import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { deleteCouponAction, toggleCouponAction } from "@/actions/admin-billing";
import { CouponForm } from "@/components/admin/coupon-form";
import { PageHeader } from "@/components/app/page-header";
import { ConfirmSubmitButton, SubmitButton } from "@/components/ui/form";
import { site } from "@/config/site";
import { listAdminCoupons } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth/dal";
import { listActivePlans } from "@/lib/billing";
import { couponProblem } from "@/lib/checkout";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Cupons" };

export default async function AdminCouponsPage() {
  await requireAdmin();
  const [coupons, plans] = await Promise.all([listAdminCoupons(), listActivePlans()]);
  const linkPlan = plans.find((plan) => plan.highlighted) ?? plans[0];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Cupons de cortesia"
        description="Códigos que liberam o plano sem pagar, para parcerias, criadores de conteúdo e presentes. Descontos parciais (ex.: 20%) são criados na Cakto, no seu produto (o aluno digita na página de pagamento)."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="card overflow-hidden">
          <h2 className="px-6 pt-6 text-lg font-semibold">Cupons criados</h2>
          {coupons.length === 0 ? (
            <p className="text-ink px-6 pt-2 pb-6 text-[15px]">
              Nenhum cupom ainda. Crie o primeiro no formulário ao lado.
            </p>
          ) : (
            <div className="mt-2 overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Desconto</th>
                    <th scope="col">Usos</th>
                    <th scope="col">Validade</th>
                    <th scope="col">Situação</th>
                    <th scope="col">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => {
                    const problem = couponProblem(coupon);
                    return (
                      <tr key={coupon.id}>
                        <td className="text-navy-900 font-semibold">{coupon.code}</td>
                        <td className="tabular-nums">{coupon.percentOff}%</td>
                        <td className="tabular-nums">
                          {coupon.redemptions}
                          {coupon.maxRedemptions !== null ? ` de ${coupon.maxRedemptions}` : ""}
                        </td>
                        <td className="whitespace-nowrap">{coupon.expiresAt ? formatDate(coupon.expiresAt) : "Sem prazo"}</td>
                        <td>
                          <span
                            className={
                              problem ? "badge bg-surface text-ink" : "badge bg-mint-50 text-mint-700"
                            }
                            title={problem ?? undefined}
                          >
                            {!coupon.active ? "Desligado" : problem ? "Encerrado" : "Valendo"}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-1.5">
                            <form action={toggleCouponAction}>
                              <input type="hidden" name="couponId" value={coupon.id} />
                              <SubmitButton className="btn btn-outline btn-sm">
                                {coupon.active ? "Desligar" : "Ligar"}
                              </SubmitButton>
                            </form>
                            <form action={deleteCouponAction}>
                              <input type="hidden" name="couponId" value={coupon.id} />
                              <ConfirmSubmitButton
                                message={`Excluir o cupom ${coupon.code}? Os pagamentos já feitos com ele continuam no histórico.`}
                                className="text-muted hover:bg-danger-50 hover:text-danger-600 grid size-9 place-items-center rounded-lg"
                                aria-label={`Excluir o cupom ${coupon.code}`}
                              >
                                <Trash2 className="size-4" aria-hidden="true" />
                              </ConfirmSubmitButton>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {linkPlan ? (
            <p className="border-line text-ink border-t px-6 py-5 text-sm leading-relaxed">
              <strong className="text-navy-900 font-semibold">Dica:</strong> para mandar um link que já abre com a
              cortesia aplicada, use{" "}
              <code className="bg-surface text-navy-900 rounded px-1.5 py-0.5 text-[13px] break-all">
                {site.url}/checkout/{linkPlan.slug}?cupom=CODIGO
              </code>
              , trocando CODIGO pelo código do cupom.
            </p>
          ) : null}
        </section>

        <section className="card h-fit p-6">
          <h2 className="text-lg font-semibold">Nova cortesia</h2>
          <div className="mt-4">
            <CouponForm />
          </div>
        </section>
      </div>
    </div>
  );
}
