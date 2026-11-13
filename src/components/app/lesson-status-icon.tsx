import { Check, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type LessonStatus = "done" | "current" | "available" | "locked";

/** Ícone de estado da aula. Sempre acompanhado de texto para leitores de tela. */
export function LessonStatusIcon({ status, className }: { status: LessonStatus; className?: string }) {
  const label = { done: "Concluída", current: "Aula atual", available: "Disponível", locked: "Bloqueada" }[status];

  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full",
        status === "done" && "bg-mint-500 text-white",
        status === "current" && "bg-brand-500 text-white",
        status === "available" && "bg-brand-50 text-brand-600",
        status === "locked" && "bg-surface text-muted",
        className,
      )}
    >
      {status === "done" ? (
        <Check className="size-4" strokeWidth={3} aria-hidden="true" />
      ) : status === "locked" ? (
        <Lock className="size-3.5" aria-hidden="true" />
      ) : (
        <Play className="size-3.5 translate-x-px fill-current" aria-hidden="true" />
      )}
      <span className="sr-only">{label}</span>
    </span>
  );
}
