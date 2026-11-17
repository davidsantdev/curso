import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";

/** Estrutura das páginas de termos e privacidade. */
export function LegalPage({ title, updatedAt, children }: { title: string; updatedAt: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} compact>
        <p className="mt-5 font-mono text-[12px] tracking-[0.1em] text-white/50 uppercase">Última atualização: {updatedAt}</p>
      </PageHero>
      <div className="container-page max-w-3xl pt-12 pb-24 lg:pt-16">
        <div className="bg-sun-50 text-sun-700 flex gap-3 rounded-2xl p-4 text-sm leading-relaxed">
          <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p>
            <strong className="font-semibold">Texto modelo.</strong> Revise este conteúdo com um advogado e complete os
            dados da sua empresa (razão social, CNPJ, endereço e canal de contato) antes de publicar o site.
          </p>
        </div>

        <div className="prose-lesson mt-10">{children}</div>
      </div>
    </>
  );
}
