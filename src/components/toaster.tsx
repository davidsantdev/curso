"use client";

import { useEffect, useState } from "react";
import { CircleAlert, CircleCheck, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "celebrate";
type ToastInput = { title: string; description?: string; tone?: ToastTone };
type ToastItem = ToastInput & { id: number };

const EVENT = "vendra:toast";
const DURATION_MS = 5500;

/** Mostra um aviso flutuante. Pode ser chamado de qualquer componente do navegador. */
export function toast(input: ToastInput) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ToastInput>(EVENT, { detail: input }));
}

const TONE: Record<ToastTone, { icon: typeof CircleCheck; box: string }> = {
  success: { icon: CircleCheck, box: "bg-mint-50 text-mint-600" },
  error: { icon: CircleAlert, box: "bg-danger-50 text-danger-600" },
  celebrate: { icon: Sparkles, box: "bg-sun-50 text-sun-500" },
};

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    let nextId = 1;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const onToast = (event: Event) => {
      const id = nextId++;
      const detail = (event as CustomEvent<ToastInput>).detail;
      setItems((current) => [...current.slice(-3), { ...detail, id }]);

      const timer = setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== id));
        timers.delete(timer);
      }, DURATION_MS);
      timers.add(timer);
    };

    window.addEventListener(EVENT, onToast);
    return () => {
      window.removeEventListener(EVENT, onToast);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className="no-print pointer-events-none fixed inset-x-4 bottom-24 z-[60] flex flex-col items-end gap-3 lg:bottom-6"
    >
      {items.map((item) => {
        const tone = TONE[item.tone ?? "success"];
        const Icon = tone.icon;
        return (
          <div
            key={item.id}
            role="status"
            className="animate-pop shadow-float border-line pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-white p-4"
          >
            <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", tone.box)}>
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-navy-900 text-[15px] leading-snug font-semibold">{item.title}</p>
              {item.description ? <p className="text-ink mt-0.5 text-sm leading-snug">{item.description}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => setItems((current) => current.filter((other) => other.id !== item.id))}
              className="text-muted hover:text-navy-900 -m-1 rounded-lg p-1"
              aria-label="Fechar aviso"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
