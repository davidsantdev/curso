import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { db } from "@/db";
import { payments } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/dal";
import { checkoutNotice, reconcilePayment, settleMercadoPagoPayment, type SettleResult } from "@/lib/checkout";
import { getPayment, mercadoPagoEnabled } from "@/lib/payments/mercadopago";

/**
 * Volta do Mercado Pago depois do pagamento.
 *
 * Os parâmetros da URL (status, payment_id…) NÃO são confiáveis: qualquer pessoa
 * pode digitá-los. Por isso consultamos o pagamento na API do Mercado Pago e só
 * então mostramos o resultado na página Assinatura.
 */
export async function GET(request: NextRequest): Promise<never> {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/assinatura");

  const params = request.nextUrl.searchParams;
  const reference = params.get("external_reference") ?? "";
  const remoteId = params.get("payment_id") ?? params.get("collection_id") ?? "";

  if (!mercadoPagoEnabled() || !reference || reference.length > 40) redirect("/assinatura");

  const [payment] = await db
    .select({ id: payments.id })
    .from(payments)
    .where(and(eq(payments.id, reference), eq(payments.userId, user.id), eq(payments.provider, "mercadopago")))
    .limit(1);
  if (!payment) redirect("/assinatura");

  let result: SettleResult | null = null;
  try {
    const remote = /^\d{1,30}$/.test(remoteId) ? await getPayment(remoteId) : null;
    // O id veio pela URL: só vale se o pagamento for mesmo desta cobrança.
    result =
      remote && remote.external_reference === payment.id
        ? await settleMercadoPagoPayment(remote)
        : await reconcilePayment(payment.id);
  } catch (error) {
    console.error("[checkout] Falha ao conferir o pagamento na volta do Mercado Pago:", error);
  }

  revalidatePath("/", "layout");
  redirect(`/assinatura?aviso=${result ? checkoutNotice(result) : "pagamento-em-analise"}`);
}
