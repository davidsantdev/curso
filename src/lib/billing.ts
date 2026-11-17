import "server-only";
import { cache } from "react";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { payments, plans, subscriptions, type Plan, type PlanInterval } from "@/db/schema";
import { grantAchievements } from "@/lib/achievements";
import { isSubscriptionActive } from "@/lib/auth/dal";
import { anyProviderReady } from "@/lib/payments/links";

/**
 * COBRANÇA
 * --------
 * Este arquivo é o ponto único por onde um plano é ativado, renovado ou cortado.
 * O acesso pago é sempre decidido pela tabela `subscriptions`.
 *
 * O modelo é de PERÍODOS DE ACESSO, sem cobrança automática: o aluno paga uma vez
 * (Pix, cartão ou boleto, na Cakto) e ganha 1 mês, 1 ano ou acesso vitalício.
 * Quando renova, o novo período é somado ao final do atual.
 *
 * Formas de liberar o acesso:
 *   • "cakto"   — venda real; quem ativa é `settleSaleEvent` (src/lib/checkout.ts),
 *                 chamado pelo aviso de venda da Cakto (webhook). "hotmart" funciona igual, se for religada;
 *   • "cupom"   — cupom de cortesia (100%);
 *   • "manual"  — o administrador libera pelo painel (venda por fora);
 *   • "demo"    — checkout de demonstração, sem cobrança (desenvolvimento).
 */

/** "live": há uma plataforma de pagamento configurada (Cakto ou Hotmart). */
export type BillingMode = "live" | "demo" | "disabled";

export function getBillingMode(): BillingMode {
  if (anyProviderReady()) return "live";
  if (process.env.NODE_ENV !== "production") return "demo";
  return process.env.ALLOW_DEMO_CHECKOUT === "true" ? "demo" : "disabled";
}

export const listActivePlans = cache(async (): Promise<Plan[]> => {
  return db.select().from(plans).where(eq(plans.active, true)).orderBy(asc(plans.sortOrder), asc(plans.priceCents));
});

export async function getActivePlanBySlug(slug: string): Promise<Plan | null> {
  const [plan] = await db
    .select()
    .from(plans)
    .where(and(eq(plans.slug, slug), eq(plans.active, true)))
    .limit(1);
  return plan ?? null;
}

/** Fim do período a partir de uma data. `null` = vitalício. */
export function addInterval(from: Date, interval: PlanInterval): Date | null {
  if (interval === "LIFETIME") return null;
  const end = new Date(from);
  if (interval === "MONTH") end.setMonth(end.getMonth() + 1);
  else end.setFullYear(end.getFullYear() + 1);
  return end;
}

function subtractInterval(from: Date, interval: Exclude<PlanInterval, "LIFETIME">): Date {
  const start = new Date(from);
  if (interval === "MONTH") start.setMonth(start.getMonth() - 1);
  else start.setFullYear(start.getFullYear() - 1);
  return start;
}

/** Quanto o plano custa por mês (para comparar mensal x anual). */
export function monthlyEquivalentCents(plan: Pick<Plan, "priceCents" | "interval">): number | null {
  if (plan.interval === "MONTH") return plan.priceCents;
  if (plan.interval === "YEAR") return Math.round(plan.priceCents / 12);
  return null;
}

type ActivateInput = {
  userId: string;
  plan: Pick<Plan, "id" | "interval">;
  provider: string;
  providerRef?: string | null;
  /**
   * Valor efetivamente pago. Quando informado, registra o pagamento no histórico.
   * (O checkout do gateway já cria a própria linha em `payments` e não usa este campo.)
   */
  paidAmountCents?: number | null;
};

/**
 * Ativa ou renova o acesso do usuário.
 * Se ele já tem um período ativo, o novo período é somado ao final do atual.
 */
export async function activateSubscription(input: ActivateInput): Promise<{ currentPeriodEnd: Date | null }> {
  const { userId, plan, provider, providerRef = null, paidAmountCents = null } = input;
  const now = new Date();

  const [existing] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);

  const stillActive = isSubscriptionActive(existing, now);
  const startFrom = stillActive && existing?.currentPeriodEnd ? existing.currentPeriodEnd : now;
  // Quem já é vitalício continua vitalício.
  const keepLifetime = stillActive && existing?.currentPeriodEnd === null;
  const currentPeriodEnd = keepLifetime ? null : addInterval(startFrom, plan.interval);

  const values = {
    planId: plan.id,
    status: "ACTIVE" as const,
    provider,
    providerRef,
    currentPeriodEnd,
    cancelAtPeriodEnd: false,
    expiryNoticeFor: null,
  };

  await db
    .insert(subscriptions)
    .values({ userId, ...values })
    .onConflictDoUpdate({ target: subscriptions.userId, set: { ...values, updatedAt: now } });

  if (paidAmountCents !== null && paidAmountCents > 0) {
    await db.insert(payments).values({
      userId,
      planId: plan.id,
      amountCents: paidAmountCents,
      status: "PAID",
      provider,
      providerRef,
      paidAt: now,
    });
  }

  await grantAchievements(userId, ["pro"]);

  return { currentPeriodEnd };
}

/** Corta o acesso imediatamente (uso administrativo, fraude…). */
export async function revokeSubscription(userId: string): Promise<void> {
  const now = new Date();
  await db
    .update(subscriptions)
    .set({ status: "CANCELED", currentPeriodEnd: now, cancelAtPeriodEnd: false, updatedAt: now })
    .where(eq(subscriptions.userId, userId));
}

/**
 * Desfaz UM período pago (reembolso ou contestação de um pagamento).
 * Se o aluno tinha períodos somados, perde só o que foi devolvido.
 */
export async function removePaidPeriod(userId: string, interval: PlanInterval): Promise<void> {
  const [existing] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  if (!existing) return;

  if (interval === "LIFETIME" || existing.currentPeriodEnd === null) return revokeSubscription(userId);

  const now = new Date();
  const shortened = subtractInterval(existing.currentPeriodEnd, interval);
  if (shortened <= now) return revokeSubscription(userId);

  await db
    .update(subscriptions)
    .set({ currentPeriodEnd: shortened, expiryNoticeFor: null, updatedAt: now })
    .where(eq(subscriptions.userId, userId));
}

export async function listUserPayments(userId: string) {
  return db
    .select({
      id: payments.id,
      amountCents: payments.amountCents,
      status: payments.status,
      provider: payments.provider,
      method: payments.method,
      checkoutUrl: payments.checkoutUrl,
      createdAt: payments.createdAt,
      planName: plans.name,
    })
    .from(payments)
    .leftJoin(plans, eq(plans.id, payments.planId))
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt))
    .limit(24);
}
