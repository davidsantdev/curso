import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookA } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Calculators } from "@/components/tools/calculators";
import { requireUser } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Ferramentas" };

export default async function ToolsPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Ferramentas"
        description="Calculadoras para decidir com números: preço, margem, anúncios e metas. Nada é salvo — use à vontade."
      />
      <Calculators />
      <p className="text-muted mt-4 text-sm">
        Os resultados são estimativas para apoiar a decisão. Confirme impostos e taxas com o seu contador e com o seu
        meio de pagamento.
      </p>

      <Link
        href="/glossario"
        className="card group hover:shadow-float mt-6 flex items-center gap-4 p-5 transition-shadow sm:p-6"
      >
        <span className="bg-brand-50 text-brand-600 grid size-12 shrink-0 place-items-center rounded-2xl">
          <BookA className="size-6" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-navy-900 block text-[17px] font-semibold">Dicionário de quem vende pela internet</span>
          <span className="text-ink mt-0.5 block text-[15px]">
            Não entendeu um termo? CPA, ROAS, checkout, chargeback e outros, explicados em linguagem simples.
          </span>
        </span>
        <ArrowRight className="text-muted group-hover:text-brand-600 size-5 shrink-0 transition-colors" aria-hidden="true" />
      </Link>
    </div>
  );
}
