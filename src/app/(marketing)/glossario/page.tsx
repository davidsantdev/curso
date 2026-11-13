import type { Metadata } from "next";
import Link from "next/link";
import { GlossaryBrowser, type GlossaryItem } from "@/components/marketing/glossary-browser";
import { GLOSSARY, GLOSSARY_CATEGORIES } from "@/content/glossary";
import { getCurrentUser } from "@/lib/auth/dal";
import { getCatalog } from "@/lib/content";
import { slugify } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dicionário de quem vende pela internet",
  description:
    "Dropshipping, checkout, pixel, ROAS, chargeback… Os termos de quem vende pela internet explicados em linguagem simples, para quem está começando do zero.",
};

export default async function GlossaryPage() {
  const [user, catalog] = await Promise.all([getCurrentUser(), getCatalog()]);
  const trackTitles = new Map(catalog.map((track) => [track.slug, track.title]));

  const items: GlossaryItem[] = [...GLOSSARY]
    .sort((a, b) => a.term.localeCompare(b.term, "pt-BR"))
    .map((entry) => {
      const title = entry.track ? trackTitles.get(entry.track) : undefined;
      return {
        id: `termo-${slugify(entry.term)}`,
        term: entry.term,
        also: entry.also,
        category: entry.category,
        definition: entry.definition,
        track: entry.track && title ? { slug: entry.track, title } : undefined,
      };
    });

  return (
    <div className="container-page pt-12 pb-20 lg:pt-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Dicionário</p>
        <h1 className="mt-3 text-4xl leading-[1.1] font-bold text-balance lg:text-5xl">
          As palavras de quem vende pela internet, sem complicação
        </h1>
        <p className="text-ink mt-5 text-[17px] leading-relaxed">
          Ouviu um termo e não entendeu? Aqui estão {items.length} deles, explicados do jeito que a gente explicaria
          para um amigo.
        </p>
      </div>

      <div className="mt-10">
        <GlossaryBrowser items={items} categories={GLOSSARY_CATEGORIES} />
      </div>

      <section className="bg-hero relative mt-16 overflow-hidden rounded-[32px] px-7 py-12 text-center text-white sm:px-12">
        <div className="absolute -top-16 -right-10 size-56 rounded-full bg-white/10" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl leading-tight font-bold text-white lg:text-[34px]">
            Mais fácil do que decorar é ver na prática
          </h2>
          <p className="mt-3 text-[17px] leading-relaxed text-white/90">
            A trilha Vender sem estoque explica tudo do zero, em aulas curtas — e é grátis.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href={user ? "/painel" : "/cadastro"} className="btn btn-pink btn-lg">
              {user ? "Continuar estudando" : "Começar grátis"}
            </Link>
            <Link href="/cursos" className="btn btn-glass btn-lg">
              Ver o que você vai aprender
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
