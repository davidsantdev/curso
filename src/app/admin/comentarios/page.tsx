import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MessageSquareText, Trash2 } from "lucide-react";
import { deleteCommentAction } from "@/actions/learning";
import { PageHeader } from "@/components/app/page-header";
import { Avatar } from "@/components/ui/avatar";
import { ConfirmSubmitButton } from "@/components/ui/form";
import { listAdminComments } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth/dal";
import { formatDate, plural } from "@/lib/format";

export const metadata: Metadata = { title: "Comentários" };

export default async function AdminCommentsPage({ searchParams }: { searchParams: Promise<{ pagina?: string }> }) {
  await requireAdmin();
  const page = Math.max(1, Number.parseInt((await searchParams).pagina ?? "1", 10) || 1);
  const { rows, total, pages } = await listAdminComments(page);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Comentários"
        description="As dúvidas e os comentários mais recentes dos alunos. Abra a aula para responder — as respostas da equipe aparecem com o selo “Equipe”."
      />

      {rows.length === 0 ? (
        <div className="card p-10 text-center">
          <span className="bg-brand-50 text-brand-600 mx-auto grid size-12 place-items-center rounded-2xl">
            <MessageSquareText className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-xl font-semibold">Nenhum comentário ainda</h2>
          <p className="text-ink mt-1.5 text-[15px]">Quando os alunos comentarem nas aulas, tudo aparece aqui.</p>
        </div>
      ) : (
        <ul className="card divide-line divide-y">
          {rows.map((comment) => (
            <li key={comment.id} className="flex gap-3.5 p-5 sm:p-6">
              <Avatar name={comment.userName} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <Link
                    href={`/admin/usuarios/${comment.userId}`}
                    className="text-navy-900 hover:text-brand-600 text-[15px] font-semibold"
                  >
                    {comment.userName}
                  </Link>
                  {comment.userRole === "ADMIN" ? <span className="badge bg-brand-50 text-brand-700">Equipe</span> : null}
                  <p className="text-muted text-sm">{formatDate(comment.createdAt)}</p>
                </div>
                <p className="text-ink mt-1.5 text-[15px] leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                <p className="mt-2.5 text-sm">
                  <Link href={`/aula/${comment.lessonId}#comentarios`} className="text-brand-600 hover:text-brand-700 font-medium">
                    {comment.lessonTitle}
                  </Link>
                  <span className="text-muted"> · {comment.trackTitle}</span>
                </p>
              </div>
              <form action={deleteCommentAction} className="shrink-0">
                <input type="hidden" name="commentId" value={comment.id} />
                <ConfirmSubmitButton
                  message="Apagar este comentário? Não dá para desfazer."
                  className="text-muted hover:bg-danger-50 hover:text-danger-600 grid size-9 place-items-center rounded-lg"
                  aria-label={`Apagar o comentário de ${comment.userName}`}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </ConfirmSubmitButton>
              </form>
            </li>
          ))}
        </ul>
      )}

      <div className="text-ink mt-5 flex items-center justify-between text-sm">
        <p>{plural(total, "comentário", "comentários")}</p>
        {pages > 1 ? (
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link href={page - 1 > 1 ? `/admin/comentarios?pagina=${page - 1}` : "/admin/comentarios"} className="btn btn-outline btn-sm">
                <ChevronLeft className="size-4" aria-hidden="true" />
                Anterior
              </Link>
            ) : null}
            <span className="px-1 tabular-nums">
              Página {page} de {pages}
            </span>
            {page < pages ? (
              <Link href={`/admin/comentarios?pagina=${page + 1}`} className="btn btn-outline btn-sm">
                Próxima
                <ChevronRight className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
