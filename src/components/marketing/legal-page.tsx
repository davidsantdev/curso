import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";

/** Estrutura das páginas de termos e privacidade. */
export function LegalPage({ title, updatedAt, children }: { title: string; updatedAt: string; children: ReactNode }) {
  return (
    <div className="container-page max-w-3xl pt-12 pb-20 lg:pt-16">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-muted mt-3 text-sm">Última atualização: {updatedAt}</p>

      <div className="bg-sun-50 text-sun-700 mt-8 flex gap-3 rounded-2xl p-4 text-sm leading-relaxed">
        <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <p>
          <strong className="font-semibold">Texto modelo.</strong> Revise este conteúdo com um advogado e complete os
          dados da sua empresa (razão social, CNPJ, endereço e canal de contato) antes de publicar o site.
        </p>
      </div>

      <div className="prose-lesson mt-10">{children}</div>
    </div>
  );
}
