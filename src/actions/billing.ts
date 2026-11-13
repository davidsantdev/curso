"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { getActivePlanBySlug, getBillingMode } from "@/lib/billing";
import {
  activateWithoutGateway,
  checkoutNotice,
  quotePlan,
  reconcilePayment,
  startMercadoPagoCheckout,
  type SettleResult,
} from "@/lib/checkout";
import { field } from "@/lib/forms";
import { mercadoPagoEnabled } from "@/lib/payments/mercadopago";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Botão "Pagar" do checkout.
 *
 *  - Com o Mercado Pago configurado: cria a cobrança e leva o aluno para pagar.
 *    Quem libera o plano é a confirmação do pagamento (webhook / volta do checkout).
 *  - Em modo demonstração: ativa o plano na hora, sem cobrar.
 *  - Cupom de 100%: não há o que pagar, o plano é liberado direto.
 */
export async function startCheckoutAction(formData: FormData): Promise<void> {
  const user = await requireUser();

  const plan = await getActivePlanBySlug(field(formData, "plan"));
  if (!plan) redirect("/assinatura");

  const mode = getBillingMode();
  if (mode === "disabled") redirect("/assinatura?aviso=pagamento-indisponivel");

  const couponCode = field(formData, "cupom");
  const quote = await quotePlan(plan, couponCode);
  // O cupom deixou de valer entre abrir a página e clicar em pagar: volta para o aluno ver o preço certo.
  if (quote.couponError) redirect(`/checkout/${plan.slug}?cupom=${encodeURIComponent(couponCode)}`);

  const limit = rateLimit(`checkout:${user.id}`, 12, 10 * 60_000);
  if (!limit.ok) redirect("/assinatura?aviso=muitas-tentativas");

  const buyer = { id: user.id, name: user.name, email: user.email };

  if (quote.totalCents <= 0 || mode === "demo") {
    await activateWithoutGateway(buyer, plan, quote, quote.totalCents <= 0 ? "cupom" : "demo");
    revalidatePath("/", "layout");
    redirect("/assinatura?aviso=plano-ativado");
  }

  const checkout = await startMercadoPagoCheckout(buyer, plan, quote);
  if (checkout.kind === "redirect") redirect(checkout.url);
  if (checkout.kind === "activated") {
    revalidatePath("/", "layout");
    redirect("/assinatura?aviso=plano-ativado");
  }
  redirect("/assinatura?aviso=pagamento-erro");
}

/** Botão "Já paguei": consulta o Mercado Pago na hora, sem esperar o aviso automático. */
export async function verifyPaymentAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  if (!mercadoPagoEnabled()) redirect("/assinatura");

  const [payment] = await db
    .select({ id: payments.id })
    .from(payments)
    .where(
      and(
        eq(payments.id, field(formData, "paymentId")),
        eq(payments.userId, user.id),
        eq(payments.provider, "mercadopago"),
      ),
    )
    .limit(1);
  if (!payment) redirect("/assinatura");

  const limit = rateLimit(`verify-payment:${user.id}`, 10, 10 * 60_000);
  if (!limit.ok) redirect("/assinatura?aviso=muitas-tentativas");

  let result: SettleResult | null = null;
  try {
    result = await reconcilePayment(payment.id);
  } catch (error) {
    console.error("[checkout] Falha ao consultar o pagamento:", error);
  }

  revalidatePath("/", "layout");
  redirect(`/assinatura?aviso=${result ? checkoutNotice(result) : "pagamento-erro"}`);
}
