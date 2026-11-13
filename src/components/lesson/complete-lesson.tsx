"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Award, CircleCheckBig, LoaderCircle, PartyPopper } from "lucide-react";
import { completeLessonAction } from "@/actions/learning";
import { toast } from "@/components/toaster";
import { announceAchievements } from "./celebrate";

export function CompleteLesson({
  lessonId,
  completed: initiallyCompleted,
  xpReward,
  nextLessonId,
  nextLessonLocked,
}: {
  lessonId: string;
  completed: boolean;
  xpReward: number;
  nextLessonId: string | null;
  nextLessonLocked: boolean;
}) {
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function complete() {
    startTransition(async () => {
      const response = await completeLessonAction(lessonId);
      if (!response.ok) {
        toast({ tone: "error", title: response.message });
        return;
      }

      const { result } = response;
      setCompleted(true);

      if (!result.alreadyCompleted) {
        toast({
          tone: "celebrate",
          title: `Aula concluída! +${result.xpGained} XP`,
          description:
            result.streak > 1 ? `Sequência de ${result.streak} dias seguidos. Continue assim!` : "Bom trabalho. Siga para a próxima.",
        });
        announceAchievements(result.newAchievements);
      }
      if (result.certificateId) {
        setCertificateId(result.certificateId);
        toast({ tone: "celebrate", title: "Trilha concluída!", description: "O seu certificado foi emitido." });
      }
    });
  }

  const nextHref = nextLessonId ? `/aula/${nextLessonId}` : null;

  if (completed) {
    return (
      <div className="bg-mint-50 flex flex-col gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-center gap-4">
          <span className="bg-mint-500 grid size-12 shrink-0 place-items-center rounded-2xl text-white">
            {certificateId ? (
              <PartyPopper className="size-6" aria-hidden="true" />
            ) : (
              <CircleCheckBig className="size-6" aria-hidden="true" />
            )}
          </span>
          <div>
            <p className="text-mint-700 text-lg leading-tight font-semibold">
              {certificateId ? "Você concluiu a trilha!" : "Aula concluída"}
            </p>
            <p className="text-ink mt-0.5 text-[15px]">
              {certificateId
                ? "Parabéns! O seu certificado já está disponível."
                : nextHref
                  ? "Quando estiver pronto, siga para a próxima aula."
                  : "Esta é a última aula da trilha."}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {certificateId ? (
            <Link href={`/certificado/${certificateId}`} className="btn btn-primary">
              <Award className="size-4" aria-hidden="true" />
              Ver certificado
            </Link>
          ) : null}
          {nextHref ? (
            <Link href={nextLessonLocked ? "/assinatura" : nextHref} className={certificateId ? "btn btn-outline" : "btn btn-primary"}>
              {nextLessonLocked ? "Desbloquear próxima aula" : "Próxima aula"}
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div>
        <p className="text-navy-900 text-lg leading-tight font-semibold">Terminou a aula?</p>
        <p className="text-ink mt-1 text-[15px]">Marque como concluída para ganhar {xpReward} XP e salvar o seu progresso.</p>
      </div>
      <button type="button" onClick={complete} disabled={pending} className="btn btn-pink btn-lg shrink-0">
        {pending ? (
          <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
        ) : (
          <CircleCheckBig className="size-5" aria-hidden="true" />
        )}
        Concluir aula
      </button>
    </div>
  );
}
