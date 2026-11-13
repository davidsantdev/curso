import type { Metadata } from "next";
import { CircleCheck, Flame, Lock, PlayCircle, Zap } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { AchievementIcon } from "@/components/icons";
import { ProgressBar } from "@/components/ui/progress";
import { getUnlockedAchievements } from "@/lib/achievements";
import { requireUser } from "@/lib/auth/dal";
import { formatDate } from "@/lib/format";
import { ACHIEVEMENTS, getLevel, LEVELS, QUIZ_BONUS_XP, QUIZ_PASS_PERCENT } from "@/lib/gamification";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Conquistas" };

const XP_RULES = [
  { icon: PlayCircle, title: "Concluir uma aula", text: "Cada aula vale o XP indicado nela (normalmente 10 XP)." },
  {
    icon: CircleCheck,
    title: "Passar no quiz",
    text: `+${QUIZ_BONUS_XP} XP na primeira vez que acertar pelo menos ${QUIZ_PASS_PERCENT}%.`,
  },
  { icon: Flame, title: "Manter a sequência", text: "Conclua pelo menos uma aula por dia para a sequência não zerar." },
];

export default async function AchievementsPage() {
  const user = await requireUser();
  const unlocked = await getUnlockedAchievements(user.id);
  const level = getLevel(user.xp);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Conquistas" description="Seu nível, seu XP e as conquistas que você já desbloqueou." />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="bg-hero relative overflow-hidden rounded-3xl p-7 text-white sm:p-8 lg:col-span-2">
          <div className="absolute -top-20 -right-14 size-64 rounded-full bg-white/10" aria-hidden="true" />
          <div className="relative">
            <p className="text-sm font-semibold tracking-wider text-white/80 uppercase">Nível {level.number}</p>
            <h2 className="mt-2 text-[34px] leading-tight font-bold text-white">{level.name}</h2>
            <p className="mt-4 text-[48px] leading-none font-semibold">
              {user.xp}
              <span className="ml-2 text-lg font-medium text-white/85">XP</span>
            </p>
            <div className="mt-7 max-w-lg">
              <ProgressBar
                value={level.progress}
                label="Progresso para o próximo nível"
                from="#ffffff"
                to="#ffffff"
                track="rgb(255 255 255 / 0.25)"
              />
              <p className="mt-3 text-[15px] text-white/90">
                {level.nextName
                  ? `Faltam ${level.remaining} XP para chegar ao nível ${level.nextName}.`
                  : "Você chegou ao nível máximo."}
              </p>
            </div>
          </div>
        </section>

        <section className="card p-7">
          <h2 className="text-xl font-semibold">Como ganhar XP</h2>
          <ul className="mt-5 space-y-5">
            {XP_RULES.map((rule) => (
              <li key={rule.title} className="flex gap-3.5">
                <span className="bg-brand-50 text-brand-600 grid size-10 shrink-0 place-items-center rounded-xl">
                  <rule.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-navy-900 text-[15px] font-semibold">{rule.title}</p>
                  <p className="text-ink mt-0.5 text-sm leading-relaxed">{rule.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6">
        <div className="flex items-baseline justify-between gap-4 pb-5">
          <h2 className="text-xl font-semibold">Conquistas</h2>
          <p className="text-muted text-sm">
            {unlocked.size} de {ACHIEVEMENTS.length} desbloqueadas
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {ACHIEVEMENTS.map((achievement) => {
            const unlockedAt = unlocked.get(achievement.key);
            return (
              <li key={achievement.key} className={cn("card flex items-center gap-4 p-5", !unlockedAt && "bg-white/60")}>
                <span
                  className={cn(
                    "grid size-14 shrink-0 place-items-center rounded-2xl",
                    unlockedAt ? "bg-sun-50 text-sun-500" : "bg-surface text-muted",
                  )}
                >
                  {unlockedAt ? (
                    <AchievementIcon icon={achievement.icon} className="size-7" />
                  ) : (
                    <Lock className="size-6" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className={cn("text-[16px] font-semibold", unlockedAt ? "text-navy-900" : "text-ink")}>
                    {achievement.title}
                  </p>
                  <p className="text-ink mt-0.5 text-sm leading-snug">{achievement.description}</p>
                  <p className={cn("mt-1.5 text-xs font-medium", unlockedAt ? "text-mint-700" : "text-muted")}>
                    {unlockedAt ? `Desbloqueada em ${formatDate(unlockedAt)}` : "Bloqueada"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card mt-6 p-7">
        <h2 className="text-xl font-semibold">Níveis</h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LEVELS.map((item, index) => {
            const reached = user.xp >= item.min;
            const current = index + 1 === level.number;
            return (
              <li
                key={item.name}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-4",
                  current ? "border-brand-300 bg-brand-50" : "border-line",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-xl text-sm font-bold",
                    reached ? "bg-brand-500 text-white" : "bg-surface text-muted",
                  )}
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className={cn("text-[15px] font-semibold", reached ? "text-navy-900" : "text-ink")}>{item.name}</p>
                  <p className="text-muted text-xs">
                    <Zap className="mr-0.5 inline size-3" aria-hidden="true" />
                    {item.min === 0 ? "início" : `a partir de ${item.min} XP`}
                    {current ? " · você está aqui" : ""}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
