"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/dal";
import { getActivePlanBySlug, getBillingMode } from "@/lib/billing";
import { activateWithoutGateway, checkoutLinkFor, quotePlan } from "@/lib/checkout";
import { field } from "@/lib/forms";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Botão "Pagar" do checkout.
 *
 *  - Com a plataforma de pagamento configurada (Cakto): leva o aluno para a página de pagamento, com o nome
 *    e o e-mail já preenchidos. Quem libera o plano é o aviso de venda da plataforma (webhook).
 *  - Cupom de cortesia (100%): não há o que pagar, o plano é liberado direto.
 *  - Em modo demonstração: ativa o plano na hora, sem cobrar.
 */
export async function startCheckoutAction(formData: FormData): Promise<void> {
  const user = await requireUser();

  const plan = await getActivePlanBySlug(field(formData, "plan"));
  if (!plan) redirect("/assinatura");

  const couponCode = field(formData, "cupom");
  const quote = await quotePlan(plan, couponCode);
  // O cupom deixou de valer entre abrir a página e clicar em pagar: volta para o aluno ver o aviso.
  if (quote.couponError) redirect(`/checkout/${plan.slug}?cupom=${encodeURIComponent(couponCode)}`);

  const limit = rateLimit(`checkout:${user.id}`, 12, 10 * 60_000);
  if (!limit.ok) redirect("/assinatura?aviso=muitas-tentativas");

  const buyer = { id: user.id, name: user.name, email: user.email };
  const mode = getBillingMode();

  if (quote.totalCents <= 0 || mode === "demo") {
    await activateWithoutGateway(buyer, plan, quote, quote.totalCents <= 0 ? "cupom" : "demo");
    revalidatePath("/", "layout");
    redirect("/assinatura?aviso=plano-ativado");
  }

  const link = mode === "live" ? checkoutLinkFor(plan, buyer) : null;
  if (!link) redirect("/assinatura?aviso=pagamento-indisponivel");
  redirect(link);
}
