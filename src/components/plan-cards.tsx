import Link from "next/link";
import { Check } from "lucide-react";
import { site } from "@/config/site";
import type { Plan } from "@/db/schema";
import { formatMoney, INTERVAL_LABEL } from "@/lib/format";
import { cn } from "@/lib/utils";

export const FREE_FEATURES = [
  "Trilha Vender sem estoque completa",
  "Certificado da trilha inicial",
  "Veja a grade de todos os métodos",
  "Quizzes, tarefas, XP e conquistas",
  "Calculadoras de margem e de anúncios",
];

export type PlanViewer = {
  signedIn: boolean;
  isPremium: boolean;
  /** Plano com assinatura ativa, se houver. */
  activePlanId: string | null;
};

function monthlyCents(plan: Plan): number | null {
  if (plan.interval === "MONTH") return plan.priceCents;
  if (plan.interval === "YEAR") return Math.round(plan.priceCents / 12);
  return null;
}

function FeatureList({ items, inverted }: { items: string[]; inverted?: boolean }) {
  return (
    <ul className="mt-7 space-y-3.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[15px] leading-snug">
          <span
            className={cn(
              "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
              inverted ? "bg-[linear-gradient(135deg,#6c5cff,#f25fdc)] text-white" : "bg-mint-50 text-mint-600",
            )}
          >
            <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
          </span>
          <span className={inverted ? "text-white/80" : "text-ink"}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Cartões de planos — usados na página inicial, em /precos e em /assinatura. */
export function PlanCards({ plans, viewer }: { plans: Plan[]; viewer: PlanViewer }) {
  const cheapestMonthly = plans
    .filter((plan) => plan.interval === "MONTH")
    .reduce<number | null>((min, plan) => (min === null || plan.priceCents < min ? plan.priceCents : min), null);

  const columns = plans.length + 1;

  return (
    <div
      className={cn(
        "mx-auto grid max-w-md gap-6 lg:max-w-none lg:items-stretch",
        columns === 2 && "lg:max-w-3xl lg:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns >= 4 && "lg:grid-cols-2 xl:grid-cols-4",
      )}
    >
      {/* Plano gratuito */}
      <article className="card border-line flex flex-col border p-8">
        <h3 className="text-xl font-semibold">Grátis</h3>
        <p className="text-ink mt-1.5 text-[15px]">Para entender como vender sem estoque e dar os primeiros passos.</p>
        {site.prelaunch ? (
          <p className="text-muted mt-6 font-mono text-[11.5px] font-medium tracking-[0.14em] uppercase">Sem custo</p>
        ) : null}
        <p
          className={cn(
            "text-navy-900 text-[44px] leading-none font-semibold tracking-[-0.04em]",
            site.prelaunch ? "mt-2" : "mt-6",
          )}
        >
          R$ 0
        </p>
        <p className="text-muted mt-2 text-sm">para sempre</p>
        <FeatureList items={FREE_FEATURES} />
        <div className="mt-auto pt-8">
          {viewer.signedIn ? (
            <span className="btn btn-outline w-full cursor-default" aria-disabled="true">
              {viewer.isPremium ? "Incluído no seu plano" : "Seu plano atual"}
            </span>
          ) : (
            <Link href="/cadastro" className="btn btn-outline w-full">
              Criar conta grátis
            </Link>
          )}
        </div>
      </article>

      {plans.map((plan) => {
        const highlighted = plan.highlighted;
        const perMonth = monthlyCents(plan);
        const saving =
          plan.interval === "YEAR" && cheapestMonthly
            ? Math.round((1 - plan.priceCents / (cheapestMonthly * 12)) * 100)
            : 0;
        const isCurrent = viewer.activePlanId === plan.id;
        const checkoutPath = `/checkout/${plan.slug}`;

        return (
          <article
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-3xl p-8",
              highlighted
                ? "bg-night border-gradient overflow-hidden shadow-[0_40px_90px_-40px_rgb(46_32_120/0.75)]"
                : "card border-line border",
            )}
          >
            {highlighted ? <div className="night-glow" aria-hidden="true" /> : null}
            {saving > 0 ? (
              <span
                className={cn(
                  "badge absolute top-7 right-7",
                  highlighted ? "text-brand-600 bg-white" : "bg-magenta-50 text-magenta-700",
                )}
              >
                Economize {saving}%
              </span>
            ) : null}

            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className={cn("mt-1.5 max-w-[16rem] text-[15px]", highlighted ? "text-white/65" : "text-ink")}>
              {plan.description}
            </p>

            {site.prelaunch ? (
              <p
                className={cn(
                  "mt-6 font-mono text-[11.5px] font-medium tracking-[0.14em] uppercase",
                  highlighted ? "text-[#c9c3ff]" : "text-brand-600",
                )}
              >
                Preço de estreia
              </p>
            ) : null}
            <p
              className={cn(
                "text-[44px] leading-none font-semibold tracking-[-0.04em]",
                site.prelaunch ? "mt-2" : "mt-6",
                highlighted ? "text-white" : "text-navy-900",
              )}
            >
              {formatMoney(plan.priceCents)}
              <span
                className={cn("ml-1 text-base font-medium tracking-normal", highlighted ? "text-white/60" : "text-muted")}
              >
                {INTERVAL_LABEL[plan.interval].suffix}
              </span>
            </p>
            <p className={cn("mt-2 text-sm", highlighted ? "text-white/55" : "text-muted")}>
              {plan.interval === "YEAR" && perMonth
                ? `equivale a ${formatMoney(perMonth)} por mês · sem renovação automática`
                : plan.interval === "LIFETIME"
                  ? "pagamento único, acesso para sempre"
                  : "1 mês de acesso · sem renovação automática"}
            </p>

            <FeatureList items={plan.features} inverted={highlighted} />

            <div className="mt-auto pt-8">
              {isCurrent ? (
                <Link href={checkoutPath} className={cn("btn w-full", highlighted ? "btn-white" : "btn-outline")}>
                  Renovar {plan.name}
                </Link>
              ) : (
                <Link
                  href={viewer.signedIn ? checkoutPath : `/cadastro?next=${encodeURIComponent(checkoutPath)}`}
                  className={cn("btn w-full", highlighted ? "btn-pink" : "btn-primary")}
                >
                  Assinar {plan.name}
                </Link>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
