import type { Metadata } from "next";
import Link from "next/link";
import { Check, ChevronDown, Clock, Crown, Gift, Layers, Lock, PlayCircle } from "lucide-react";
import { TrackIcon } from "@/components/icons";
import { AccessBadge } from "@/components/track-access-badge";
import { getCurrentUser } from "@/lib/auth/dal";
import { getCatalog, trackAccess, trackLessons, type CatalogTrack } from "@/lib/content";
import { formatDuration, LEVEL_LABEL, plural } from "@/lib/format";
import { deepGradient, getTheme } from "@/lib/theme";

export const metadata: Metadata = {
  title: "O que você vai aprender",
  description:
    "A grade completa: vender sem estoque, produtos e fornecedores, loja virtual, sites, pagamentos, robôs e anúncios no Facebook, Instagram, TikTok e Google.",
};

function trackCta(track: CatalogTrack, signedIn: boolean) {
  if (signedIn) return { href: `/trilhas/${track.slug}`, label: "Abrir trilha" };
  if (trackAccess(track) !== "pro") {
    return { href: `/cadastro?next=${encodeURIComponent(`/trilhas/${track.slug}`)}`, label: "Começar grátis" };
  }
  return { href: "/precos", label: "Ver planos" };
}

export default async function CoursesPage() {
  const [user, catalog] = await Promise.all([getCurrentUser(), getCatalog()]);
  const totalLessons = catalog.reduce((sum, track) => sum + trackLessons(track).length, 0);
  const totalMinutes = catalog.reduce(
    (sum, track) => sum + trackLessons(track).reduce((acc, lesson) => acc + lesson.durationMinutes, 0),
    0,
  );

  return (
    <div className="container-page pt-12 pb-20 lg:pt-16">
      {/* -------- Cabeçalho -------- */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Grade completa</p>
        <h1 className="mt-3 text-4xl leading-[1.1] font-bold text-balance lg:text-5xl">Tudo o que você vai aprender</h1>
        <p className="text-ink mt-5 text-[17px] leading-relaxed">
          {plural(catalog.length, "trilha", "trilhas")}, {plural(totalLessons, "aula", "aulas")} e{" "}
          {formatDuration(totalMinutes)} de conteúdo, do primeiro passo ao anúncio. A trilha{" "}
          <strong className="text-navy-900 font-semibold">Vender sem estoque</strong> é grátis; os métodos fazem parte do
          plano Pro.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={user ? "/painel" : "/cadastro"} className="btn btn-pink btn-lg">
            {user ? "Ir para o painel" : "Começar grátis"}
          </Link>
          <Link href="/precos" className="btn btn-outline btn-lg">
            Ver planos
          </Link>
        </div>
      </div>

      {/* -------- Atalhos -------- */}
      <nav className="mx-auto mt-12 max-w-5xl" aria-label="Ir para a trilha">
        <ul className="flex flex-wrap justify-center gap-2">
          {catalog.map((track) => {
            const theme = getTheme(track.color);
            return (
              <li key={track.id}>
                <a
                  href={`#${track.slug}`}
                  className="border-line text-navy-900 hover:border-brand-300 inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-2 text-sm font-medium transition-colors"
                >
                  <span className="grid size-6 place-items-center rounded-full" style={{ backgroundColor: theme.soft, color: theme.ink }}>
                    <TrackIcon icon={track.icon} className="size-3.5" />
                  </span>
                  {track.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* -------- Trilhas -------- */}
      <div className="mx-auto mt-12 max-w-5xl space-y-8">
        {catalog.map((track, trackIndex) => {
          const theme = getTheme(track.color);
          const lessonList = trackLessons(track);
          const minutes = lessonList.reduce((sum, lesson) => sum + lesson.durationMinutes, 0);
          const access = trackAccess(track);
          const cta = trackCta(track, Boolean(user));

          return (
            <section key={track.id} id={track.slug} className="card scroll-mt-24 overflow-hidden">
              <header className="relative overflow-hidden p-7 text-white sm:p-9" style={{ backgroundImage: deepGradient(theme) }}>
                <div className="absolute -top-20 -right-12 size-60 rounded-full bg-white/10" aria-hidden="true" />
                <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="grid size-11 place-items-center rounded-2xl bg-white/20">
                        <TrackIcon icon={track.icon} className="size-5.5" />
                      </span>
                      <span className="text-sm font-semibold text-white/85">Trilha {trackIndex + 1}</span>
                      <AccessBadge access={access} />
                    </div>
                    <h2 className="mt-4 text-[26px] leading-tight font-bold text-white sm:text-[30px]">{track.title}</h2>
                    <p className="mt-2 text-[16px] leading-relaxed text-white/90">{track.description}</p>
                    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-white/90">
                      <li className="inline-flex items-center gap-1.5">
                        <Layers className="size-4" aria-hidden="true" />
                        {plural(track.modules.length, "módulo", "módulos")}
                      </li>
                      <li className="inline-flex items-center gap-1.5">
                        <PlayCircle className="size-4" aria-hidden="true" />
                        {plural(lessonList.length, "aula", "aulas")}
                      </li>
                      <li className="inline-flex items-center gap-1.5">
                        <Clock className="size-4" aria-hidden="true" />
                        {formatDuration(minutes)}
                      </li>
                      <li>{LEVEL_LABEL[track.level]}</li>
                    </ul>
                  </div>
                  <Link href={cta.href} className="btn btn-white shrink-0">
                    {access === "pro" && !user ? <Crown className="size-4" aria-hidden="true" /> : null}
                    {cta.label}
                  </Link>
                </div>
              </header>

              <div className="space-y-7 p-6 sm:p-8">
                {track.modules.map((mod, moduleIndex) => (
                  <div key={mod.id}>
                    <h3 className="text-[17px] font-semibold">
                      <span style={{ color: theme.ink }}>Módulo {moduleIndex + 1} · </span>
                      {mod.title}
                    </h3>
                    {mod.description ? <p className="text-ink mt-1 text-sm">{mod.description}</p> : null}

                    <ol className="mt-3 space-y-2">
                      {mod.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <details className="group border-line open:bg-surface/60 rounded-2xl border bg-white">
                            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                              {lesson.isFree ? (
                                <PlayCircle className="text-mint-600 size-5 shrink-0" aria-hidden="true" />
                              ) : (
                                <Lock className="text-muted size-4.5 shrink-0" aria-hidden="true" />
                              )}
                              <span className="text-navy-900 min-w-0 flex-1 text-[15px] leading-snug font-medium">
                                {lesson.title}
                                <span className="sr-only">{lesson.isFree ? " (aula grátis)" : " (plano Pro)"}</span>
                              </span>
                              {lesson.isFree ? (
                                <span className="badge bg-mint-50 text-mint-700 hidden sm:inline-flex">
                                  <Gift className="size-3" aria-hidden="true" />
                                  Grátis
                                </span>
                              ) : null}
                              <span className="text-muted shrink-0 text-sm tabular-nums">{lesson.durationMinutes} min</span>
                              <ChevronDown
                                className="text-muted size-4 shrink-0 transition-transform group-open:rotate-180"
                                aria-hidden="true"
                              />
                            </summary>
                            <div className="px-4 pb-4 sm:pl-12">
                              {lesson.summary ? <p className="text-ink text-[15px]">{lesson.summary}</p> : null}
                              {lesson.objectives.length > 0 ? (
                                <>
                                  <p className="text-navy-900 mt-3 text-sm font-semibold">Você vai aprender:</p>
                                  <ul className="mt-2 space-y-1.5">
                                    {lesson.objectives.map((objective) => (
                                      <li key={objective} className="text-ink flex items-start gap-2 text-sm">
                                        <Check className="text-mint-600 mt-0.5 size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
                                        {objective}
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              ) : null}
                            </div>
                          </details>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* -------- Chamada final -------- */}
      <div className="bg-hero relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-[32px] px-6 py-12 text-center sm:px-12">
        <div className="absolute -top-20 -left-16 size-56 rounded-full bg-white/10" aria-hidden="true" />
        <div className="relative">
          <h2 className="text-3xl leading-tight font-bold text-white lg:text-4xl">Comece pela trilha grátis hoje</h2>
          <p className="mx-auto mt-3 max-w-xl text-[17px] leading-relaxed text-white/90">
            Entenda como vender sem estoque e monte o seu plano. Quando quiser, libere todos os métodos com o Pro.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href={user ? "/painel" : "/cadastro"} className="btn btn-pink btn-lg">
              {user ? "Ir para o painel" : "Criar conta grátis"}
            </Link>
            <Link href="/precos" className="btn btn-glass btn-lg">
              Ver planos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
