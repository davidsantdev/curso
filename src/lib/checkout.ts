import "server-only";
import { and, desc, eq, gte, isNull, ne, sql } from "drizzle-orm";
import { publicSiteUrl, site } from "@/config/site";
import { db } from "@/db";
import { coupons, payments, plans, users, type Coupon, type Payment, type Plan } from "@/db/schema";
import { activateSubscription, removePaidPeriod } from "@/lib/billing";
import { sendEmail } from "@/lib/email";
import { paymentApprovedEmail } from "@/lib/email-templates";
import {
  createPreference,
  paymentMethodOf,
  searchPaymentsByReference,
  type MercadoPagoPayment,
} from "@/lib/payments/mercadopago";

/**
 * CHECKOUT
 * --------
 * Cria a cobrança no Mercado Pago e, quando o pagamento é confirmado, libera o plano.
 *
 * Regra de ouro: o plano só é liberado a partir do que a API do Mercado Pago responde
 * (`settleMercadoPagoPayment`). Nada do que chega pelo navegador ou pelo corpo do
 * webhook é usado para decidir — só o id do pagamento, que é consultado na API.
 */

/* ------------------------------------------------------------------ */
/* Cupons                                                              */
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
  return null;
}

export type Quote = {
  coupon: Coupon | null;
  /** Por que o cupom digitado não foi aplicado (se for o caso). */
  couponError: string | null;
  discountCents: number;
  totalCents: number;
};

/** Preço final do plano, com o cupom (se houver e for válido). */
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

type Buyer = { id: string; name: string; email: string };

export type CheckoutStart =
  | { kind: "redirect"; url: string }
  /** Cupom de 100%: não há o que pagar, o plano já foi liberado. */
  | { kind: "activated" }
  | { kind: "error" };

const REUSE_WINDOW_MS = 12 * 60 * 60 * 1000;

/** Cria (ou reaproveita) a cobrança e devolve o link de pagamento do Mercado Pago. */
export async function startMercadoPagoCheckout(buyer: Buyer, plan: Plan, quote: Quote): Promise<CheckoutStart> {
  if (quote.totalCents <= 0) {
    await activateWithoutGateway(buyer, plan, quote, "cupom");
    return { kind: "activated" };
  }

  const couponId = quote.coupon?.id ?? null;

  // Se o aluno já abriu este mesmo pagamento há pouco, continua nele em vez de criar outro.
  const [reusable] = await db
    .select({ checkoutUrl: payments.checkoutUrl })
    .from(payments)
    .where(
      and(
        eq(payments.userId, buyer.id),
        eq(payments.planId, plan.id),
        eq(payments.provider, "mercadopago"),
        eq(payments.status, "PENDING"),
        eq(payments.amountCents, quote.totalCents),
        couponId ? eq(payments.couponId, couponId) : isNull(payments.couponId),
        gte(payments.createdAt, new Date(Date.now() - REUSE_WINDOW_MS)),
      ),
    )
    .orderBy(desc(payments.createdAt))
    .limit(1);
  if (reusable?.checkoutUrl) return { kind: "redirect", url: reusable.checkoutUrl };

  const [payment] = await db
    .insert(payments)
    .values({
      userId: buyer.id,
      planId: plan.id,
      amountCents: quote.totalCents,
      discountCents: quote.discountCents,
      couponId,
      status: "PENDING",
      provider: "mercadopago",
    })
    .returning({ id: payments.id });

  try {
    const baseUrl = publicSiteUrl();
    const preference = await createPreference({
      reference: payment.id,
      title: `${site.name} — ${plan.name}`,
      amountCents: quote.totalCents,
      payer: { email: buyer.email, name: buyer.name },
      statementDescriptor: site.name
        .normalize("NFD")
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .toUpperCase()
        .slice(0, 13),
      returnUrl: baseUrl ? `${baseUrl}/checkout/retorno` : null,
      notificationUrl: baseUrl ? `${baseUrl}/api/webhooks/mercadopago` : null,
    });

    await db
      .update(payments)
      .set({ providerCheckoutId: preference.id, checkoutUrl: preference.url })
      .where(eq(payments.id, payment.id));

    return { kind: "redirect", url: preference.url };
  } catch (error) {
    console.error("[checkout] Não foi possível criar a cobrança no Mercado Pago:", error);
    await db.update(payments).set({ status: "FAILED" }).where(eq(payments.id, payment.id));
    return { kind: "error" };
  }
}

/**
 * Libera o plano sem passar pelo gateway:
 *  - "cupom": cupom de 100% (não há o que cobrar);
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
/* Confirmação do pagamento                                            */
/* ------------------------------------------------------------------ */

export type SettleResult =
  /** Pagamento aprovado agora: o plano acabou de ser liberado. */
  | "activated"
  /** Já tinha sido processado antes (avisos repetidos são normais). */
  | "already-paid"
  | "pending"
  | "failed"
  | "refunded"
  /** Não é um pagamento desta plataforma, ou os dados não batem. */
  | "ignored";

/**
 * Aplica no nosso banco a situação de um pagamento lido da API do Mercado Pago.
 * Pode ser chamada várias vezes para o mesmo pagamento: só a primeira aprovação libera o plano.
 */
export async function settleMercadoPagoPayment(remote: MercadoPagoPayment): Promise<SettleResult> {
  const reference = remote.external_reference;
  if (!reference || reference.length > 40) return "ignored";

  const [payment] = await db
    .select()
    .from(payments)
    .where(and(eq(payments.id, reference), eq(payments.provider, "mercadopago")))
    .limit(1);
  if (!payment) return "ignored";

  const remoteId = String(remote.id);
  const method = paymentMethodOf(remote);

  switch (remote.status) {
    case "approved":
      return settleApproved(payment, remote, remoteId, method);

    case "refunded":
    case "charged_back":
      return settleRefunded(payment, remoteId);

    case "rejected":
    case "cancelled": {
      // Uma tentativa recusada não impede uma próxima: o aluno pode tentar outro cartão ou o Pix.
      await db
        .update(payments)
        .set({ status: "FAILED", method: method ?? payment.method })
        .where(and(eq(payments.id, payment.id), eq(payments.status, "PENDING")));
      return payment.status === "PAID" ? "already-paid" : "failed";
    }

    default: {
      // pending, in_process, authorized, in_mediation: seguimos aguardando.
      if (payment.status === "PAID") return "already-paid";
      await db
        .update(payments)
        .set({ status: "PENDING", method: method ?? payment.method })
        .where(and(eq(payments.id, payment.id), ne(payments.status, "PAID"), ne(payments.status, "REFUNDED")));
      return "pending";
    }
  }
}

async function settleApproved(
  payment: Payment,
  remote: MercadoPagoPayment,
  remoteId: string,
  method: string | null,
): Promise<SettleResult> {
  if (payment.status === "PAID") {
    // A mesma cobrança foi paga duas vezes (ex.: Pix e cartão). O plano já está liberado;
    // o segundo valor precisa ser devolvido pelo painel do Mercado Pago.
    if (payment.providerRef && payment.providerRef !== remoteId) {
      console.warn(
        `[checkout] Pagamento em duplicidade: a cobrança ${payment.id} já foi paga (${payment.providerRef}) ` +
          `e chegou outro pagamento aprovado (${remoteId}). Reembolse o segundo no painel do Mercado Pago.`,
      );
    }
    return "already-paid";
  }
  if (payment.status === "REFUNDED") return "refunded";

  const paidCents = Math.round((remote.transaction_amount ?? 0) * 100);
  if ((remote.currency_id && remote.currency_id !== "BRL") || paidCents < payment.amountCents) {
    console.error(
      `[checkout] Pagamento ${remoteId} não confere com a cobrança ${payment.id}: ` +
        `pago ${paidCents} ${remote.currency_id ?? "?"}, esperado ${payment.amountCents} BRL.`,
    );
    return "ignored";
  }

  if (!payment.userId || !payment.planId) {
    console.error(`[checkout] Pagamento ${remoteId} aprovado, mas a conta ou o plano da cobrança ${payment.id} não existe mais.`);
    return "ignored";
  }

  const [[plan], [user]] = await Promise.all([
    db.select().from(plans).where(eq(plans.id, payment.planId)).limit(1),
    db.select({ name: users.name, email: users.email }).from(users).where(eq(users.id, payment.userId)).limit(1),
  ]);
  if (!plan || !user) return "ignored";

  const approvedAt = remote.date_approved ? new Date(remote.date_approved) : new Date();
  const paidAt = Number.isNaN(approvedAt.getTime()) ? new Date() : approvedAt;

  // A troca de estado é atômica: se dois avisos chegarem juntos, só um deles libera o plano.
  const claimed = await db
    .update(payments)
    .set({ status: "PAID", providerRef: remoteId, method, paidAt })
    .where(and(eq(payments.id, payment.id), ne(payments.status, "PAID"), ne(payments.status, "REFUNDED")))
    .returning({ id: payments.id });
  if (claimed.length === 0) return "already-paid";

  const { currentPeriodEnd } = await activateSubscription({
    userId: payment.userId,
    plan,
    provider: "mercadopago",
    providerRef: remoteId,
  });
  await countCouponUse(payment.couponId);

  await sendEmail(
    paymentApprovedEmail(user, { planName: plan.name, amountCents: payment.amountCents, accessUntil: currentPeriodEnd }),
  );

  return "activated";
}

async function settleRefunded(payment: Payment, remoteId: string): Promise<SettleResult> {
  // Só desfaz o período se este pagamento foi o que liberou o acesso.
  const reverted = await db
    .update(payments)
    .set({ status: "REFUNDED" })
    .where(and(eq(payments.id, payment.id), eq(payments.status, "PAID"), eq(payments.providerRef, remoteId)))
    .returning({ id: payments.id });

  if (reverted.length > 0 && payment.userId && payment.planId) {
    const [plan] = await db.select({ interval: plans.interval }).from(plans).where(eq(plans.id, payment.planId)).limit(1);
    if (plan) await removePaidPeriod(payment.userId, plan.interval);
  }
  return "refunded";
}

/**
 * Consulta no Mercado Pago todas as tentativas de uma cobrança nossa e aplica a mais relevante.
 * Usada na volta do checkout, no botão "Já paguei" e na conferência diária.
 */
export async function reconcilePayment(paymentId: string): Promise<SettleResult> {
  const attempts = await searchPaymentsByReference(paymentId);
  if (attempts.length === 0) return "pending";

  const pick =
    attempts.find((attempt) => attempt.status === "approved") ??
    attempts.find((attempt) => attempt.status === "refunded" || attempt.status === "charged_back") ??
    attempts.find((attempt) => ["pending", "in_process", "authorized"].includes(attempt.status)) ??
    attempts[0];

  return settleMercadoPagoPayment(pick);
}

/** Aviso mostrado na página Assinatura para cada resultado. */
export function checkoutNotice(result: SettleResult): string {
  switch (result) {
    case "activated":
    case "already-paid":
      return "plano-ativado";
    case "failed":
      return "pagamento-recusado";
    case "refunded":
      return "pagamento-estornado";
    case "ignored":
      return "pagamento-em-analise";
    default:
      return "pagamento-pendente";
  }
}
