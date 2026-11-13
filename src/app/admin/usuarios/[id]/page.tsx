import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Crown, ShieldCheck, ShieldOff } from "lucide-react";
import { revokeAccessAction, setUserRoleAction } from "@/actions/admin-users";
import { GrantAccessForm, SetPasswordForm } from "@/components/admin/user-forms";
import { Avatar } from "@/components/ui/avatar";
import { ConfirmSubmitButton } from "@/components/ui/form";
import { ProgressBar } from "@/components/ui/progress";
import { getAdminUser } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth/dal";
import { formatDate, formatMoney, INTERVAL_LABEL, PAYMENT_STATUS_LABEL, paymentWayLabel, plural } from "@/lib/format";
import { getLevel } from "@/lib/gamification";
import { getTheme } from "@/lib/theme";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Aluno" };

export default async function AdminUserPage({ params }: Props) {
  const admin = await requireAdmin();
  const data = await getAdminUser((await params).id);
  if (!data) notFound();

  const { user, subscription, payments, plans, progress } = data;
  const level = getLevel(user.xp);
  const isSelf = admin.id === user.id;

  return (
    <div className="mx-auto max-w-6xl">
      <nav className="text-muted flex items-center gap-1.5 pb-4 text-sm" aria-label="Você está em">
        <Link href="/admin/usuarios" className="hover:text-brand-600">
          Alunos
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="text-ink">{user.name}</span>
      </nav>

      <section className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} className="size-14 text-lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl leading-tight font-bold">{user.name}</h1>
              {user.role === "ADMIN" ? <span className="badge bg-navy-900 text-white">Admin</span> : null}
            </div>
            <p className="text-ink truncate text-[15px]">{user.email}</p>
            <p className="text-muted mt-0.5 text-sm">
              Cadastro em {formatDate(user.createdAt)} · Nível {level.number} ({level.name}) · {user.xp} XP · recorde de{" "}
              {plural(user.longestStreak, "dia seguido", "dias seguidos")}
            </p>
          </div>
        </div>
        {!isSelf ? (
          <form action={setUserRoleAction}>
            <input type="hidden" name="userId" value={user.id} />
            <input type="hidden" name="role" value={user.role === "ADMIN" ? "USER" : "ADMIN"} />
            <ConfirmSubmitButton
              message={
                user.role === "ADMIN"
                  ? `Remover o acesso de administrador de ${user.name}?`
                  : `Dar acesso de administrador para ${user.name}? Essa conta poderá editar o conteúdo e ver todos os alunos.`
              }
              className="btn btn-outline btn-sm"
            >
              {user.role === "ADMIN" ? (
                <>
                  <ShieldOff className="size-4" aria-hidden="true" /> Remover admin
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" aria-hidden="true" /> Tornar admin
                </>
              )}
            </ConfirmSubmitButton>
          </form>
        ) : null}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* -------- Assinatura -------- */}
        <section className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Assinatura</h2>
          {subscription ? (
            <div className="bg-surface mt-4 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-navy-900 flex items-center gap-2 text-[16px] font-semibold">
                  <Crown className={subscription.active ? "text-magenta-500 size-5" : "text-muted size-5"} aria-hidden="true" />
                  {subscription.planName} · {subscription.active ? "ativo" : "encerrado"}
                </p>
                <p className="text-ink mt-1 text-sm">
                  {subscription.currentPeriodEnd === null
                    ? "Acesso vitalício"
                    : `${subscription.active ? "Acesso até" : "Terminou em"} ${formatDate(subscription.currentPeriodEnd)}`}
                  {` · ${paymentWayLabel(subscription.provider)}`}
                </p>
              </div>
              {subscription.active ? (
                <form action={revokeAccessAction}>
                  <input type="hidden" name="userId" value={user.id} />
                  <ConfirmSubmitButton
                    message={`Cortar o acesso de ${user.name} agora? (Use em caso de reembolso feito por fora ou de fraude.)`}
                    className="btn btn-danger-ghost btn-sm"
                  >
                    Cortar acesso agora
                  </ConfirmSubmitButton>
                </form>
              ) : null}
            </div>
          ) : (
            <p className="text-ink mt-2 text-[15px]">Plano grátis — nunca assinou.</p>
          )}

          <h3 className="mt-7 text-[16px] font-semibold">Liberar ou renovar acesso manualmente</h3>
          <p className="text-ink mt-1 mb-4 text-sm">
            Para vendas fora da plataforma (Pix, WhatsApp, cortesia). Se o aluno já tem período ativo, o novo é somado ao
            final.
          </p>
          {plans.length > 0 ? (
            <GrantAccessForm
              userId={user.id}
              plans={plans.map((plan) => ({
                id: plan.id,
                label: `${plan.name} — ${formatMoney(plan.priceCents)}${INTERVAL_LABEL[plan.interval].suffix}${plan.active ? "" : " (desativado)"}`,
                price: formatMoney(plan.priceCents),
              }))}
            />
          ) : (
            <p className="text-muted text-sm">Cadastre um plano em Planos primeiro.</p>
          )}
        </section>

        {/* -------- Senha -------- */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold">Redefinir senha</h2>
          <p className="text-ink mt-1 mb-4 text-sm">
            Para quando o aluno não consegue usar o “esqueci minha senha”. Combine a nova senha por um canal seguro.
          </p>
          <SetPasswordForm userId={user.id} />
        </section>
      </div>

      {/* -------- Progresso -------- */}
      <section className="card mt-6 p-6">
        <h2 className="text-lg font-semibold">Progresso nas trilhas</h2>
        {progress.length === 0 ? (
          <p className="text-ink mt-2 text-[15px]">Nenhuma trilha publicada.</p>
        ) : (
          <ul className="mt-4 grid gap-5 md:grid-cols-2">
            {progress.map((track) => {
              const theme = getTheme(track.color);
              return (
                <li key={track.id}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <p className="text-navy-900 truncate text-[15px] font-medium">{track.title}</p>
                    <p className="text-ink shrink-0 text-sm tabular-nums">
                      {track.done}/{track.total} · {track.percent}%
                    </p>
                  </div>
                  <ProgressBar
                    value={track.percent}
                    label={`Progresso em ${track.title}`}
                    from={theme.from}
                    to={theme.to}
                    track={theme.soft}
                    size="sm"
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* -------- Pagamentos -------- */}
      <section className="card mt-6 overflow-hidden">
        <h2 className="px-6 pt-6 text-lg font-semibold">Pagamentos</h2>
        {payments.length === 0 ? (
          <p className="text-ink px-6 pt-2 pb-6 text-[15px]">Nenhum pagamento registrado.</p>
        ) : (
          <div className="mt-2 overflow-x-auto">
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
                    <td className="whitespace-nowrap">{formatDate(payment.createdAt)}</td>
                    <td>{payment.planName ?? "—"}</td>
                    <td>{paymentWayLabel(payment.provider, payment.method)}</td>
                    <td>{PAYMENT_STATUS_LABEL[payment.status]}</td>
                    <td className="text-navy-900 text-right font-medium tabular-nums">{formatMoney(payment.amountCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
