import type { Metadata } from "next";
import Link from "next/link";
import { GlossaryBrowser, type GlossaryItem } from "@/components/marketing/glossary-browser";
import { NightPanel, PageHero, PageHeroText } from "@/components/marketing/page-hero";
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
    <>
      <PageHero
        eyebrow="Dicionário"
        title={
          <>
            As palavras de quem vende pela internet, <span className="accent">sem complicação</span>
          </>
        }
      >
        <PageHeroText>
          Ouviu um termo e não entendeu? Aqui estão {items.length} deles, explicados do jeito que a gente explicaria
          para um amigo.
        </PageHeroText>
      </PageHero>

      <div className="container-page pt-12 pb-24 lg:pt-16">
        <GlossaryBrowser items={items} categories={GLOSSARY_CATEGORIES} />

        <NightPanel
          title={
            <>
              Mais fácil do que decorar é <span className="accent">ver na prática</span>
            </>
          }
          text="A trilha Vender sem estoque explica tudo do zero, em aulas curtas — e é grátis."
        >
          <Link href={user ? "/painel" : "/cadastro"} className="btn btn-pink btn-lg">
            {user ? "Continuar estudando" : "Começar grátis"}
          </Link>
          <Link href="/cursos" className="btn btn-glass btn-lg">
            Ver o que você vai aprender
          </Link>
        </NightPanel>
      </div>
    </>
  );
}
