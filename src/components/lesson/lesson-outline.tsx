import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { LessonStatusIcon, type LessonStatus } from "@/components/app/lesson-status-icon";
import { ProgressBar } from "@/components/ui/progress";
import { canAccessLesson, summarize, trackLessons, type CatalogTrack } from "@/lib/content";
import { getTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** Índice da trilha ao lado da aula. */
export function LessonOutline({
  track,
  currentLessonId,
  completed,
  user,
}: {
  track: CatalogTrack;
  currentLessonId: string;
  completed: ReadonlySet<string>;
  user: { isPremium: boolean };
}) {
  const theme = getTheme(track.color);
  const progress = summarize(trackLessons(track), completed);

  return (
    <nav className="card overflow-hidden" aria-label={`Aulas da trilha ${track.title}`}>
      <div className="border-line border-b p-5">
        <Link href={`/trilhas/${track.slug}`} className="text-navy-900 hover:text-brand-600 text-[16px] font-semibold">
          {track.title}
        </Link>
        <div className="mt-3 mb-1.5 flex justify-between text-sm">
          <span className="text-muted">
            {progress.done} de {progress.total} aulas
          </span>
          <span className="text-navy-900 font-semibold">{progress.percent}%</span>
        </div>
        <ProgressBar
          value={progress.percent}
          label={`Progresso em ${track.title}`}
          from={theme.from}
          to={theme.to}
          track={theme.soft}
          size="sm"
        />
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        {track.modules.map((mod, moduleIndex) => {
          const containsCurrent = mod.lessons.some((lesson) => lesson.id === currentLessonId);
          const moduleProgress = summarize(mod.lessons, completed);

          return (
            <details key={mod.id} open={containsCurrent} className="group border-line border-b last:border-b-0">
              <summary className="hover:bg-surface flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <div className="min-w-0 flex-1">
                  <p className="text-muted text-xs font-semibold tracking-wide uppercase">Módulo {moduleIndex + 1}</p>
                  <p className="text-navy-900 truncate text-[15px] font-semibold">{mod.title}</p>
                </div>
                <span className="text-muted shrink-0 text-xs">
                  {moduleProgress.done}/{moduleProgress.total}
                </span>
                <ChevronDown
                  className="text-muted size-4 shrink-0 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <ol className="px-3 pb-3">
                {mod.lessons.map((lesson) => {
                  const isCurrent = lesson.id === currentLessonId;
                  const status: LessonStatus = completed.has(lesson.id)
                    ? "done"
                    : !canAccessLesson(user, lesson)
                      ? "locked"
                      : isCurrent
                        ? "current"
                        : "available";

                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/aula/${lesson.id}`}
                        aria-current={isCurrent ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors",
                          isCurrent ? "bg-brand-50" : "hover:bg-surface",
                        )}
                      >
                        <LessonStatusIcon status={status} className="size-7" />
                        <span
                          className={cn(
                            "min-w-0 flex-1 text-sm leading-snug",
                            isCurrent ? "text-brand-700 font-semibold" : "text-navy-900",
                          )}
                        >
                          {lesson.title}
                        </span>
                        <span className="text-muted shrink-0 text-xs">{lesson.durationMinutes} min</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </details>
          );
        })}
      </div>
    </nav>
  );
}
