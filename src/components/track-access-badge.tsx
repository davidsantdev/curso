import { Crown, Gift } from "lucide-react";
import type { TrackAccess } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Selo "Grátis" / "Pro" de uma trilha ou aula. Sempre com ícone e texto (nunca só cor). */
export function AccessBadge({ access, className }: { access: TrackAccess; className?: string }) {
  if (access === "free") {
    return (
      <span className={cn("badge bg-mint-50 text-mint-700", className)}>
        <Gift className="size-3.5" aria-hidden="true" />
        Grátis
      </span>
    );
  }
  if (access === "partial") {
    return (
      <span className={cn("badge bg-mint-50 text-mint-700", className)}>
        <Gift className="size-3.5" aria-hidden="true" />
        Aulas grátis
      </span>
    );
  }
  return (
    <span className={cn("badge bg-magenta-50 text-magenta-700", className)}>
      <Crown className="size-3.5" aria-hidden="true" />
      Pro
    </span>
  );
}
