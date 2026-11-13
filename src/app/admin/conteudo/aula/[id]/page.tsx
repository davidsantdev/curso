import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ExternalLink, Trash2 } from "lucide-react";
import { deleteLessonAction } from "@/actions/admin-content";
import { LessonForm } from "@/components/admin/content-forms";
import { QuizEditor } from "@/components/admin/quiz-editor";
import { ConfirmSubmitButton } from "@/components/ui/form";
import { getAdminLesson } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth/dal";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lesson = await getAdminLesson((await params).id);
  return { title: lesson ? `Aula: ${lesson.title}` : "Aula" };
}

export default async function AdminLessonPage({ params }: Props) {
  await requireAdmin();
  const lesson = await getAdminLesson((await params).id);
  if (!lesson) notFound();

  const track = lesson.module.track;
  const visibleToStudents = lesson.published && lesson.module.published && track.published;

  return (
    <div className="mx-auto max-w-7xl">
      <nav className="text-muted flex flex-wrap items-center gap-1.5 pb-4 text-sm" aria-label="Você está em">
        <Link href="/admin/conteudo" className="hover:text-brand-600">
          Conteúdo
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <Link href={`/admin/conteudo/trilha/${track.id}`} className="hover:text-brand-600">
          {track.title}
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="text-ink">{lesson.module.title}</span>
      </nav>

      <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] leading-tight font-bold lg:text-[34px]">{lesson.title}</h1>
          <p className="text-ink mt-2 text-[15px]">
            {visibleToStudents
              ? "Publicada e visível para os alunos."
              : lesson.published
                ? "Publicada, mas o módulo ou a trilha ainda é rascunho — os alunos não veem."
                : "Rascunho — só aparece para os alunos depois de publicada."}
          </p>
        </div>
        {visibleToStudents ? (
          <Link href={`/aula/${lesson.id}`} className="btn btn-outline btn-sm" target="_blank">
            Ver como aluno
            <ExternalLink className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      <LessonForm
        lesson={{
          id: lesson.id,
          title: lesson.title,
          summary: lesson.summary,
          videoUrl: lesson.videoUrl,
          durationMinutes: lesson.durationMinutes,
          xpReward: lesson.xpReward,
          content: lesson.content,
          objectives: lesson.objectives,
          isFree: lesson.isFree,
          published: lesson.published,
          tasks: lesson.tasks.map((task) => task.text),
          resources: lesson.resources.map((resource) => ({ title: resource.title, url: resource.url })),
        }}
      />

      <section className="card mt-6 p-6 sm:p-7">
        <h2 className="text-lg font-semibold">Quiz de fixação</h2>
        <p className="text-ink mt-1 mb-5 text-sm">
          Opcional. O aluno vê as respostas certas e as explicações só depois de responder.
        </p>
        <QuizEditor
          lessonId={lesson.id}
          initial={lesson.questions.map((question) => ({
            text: question.text,
            explanation: question.explanation,
            options: question.options.map((option) => ({ text: option.text, isCorrect: option.isCorrect })),
          }))}
        />
      </section>

      <section className="border-danger-100 mt-10 rounded-3xl border bg-white p-6">
        <h2 className="text-danger-700 text-[16px] font-semibold">Excluir aula</h2>
        <p className="text-ink mt-1 text-sm">Apaga a aula, o quiz, as tarefas e o progresso dos alunos nela.</p>
        <form action={deleteLessonAction} className="mt-4">
          <input type="hidden" name="id" value={lesson.id} />
          <ConfirmSubmitButton message={`Excluir definitivamente a aula "${lesson.title}"?`} className="btn btn-danger btn-sm">
            <Trash2 className="size-4" aria-hidden="true" />
            Excluir aula
          </ConfirmSubmitButton>
        </form>
      </section>
    </div>
  );
}
