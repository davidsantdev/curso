import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  ExternalLink,
  FileText,
  ListChecks,
  MessageCircle,
  NotebookPen,
  Zap,
} from "lucide-react";
import { LessonComments, type CommentView } from "@/components/lesson/comments";
import { CompleteLesson } from "@/components/lesson/complete-lesson";
import { LessonObjectives } from "@/components/lesson/lesson-objectives";
import { LessonOutline } from "@/components/lesson/lesson-outline";
import { LessonPdfCard } from "@/components/lesson/lesson-pdf-card";
import { LessonVideo } from "@/components/lesson/lesson-video";
import { LockedPreview } from "@/components/lesson/locked-preview";
import { LessonNotes } from "@/components/lesson/notes";
import { Quiz, type QuizQuestionView } from "@/components/lesson/quiz";
import { TaskList } from "@/components/lesson/task-list";
import { Markdown } from "@/components/markdown";
import { requireUser } from "@/lib/auth/dal";
import {
  canAccessLesson,
  getCatalog,
  getCompletedLessonIds,
  getLessonDetail,
  getLessonUserState,
  listComments,
  locateLesson,
} from "@/lib/content";
import { formatDate, plural } from "@/lib/format";
import { lessonPdf } from "@/lib/lesson-pdf";
import { toVideoEmbed } from "@/lib/video";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const context = locateLesson(await getCatalog(), id);
  return { title: context?.lesson.title ?? "Aula" };
}

function Section({
  icon,
  title,
  aside,
  children,
}: {
  icon: ReactNode;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="card p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 text-xl font-semibold">
          <span className="bg-brand-50 text-brand-600 grid size-9 place-items-center rounded-xl">{icon}</span>
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export default async function LessonPage({ params }: Props) {
  const { id } = await params;
  const user = await requireUser();
  const [catalog, completed] = await Promise.all([getCatalog(), getCompletedLessonIds(user.id)]);

  const context = locateLesson(catalog, id);
  if (!context) notFound();

  const { track, module: mod, lesson, position, total, previous, next } = context;
  const accessible = canAccessLesson(user, lesson);
  const isCompleted = completed.has(lesson.id);

  const header = (
    <div>
      <nav className="text-muted flex flex-wrap items-center gap-1.5 text-sm" aria-label="Você está em">
        <Link href="/trilhas" className="hover:text-brand-600">
          Trilhas
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <Link href={`/trilhas/${track.slug}`} className="hover:text-brand-600">
          {track.title}
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="text-ink">{mod.title}</span>
      </nav>
      <h1 className="mt-3 text-[28px] leading-tight font-bold text-balance sm:text-[34px]">{lesson.title}</h1>
      <ul className="text-ink mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px]">
        <li>
          Aula {position} de {total}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Clock className="text-muted size-4" aria-hidden="true" />
          {lesson.durationMinutes} min
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Zap className="text-muted size-4" aria-hidden="true" />+{lesson.xpReward} XP
        </li>
        {isCompleted ? (
          <li className="badge bg-mint-50 text-mint-700">
            <CircleCheck className="size-3.5" aria-hidden="true" />
            Concluída
          </li>
        ) : null}
      </ul>
    </div>
  );

  const pager = (
    <div className="flex items-center justify-between gap-3">
      {previous ? (
        <Link href={`/aula/${previous.id}`} className="btn btn-outline btn-sm max-w-[48%]">
          <ChevronLeft className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Anterior</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/aula/${next.id}`} className="btn btn-outline btn-sm max-w-[48%]">
          <span className="truncate">Próxima</span>
          <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );

  const outline = <LessonOutline track={track} currentLessonId={lesson.id} completed={completed} user={user} />;

  const detail = await getLessonDetail(lesson.id);
  if (!detail) notFound();

  const pdf = lessonPdf(track.slug, lesson.title);
  const hasVideo = Boolean(toVideoEmbed(detail.videoUrl));

  /* ------------------------- Aula bloqueada ------------------------- */
  // Mostra o que a aula ensina (para dar vontade de assinar), mas nunca o conteúdo em si.
  if (!accessible) {
    return (
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          {header}
          {lesson.summary ? <p className="text-ink -mt-2 text-[17px] leading-relaxed">{lesson.summary}</p> : null}
          <LessonObjectives objectives={lesson.objectives} />
          {detail.tasks.length > 0 ? (
            <Section icon={<ListChecks className="size-5" aria-hidden="true" />} title="Na prática, você vai">
              <ul className="space-y-2">
                {detail.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="border-line text-navy-900 flex items-start gap-3 rounded-2xl border bg-white p-4 text-[15px]"
                  >
                    <span className="border-brand-200 mt-0.5 size-5 shrink-0 rounded-md border-2" aria-hidden="true" />
                    {task.text}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
          <LockedPreview
            color={track.color}
            trackSlug={track.slug}
            minutes={lesson.durationMinutes}
            hasVideo={Boolean(detail.videoUrl)}
            hasPdf={Boolean(pdf)}
            taskCount={detail.tasks.length}
            questionCount={detail.questions.length}
            resourceCount={detail.resources.length}
          />
          {pager}
        </div>
        <aside className="xl:sticky xl:top-24 xl:self-start">{outline}</aside>
      </div>
    );
  }

  /* --------------------------- Aula liberada ------------------------- */

  const [state, comments] = await Promise.all([
    getLessonUserState(
      user.id,
      lesson.id,
      detail.tasks.map((task) => task.id),
    ),
    listComments(lesson.id),
  ]);

  // As respostas certas e as explicações NUNCA vão para o navegador antes do envio.
  const questions: QuizQuestionView[] = detail.questions
    .filter((question) => question.options.length >= 2)
    .map((question) => ({
      id: question.id,
      text: question.text,
      options: question.options.map((option) => ({ id: option.id, text: option.text })),
    }));

  const commentViews: CommentView[] = comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    createdAt: formatDate(comment.createdAt),
    userName: comment.userName,
    isStaff: comment.userRole === "ADMIN",
    canDelete: comment.userId === user.id || user.isAdmin,
  }));

  return (
    <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 space-y-6">
        <LessonVideo
          url={detail.videoUrl}
          title={lesson.title}
          summary={lesson.summary}
          moduleLabel={mod.title}
          color={track.color}
        />
        {header}

        <LessonObjectives objectives={lesson.objectives} />

        {pdf ? <LessonPdfCard href={`/aula/${lesson.id}/pdf`} /> : null}

        {/* Com vídeo, o texto da aula (o roteiro do vídeo) não aparece: o aluno assiste e baixa os slides.
            Sem vídeo, o texto continua sendo o conteúdo da aula. */}
        {!hasVideo && detail.content.trim() ? (
          <section className="card p-6 sm:p-9">
            <Markdown>{detail.content}</Markdown>
          </section>
        ) : null}

        {detail.tasks.length > 0 ? (
          <Section icon={<ListChecks className="size-5" aria-hidden="true" />} title="Tarefas práticas">
            <TaskList
              tasks={detail.tasks.map((task) => ({ id: task.id, text: task.text }))}
              initialDone={state.doneTaskIds}
            />
          </Section>
        ) : null}

        {detail.resources.length > 0 ? (
          <Section icon={<FileText className="size-5" aria-hidden="true" />} title="Materiais da aula">
            <ul className="grid gap-2 sm:grid-cols-2">
              {detail.resources.map((resource) => (
                <li key={resource.id}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-line hover:border-brand-300 text-navy-900 flex items-center gap-3 rounded-2xl border bg-white p-4 text-[15px] font-medium transition-colors"
                  >
                    <FileText className="text-brand-500 size-5 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{resource.title}</span>
                    <ExternalLink className="text-muted size-4 shrink-0" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {questions.length > 0 ? (
          <Section
            icon={<CircleCheck className="size-5" aria-hidden="true" />}
            title="Quiz de fixação"
            aside={<span className="text-muted text-sm">{plural(questions.length, "pergunta", "perguntas")}</span>}
          >
            <Quiz lessonId={lesson.id} questions={questions} best={state.bestQuiz} />
          </Section>
        ) : null}

        <CompleteLesson
          key={lesson.id}
          lessonId={lesson.id}
          completed={isCompleted}
          xpReward={lesson.xpReward}
          nextLessonId={next?.id ?? null}
          nextLessonLocked={Boolean(next && !canAccessLesson(user, next))}
        />
        {pager}

        <Section icon={<NotebookPen className="size-5" aria-hidden="true" />} title="Minhas anotações">
          <LessonNotes key={lesson.id} lessonId={lesson.id} initialContent={state.note} />
        </Section>

        <div id="comentarios" className="scroll-mt-24">
          <Section
            icon={<MessageCircle className="size-5" aria-hidden="true" />}
            title="Comentários"
            aside={<span className="text-muted text-sm">{commentViews.length}</span>}
          >
            <LessonComments lessonId={lesson.id} comments={commentViews} />
          </Section>
        </div>
      </div>

      <aside className="xl:sticky xl:top-24 xl:self-start">{outline}</aside>
    </div>
  );
}
