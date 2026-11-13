"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Texto da aula com "Continuar lendo": o começo aparece aberto e o restante abre com um clique.
 * Enquanto fechado, o restante fica `hidden` — fora da leitura de tela e do Tab, como deve ser.
 * Ao abrir, o foco vai para o começo do restante, para a leitura continuar de onde parou.
 */
export function LessonReader({
  preview,
  rest,
  moreLabel,
}: {
  preview: ReactNode;
  rest: ReactNode | null;
  moreLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const restId = useId();
  const restRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) restRef.current?.focus();
  }, [open]);

  return (
    <div>
      <div className="relative">
        {preview}
        {rest && !open ? (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
            style={{ backgroundImage: "linear-gradient(to top, #ffffff, rgb(255 255 255 / 0))" }}
            aria-hidden="true"
          />
        ) : null}
      </div>

      {rest ? (
        <>
          <div id={restId} ref={restRef} hidden={!open} tabIndex={-1} className="mt-11 outline-none">
            {rest}
          </div>
          {!open ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="btn btn-outline"
                aria-expanded="false"
                aria-controls={restId}
                onClick={() => setOpen(true)}
              >
                {moreLabel}
                <ChevronDown className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
