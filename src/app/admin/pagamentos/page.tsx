import type { Metadata } from "next";
import Link from "next/link";
import { BadgeDollarSign, ChevronLeft, ChevronRight, CircleX, Clock, Undo2 } from "lucide-react";
import { adminVerifyPaymentAction } from "@/actions/admin-billing";
import { PageHeader } from "@/components/app/page-header";
import { SubmitButton } from "@/components/ui/form";
import { StatTile } from "@/components/ui/stat-tile";
import { listAdminPayments, PAYMENT_FILTERS, type PaymentFilter } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth/dal";
import { getBillingMode } from "@/lib/billing";
import { formatDate, formatMoney, PAYMENT_STATUS_LABEL, paymentWayLabel, plural } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Pagamentos" };

const FILTER_LABEL: Record<PaymentFilter, string> = {
  todos: "Todos",
  pagos: "Pagos",
  pendentes: "Aguardando",
  recusados: "Não aprovados",
  reembolsados: "Reembolsados",
};

const STATUS_STYLE = {
  PAID: "bg-mint-50 text-mint-700",
  PENDING: "bg-sun-50 text-sun-700",
  FAILED: "bg-surface text-ink",
  REFUNDED: "bg-danger-50 text-danger-700",
} as const;

function buildHref(filter: PaymentFilter, page = 1) {
  const search = new URLSearchParams();
  if (filter !== "todos") search.set("filtro", filter);
  if (page > 1) search.set("pagina", String(page));
  const query = search.toString();
  return query ? `/admin/pagamentos?${query}` : "/admin/pagamentos";
}

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string; pagina?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const filter: PaymentFilter = PAYMENT_FILTERS.includes(params.filtro as PaymentFilter)
    ? (params.filtro as PaymentFilter)
    : "todos";
  const page = Math.max(1, Number.parseInt(params.pagina ?? "1", 10) || 1);

  const { rows, total, pages, summary } = await listAdminPayments({ filter, page });
  const gatewayOn = getBillingMode() === "mercadopago";

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Pagamentos"
        description="Tudo o que foi cobrado pela plataforma. Reembolsos são feitos no painel do Mercado Pago e aparecem aqui sozinhos."
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Recebido"
          value={formatMoney(summary.paid.amountCents)}
          hint={plural(summary.paid.total, "pagamento confirmado", "pagamentos confirmados")}
          icon={<BadgeDollarSign className="size-5" aria-hidden="true" />}
          tone="mint"
        />
        <StatTile
          label="Aguardando pagamento"
          value={summary.pending.total}
          hint={`${formatMoney(summary.pending.amountCents)} em aberto`}
          icon={<Clock className="size-5" aria-hidden="true" />}
          tone="sun"
        />
        <StatTile
          label="Não aprovados"
          value={summary.failed.total}
          hint="Recusados, cancelados ou vencidos"
          icon={<CircleX className="size-5" aria-hidden="true" />}
        />
        <StatTile
          label="Reembolsados"
          value={summary.refunded.total}
          hint={`${formatMoney(summary.refunded.amountCents)} devolvidos`}
          icon={<Undo2 className="size-5" aria-hidden="true" />}
          tone="magenta"
        />
      </div>

      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Filtrar pagamentos">
        {PAYMENT_FILTERS.map((item) => (
          <Link
            key={item}
            href={buildHref(item)}
            aria-current={filter === item ? "page" : undefined}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              filter === item ? "bg-brand-500 text-white" : "text-ink hover:text-navy-900 bg-white",
            )}
          >
            {FILTER_LABEL[item]}
          </Link>
        ))}
      </nav>

      <section className="card mt-5 overflow-hidden">
        {rows.length === 0 ? (
          <p className="text-ink p-7 text-[15px]">Nenhum pagamento por aqui.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Aluno</th>
                  <th scope="col">Plano</th>
                  <th scope="col">Forma</th>
                  <th scope="col">Situação</th>
                  <th scope="col" className="text-right">
                    Valor
                  </th>
                  <th scope="col">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((payment) => (
                  <tr key={payment.id}>
                    <td className="whitespace-nowrap">{formatDate(payment.createdAt)}</td>
                    <td>
                      {payment.userId ? (
                        <Link href={`/admin/usuarios/${payment.userId}`} className="text-navy-900 hover:text-brand-600 font-medium">
                          {payment.userName}
                          <span className="text-muted block text-xs font-normal">{payment.userEmail}</span>
                        </Link>
                      ) : (
                        "Conta excluída"
                      )}
                    </td>
                    <td>
                      {payment.planName ?? "—"}
                      {payment.couponCode ? (
                        <span className="text-muted block text-xs">
                          Cupom {payment.couponCode} (−{formatMoney(payment.discountCents)})
                        </span>
                      ) : null}
                    </td>
                    <td>{paymentWayLabel(payment.provider, payment.method)}</td>
                    <td>
                      <span className={cn("badge whitespace-nowrap", STATUS_STYLE[payment.status])}>
                        {PAYMENT_STATUS_LABEL[payment.status]}
                      </span>
                    </td>
                    <td className="text-navy-900 text-right font-medium whitespace-nowrap tabular-nums">
                      {formatMoney(payment.amountCents)}
                    </td>
                    <td className="text-right">
                      {gatewayOn && payment.provider === "mercadopago" && payment.status !== "PAID" && payment.status !== "REFUNDED" ? (
                        <form action={adminVerifyPaymentAction}>
                          <input type="hidden" name="paymentId" value={payment.id} />
                          <SubmitButton className="btn btn-outline btn-sm" pendingLabel="Conferindo…">
                            Conferir
                          </SubmitButton>
                        </form>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="text-ink mt-5 flex items-center justify-between text-sm">
        <p>{plural(total, "pagamento", "pagamentos")}</p>
        {pages > 1 ? (
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link href={buildHref(filter, page - 1)} className="btn btn-outline btn-sm">
                <ChevronLeft className="size-4" aria-hidden="true" />
                Anterior
              </Link>
            ) : null}
            <span className="px-1 tabular-nums">
              Página {page} de {pages}
            </span>
            {page < pages ? (
              <Link href={buildHref(filter, page + 1)} className="btn btn-outline btn-sm">
                Próxima
                <ChevronRight className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
