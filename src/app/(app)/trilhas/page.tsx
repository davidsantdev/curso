import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Layers, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { TrackBadge } from "@/components/icons";
import { ProgressBar } from "@/components/ui/progress";
import { requireUser } from "@/lib/auth/dal";
import { AccessBadge } from "@/components/track-access-badge";
import { getCatalog, getCompletedLessonIds, summarize, trackAccess, trackLessons } from "@/lib/content";
import { formatDuration, LEVEL_LABEL, plural } from "@/lib/format";
import { getTheme } from "@/lib/theme";

export const metadata: Metadata = { title: "Trilhas" };

export default async function TracksPage() {
  const user = await requireUser();
  const [catalog, completed] = await Promise.all([getCatalog(), getCompletedLessonIds(user.id)]);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Trilhas"
        description="Cada trilha é um caminho completo, dividido em módulos curtos. Siga na ordem ou vá direto ao que precisa agora."
      />

      {catalog.length === 0 ? (
        <div className="card p-10 text-center">
          <h2 className="text-xl font-semibold">Nenhuma trilha publicada ainda</h2>
          <p className="text-ink mt-2">Assim que o conteúdo for publicado, ele aparece aqui.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {catalog.map((track) => {
            const lessonList = trackLessons(track);
            const progress = summarize(lessonList, completed);
            const theme = getTheme(track.color);
            const freeCount = lessonList.filter((lesson) => lesson.isFree).length;
            const locked = !user.isPremium && trackAccess(track) === "pro";
            const cta = locked
              ? "Ver o que você vai aprender"
              : progress.done === 0
                ? "Começar trilha"
                : progress.percent === 100
                  ? "Revisar trilha"
                  : "Continuar";

            return (
              <article key={track.id} className="card flex flex-col overflow-hidden">
                <div className="relative h-28 overflow-hidden" style={{ backgroundImage: `linear-gradient(120deg, ${theme.from}, ${theme.to})` }}>
                  <div className="absolute -top-10 -right-6 size-36 rounded-full bg-white/15" aria-hidden="true" />
                  <div className="absolute right-20 -bottom-14 size-24 rounded-full bg-white/10" aria-hidden="true" />
                  <span className="badge absolute top-5 left-6 bg-white/90" style={{ color: theme.ink }}>
                    {LEVEL_LABEL[track.level]}
                  </span>
                  {!user.isPremium ? <AccessBadge access={trackAccess(track)} className="absolute top-5 right-6" /> : null}
                </div>

                <div className="relative -mt-9 flex flex-1 flex-col px-7 pb-7">
                  <TrackBadge
                    icon={track.icon}
                    color={track.color}
                    className="size-16 rounded-[20px] ring-4 ring-white"
                    iconClassName="size-8"
                  />
                  <h2 className="mt-5 text-xl leading-tight font-semibold">{track.title}</h2>
                  <p className="text-ink mt-2 line-clamp-3 text-[15px] leading-relaxed">{track.description}</p>

                  <ul className="text-muted mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
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
                      {formatDuration(progress.minutes)}
                    </li>
                  </ul>

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-ink">
                        {progress.done} de {progress.total} concluídas
                      </span>
                      <span className="text-navy-900 font-semibold">{progress.percent}%</span>
                    </div>
                    <ProgressBar
                      value={progress.percent}
                      label={`Progresso em ${track.title}`}
                      from={theme.from}
                      to={theme.to}
                      track={theme.soft}
                    />
                  </div>

                  {!user.isPremium && freeCount < lessonList.length ? (
                    <p className="text-muted mt-4 text-sm">
                      {freeCount > 0
                        ? `${plural(freeCount, "aula grátis", "aulas grátis")} · restante no plano Pro`
                        : "Conteúdo do plano Pro"}
                    </p>
                  ) : null}

                  <div className="mt-auto pt-6">
                    <Link href={`/trilhas/${track.slug}`} className="btn btn-primary w-full">
                      {cta}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
