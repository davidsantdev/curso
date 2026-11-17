import "server-only";
import { and, eq, ne, sql } from "drizzle-orm";
import { site } from "@/config/site";
import { db } from "@/db";
import { coupons, passwordResets, payments, plans, subscriptions, users, type Coupon, type Plan } from "@/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { hashToken, newToken } from "@/lib/auth/session";
import { activateSubscription, removePaidPeriod } from "@/lib/billing";
import { sendEmail } from "@/lib/email";
import { paymentApprovedEmail, purchaseAccessEmail, saleAlertEmail } from "@/lib/email-templates";
import { parsePaymentLink, personalizedCheckoutUrl, sellableLink } from "@/lib/payments/links";
import { PROVIDER_NAME, type Buyer, type SaleEvent } from "@/lib/payments/types";

/**
 * CHECKOUT
 * --------
 * O pagamento acontece na plataforma de pagamento (hoje a Cakto; a Hotmart fica pronta para religar).
 * Daqui saem:
 *  - o link de pagamento de cada plano, com os dados do aluno já preenchidos;
 *  - a liberação do plano quando a plataforma avisa a venda (`settleSaleEvent`),
 *    e a retirada quando avisa reembolso, chargeback ou cancelamento.
 *
 * Regra de ouro: o plano só é liberado por um aviso autenticado (assinatura da Cakto ou hottok da Hotmart,
 * conferidos na rota do webhook). Nada que chega pelo navegador libera acesso.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/* ------------------------------------------------------------------ */
/* Cupons de cortesia                                                  */
/* ------------------------------------------------------------------ */

/** "bem vindo 20" → "BEMVINDO20" */
export function normalizeCouponCode(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 30);
}

export function couponProblem(coupon: Coupon, now: Date = new Date()): string | null {
  if (!coupon.active) return "Este cupom não está mais ativo.";
  if (coupon.expiresAt && coupon.expiresAt <= now) return "Este cupom já venceu.";
  if (coupon.maxRedemptions !== null && coupon.redemptions >= coupon.maxRedemptions) {
    return "Este cupom já atingiu o limite de usos.";
  }
  // Descontos parciais são criados e aplicados na plataforma de pagamento; aqui só valem cortesias.
  if (coupon.percentOff < 100) return "Cupom de desconto? Digite o código na página de pagamento.";
  return null;
}

export type Quote = {
  coupon: Coupon | null;
  /** Por que o cupom digitado não foi aplicado (se for o caso). */
  couponError: string | null;
  discountCents: number;
  totalCents: number;
};

/** Preço final do plano, com o cupom de cortesia (se houver e for válido). */
export async function quotePlan(plan: Pick<Plan, "priceCents">, couponCode: string | null | undefined): Promise<Quote> {
  const full: Quote = { coupon: null, couponError: null, discountCents: 0, totalCents: plan.priceCents };

  const code = normalizeCouponCode(couponCode ?? "");
  if (!code) return full;

  const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
  if (!coupon) return { ...full, couponError: "Cupom não encontrado. Confira se digitou certo." };

  const problem = couponProblem(coupon);
  if (problem) return { ...full, couponError: problem };

  const discountCents = Math.min(plan.priceCents, Math.round((plan.priceCents * coupon.percentOff) / 100));
  return { coupon, couponError: null, discountCents, totalCents: plan.priceCents - discountCents };
}

async function countCouponUse(couponId: string | null): Promise<void> {
  if (!couponId) return;
  await db
    .update(coupons)
    .set({ redemptions: sql`${coupons.redemptions} + 1` })
    .where(eq(coupons.id, couponId));
}

/* ------------------------------------------------------------------ */
/* Início do pagamento                                                 */
/* ------------------------------------------------------------------ */

/** Link de pagamento deste plano para este aluno (null se o plano não tem link de uma plataforma configurada). */
export function checkoutLinkFor(plan: Pick<Plan, "paymentLink">, buyer: Buyer): string | null {
  const link = sellableLink(plan.paymentLink);
  return link ? personalizedCheckoutUrl(link, buyer) : null;
}

/**
 * Libera o plano sem passar pela plataforma de pagamento:
 *  - "cupom": cupom de cortesia (100%);
 *  - "demo":  checkout de demonstração, usado em desenvolvimento.
 */
export async function activateWithoutGateway(
  buyer: Buyer,
  plan: Plan,
  quote: Quote,
  provider: "cupom" | "demo",
): Promise<void> {
  const now = new Date();
  await db.insert(payments).values({
    userId: buyer.id,
    planId: plan.id,
    amountCents: quote.totalCents,
    discountCents: quote.discountCents,
    couponId: quote.coupon?.id ?? null,
    status: "PAID",
    provider,
    providerRef: `${provider}_${now.getTime()}_${buyer.id}`,
    paidAt: now,
  });
  await activateSubscription({ userId: buyer.id, plan, provider });
  await countCouponUse(quote.coupon?.id ?? null);
}

/* ------------------------------------------------------------------ */
/* Avisos de venda                                                     */
/* ------------------------------------------------------------------ */

export type SaleResult =
  /** Venda aprovada agora: o plano acabou de ser liberado. */
  | "activated"
  /** Já tinha sido processada (o mesmo aviso pode chegar mais de uma vez). */
  | "already-paid"
  /** Reembolso, chargeback ou cancelamento: o período foi retirado. */
  | "refunded"
  /** Assinatura cancelada: o acesso vai até o fim do período já pago. */
  | "canceled"
  /** Evento que não muda nada aqui, ou venda que não pôde ser ligada a um plano. */
  | "ignored";

/** Aplica no nosso banco um aviso de venda. Pode ser chamada várias vezes com o mesmo aviso. */
export async function settleSaleEvent(event: SaleEvent): Promise<SaleResult> {
  switch (event.kind) {
    case "approved":
      return event.orderId ? settleApproved(event, event.orderId) : "ignored";
    case "reverted":
      return event.orderId ? settleReverted(event, event.orderId) : "ignored";
    case "subscription-canceled":
      return settleSubscriptionCanceled(event);
    default:
      return "ignored";
  }
}

/** O plano da venda: pelo código da oferta ou, se só um plano é vendido nessa plataforma, ele. */
async function planForOffer(event: SaleEvent): Promise<Plan | null> {
  const sold = (await db.select().from(plans))
    .map((plan) => ({ plan, link: parsePaymentLink(plan.paymentLink) }))
    .filter(({ link }) => link?.provider === event.provider);
  if (event.offerCode) {
    const exact = sold.find(({ link }) => link?.offerCode === event.offerCode);
    if (exact) return exact.plan;
  }
  return sold.length === 1 ? sold[0].plan : null;
}

type Account = Buyer & { created: boolean };

/** A conta de quem comprou: pelo id que mandamos no link, pelo e-mail ou, se ainda não existe, uma conta nova. */
async function buyerAccount(event: SaleEvent): Promise<Account | null> {
  const columns = { id: users.id, name: users.name, email: users.email };

  if (event.accountRef && /^[\w-]{6,40}$/.test(event.accountRef)) {
    const [byId] = await db.select(columns).from(users).where(eq(users.id, event.accountRef)).limit(1);
    if (byId) return { ...byId, created: false };
  }

  const email = event.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return null;

  const [byEmail] = await db.select(columns).from(users).where(eq(users.email, email)).limit(1);
  if (byEmail) return { ...byEmail, created: false };

  // Comprou direto na plataforma (ex.: pelo link de um afiliado) sem ter conta: criamos uma.
  // A senha é aleatória; a pessoa cria a dela pelo link que vai no e-mail.
  const name = (event.name ?? "").replace(/\s+/g, " ").trim().slice(0, 80) || email.split("@")[0];
  const [created] = await db
    .insert(users)
    .values({ name, email, passwordHash: await hashPassword(newToken()) })
    .onConflictDoNothing()
    .returning(columns);
  if (created) return { ...created, created: true };

  // Outra requisição criou a conta ao mesmo tempo.
  const [raced] = await db.select(columns).from(users).where(eq(users.email, email)).limit(1);
  return raced ? { ...raced, created: false } : null;
}

/** Link para a pessoa criar a senha (vale 7 dias). */
async function createPasswordLink(userId: string): Promise<string> {
  const token = newToken();
  await db.insert(passwordResets).values({
    id: hashToken(token),
    userId,
    expiresAt: new Date(Date.now() + 7 * DAY_MS),
  });
  return `${site.url}/redefinir-senha/${token}`;
}

async function settleApproved(event: SaleEvent, orderId: string): Promise<SaleResult> {
  const where = and(eq(payments.provider, event.provider), eq(payments.providerRef, orderId));
  const [existing] = await db.select({ status: payments.status }).from(payments).where(where).limit(1);
  if (existing?.status === "PAID") return "already-paid";
  if (existing?.status === "REFUNDED") return "refunded";

  // A conta vem antes do plano: se o plano não for encontrado, a pessoa já existe no admin
  // e a equipe consegue liberar o acesso à mão.
  const account = await buyerAccount(event);
  if (!account) {
    console.error(`[vendas] ${PROVIDER_NAME[event.provider]}: venda ${orderId} sem e-mail de comprador válido.`);
    await sendEmail(saleAlertEmail(event, orderId));
    return "ignored";
  }

  const plan = await planForOffer(event);
  if (!plan) {
    console.error(
      `[vendas] ${PROVIDER_NAME[event.provider]}: venda ${orderId} (oferta ${event.offerCode ?? "?"}) sem plano ` +
        "correspondente. Confira o link de pagamento de cada plano em Admin → Planos e libere o acesso pelo admin.",
    );
    await sendEmail(saleAlertEmail(event, orderId));
    return "ignored";
  }

  const values = {
    userId: account.id,
    planId: plan.id,
    amountCents: event.amountCents,
    currency: event.currency,
    method: event.method,
    paidAt: event.paidAt ?? new Date(),
    status: "PAID" as const,
  };

  // A troca de estado é atômica: se o mesmo aviso chegar duas vezes ao mesmo tempo, só um libera o plano
  // (o índice único de provider + providerRef garante).
  const claimed = existing
    ? await db
        .update(payments)
        .set(values)
        .where(and(where, ne(payments.status, "PAID"), ne(payments.status, "REFUNDED")))
        .returning({ id: payments.id })
    : await db
        .insert(payments)
        .values({ ...values, provider: event.provider, providerRef: orderId })
        .onConflictDoNothing()
        .returning({ id: payments.id });
  if (claimed.length === 0) return "already-paid";

  const { currentPeriodEnd } = await activateSubscription({
    userId: account.id,
    plan,
    provider: event.provider,
    providerRef: orderId,
  });

  if (account.created) {
    const passwordUrl = await createPasswordLink(account.id);
    await sendEmail(
      purchaseAccessEmail(
        account,
        { planName: plan.name, accessUntil: currentPeriodEnd, providerName: PROVIDER_NAME[event.provider] },
        passwordUrl,
      ),
    );
  } else {
    await sendEmail(
      paymentApprovedEmail(account, { planName: plan.name, amountCents: event.amountCents, accessUntil: currentPeriodEnd }),
    );
  }

  return "activated";
}

async function settleReverted(event: SaleEvent, orderId: string): Promise<SaleResult> {
  // Só desfaz se esta venda liberou um período (e só uma vez).
  const [reverted] = await db
    .update(payments)
    .set({ status: "REFUNDED" })
    .where(and(eq(payments.provider, event.provider), eq(payments.providerRef, orderId), eq(payments.status, "PAID")))
    .returning({ userId: payments.userId, planId: payments.planId });
  if (!reverted) return "ignored";

  if (reverted.userId && reverted.planId) {
    const [plan] = await db.select({ interval: plans.interval }).from(plans).where(eq(plans.id, reverted.planId)).limit(1);
    if (plan) await removePaidPeriod(reverted.userId, plan.interval);
  }
  return "refunded";
}

async function settleSubscriptionCanceled(event: SaleEvent): Promise<SaleResult> {
  const email = event.email?.trim().toLowerCase();
  if (!email) return "ignored";
  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (!user) return "ignored";

  const updated = await db
    .update(subscriptions)
    .set({ cancelAtPeriodEnd: true, updatedAt: new Date() })
    .where(and(eq(subscriptions.userId, user.id), eq(subscriptions.provider, event.provider)))
    .returning({ id: subscriptions.id });
  return updated.length > 0 ? "canceled" : "ignored";
}
