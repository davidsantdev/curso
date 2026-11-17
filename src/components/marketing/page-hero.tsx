import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Faixa escura no topo das páginas públicas (cursos, planos, dicionário, termos), no mesmo estilo do topo da
 * página inicial. Para destacar uma palavra do título, use `<span className="accent">`.
 */
export function PageHero({
  eyebrow,
  title,
  children,
  compact = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  /** Versão mais baixa, para páginas de texto (termos e privacidade). */
  compact?: boolean;
}) {
  return (
    <section className="bg-night relative overflow-hidden">
      <div className="night-glow" aria-hidden="true" />
      <div className="night-grid" aria-hidden="true" />
      <div
        className={cn(
          "container-page text-center",
          compact ? "pt-14 pb-16 lg:pt-20 lg:pb-20" : "pt-16 pb-20 lg:pt-24 lg:pb-28",
        )}
      >
        <div className="mx-auto max-w-3xl">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1
            className={cn(
              "mt-4 leading-[1.04] font-semibold text-balance",
              compact ? "text-[38px] sm:text-[46px]" : "text-[40px] sm:text-[52px] lg:text-[60px]",
            )}
          >
            {title}
          </h1>
        </div>
        {children}
      </div>
    </section>
  );
}

/** Texto de apoio logo abaixo do título da faixa escura. */
export function PageHeroText({ children }: { children: ReactNode }) {
  return <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-white/65">{children}</p>;
}

/** Chamada no fim das páginas: um painel escuro arredondado, com o brilho da marca. */
export function NightPanel({ title, text, children }: { title: ReactNode; text: ReactNode; children: ReactNode }) {
  return (
    <section className="bg-night relative mx-auto mt-16 max-w-5xl overflow-hidden rounded-[32px] px-6 py-14 text-center sm:px-12">
      <div className="night-glow" aria-hidden="true" />
      <div className="night-grid" aria-hidden="true" />
      <h2 className="mx-auto max-w-2xl text-[32px] leading-[1.08] font-semibold lg:text-[42px]">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-white/60">{text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
    </section>
  );
}
