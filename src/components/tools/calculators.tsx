"use client";

import { useId, useState } from "react";
import { Calculator, Megaphone, Target } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const number = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
const integer = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

/** Aceita "49,90", "1.234,56" ou "49.9". */
function parse(value: string): number {
  const cleaned = value.replace(/[^\d.,-]/g, "");
  if (!cleaned) return 0;
  const normalized = cleaned.includes(",") ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned;
  const result = Number(normalized);
  return Number.isFinite(result) ? result : 0;
}

function NumberInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        {prefix ? (
          <span className="text-muted pointer-events-none absolute inset-y-0 left-4 flex items-center text-[15px]">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn("input tabular-nums", prefix && "pl-11", suffix && "pr-10")}
        />
        {suffix ? (
          <span className="text-muted pointer-events-none absolute inset-y-0 right-4 flex items-center text-[15px]">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? <p className="text-muted mt-1.5 text-xs">{hint}</p> : null}
    </div>
  );
}

function Result({
  label,
  value,
  tone = "default",
  hint,
  big,
}: {
  label: string;
  value: string;
  tone?: "default" | "good" | "bad";
  hint?: string;
  big?: boolean;
}) {
  return (
    <div className={cn("rounded-2xl p-4", big ? "bg-white" : "bg-white/70")}>
      <p className="text-ink text-sm">{label}</p>
      <p
        className={cn(
          "mt-1 leading-tight font-semibold",
          big ? "text-[30px]" : "text-xl",
          tone === "good" && "text-mint-700",
          tone === "bad" && "text-danger-600",
          tone === "default" && "text-navy-900",
        )}
      >
        {value}
      </p>
      {hint ? <p className="text-muted mt-1 text-xs leading-snug">{hint}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Margem e preço                                                   */
/* ------------------------------------------------------------------ */

function MarginCalculator() {
  const [price, setPrice] = useState("129,90");
  const [cost, setCost] = useState("45,00");
  const [shipping, setShipping] = useState("12,00");
  const [fees, setFees] = useState("6");
  const [taxes, setTaxes] = useState("6");
  const [cpa, setCpa] = useState("30,00");
  const [targetMargin, setTargetMargin] = useState("20");

  const p = parse(price);
  const variableCosts = (p * (parse(fees) + parse(taxes))) / 100;
  const contribution = p - parse(cost) - parse(shipping) - variableCosts;
  const profit = contribution - parse(cpa);
  const margin = p > 0 ? (profit / p) * 100 : 0;
  const breakEvenRoas = contribution > 0 ? p / contribution : null;

  const denominator = 1 - (parse(fees) + parse(taxes) + parse(targetMargin)) / 100;
  const suggestedPrice = denominator > 0 ? (parse(cost) + parse(shipping) + parse(cpa)) / denominator : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberInput label="Preço de venda" prefix="R$" value={price} onChange={setPrice} />
        <NumberInput label="Custo do produto" prefix="R$" value={cost} onChange={setCost} />
        <NumberInput label="Frete pago por você" prefix="R$" value={shipping} onChange={setShipping} hint="Use 0 se o cliente paga o frete." />
        <NumberInput label="Custo de anúncio por venda (CPA)" prefix="R$" value={cpa} onChange={setCpa} />
        <NumberInput label="Taxas de pagamento e plataforma" suffix="%" value={fees} onChange={setFees} />
        <NumberInput label="Impostos" suffix="%" value={taxes} onChange={setTaxes} hint="Confirme a alíquota com o seu contador." />
        <NumberInput label="Margem desejada" suffix="%" value={targetMargin} onChange={setTargetMargin} />
      </div>

      <div className="bg-brand-50 grid content-start gap-3 rounded-3xl p-5">
        <Result
          big
          label="Lucro por venda"
          value={money.format(profit)}
          tone={profit > 0 ? "good" : profit < 0 ? "bad" : "default"}
          hint={profit < 0 ? "Cada venda está dando prejuízo com esses números." : undefined}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Result label="Margem líquida" value={`${number.format(margin)}%`} tone={margin > 0 ? "good" : margin < 0 ? "bad" : "default"} />
          <Result
            label="CPA máximo"
            value={money.format(Math.max(0, contribution))}
            hint="O máximo que você pode pagar em anúncio por venda sem prejuízo."
          />
          <Result
            label="ROAS de equilíbrio"
            value={breakEvenRoas ? number.format(breakEvenRoas) : "—"}
            hint="Abaixo disso, os anúncios dão prejuízo."
          />
          <Result
            label={`Preço para ${number.format(parse(targetMargin))}% de margem`}
            value={suggestedPrice ? money.format(suggestedPrice) : "—"}
            hint={suggestedPrice ? undefined : "Taxas + impostos + margem passam de 100%."}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Resultado de campanha                                            */
/* ------------------------------------------------------------------ */

function CampaignCalculator() {
  const [spend, setSpend] = useState("500,00");
  const [revenue, setRevenue] = useState("1.800,00");
  const [orders, setOrders] = useState("14");
  const [productCosts, setProductCosts] = useState("800,00");

  const s = parse(spend);
  const r = parse(revenue);
  const o = parse(orders);
  const roas = s > 0 ? r / s : null;
  const cpa = o > 0 ? s / o : null;
  const ticket = o > 0 ? r / o : null;
  const result = r - s - parse(productCosts);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberInput label="Investimento em anúncios" prefix="R$" value={spend} onChange={setSpend} />
        <NumberInput label="Faturamento da campanha" prefix="R$" value={revenue} onChange={setRevenue} />
        <NumberInput label="Número de vendas" value={orders} onChange={setOrders} />
        <NumberInput
          label="Custos dos pedidos"
          prefix="R$"
          value={productCosts}
          onChange={setProductCosts}
          hint="Produto, frete, taxas e impostos dessas vendas."
        />
      </div>

      <div className="bg-brand-50 grid content-start gap-3 rounded-3xl p-5">
        <Result
          big
          label="Resultado da campanha"
          value={money.format(result)}
          tone={result > 0 ? "good" : result < 0 ? "bad" : "default"}
          hint="Faturamento − anúncios − custos dos pedidos."
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <Result label="ROAS" value={roas ? number.format(roas) : "—"} hint="Faturamento ÷ investimento." />
          <Result label="CPA" value={cpa ? money.format(cpa) : "—"} hint="Custo por venda." />
          <Result label="Ticket médio" value={ticket ? money.format(ticket) : "—"} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Meta de vendas                                                   */
/* ------------------------------------------------------------------ */

function GoalCalculator() {
  const [goal, setGoal] = useState("3.000,00");
  const [profitPerSale, setProfitPerSale] = useState("25,00");
  const [conversion, setConversion] = useState("1,5");
  const [days, setDays] = useState("30");

  const g = parse(goal);
  const pps = parse(profitPerSale);
  const conv = parse(conversion);
  const d = Math.max(1, parse(days));

  const sales = pps > 0 ? Math.ceil(g / pps) : null;
  const visitors = sales && conv > 0 ? Math.ceil(sales / (conv / 100)) : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberInput label="Lucro que você quer no período" prefix="R$" value={goal} onChange={setGoal} />
        <NumberInput
          label="Lucro por venda"
          prefix="R$"
          value={profitPerSale}
          onChange={setProfitPerSale}
          hint="Use o resultado da calculadora de margem."
        />
        <NumberInput
          label="Taxa de conversão da loja"
          suffix="%"
          value={conversion}
          onChange={setConversion}
          hint="De cada 100 visitantes, quantos compram."
        />
        <NumberInput label="Duração do período (dias)" value={days} onChange={setDays} />
      </div>

      <div className="bg-brand-50 grid content-start gap-3 rounded-3xl p-5">
        <Result big label="Vendas necessárias" value={sales ? integer.format(sales) : "—"} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Result label="Vendas por dia" value={sales ? number.format(sales / d) : "—"} />
          <Result label="Visitantes necessários" value={visitors ? integer.format(visitors) : "—"} />
          <Result label="Visitantes por dia" value={visitors ? integer.format(Math.ceil(visitors / d)) : "—"} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Abas                                                                */
/* ------------------------------------------------------------------ */

const TABS = [
  {
    key: "margem",
    label: "Margem e preço",
    icon: Calculator,
    description: "Descubra quanto sobra de cada venda e qual preço cobrar.",
    component: MarginCalculator,
  },
  {
    key: "campanha",
    label: "Resultado de campanha",
    icon: Megaphone,
    description: "Avalie se uma campanha de anúncios deu lucro.",
    component: CampaignCalculator,
  },
  {
    key: "meta",
    label: "Meta de vendas",
    icon: Target,
    description: "Transforme uma meta de lucro em vendas e visitantes por dia.",
    component: GoalCalculator,
  },
] as const;

export function Calculators() {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("margem");
  const current = TABS.find((tab) => tab.key === active) ?? TABS[0];
  const Current = current.component;

  return (
    <div className="card p-6 sm:p-8">
      <div role="tablist" aria-label="Calculadoras" className="bg-surface flex gap-1 overflow-x-auto rounded-2xl p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            id={`tab-${tab.key}`}
            aria-selected={active === tab.key}
            aria-controls={`panel-${tab.key}`}
            onClick={() => setActive(tab.key)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-medium transition-colors",
              active === tab.key ? "text-brand-700 bg-white shadow-sm" : "text-ink hover:text-navy-900",
            )}
          >
            <tab.icon className="size-4.5" aria-hidden="true" />
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${current.key}`} aria-labelledby={`tab-${current.key}`} className="mt-7">
        <p className="text-ink mb-6 text-[15px]">{current.description}</p>
        <Current />
      </div>
    </div>
  );
}
