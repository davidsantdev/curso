import type { Metadata } from "next";
import Link from "next/link";
import { Award, BookOpen, Check, ChevronRight, Flame, ListChecks, Lock, PartyPopper, Play } from "lucide-react";
import { UpgradeBanner } from "@/components/app/upgrade-banner";
import { AchievementIcon, TrackBadge, TrackIcon } from "@/components/icons";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { StatTile } from "@/components/ui/stat-tile";
import { site } from "@/config/site";
import { getUnlockedAchievements } from "@/lib/achievements";
import { requireUser } from "@/lib/auth/dal";
import {
  canAccessLesson,
  getCatalog,
  getCompletedLessonIds,
  getLastCompletedLessonId,
  locateLesson,
  pickContinueLesson,
  summarize,
  trackAccess,
  trackLessons,
} from "@/lib/content";
import { AccessBadge } from "@/components/track-access-badge";
import { dayKey, formatDate, plural } from "@/lib/format";
import { ACHIEVEMENTS, getLevel } from "@/lib/gamification";
import { getActiveDays, getUserCounters } from "@/lib/progress";
import { getTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Painel" };

const weekdayFormat = new Intl.DateTimeFormat("pt-BR", { weekday: "short", timeZone: "UTC" });

function lastSevenDays(): Array<{ key: string; label: string; isToday: boolean }> {
  const today = dayKey();
  return Array.from({ length: 7 }, (_, index) => {
    const key = dayKey(new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000));
    const label = weekdayFormat.format(new Date(`${key}T12:00:00Z`)).replace(".", "");
    return { key, label: label.charAt(0).toUpperCase() + label.slice(1), isToday: key === today };
  });
}

export default async function DashboardPage() {
  const user = await requireUser();

  const [catalog, completed, lastLessonId, counters, activeDays, unlocked] = await Promise.all([
    getCatalog(),
    getCompletedLessonIds(user.id),
    getLastCompletedLessonId(user.id),
    getUserCounters(user.id),
    getActiveDays(user.id, 7),
    getUnlockedAchievements(user.id),
  ]);

  const allLessons = catalog.flatMap(trackLessons);
  const totalLessons = allLessons.length;
  const lockedLessons = allLessons.filter((lesson) => !completed.has(lesson.id) && !canAccessLesson(user, lesson)).length;
  const level = getLevel(user.xp);

  const next = pickContinueLesson(catalog, completed, lastLessonId, (lesson) => canAccessLesson(user, lesson));
  const nextContext = next ? locateLesson(catalog, next.lesson.id) : null;
  const nextTrackProgress = next ? summarize(trackLessons(next.track), completed) : null;
  const allDone = totalLessons > 0 && allLessons.every((lesson) => completed.has(lesson.id));

  const week = lastSevenDays();
  const studiedThisWeek = week.filter((day) => activeDays.has(day.key)).length;

  const recentAchievements = ACHIEVEMENTS.filter((achievement) => unlocked.has(achievement.key))
    .sort((a, b) => (unlocked.get(b.key)?.getTime() ?? 0) - (unlocked.get(a.key)?.getTime() ?? 0))
    .slice(0, 3);

  const firstName = user.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="pb-8">
        <h1 className="text-[28px] leading-tight font-bold lg:text-[34px]">Olá, {firstName}!</h1>
        <p className="text-ink mt-2 text-[16px]">
          {user.streak > 1
            ? `Você está há ${user.streak} dias seguidos estudando. Continue assim!`
            : completed.size === 0
              ? `Bem-vindo à ${site.name}. Que tal começar pela primeira aula?`
              : "Que tal concluir uma aula hoje e manter o ritmo?"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* -------- Continue de onde parou -------- */}
        <section className="bg-night relative overflow-hidden rounded-3xl p-7 text-white sm:p-8 lg:col-span-2">
          <div className="night-glow" aria-hidden="true" />
          <div className="night-grid" aria-hidden="true" />

          <div className="relative">
            {next && nextContext && nextTrackProgress ? (
              <>
                <p className="font-mono text-[12px] font-medium tracking-[0.16em] text-[#c9c3ff] uppercase">
                  {completed.size === 0 ? "Comece por aqui" : "Continue de onde parou"}
                </p>
                <div className="mt-5 flex items-start gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#6c5cff,#f25fdc)] shadow-[0_10px_24px_-10px_rgb(214_84_230/0.7)]">
                    <TrackIcon icon={next.track.icon} className="size-7" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-2xl leading-tight font-semibold sm:text-[30px]">{next.lesson.title}</h2>
                    <p className="mt-1.5 text-[15px] text-white/60">
                      {next.track.title} · {nextContext.module.title}
                    </p>
                  </div>
                </div>

                <div className="mt-7 max-w-md">
                  <div className="mb-2 flex justify-between text-sm text-white/70">
                    <span>
                      {nextTrackProgress.done} de {plural(nextTrackProgress.total, "aula", "aulas")}
                    </span>
                    <span className="font-semibold text-white">{nextTrackProgress.percent}%</span>
                  </div>
                  <ProgressBar
                    value={nextTrackProgress.percent}
                    label={`Progresso em ${next.track.title}`}
from="#8c9bff"
                    to="#b49cfb"
                    track="rgb(140 155 255 / 0.18)"
                  />
                </div>

                <Link href={`/aula/${next.lesson.id}`} className="btn btn-white btn-lg mt-7">
                  <Play className="size-4 fill-current" aria-hidden="true" />
                  {completed.size === 0 ? "Começar a primeira aula" : "Continuar aula"}
                </Link>
              </>
            ) : allDone ? (
              <>
                <PartyPopper className="size-10" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-semibold sm:text-[30px]">Você concluiu todas as aulas!</h2>
                <p className="mt-2 max-w-md text-[16px] text-white/65">
                  Parabéns pela dedicação. Seus certificados estão esperando por você.
                </p>
                <Link href="/certificados" className="btn btn-white btn-lg mt-7">
                  Ver certificados
                </Link>
              </>
            ) : lockedLessons > 0 ? (
              <>
                <Lock className="size-10" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-semibold sm:text-[30px]">Você concluiu as aulas grátis</h2>
                <p className="mt-2 max-w-md text-[16px] text-white/65">
                  Mandou bem! Para seguir na trilha, libere o restante do conteúdo com o plano Pro.
                </p>
                <Link href="/assinatura" className="btn btn-white btn-lg mt-7">
                  Ver planos
                </Link>
              </>
            ) : (
              <>
                <BookOpen className="size-10" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-semibold sm:text-[30px]">As trilhas estão chegando</h2>
                <p className="mt-2 max-w-md text-[16px] text-white/65">
                  Assim que as primeiras aulas forem publicadas, elas aparecem aqui.
                </p>
              </>
            )}
          </div>
        </section>

        {/* -------- Nível -------- */}
        <section className="card flex flex-col p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-ink text-sm font-medium">Seu nível</p>
              <p className="text-navy-900 mt-1 text-2xl leading-tight font-bold">
                {level.number} · {level.name}
              </p>
            </div>
            <ProgressRing value={level.progress} label="Progresso para o próximo nível" />
          </div>
          <p className="text-navy-900 mt-6 text-[40px] leading-none font-semibold">
            {user.xp}
            <span className="text-muted ml-1.5 text-base font-medium">XP</span>
          </p>
          <p className="text-ink mt-3 text-[15px] leading-snug">
            {level.nextName
              ? `Faltam ${level.remaining} XP para o nível ${level.nextName}.`
              : "Você chegou ao nível máximo. Lendário!"}
          </p>
          <Link
            href="/conquistas"
            className="text-brand-600 hover:text-brand-700 mt-auto inline-flex items-center gap-1 pt-6 text-[15px] font-semibold"
          >
            Ver conquistas
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </section>
      </div>

      {/* -------- Números -------- */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Sequência de estudos"
          value={plural(user.streak, "dia", "dias")}
          hint={`Seu recorde: ${plural(user.longestStreak, "dia", "dias")}`}
          icon={<Flame className="size-5" aria-hidden="true" />}
          tone="sun"
        />
        <StatTile
          label="Aulas concluídas"
          value={counters.lessonsDone}
          hint={`de ${plural(totalLessons, "aula publicada", "aulas publicadas")}`}
          icon={<BookOpen className="size-5" aria-hidden="true" />}
        />
        <StatTile
          label="Tarefas práticas feitas"
          value={counters.tasksDone}
          hint="Marque as tarefas ao final das aulas"
          icon={<ListChecks className="size-5" aria-hidden="true" />}
          tone="mint"
        />
        <StatTile
          label="Certificados"
          value={counters.certificates}
          hint={counters.certificates > 0 ? "Veja em Certificados" : "Conclua uma trilha para ganhar"}
          icon={<Award className="size-5" aria-hidden="true" />}
          tone="magenta"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* -------- Trilhas -------- */}
        <section className="card p-7 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Suas trilhas</h2>
            <Link href="/trilhas" className="text-brand-600 hover:text-brand-700 text-[15px] font-semibold">
              Ver todas
            </Link>
          </div>

          {catalog.length === 0 ? (
            <p className="text-ink mt-6 text-[15px]">Nenhuma trilha publicada ainda.</p>
          ) : (
            <ul className="divide-line mt-5 divide-y">
              {catalog.map((track) => {
                const progress = summarize(trackLessons(track), completed);
                const theme = getTheme(track.color);
                return (
                  <li key={track.id}>
                    <Link
                      href={`/trilhas/${track.slug}`}
                      className="group hover:bg-surface -mx-3 flex items-center gap-4 rounded-2xl px-3 py-4 transition-colors"
                    >
                      <TrackBadge icon={track.icon} color={track.color} className="size-11" iconClassName="size-5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="text-navy-900 flex min-w-0 items-center gap-2 text-[16px] font-semibold">
                            <span className="truncate">{track.title}</span>
                            {!user.isPremium && trackAccess(track) === "pro" ? (
                              <AccessBadge access="pro" className="shrink-0" />
                            ) : null}
                          </p>
                          <p className="text-navy-900 shrink-0 text-sm font-semibold">{progress.percent}%</p>
                        </div>
                        <ProgressBar
                          value={progress.percent}
                          label={`Progresso em ${track.title}`}
                          from={theme.from}
                          to={theme.to}
                          track={theme.soft}
                          size="sm"
                          className="mt-2"
                        />
                        <p className="text-muted mt-2 text-sm">
                          {progress.done} de {plural(progress.total, "aula", "aulas")} concluídas
                        </p>
                      </div>
                      <ChevronRight
                        className="text-muted group-hover:text-brand-600 size-5 shrink-0 transition-colors"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="grid content-start gap-6">
          {/* -------- Semana -------- */}
          <section className="card p-7">
            <h2 className="text-xl font-semibold">Esta semana</h2>
            <p className="text-ink mt-1 text-sm">
              {studiedThisWeek > 0
                ? `Você estudou em ${plural(studiedThisWeek, "dia", "dias")} dos últimos 7.`
                : "Nenhuma aula concluída nos últimos 7 dias."}
            </p>
            <ol className="mt-5 grid grid-cols-7 gap-1">
              {week.map((day) => {
                const studied = activeDays.has(day.key);
                return (
                  <li key={day.key} className="flex flex-col items-center gap-2">
                    <span
                      className={cn(
                        "grid size-9 place-items-center rounded-full",
                        studied ? "bg-brand-500 text-white" : "bg-surface",
                        day.isToday && !studied && "ring-brand-300 ring-2 ring-inset",
                      )}
                    >
                      {studied ? <Check className="size-4" strokeWidth={3} aria-hidden="true" /> : null}
                      <span className="sr-only">
                        {day.label}: {studied ? "estudou" : "sem estudo"}
                        {day.isToday ? " (hoje)" : ""}
                      </span>
                    </span>
                    <span
                      className={cn("text-xs", day.isToday ? "text-navy-900 font-semibold" : "text-muted")}
                      aria-hidden="true"
                    >
                      {day.isToday ? "Hoje" : day.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* -------- Conquistas -------- */}
          <section className="card p-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Conquistas</h2>
              <span className="text-muted text-sm">
                {unlocked.size}/{ACHIEVEMENTS.length}
              </span>
            </div>
            {recentAchievements.length === 0 ? (
              <p className="text-ink mt-3 text-[15px] leading-relaxed">
                Conclua a sua primeira aula para desbloquear a primeira conquista.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {recentAchievements.map((achievement) => (
                  <li key={achievement.key} className="flex items-center gap-3">
                    <span className="bg-sun-50 text-sun-500 grid size-10 shrink-0 place-items-center rounded-xl">
                      <AchievementIcon icon={achievement.icon} className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-navy-900 truncate text-[15px] font-semibold">{achievement.title}</p>
                      <p className="text-muted text-xs">{formatDate(unlocked.get(achievement.key)!)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/conquistas"
              className="text-brand-600 hover:text-brand-700 mt-5 inline-flex items-center gap-1 text-[15px] font-semibold"
            >
              Ver todas
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </section>
        </div>
      </div>

      {!user.isPremium ? (
        <div className="mt-6">
          <UpgradeBanner lockedLessons={lockedLessons} />
        </div>
      ) : null}
    </div>
  );
}
