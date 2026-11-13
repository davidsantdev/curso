import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { CreatePlanForm, PlanForm } from "@/components/admin/plan-forms";
import { PageHeader } from "@/components/app/page-header";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { centsToInput, formatMoney, INTERVAL_LABEL } from "@/lib/format";

export const metadata: Metadata = { title: "Planos" };

export default async function AdminPlansPage() {
  await requireAdmin();
  const allPlans = await db.select().from(plans).orderBy(asc(plans.sortOrder), asc(plans.priceCents));

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Planos"
        description="Preço, recorrência e benefícios de cada plano. Mudanças de preço valem para novas assinaturas."
      />

      <div className="space-y-6">
        {allPlans.map((plan) => (
          <section key={plan.id} className="card p-6 sm:p-7">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <span className="text-muted text-sm">
                {formatMoney(plan.priceCents)}
                {INTERVAL_LABEL[plan.interval].suffix}
              </span>
              {plan.active ? (
                <span className="badge bg-mint-50 text-mint-700">À venda</span>
              ) : (
                <span className="badge bg-surface text-ink">Desativado</span>
              )}
              {plan.highlighted ? <span className="badge bg-magenta-50 text-magenta-700">Destaque</span> : null}
            </div>
            <PlanForm
              plan={{
                id: plan.id,
                name: plan.name,
                description: plan.description,
                price: centsToInput(plan.priceCents),
                interval: plan.interval,
                features: plan.features.join("\n"),
                externalPriceId: plan.externalPriceId ?? "",
                highlighted: plan.highlighted,
                active: plan.active,
              }}
            />
          </section>
        ))}

        <section className="card border-brand-200 border-2 border-dashed p-6 sm:p-7">
          <h2 className="mb-1 text-lg font-semibold">Novo plano</h2>
          <p className="text-ink mb-5 text-sm">Ele nasce desativado, para você revisar antes de colocar à venda.</p>
          <CreatePlanForm />
        </section>
      </div>
    </div>
  );
}
