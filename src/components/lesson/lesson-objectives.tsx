import { Check, Target } from "lucide-react";
import { keepShortWordsTogether } from "@/lib/utils";

/** "Nesta aula você vai aprender" — mostrado para todos, inclusive em aulas bloqueadas. */
export function LessonObjectives({ objectives }: { objectives: string[] }) {
  if (objectives.length === 0) return null;

  return (
    <section className="card p-6 sm:p-8">
      <h2 className="flex items-center gap-3 text-xl font-semibold">
        <span className="bg-brand-50 text-brand-600 grid size-9 place-items-center rounded-xl">
          <Target className="size-5" aria-hidden="true" />
        </span>
        Nesta aula você vai aprender
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {objectives.map((objective) => (
          <li key={objective} className="text-navy-900 flex items-start gap-3 text-[15px] leading-snug">
            <span className="bg-mint-50 text-mint-600 mt-0.5 grid size-5.5 shrink-0 place-items-center rounded-full">
              <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
            </span>
            {keepShortWordsTogether(objective)}
          </li>
        ))}
      </ul>
    </section>
  );
}
