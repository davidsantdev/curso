"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { toggleTaskAction } from "@/actions/learning";
import { toast } from "@/components/toaster";
import { cn } from "@/lib/utils";
import { announceAchievements } from "./celebrate";

export function TaskList({ tasks, initialDone }: { tasks: Array<{ id: string; text: string }>; initialDone: string[] }) {
  const [done, setDone] = useState(() => new Set(initialDone));
  const [, startTransition] = useTransition();

  function toggle(taskId: string) {
    const willBeDone = !done.has(taskId);
    const apply = (value: boolean) =>
      setDone((current) => {
        const next = new Set(current);
        if (value) next.add(taskId);
        else next.delete(taskId);
        return next;
      });

    apply(willBeDone);
    startTransition(async () => {
      const result = await toggleTaskAction(taskId, willBeDone);
      if (!result.ok) {
        apply(!willBeDone);
        toast({ tone: "error", title: result.message });
        return;
      }
      announceAchievements(result.newAchievements);
    });
  }

  const doneCount = tasks.filter((task) => done.has(task.id)).length;

  return (
    <div>
      <p className="text-muted text-sm" aria-live="polite">
        {doneCount} de {tasks.length} feitas
      </p>
      <ul className="mt-3 space-y-2">
        {tasks.map((task) => {
          const isDone = done.has(task.id);
          return (
            <li key={task.id}>
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
                  isDone ? "border-mint-100 bg-mint-50" : "border-line hover:border-brand-200 bg-white",
                )}
              >
                <input type="checkbox" checked={isDone} onChange={() => toggle(task.id)} className="peer sr-only" />
                <span
                  className={cn(
                    "peer-focus-visible:ring-brand-300 mt-0.5 grid size-5.5 shrink-0 place-items-center rounded-md border-2 transition-colors peer-focus-visible:ring-4",
                    isDone ? "border-mint-500 bg-mint-500 text-white" : "border-brand-200 bg-white",
                  )}
                  aria-hidden="true"
                >
                  {isDone ? <Check className="size-3.5" strokeWidth={3.5} /> : null}
                </span>
                <span className={cn("text-[15px] leading-relaxed", isDone ? "text-mint-700" : "text-navy-900")}>
                  {task.text}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
