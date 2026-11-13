"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type GlossaryItem = {
  id: string;
  term: string;
  also?: string;
  category: string;
  definition: string;
  /** Trilha em que o assunto é ensinado, quando ela está publicada. */
  track?: { slug: string; title: string };
};

/** Compara textos sem ligar para maiúsculas nem acentos ("anuncio" encontra "anúncio"). */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

export function GlossaryBrowser({ items, categories }: { items: GlossaryItem[]; categories: readonly string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const visible = useMemo(() => {
    const term = normalize(query.trim());
    return items.filter((item) => {
      if (category && item.category !== category) return false;
      if (!term) return true;
      return normalize(`${item.term} ${item.also ?? ""} ${item.definition}`).includes(term);
    });
  }, [items, query, category]);

  return (
    <div>
      <div className="mx-auto max-w-2xl">
        <label htmlFor="busca-termo" className="sr-only">
          Buscar um termo
        </label>
        <div className="relative">
          <Search
            className="text-muted pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            id="busca-termo"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busque um termo: pixel, checkout, ROAS…"
            className="input h-14 rounded-full pl-13 text-[16px]"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2" role="group" aria-label="Filtrar por assunto">
        {[null, ...categories].map((item) => {
          const active = category === item;
          return (
            <button
              key={item ?? "todos"}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(item)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active ? "bg-brand-500 text-white" : "bg-surface text-ink hover:text-navy-900",
              )}
            >
              {item ?? "Todos"}
            </button>
          );
        })}
      </div>

      <p className="text-muted mt-8 text-center text-sm" role="status">
        {visible.length === 1 ? "1 termo" : `${visible.length} termos`}
      </p>

      {visible.length === 0 ? (
        <div className="card mx-auto mt-6 max-w-xl p-8 text-center">
          <h2 className="text-xl font-semibold">Não encontramos esse termo</h2>
          <p className="text-ink mt-2 text-[15px]">Tente outra palavra ou veja todos os assuntos.</p>
          <button
            type="button"
            className="btn btn-outline btn-sm mt-5"
            onClick={() => {
              setQuery("");
              setCategory(null);
            }}
          >
            Limpar a busca
          </button>
        </div>
      ) : (
        <dl className="mt-6 grid gap-5 md:grid-cols-2">
          {visible.map((item) => (
            <div key={item.id} id={item.id} className="card scroll-mt-24 p-6">
              <dt>
                <span className="text-brand-600 text-xs font-semibold tracking-wider uppercase">{item.category}</span>
                <span className="text-navy-900 mt-1.5 block text-xl leading-tight font-semibold">{item.term}</span>
                {item.also ? <span className="text-muted mt-1 block text-sm">Também chamado de {item.also}</span> : null}
              </dt>
              <dd className="mt-3">
                <p className="text-ink text-[15px] leading-relaxed">{item.definition}</p>
                {item.track ? (
                  <Link
                    href={`/cursos#${item.track.slug}`}
                    className="text-brand-600 hover:text-brand-700 mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
                  >
                    Aprenda na trilha {item.track.title}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
