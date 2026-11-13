import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, CircleCheck, ExternalLink, ListChecks, Pencil, Trash2, Video } from "lucide-react";
import { deleteModuleAction, deleteTrackAction } from "@/actions/admin-content";
import { CreateLessonForm, CreateModuleForm, ModuleForm, TrackForm } from "@/components/admin/content-forms";
import { MoveButtons } from "@/components/admin/move-buttons";
import { ConfirmSubmitButton } from "@/components/ui/form";
import { getAdminTrack } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth/dal";
import { plural } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const track = await getAdminTrack((await params).id);
  return { title: track ? `Trilha: ${track.title}` : "Trilha" };
}

export default async function AdminTrackPage({ params }: Props) {
  await requireAdmin();
  const track = await getAdminTrack((await params).id);
  if (!track) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <nav className="text-muted flex items-center gap-1.5 pb-4 text-sm" aria-label="Você está em">
        <Link href="/admin/conteudo" className="hover:text-brand-600">
          Conteúdo
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="text-ink">{track.title}</span>
      </nav>

      <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-[28px] leading-tight font-bold lg:text-[34px]">{track.title}</h1>
        {track.published ? (
          <Link href={`/trilhas/${track.slug}`} className="btn btn-outline btn-sm" target="_blank">
            Ver como aluno
            <ExternalLink className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      <section className="card p-6 sm:p-7">
        <h2 className="mb-5 text-lg font-semibold">Dados da trilha</h2>
        <TrackForm
          track={{
            id: track.id,
            title: track.title,
            slug: track.slug,
            description: track.description,
            level: track.level,
            icon: track.icon,
            color: track.color,
            published: track.published,
          }}
        />
      </section>

      <h2 className="mt-10 mb-4 text-xl font-semibold">Módulos e aulas</h2>

      <div className="space-y-6">
        {track.modules.map((mod, moduleIndex) => (
          <section key={mod.id} className="card overflow-hidden">
            <div className="border-line flex items-start gap-3 border-b p-5">
              <MoveButtons
                kind="module"
                id={mod.id}
                isFirst={moduleIndex === 0}
                isLast={moduleIndex === track.modules.length - 1}
              />
              <div className="min-w-0 flex-1">
                <p className="text-muted text-xs font-semibold tracking-wide uppercase">Módulo {moduleIndex + 1}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[17px] font-semibold">{mod.title}</h3>
                  {!mod.published ? <span className="badge bg-surface text-ink">Rascunho</span> : null}
                </div>
                {mod.description ? <p className="text-ink mt-0.5 text-sm">{mod.description}</p> : null}
              </div>
              <form action={deleteModuleAction}>
                <input type="hidden" name="id" value={mod.id} />
                <ConfirmSubmitButton
                  message={`Excluir o módulo "${mod.title}" e todas as suas aulas? O progresso dos alunos nessas aulas também será apagado.`}
                  className="text-muted hover:bg-danger-50 hover:text-danger-600 grid size-8 place-items-center rounded-lg"
                  aria-label={`Excluir módulo ${mod.title}`}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </ConfirmSubmitButton>
              </form>
            </div>

            <details className="border-line group border-b">
              <summary className="text-brand-600 hover:bg-surface flex cursor-pointer list-none items-center gap-2 px-5 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
                <Pencil className="size-4" aria-hidden="true" />
                Editar módulo
              </summary>
              <div className="px-5 pt-2 pb-5">
                <ModuleForm
                  module={{ id: mod.id, title: mod.title, description: mod.description, published: mod.published }}
                />
              </div>
            </details>

            {mod.lessons.length === 0 ? (
              <p className="text-muted px-5 py-4 text-sm">Nenhuma aula neste módulo.</p>
            ) : (
              <ul className="divide-line divide-y">
                {mod.lessons.map((lesson, lessonIndex) => (
                  <li key={lesson.id} className="flex items-center gap-3 px-5 py-3">
                    <MoveButtons
                      kind="lesson"
                      id={lesson.id}
                      isFirst={lessonIndex === 0}
                      isLast={lessonIndex === mod.lessons.length - 1}
                    />
                    <Link href={`/admin/conteudo/aula/${lesson.id}`} className="group min-w-0 flex-1">
                      <p className="text-navy-900 group-hover:text-brand-600 truncate text-[15px] font-medium">
                        <span className="text-muted mr-1.5 font-normal">
                          {moduleIndex + 1}.{lessonIndex + 1}
                        </span>
                        {lesson.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {lesson.published ? (
                          <span className="badge bg-mint-50 text-mint-700">Publicada</span>
                        ) : (
                          <span className="badge bg-surface text-ink">Rascunho</span>
                        )}
                        {lesson.isFree ? <span className="badge bg-brand-50 text-brand-700">Grátis</span> : null}
                        {lesson.videoUrl ? (
                          <span className="badge bg-surface text-ink">
                            <Video className="size-3" aria-hidden="true" /> Vídeo
                          </span>
                        ) : null}
                        {lesson.questions.length > 0 ? (
                          <span className="badge bg-surface text-ink">
                            <CircleCheck className="size-3" aria-hidden="true" />
                            {plural(lesson.questions.length, "pergunta", "perguntas")}
                          </span>
                        ) : null}
                        {lesson.tasks.length > 0 ? (
                          <span className="badge bg-surface text-ink">
                            <ListChecks className="size-3" aria-hidden="true" />
                            {plural(lesson.tasks.length, "tarefa", "tarefas")}
                          </span>
                        ) : null}
                        <span className="text-muted text-xs">{lesson.durationMinutes} min</span>
                      </div>
                    </Link>
                    <ChevronRight className="text-muted size-4 shrink-0" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            )}

            <div className="bg-surface/60 border-line border-t p-5">
              <CreateLessonForm moduleId={mod.id} />
            </div>
          </section>
        ))}
      </div>

      <section className="card mt-6 p-6">
        <h3 className="text-[16px] font-semibold">Novo módulo</h3>
        <div className="mt-3">
          <CreateModuleForm trackId={track.id} />
        </div>
      </section>

      <section className="border-danger-100 mt-10 rounded-3xl border bg-white p-6">
        <h3 className="text-danger-700 text-[16px] font-semibold">Excluir trilha</h3>
        <p className="text-ink mt-1 text-sm">
          Apaga a trilha com todos os módulos, aulas, progresso e certificados ligados a ela. Não dá para desfazer. Se
          quiser só esconder, desmarque “Trilha publicada”.
        </p>
        <form action={deleteTrackAction} className="mt-4">
          <input type="hidden" name="id" value={track.id} />
          <ConfirmSubmitButton
            message={`Excluir definitivamente a trilha "${track.title}"?`}
            className="btn btn-danger btn-sm"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Excluir trilha
          </ConfirmSubmitButton>
        </form>
      </section>
    </div>
  );
}
