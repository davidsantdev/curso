"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, LoaderCircle, Plus, Trash2, X } from "lucide-react";
import { saveQuizAction, type QuizDraft } from "@/actions/admin-content";
import { toast } from "@/components/toaster";
import { cn } from "@/lib/utils";

type DraftOption = { key: string; text: string; isCorrect: boolean };
type DraftQuestion = { key: string; text: string; explanation: string; options: DraftOption[] };

let keySeed = 0;
const newKey = () => `k${++keySeed}`;

const emptyQuestion = (): DraftQuestion => ({
  key: newKey(),
  text: "",
  explanation: "",
  options: [
    { key: newKey(), text: "", isCorrect: true },
    { key: newKey(), text: "", isCorrect: false },
    { key: newKey(), text: "", isCorrect: false },
  ],
});

export function QuizEditor({
  lessonId,
  initial,
}: {
  lessonId: string;
  initial: Array<{ text: string; explanation: string; options: Array<{ text: string; isCorrect: boolean }> }>;
}) {
  const [questions, setQuestions] = useState<DraftQuestion[]>(() =>
    initial.map((question) => ({
      key: newKey(),
      text: question.text,
      explanation: question.explanation,
      options: question.options.map((option) => ({ key: newKey(), ...option })),
    })),
  );
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();

  function update(next: (current: DraftQuestion[]) => DraftQuestion[]) {
    setQuestions(next);
    setDirty(true);
  }

  function patchQuestion(key: string, patch: Partial<DraftQuestion>) {
    update((current) => current.map((question) => (question.key === key ? { ...question, ...patch } : question)));
  }

  function move(index: number, step: -1 | 1) {
    update((current) => {
      const target = index + step;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function save() {
    const draft: QuizDraft = questions.map((question) => ({
      text: question.text,
      explanation: question.explanation,
      options: question.options.map((option) => ({ text: option.text, isCorrect: option.isCorrect })),
    }));

    startTransition(async () => {
      const result = await saveQuizAction(lessonId, draft);
      toast({ tone: result.ok ? "success" : "error", title: result.message });
      if (result.ok) setDirty(false);
    });
  }

  return (
    <div>
      {questions.length === 0 ? (
        <p className="text-ink bg-surface rounded-2xl px-5 py-6 text-center text-[15px]">
          Esta aula ainda não tem quiz. Adicione perguntas para o aluno fixar o conteúdo.
        </p>
      ) : (
        <ol className="space-y-5">
          {questions.map((question, index) => (
            <li key={question.key} className="border-line rounded-2xl border p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-brand-600 text-sm font-semibold">Pergunta {index + 1}</p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="text-muted hover:bg-surface hover:text-navy-900 grid size-8 place-items-center rounded-lg disabled:opacity-30"
                    aria-label="Mover para cima"
                  >
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === questions.length - 1}
                    className="text-muted hover:bg-surface hover:text-navy-900 grid size-8 place-items-center rounded-lg disabled:opacity-30"
                    aria-label="Mover para baixo"
                  >
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => update((current) => current.filter((item) => item.key !== question.key))}
                    className="text-muted hover:bg-danger-50 hover:text-danger-600 grid size-8 place-items-center rounded-lg"
                    aria-label="Remover pergunta"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <label className="sr-only" htmlFor={`q-text-${question.key}`}>
                Enunciado da pergunta {index + 1}
              </label>
              <input
                id={`q-text-${question.key}`}
                value={question.text}
                onChange={(event) => patchQuestion(question.key, { text: event.target.value })}
                placeholder="Enunciado da pergunta"
                maxLength={500}
                className="input mt-3"
              />

              <fieldset className="mt-4">
                <legend className="text-muted mb-2 text-xs font-semibold tracking-wide uppercase">
                  Alternativas — marque a correta
                </legend>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={option.key} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${question.key}`}
                        checked={option.isCorrect}
                        onChange={() =>
                          patchQuestion(question.key, {
                            options: question.options.map((item) => ({ ...item, isCorrect: item.key === option.key })),
                          })
                        }
                        className="accent-mint-500 size-4.5 shrink-0"
                        aria-label={`Alternativa ${optionIndex + 1} é a correta`}
                      />
                      <input
                        value={option.text}
                        onChange={(event) =>
                          patchQuestion(question.key, {
                            options: question.options.map((item) =>
                              item.key === option.key ? { ...item, text: event.target.value } : item,
                            ),
                          })
                        }
                        placeholder={`Alternativa ${optionIndex + 1}`}
                        maxLength={300}
                        aria-label={`Texto da alternativa ${optionIndex + 1}`}
                        className={cn("input py-2.5", option.isCorrect && "border-mint-500")}
                      />
                      <button
                        type="button"
                        disabled={question.options.length <= 2}
                        onClick={() => {
                          const remaining = question.options.filter((item) => item.key !== option.key);
                          if (option.isCorrect) remaining[0] = { ...remaining[0], isCorrect: true };
                          patchQuestion(question.key, { options: remaining });
                        }}
                        className="text-muted hover:text-danger-600 grid size-8 shrink-0 place-items-center rounded-lg disabled:opacity-30"
                        aria-label={`Remover alternativa ${optionIndex + 1}`}
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
                {question.options.length < 6 ? (
                  <button
                    type="button"
                    onClick={() =>
                      patchQuestion(question.key, {
                        options: [...question.options, { key: newKey(), text: "", isCorrect: false }],
                      })
                    }
                    className="text-brand-600 hover:text-brand-700 mt-2 inline-flex items-center gap-1 text-sm font-medium"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    Alternativa
                  </button>
                ) : null}
              </fieldset>

              <label className="label mt-4" htmlFor={`q-explanation-${question.key}`}>
                Explicação (mostrada depois da resposta)
              </label>
              <textarea
                id={`q-explanation-${question.key}`}
                value={question.explanation}
                onChange={(event) => patchQuestion(question.key, { explanation: event.target.value })}
                rows={2}
                maxLength={1000}
                className="input"
              />
            </li>
          ))}
        </ol>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => update((current) => [...current, emptyQuestion()])} className="btn btn-outline btn-sm">
          <Plus className="size-4" aria-hidden="true" />
          Adicionar pergunta
        </button>
        <button type="button" onClick={save} disabled={pending || !dirty} className="btn btn-primary btn-sm">
          {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
          Salvar quiz
        </button>
        {dirty ? <span className="text-sun-700 text-sm font-medium">Alterações não salvas</span> : null}
      </div>
    </div>
  );
}
