import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, Clapperboard, Clock, Crown, Layers, Lock, Play, PlayCircle } from "lucide-react";
import { LessonStatusIcon, type LessonStatus } from "@/components/app/lesson-status-icon";
import { UpgradeBanner } from "@/components/app/upgrade-banner";
import { TrackIcon } from "@/components/icons";
import { trackVideoLabel, VideoSoonBadge } from "@/components/prelaunch";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { site } from "@/config/site";
import { requireUser } from "@/lib/auth/dal";
import {
  canAccessLesson,
  getCatalog,
  getCompletedLessonIds,
  summarize,
  trackLessons,
  videoProgress,
} from "@/lib/content";
import { formatDuration, LEVEL_LABEL, plural } from "@/lib/format";
import { deepGradient, getTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const track = (await getCatalog()).find((item) => item.slug === slug);
  return { title: track?.title ?? "Trilha" };
}

export default async function TrackPage({ params }: Props) {
  const { slug } = await params;
  const user = await requireUser();
  const [catalog, completed] = await Promise.all([getCatalog(), getCompletedLessonIds(user.id)]);

  const track = catalog.find((item) => item.slug === slug);
  if (!track) notFound();

  const lessonList = trackLessons(track);
  const progress = summarize(lessonList, completed);
  const theme = getTheme(track.color);
  const nextLesson = lessonList.find((lesson) => !completed.has(lesson.id) && canAccessLesson(user, lesson)) ?? null;
  const lockedCount = lessonList.filter((lesson) => !canAccessLesson(user, lesson)).length;

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/trilhas"
        className="text-ink hover:text-brand-600 inline-flex items-center gap-1.5 pb-5 text-sm font-medium"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Todas as trilhas
      </Link>

      {/* -------- Cabeçalho da trilha -------- */}
      <section
        className="relative overflow-hidden rounded-3xl p-7 text-white sm:p-10"
        style={{ backgroundImage: deepGradient(theme) }}
      >
        <div className="absolute -top-24 -right-16 size-72 rounded-full bg-white/12" aria-hidden="true" />
        <div className="absolute right-44 -bottom-24 size-52 rounded-full bg-white/10" aria-hidden="true" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/20">
                <TrackIcon icon={track.icon} className="size-6" />
              </span>
              <span className="badge bg-white/90" style={{ color: theme.ink }}>
                {LEVEL_LABEL[track.level]}
              </span>
            </div>
            <h1 className="mt-5 text-[32px] leading-tight font-bold text-white sm:text-[40px]">{track.title}</h1>
            <p className="mt-3 text-[17px] leading-relaxed text-white/90">{track.description}</p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-white/90">
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
              {site.prelaunch ? (
                <li className="inline-flex items-center gap-1.5">
                  <Clapperboard className="size-4" aria-hidden="true" />
                  {trackVideoLabel(videoProgress([track]))}
                </li>
              ) : null}
              <li className="inline-flex items-center gap-1.5">
                <Award className="size-4" aria-hidden="true" />
                Certificado ao concluir
              </li>
            </ul>
          </div>

          <div className="flex shrink-0 items-center gap-5 rounded-2xl bg-white/15 p-5">
            <ProgressRing
              value={progress.percent}
              label={`Progresso em ${track.title}`}
              color="#ffffff"
              track="rgb(255 255 255 / 0.25)"
              textClassName="text-white"
            />
            <div>
              <p className="text-sm text-white/85">
                {progress.done} de {plural(progress.total, "aula", "aulas")}
              </p>
              {nextLesson ? (
                <Link href={`/aula/${nextLesson.id}`} className="btn btn-white mt-3">
                  <Play className="size-4 fill-current" aria-hidden="true" />
                  {progress.done === 0 ? "Começar" : "Continuar"}
                </Link>
              ) : progress.percent === 100 ? (
                <Link href="/certificados" className="btn btn-white mt-3">
                  Ver certificado
                </Link>
              ) : (
                <Link href="/assinatura" className="btn btn-white mt-3">
                  <Lock className="size-4" aria-hidden="true" />
                  Desbloquear
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* -------- Módulos -------- */}
      <div className="mt-8 space-y-6">
        {track.modules.map((mod, moduleIndex) => {
          const moduleProgress = summarize(mod.lessons, completed);
          return (
            <section key={mod.id} className="card p-6 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: theme.ink }}>
                    Módulo {moduleIndex + 1}
                  </p>
                  <h2 className="mt-1 text-xl leading-tight font-semibold">{mod.title}</h2>
                  {mod.description ? <p className="text-ink mt-1.5 text-[15px]">{mod.description}</p> : null}
                </div>
                <div className="w-full shrink-0 sm:w-44">
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-muted">
                      {moduleProgress.done}/{moduleProgress.total} aulas
                    </span>
                    <span className="text-navy-900 font-semibold">{moduleProgress.percent}%</span>
                  </div>
                  <ProgressBar
                    value={moduleProgress.percent}
                    label={`Progresso no módulo ${mod.title}`}
                    from={theme.from}
                    to={theme.to}
                    track={theme.soft}
                    size="sm"
                  />
                </div>
              </div>

              <ol className="mt-5 space-y-1">
                {mod.lessons.map((lesson, lessonIndex) => {
                  const accessible = canAccessLesson(user, lesson);
                  const status: LessonStatus = completed.has(lesson.id)
                    ? "done"
                    : !accessible
                      ? "locked"
                      : nextLesson?.id === lesson.id
                        ? "current"
                        : "available";

                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/aula/${lesson.id}`}
                        className={cn(
                          "group -mx-2 flex items-center gap-4 rounded-2xl px-2 py-3 transition-colors",
                          status === "current" ? "bg-brand-50" : "hover:bg-surface",
                        )}
                      >
                        <LessonStatusIcon status={status} />
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "truncate text-[15px] font-medium",
                              status === "locked" ? "text-ink" : "text-navy-900",
                            )}
                          >
                            <span className="text-muted mr-1.5 font-normal">
                              {moduleIndex + 1}.{lessonIndex + 1}
                            </span>
                            {lesson.title}
                          </p>
                          {lesson.summary ? <p className="text-muted mt-0.5 truncate text-sm">{lesson.summary}</p> : null}
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          {lesson.hasVideo ? null : <VideoSoonBadge className="hidden md:inline-flex" />}
                          {lesson.isFree && !user.isPremium ? (
                            <span className="badge bg-mint-50 text-mint-700 hidden sm:inline-flex">Grátis</span>
                          ) : null}
                          {!accessible ? (
                            <span className="badge bg-magenta-50 text-magenta-700 hidden sm:inline-flex">
                              <Crown className="size-3" aria-hidden="true" />
                              Pro
                            </span>
                          ) : null}
                          <span className="text-muted text-sm">{lesson.durationMinutes} min</span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>

      {!user.isPremium && lockedCount > 0 ? (
        <div className="mt-8">
          <UpgradeBanner lockedLessons={lockedCount} />
        </div>
      ) : null}
    </div>
  );
}
