import { ArrowDown, ArrowUp } from "lucide-react";
import { moveItemAction } from "@/actions/admin-content";

/** Setinhas para reordenar trilhas, módulos e aulas (funcionam sem JavaScript). */
export function MoveButtons({
  kind,
  id,
  isFirst,
  isLast,
}: {
  kind: "track" | "module" | "lesson";
  id: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <form action={moveItemAction} className="flex shrink-0 gap-0.5">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        name="direction"
        value="up"
        disabled={isFirst}
        className="text-muted hover:bg-surface hover:text-navy-900 grid size-8 place-items-center rounded-lg disabled:opacity-30"
        aria-label="Mover para cima"
        title="Mover para cima"
      >
        <ArrowUp className="size-4" aria-hidden="true" />
      </button>
      <button
        type="submit"
        name="direction"
        value="down"
        disabled={isLast}
        className="text-muted hover:bg-surface hover:text-navy-900 grid size-8 place-items-center rounded-lg disabled:opacity-30"
        aria-label="Mover para baixo"
        title="Mover para baixo"
      >
        <ArrowDown className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}
