import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarCheck, Check, FlaskConical, LockKeyhole, Mail, ShieldCheck, Tag, X } from "lucide-react";
import { startCheckoutAction } from "@/actions/billing";
import { SubmitButton } from "@/components/ui/form";
import { site } from "@/config/site";
import { requireUser } from "@/lib/auth/dal";
import { addInterval, getActivePlanBySlug, getBillingMode, monthlyEquivalentCents } from "@/lib/billing";
import { quotePlan } from "@/lib/checkout";
import { formatDate, formatMoney, INTERVAL_LABEL } from "@/lib/format";

export const metadata: Metadata = { title: "Finalizar assinatura", robots: { index: false } };

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cupom?: string | string[] }>;
}) {
  const [{ slug }, { cupom }] = await Promise.all([params, searchParams]);
  const user = await requireUser();
  const plan = await getActivePlanBySlug(slug);
  if (!plan) notFound();

  const mode = getBillingMode();
  const typedCoupon = typeof cupom === "string" ? cupom.trim().slice(0, 30) : "";
  const quote = await quotePlan(plan, typedCoupon);
  const isFree = quote.totalCents <= 0;

  const perMonth = monthlyEquivalentCents({ priceCents: quote.totalCents, interval: plan.interval });
  const current = user.subscription?.active ? user.subscription : null;

  // Se já existe um período ativo, o novo começa quando o atual termina.
  const startsAt = current?.currentPeriodEnd ?? new Date();
  const endsAt = current && current.currentPeriodEnd === null ? null : addInterval(startsAt, plan.interval);
  const checkoutPath = `/checkout/${plan.slug}`;

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/assinatura"
        className="text-ink hover:text-brand-600 inline-flex items-center gap-1.5 pb-5 text-sm font-medium"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar para os planos
      </Link>

      <h1 className="text-[28px] leading-tight font-bold lg:text-[34px]">Finalizar assinatura</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* -------- Resumo -------- */}
        <section className="card p-7">
          <p className="text-muted text-sm font-medium">Você está assinando</p>
          <h2 className="mt-1 text-2xl font-bold">{plan.name}</h2>
          {plan.description ? <p className="text-ink mt-1.5 text-[15px]">{plan.description}</p> : null}

          <ul className="mt-6 space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-[15px]">
                <span className="bg-mint-50 text-mint-600 mt-0.5 grid size-5 shrink-0 place-items-center rounded-full">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-ink">{feature}</span>
              </li>
            ))}
          </ul>

          <dl className="border-line mt-7 space-y-3 border-t pt-6 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-ink">Conta</dt>
              <dd className="text-navy-900 truncate font-medium">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink">Período</dt>
              <dd className="text-navy-900 font-medium">{INTERVAL_LABEL[plan.interval].access}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink">Acesso</dt>
              <dd className="text-navy-900 text-right font-medium">
                {endsAt ? `até ${formatDate(endsAt)}` : "vitalício"}
                {current?.currentPeriodEnd ? (
                  <span className="text-muted block text-xs font-normal">somado ao seu período atual</span>
                ) : null}
              </dd>
            </div>
          </dl>

          <ul className="border-line text-ink mt-6 grid gap-3 border-t pt-6 text-sm sm:grid-cols-2">
            <li className="flex items-start gap-2.5">
              <CalendarCheck className="text-brand-500 mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
              Sem renovação automática: você paga uma vez e renova só se quiser.
            </li>
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="text-brand-500 mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
              7 dias para pedir o reembolso, sem precisar explicar o motivo.
            </li>
          </ul>
        </section>

        {/* -------- Pagamento -------- */}
        <section className="card flex flex-col p-7">
          <p className="text-muted text-sm font-medium">Total</p>
          {quote.discountCents > 0 ? (
            <p className="text-muted mt-1 text-base line-through">
              <span className="sr-only">Preço sem desconto: </span>
              {formatMoney(plan.priceCents)}
            </p>
          ) : null}
          <p className="text-navy-900 mt-1 text-[40px] leading-none font-bold">
            {formatMoney(quote.totalCents)}
            {isFree ? null : (
              <span className="text-muted ml-1 text-base font-medium">{INTERVAL_LABEL[plan.interval].suffix}</span>
            )}
          </p>
          {plan.interval === "YEAR" && perMonth && !isFree ? (
            <p className="text-ink mt-2 text-sm">equivale a {formatMoney(perMonth)} por mês</p>
          ) : null}

          {/* Cupom */}
          {quote.coupon ? (
            <p className="bg-mint-50 text-mint-700 mt-5 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium">
              <Tag className="size-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                Cupom {quote.coupon.code}: {quote.coupon.percentOff}% de desconto (−{formatMoney(quote.discountCents)})
              </span>
              <Link
                href={checkoutPath}
                className="hover:bg-mint-100 grid size-7 shrink-0 place-items-center rounded-lg"
                aria-label="Remover cupom"
                title="Remover cupom"
              >
                <X className="size-4" aria-hidden="true" />
              </Link>
            </p>
          ) : (
            <Form action={checkoutPath} className="mt-5">
              <label htmlFor="cupom" className="text-ink text-sm font-medium">
                Tem um cupom de desconto?
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  id="cupom"
                  name="cupom"
                  defaultValue={typedCoupon}
                  maxLength={30}
                  autoComplete="off"
                  autoCapitalize="characters"
                  placeholder="Digite o código"
                  className="input h-11 min-w-0 flex-1 uppercase placeholder:normal-case"
                  aria-invalid={quote.couponError ? true : undefined}
                  aria-describedby={quote.couponError ? "cupom-erro" : undefined}
                />
                <button type="submit" className="btn btn-outline btn-sm h-11 shrink-0 px-4">
                  Aplicar
                </button>
              </div>
              {quote.couponError ? (
                <p id="cupom-erro" role="alert" className="text-danger-600 mt-1.5 text-sm">
                  {quote.couponError}
                </p>
              ) : null}
            </Form>
          )}

          {/* Botão de pagamento */}
          {mode === "disabled" && !isFree ? (
            <>
              <div className="bg-brand-50 text-brand-700 mt-6 flex gap-3 rounded-2xl p-4 text-sm leading-relaxed">
                <Mail className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <p>
                  O pagamento on-line está sendo configurado. Para assinar agora, fale com a gente e liberamos o seu
                  acesso manualmente.
                </p>
              </div>
              <a
                href={`mailto:${site.supportEmail}?subject=${encodeURIComponent(`Quero assinar o ${plan.name}`)}`}
                className="btn btn-primary btn-lg mt-6 w-full"
              >
                Falar com a equipe
              </a>
            </>
          ) : (
            <>
              {mode === "demo" && !isFree ? (
                <div className="bg-sun-50 text-sun-700 mt-6 flex gap-3 rounded-2xl p-4 text-sm leading-relaxed">
                  <FlaskConical className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                  <p>
                    <strong className="font-semibold">Modo demonstração.</strong> Nenhum valor é cobrado: o plano é
                    ativado na hora para você testar a plataforma. Conecte o Mercado Pago antes de vender.
                  </p>
                </div>
              ) : null}

              <form action={startCheckoutAction} className="mt-6">
                <input type="hidden" name="plan" value={plan.slug} />
                <input type="hidden" name="cupom" value={quote.coupon?.code ?? ""} />
                <SubmitButton
                  className="btn btn-pink btn-lg w-full"
                  pendingLabel={mode === "mercadopago" && !isFree ? "Abrindo o pagamento…" : "Ativando…"}
                >
                  {isFree
                    ? "Ativar o meu acesso"
                    : mode === "mercadopago"
                      ? "Pagar com Pix, cartão ou boleto"
                      : "Confirmar assinatura"}
                </SubmitButton>
              </form>

              {mode === "mercadopago" && !isFree ? (
                <p className="text-ink mt-4 text-center text-sm leading-relaxed">
                  Você conclui o pagamento no ambiente seguro do Mercado Pago. No cartão, dá para parcelar em até 12
                  vezes.
                </p>
              ) : null}
            </>
          )}

          <p className="text-muted mt-auto flex items-center justify-center gap-2 pt-6 text-xs">
            <LockKeyhole className="size-3.5" aria-hidden="true" />
            Os dados do cartão não passam pela nossa plataforma.
          </p>
        </section>
      </div>
    </div>
  );
}
