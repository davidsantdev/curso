import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONES = {
  brand: "bg-brand-50 text-brand-600",
  magenta: "bg-magenta-50 text-magenta-600",
  mint: "bg-mint-50 text-mint-600",
  sun: "bg-sun-50 text-sun-500",
} as const;

/**
 * Número-chave: rótulo curto, valor grande e uma linha de contexto.
 * O valor fica sempre na cor do texto — a cor aparece só no ícone.
 */
export function StatTile({
  label,
  value,
  hint,
  icon,
  tone = "brand",
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <div className={cn("card p-5", className)}>
      <div className="flex items-center gap-3">
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", TONES[tone])}>{icon}</span>
        <p className="text-ink text-sm leading-tight font-medium">{label}</p>
      </div>
      <p className="text-navy-900 mt-4 text-[32px] leading-none font-semibold">{value}</p>
      {hint ? <p className="text-muted mt-2 text-sm leading-snug">{hint}</p> : null}
    </div>
  );
}
