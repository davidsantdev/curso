import Link from "next/link";
import { BadgeDollarSign, BookOpen, Crown, Users } from "lucide-react";
import { ColumnChart } from "@/components/admin/column-chart";
import { PageHeader } from "@/components/app/page-header";
import { Avatar } from "@/components/ui/avatar";
import { StatTile } from "@/components/ui/stat-tile";
import { getAdminOverview } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth/dal";
import { getBillingMode } from "@/lib/billing";
import { formatDate, formatMoney, paymentWayLabel, plural } from "@/lib/format";

export default async function AdminOverviewPage() {
  await requireAdmin();
  const data = await getAdminOverview();
  const billingMode = getBillingMode();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Visão geral"
        description="Os números da plataforma: alunos, assinaturas, receita e engajamento."
        actions={
          <Link href="/admin/conteudo" className="btn btn-primary">
            Gerenciar conteúdo
          </Link>
        }
      />

      {billingMode === "demo" ? (
        <p className="bg-sun-50 text-sun-700 mb-6 rounded-2xl px-5 py-4 text-sm leading-relaxed">
          <strong className="font-semibold">Checkout em modo demonstração:</strong> os planos são ativados sem
          cobrança. Para vender de verdade, conecte o Mercado Pago (veja o README, seção “Planos e pagamentos”).
        </p>
      ) : billingMode === "disabled" ? (
        <p className="bg-sun-50 text-sun-700 mb-6 rounded-2xl px-5 py-4 text-sm leading-relaxed">
          <strong className="font-semibold">Pagamento on-line desligado:</strong> o checkout mostra só o contato por
          e-mail. Defina MERCADOPAGO_ACCESS_TOKEN para receber por Pix, cartão e boleto (README, seção “Planos e
          pagamentos”).
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Alunos cadastrados"
          value={data.totalUsers}
          hint={`+${data.newUsers} nos últimos 30 dias`}
          icon={<Users className="size-5" aria-hidden="true" />}
        />
        <StatTile
          label="Assinantes ativos"
          value={data.activeSubscribers}
          hint={data.demoSubscribers > 0 ? `${data.demoSubscribers} em modo demonstração` : "Com acesso Pro agora"}
          icon={<Crown className="size-5" aria-hidden="true" />}
          tone="magenta"
        />
        <StatTile
          label="Receita recorrente mensal"
          value={formatMoney(data.mrrCents)}
          hint="Planos anuais contam 1/12 por mês"
          icon={<BadgeDollarSign className="size-5" aria-hidden="true" />}
          tone="mint"
        />
        <StatTile
          label="Recebido em 30 dias"
          value={formatMoney(data.revenue30Cents)}
          hint={
            data.demoPayments30 > 0
              ? `Inclui ${plural(data.demoPayments30, "pagamento", "pagamentos")} de demonstração`
              : "Pagamentos confirmados"
          }
          icon={<BadgeDollarSign className="size-5" aria-hidden="true" />}
          tone="sun"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ColumnChart title="Novos cadastros por dia" data={data.signupsByDay} unit={["cadastro", "cadastros"]} />
        <ColumnChart title="Aulas concluídas por dia" data={data.completionsByDay} unit={["aula", "aulas"]} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card min-w-0 p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Últimos pagamentos</h2>
            <Link href="/admin/pagamentos" className="text-brand-600 hover:text-brand-700 text-sm font-semibold">
              Ver todos
            </Link>
          </div>
          {data.recentPayments.length === 0 ? (
            <p className="text-ink mt-4 text-[15px]">Nenhum pagamento ainda.</p>
          ) : (
            <div className="-mx-6 mt-3 overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th scope="col">Aluno</th>
                    <th scope="col">Plano</th>
                    <th scope="col">Forma</th>
                    <th scope="col">Data</th>
                    <th scope="col" className="text-right">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        {payment.userId ? (
                          <Link href={`/admin/usuarios/${payment.userId}`} className="text-navy-900 hover:text-brand-600 font-medium">
                            {payment.userName}
                          </Link>
                        ) : (
                          "Conta excluída"
                        )}
                      </td>
                      <td>{payment.planName ?? "—"}</td>
                      <td>{paymentWayLabel(payment.provider, payment.method)}</td>
                      <td className="whitespace-nowrap">{formatDate(payment.createdAt)}</td>
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

        <div className="grid content-start gap-6">
          <section className="card p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Novos alunos</h2>
              <Link href="/admin/usuarios" className="text-brand-600 hover:text-brand-700 text-sm font-semibold">
                Ver todos
              </Link>
            </div>
            <ul className="mt-4 space-y-3.5">
              {data.recentUsers.map((user) => (
                <li key={user.id}>
                  <Link href={`/admin/usuarios/${user.id}`} className="group flex items-center gap-3">
                    <Avatar name={user.name} className="size-9 text-xs" />
                    <div className="min-w-0 flex-1">
                      <p className="text-navy-900 group-hover:text-brand-600 truncate text-[15px] font-medium">{user.name}</p>
                      <p className="text-muted truncate text-xs">{user.email}</p>
                    </div>
                    <span className="text-muted shrink-0 text-xs">{formatDate(user.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="text-brand-500 size-5" aria-hidden="true" />
              Conteúdo
            </h2>
            <dl className="mt-4 space-y-2 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-ink">Trilhas publicadas</dt>
                <dd className="text-navy-900 font-semibold tabular-nums">
                  {data.content.publishedTracks} de {data.content.tracks}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink">Aulas publicadas</dt>
                <dd className="text-navy-900 font-semibold tabular-nums">
                  {data.content.publishedLessons} de {data.content.lessons}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
