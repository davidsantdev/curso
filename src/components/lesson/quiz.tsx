"use client";

import { useState, useTransition } from "react";
import { Check, LoaderCircle, RotateCcw, Trophy, X } from "lucide-react";
import { submitQuizAction } from "@/actions/learning";
import { toast } from "@/components/toaster";
import { QUIZ_PASS_PERCENT } from "@/lib/gamification";
import type { QuizResult } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { announceAchievements } from "./celebrate";

export type QuizQuestionView = { id: string; text: string; options: Array<{ id: string; text: string }> };

export function Quiz({
  lessonId,
  questions,
  best,
}: {
  lessonId: string;
  questions: QuizQuestionView[];
  best: { score: number; total: number; passed: boolean } | null;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [pending, startTransition] = useTransition();

  const answeredAll = questions.every((question) => answers[question.id]);
  const resultByQuestion = new Map(result?.answers.map((answer) => [answer.questionId, answer]));

  function submit() {
    startTransition(async () => {
      const response = await submitQuizAction(lessonId, answers);
      if (!response.ok) {
        toast({ tone: "error", title: response.message });
        return;
      }
      setResult(response.result);
      const { passed, xpGained, score, total } = response.result;
      toast({
        tone: passed ? "celebrate" : "error",
        title: passed ? `Você acertou ${score} de ${total}!` : `Você acertou ${score} de ${total}`,
        description: passed
          ? xpGained > 0
            ? `Quiz aprovado: +${xpGained} XP.`
            : "Quiz aprovado."
          : `Revise as explicações e tente de novo. Para passar, acerte ${QUIZ_PASS_PERCENT}%.`,
      });
      announceAchievements(response.result.newAchievements);
    });
  }

  function retry() {
    setAnswers({});
    setResult(null);
  }

  return (
    <div>
      {best && !result ? (
        <p className="bg-surface text-ink mb-5 inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm">
          <Trophy className="text-sun-500 size-4" aria-hidden="true" />
          Seu melhor resultado: {best.score} de {best.total}
          {best.passed ? " · aprovado" : ""}
        </p>
      ) : null}

      <ol className="space-y-6">
        {questions.map((question, index) => {
          const answer = resultByQuestion.get(question.id);
          return (
            <li key={question.id}>
              <fieldset>
                <legend className="text-navy-900 text-[16px] leading-snug font-semibold">
                  <span className="text-brand-600 mr-1.5">{index + 1}.</span>
                  {question.text}
                </legend>
                <div className="mt-3 grid gap-2">
                  {question.options.map((option) => {
                    const chosen = answers[question.id] === option.id;
                    const isCorrect = answer?.correctOptionId === option.id;
                    const isWrongChoice = Boolean(answer) && chosen && !isCorrect;

                    return (
                      <label
                        key={option.id}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border p-3.5 text-[15px] transition-colors",
                          result ? "cursor-default" : "hover:border-brand-300 cursor-pointer",
                          answer && isCorrect && "border-mint-500 bg-mint-50 text-mint-700",
                          isWrongChoice && "border-danger-500 bg-danger-50 text-danger-700",
                          !answer && chosen && "border-brand-400 bg-brand-50 text-navy-900",
                          !answer && !chosen && "border-line text-navy-900 bg-white",
                          answer && !isCorrect && !isWrongChoice && "border-line text-ink bg-white",
                        )}
                      >
                        <input
                          type="radio"
                          name={`q-${question.id}`}
                          value={option.id}
                          checked={chosen}
                          disabled={Boolean(result) || pending}
                          onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                          className="accent-brand-500 size-4 shrink-0"
                        />
                        <span className="flex-1">{option.text}</span>
                        {answer && isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-sm font-semibold">
                            <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                            Correta
                          </span>
                        ) : null}
                        {isWrongChoice ? (
                          <span className="inline-flex items-center gap-1 text-sm font-semibold">
                            <X className="size-4" strokeWidth={3} aria-hidden="true" />
                            Sua resposta
                          </span>
                        ) : null}
                      </label>
                    );
                  })}
                </div>
                {answer?.explanation ? (
                  <p className="text-ink bg-surface mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed">
                    <strong className="text-navy-900 font-semibold">Por quê: </strong>
                    {answer.explanation}
                  </p>
                ) : null}
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        {result ? (
          <>
            <p className={cn("text-[16px] font-semibold", result.passed ? "text-mint-700" : "text-danger-700")}>
              {result.passed ? "Aprovado!" : "Ainda não foi dessa vez."} {result.score} de {result.total} ({result.percent}%)
            </p>
            <button type="button" onClick={retry} className="btn btn-outline btn-sm">
              <RotateCcw className="size-4" aria-hidden="true" />
              Refazer quiz
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={submit} disabled={!answeredAll || pending} className="btn btn-primary">
              {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
              Ver resultado
            </button>
            {!answeredAll ? <p className="text-muted text-sm">Responda todas as perguntas para ver o resultado.</p> : null}
          </>
        )}
      </div>
    </div>
  );
}
