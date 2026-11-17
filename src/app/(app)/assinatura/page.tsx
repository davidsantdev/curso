import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, CircleAlert, CircleCheck, Crown, Info, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { PlanCards } from "@/components/plan-cards";
import { site } from "@/config/site";
import { requireUser } from "@/lib/auth/dal";
import { listActivePlans, listUserPayments } from "@/lib/billing";
import { formatDate, formatMoney, INTERVAL_LABEL, PAYMENT_STATUS_LABEL, paymentWayLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Assinatura" };

type Tone = "success" | "info" | "warning";

const NOTICES: Record<string, { tone: Tone; text: string }> = {
  "plano-ativado": { tone: "success", text: "Plano ativado! Todo o conteúdo já está liberado. Bons estudos!" },
  // Para onde a plataforma de pagamento manda o aluno depois da compra (a "página de obrigado" da oferta).
  compra: {
    tone: "success",
    text: `Recebemos o seu pedido! Com Pix ou cartão, o plano é liberado em instantes; com boleto, até 3 dias úteis depois de pago. Você recebe um e-mail quando estiver tudo pronto. Se demorar, escreva para ${site.supportEmail}.`,
  },
  "pagamento-estornado": {
    tone: "info",
    text: "Este pagamento foi reembolsado. O período correspondente foi removido da sua conta.",
  },
  "pagamento-indisponivel": {
    tone: "info",
    text: `O pagamento on-line ainda está sendo configurado. Fale com a gente em ${site.supportEmail} para assinar.`,
  },
  "muitas-tentativas": { tone: "warning", text: "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo." },
};

NOTICES["compra-hotmart"] = NOTICES.compra;

const TONE_STYLE: Record<Tone, string> = {
  success: "bg-mint-50 text-mint-700",
  info: "bg-brand-50 text-brand-700",
  warning: "bg-sun-50 text-sun-700",
};

const TONE_ICON = { success: CircleCheck, info: Info, warning: CircleAlert };

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function SubscriptionPage({ searchParams }: { searchParams: Promise<{ aviso?: string }> }) {
  const user = await requireUser();
  const [{ aviso }, plans, payments] = await Promise.all([searchParams, listActivePlans(), listUserPayments(user.id)]);

  const notice = aviso ? NOTICES[aviso] : undefined;
  const NoticeIcon = notice ? TONE_ICON[notice.tone] : null;
  const subscription = user.subscription;

  const now = Date.now();
  const daysLeft =
    subscription?.active && subscription.currentPeriodEnd
      ? Math.ceil((subscription.currentPeriodEnd.getTime() - now) / DAY_MS)
      : null;
  const renewHref =
    subscription && plans.some((plan) => plan.id === subscription.planId)
      ? `/checkout/${subscription.planSlug}`
      : "#planos";

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Assinatura" description="Seu plano, a validade do acesso e o histórico de pagamentos." />

      {notice && NoticeIcon ? (
        <p
          role="status"
          className={cn("mb-6 flex items-start gap-3 rounded-2xl px-5 py-4 text-[15px] font-medium", TONE_STYLE[notice.tone])}
        >
          <NoticeIcon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          {notice.text}
        </p>
      ) : null}

      {/* -------- Situação atual -------- */}
      {subscription?.active ? (
        <section className="bg-night relative overflow-hidden rounded-3xl p-7 text-white sm:p-9">
          <div className="night-glow" aria-hidden="true" />
          <div className="night-grid" aria-hidden="true" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="badge text-brand-700 bg-white/90">
                <Crown className="size-3.5" aria-hidden="true" />
                Plano ativo
              </span>
              <h2 className="mt-4 text-[34px] leading-tight font-semibold">{subscription.planName}</h2>
              <p className="mt-2 text-[17px] text-white/70">
                {INTERVAL_LABEL[subscription.interval].access} · {paymentWayLabel(subscription.provider)}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 text-[15px] text-white/80">
                <CalendarClock className="size-4.5 shrink-0" aria-hidden="true" />
                {subscription.currentPeriodEnd === null
                  ? "Acesso vitalício"
                  : `Acesso até ${formatDate(subscription.currentPeriodEnd)}${
                      daysLeft !== null && daysLeft <= 7 ? ` — ${daysLeft <= 1 ? "último dia" : `faltam ${daysLeft} dias`}` : ""
                    }`}
              </p>
              {subscription.currentPeriodEnd !== null ? (
                <p className="mt-1.5 text-sm text-white/55">
                  Sem cobrança automática. Ao renovar, o novo período é somado ao que você já tem.
                </p>
              ) : null}
            </div>

            {subscription.currentPeriodEnd !== null ? (
              <Link href={renewHref} className="btn btn-white shrink-0">
                Renovar agora
              </Link>
            ) : null}
          </div>
        </section>
      ) : user.isAdmin ? (
        <section className="card flex items-start gap-4 p-7">
          <span className="bg-brand-50 text-brand-600 grid size-12 shrink-0 place-items-center rounded-2xl">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-semibold">Você é administrador</h2>
            <p className="text-ink mt-1 text-[15px]">
              Administradores têm acesso a todo o conteúdo, sem precisar de assinatura.
            </p>
          </div>
        </section>
      ) : subscription ? (
        <p className="bg-sun-50 text-sun-700 mb-6 rounded-2xl px-5 py-4 text-[15px] font-medium">
          Seu plano {subscription.planName} terminou
          {subscription.currentPeriodEnd ? ` em ${formatDate(subscription.currentPeriodEnd)}` : ""}. Assine de novo para
          voltar a ter acesso completo — o seu progresso continua guardado.
        </p>
      ) : null}

      {/* -------- Planos -------- */}
      {!user.isAdmin || subscription?.active ? (
        <section id="planos" className={cn("scroll-mt-24", subscription?.active && "mt-10")}>
          {subscription?.active ? <h2 className="mb-5 text-xl font-semibold">Renovar ou trocar de plano</h2> : null}
          <PlanCards
            plans={plans}
            viewer={{
              signedIn: true,
              isPremium: user.isPremium,
              activePlanId: subscription?.active ? subscription.planId : null,
            }}
          />
        </section>
      ) : null}

      {/* -------- Pagamentos -------- */}
      <section className="card mt-8 overflow-hidden">
        <div className="p-6 pb-2 sm:p-7 sm:pb-3">
          <h2 className="text-xl font-semibold">Histórico de pagamentos</h2>
        </div>
        {payments.length === 0 ? (
          <p className="text-ink px-6 pb-7 text-[15px] sm:px-7">Nenhum pagamento por aqui ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Plano</th>
                  <th scope="col">Forma</th>
                  <th scope="col">Situação</th>
                  <th scope="col" className="text-right">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="text-navy-900 whitespace-nowrap">{formatDate(payment.createdAt)}</td>
                    <td>{payment.planName ?? "—"}</td>
                    <td>{paymentWayLabel(payment.provider, payment.method)}</td>
                    <td>{PAYMENT_STATUS_LABEL[payment.status]}</td>
                    <td className="text-navy-900 text-right font-medium whitespace-nowrap tabular-nums">
                      {formatMoney(payment.amountCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-muted mt-6 text-sm">
        Comprou e se arrependeu? Você tem 7 dias para pedir o reembolso, pelo link do e-mail de confirmação da compra
        ou escrevendo para{" "}
        <a href={`mailto:${site.supportEmail}`} className="text-brand-600 underline underline-offset-2">
          {site.supportEmail}
        </a>
        .
      </p>
    </div>
  );
}
