"use client";

import { useEffect, useRef, useState } from "react";
import { saveNoteAction } from "@/actions/learning";

type SaveState = "idle" | "typing" | "saving" | "saved" | "error";

const LABEL: Record<SaveState, string> = {
  idle: "Suas anotações são salvas automaticamente.",
  typing: "Digitando…",
  saving: "Salvando…",
  saved: "Salvo",
  error: "Não foi possível salvar. Tente de novo.",
};

export function LessonNotes({ lessonId, initialContent }: { lessonId: string; initialContent: string }) {
  const [content, setContent] = useState(initialContent);
  const [state, setState] = useState<SaveState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSaved = useRef(initialContent);

  async function save(text: string) {
    if (text === lastSaved.current) {
      setState("saved");
      return;
    }
    setState("saving");
    const result = await saveNoteAction(lessonId, text).catch(() => null);
    if (result?.ok) {
      lastSaved.current = text;
      setState("saved");
    } else {
      setState("error");
    }
  }

  function onChange(text: string) {
    setContent(text);
    setState("typing");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void save(text), 900);
  }

  // Salva o que estiver pendente ao sair da página.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div>
      <label htmlFor="lesson-notes" className="sr-only">
        Anotações da aula
      </label>
      <textarea
        id="lesson-notes"
        value={content}
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => {
          if (timer.current) clearTimeout(timer.current);
          void save(content);
        }}
        rows={5}
        maxLength={5000}
        placeholder="Ideias, links, produtos para testar… só você vê."
        className="input resize-y"
      />
      <p className={state === "error" ? "text-danger-600 mt-2 text-sm" : "text-muted mt-2 text-sm"} aria-live="polite">
        {LABEL[state]}
      </p>
    </div>
  );
}
