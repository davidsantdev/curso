import { Check, Flame, Lock, Play, Rocket, Zap } from "lucide-react";
import { TrackBadge } from "@/components/icons";
import { ProgressBar } from "@/components/ui/progress";

const LESSONS = [
  { title: "Vender sem estoque: o que é", minutes: 6, state: "done" },
  { title: "Do clique ao lucro", minutes: 7, state: "current" },
  { title: "Fornecedor do Brasil ou de fora?", minutes: 8, state: "next" },
  { title: "Criar sua loja virtual", minutes: 9, state: "locked" },
] as const;

/** Prévia ilustrativa da tela de trilha (decorativa — não usa dados reais). */
export function ProductMock() {
  return (
    <div className="relative mx-auto w-full max-w-[440px]" aria-hidden="true">
      <div className="bg-hero absolute -inset-5 rounded-[44px] opacity-20 blur-2xl" />

      <div className="card relative p-6 sm:p-7">
        <div className="flex items-center gap-4">
          <TrackBadge icon="package" color="violet" />
          <div className="min-w-0">
            <p className="text-navy-900 text-lg leading-tight font-semibold">Vender sem estoque</p>
            <p className="text-muted mt-0.5 text-sm">Trilha grátis · Módulo 1</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <span className="text-ink font-medium">Seu progresso</span>
            <span className="text-navy-900 font-semibold">25%</span>
          </div>
          <ProgressBar value={25} label="Exemplo de progresso" />
        </div>

        <ul className="mt-6 space-y-2">
          {LESSONS.map((lesson) => (
            <li
              key={lesson.title}
              className={
                lesson.state === "current"
                  ? "bg-brand-50 flex items-center gap-3 rounded-2xl p-3"
                  : "flex items-center gap-3 rounded-2xl p-3"
              }
            >
              <span
                className={
                  lesson.state === "done"
                    ? "bg-mint-500 grid size-8 shrink-0 place-items-center rounded-full text-white"
                    : lesson.state === "current"
                      ? "bg-brand-500 grid size-8 shrink-0 place-items-center rounded-full text-white"
                      : "bg-surface text-muted grid size-8 shrink-0 place-items-center rounded-full"
                }
              >
                {lesson.state === "done" ? (
                  <Check className="size-4" strokeWidth={3} />
                ) : lesson.state === "locked" ? (
                  <Lock className="size-3.5" />
                ) : (
                  <Play className="size-3.5 translate-x-px fill-current" />
                )}
              </span>
              <span
                className={
                  lesson.state === "locked"
                    ? "text-muted min-w-0 flex-1 truncate text-[15px]"
                    : "text-navy-900 min-w-0 flex-1 truncate text-[15px] font-medium"
                }
              >
                {lesson.title}
              </span>
              <span className="text-muted shrink-0 text-sm">{lesson.minutes} min</span>
            </li>
          ))}
        </ul>

        <div className="border-line mt-5 flex flex-wrap gap-2 border-t pt-5">
          <span className="badge bg-sun-50 text-sun-700">
            <Flame className="size-3.5" /> 3 dias seguidos
          </span>
          <span className="badge bg-brand-50 text-brand-700">
            <Zap className="size-3.5" /> +10 XP por aula
          </span>
        </div>
      </div>

      <div className="animate-float shadow-float border-line absolute -bottom-12 -left-3 flex items-center gap-3 rounded-2xl border bg-white py-3 pr-5 pl-3 sm:-left-10">
        <span className="bg-sun-50 text-sun-500 grid size-10 place-items-center rounded-xl">
          <Rocket className="size-5" />
        </span>
        <span>
          <span className="text-muted block text-xs font-medium">Conquista desbloqueada</span>
          <span className="text-navy-900 block text-sm font-semibold">Primeiro passo</span>
        </span>
      </div>
    </div>
  );
}
