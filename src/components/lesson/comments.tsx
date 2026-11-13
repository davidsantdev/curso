"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { addCommentAction, deleteCommentAction } from "@/actions/learning";
import { Avatar } from "@/components/ui/avatar";
import { ConfirmSubmitButton, FormMessage, SubmitButton } from "@/components/ui/form";
import { EMPTY_FORM_STATE } from "@/lib/forms";

export type CommentView = {
  id: string;
  content: string;
  createdAt: string;
  userName: string;
  isStaff: boolean;
  canDelete: boolean;
};

export function LessonComments({ lessonId, comments }: { lessonId: string; comments: CommentView[] }) {
  const [state, action] = useActionState(addCommentAction, EMPTY_FORM_STATE);

  return (
    <div>
      <form action={action} className="space-y-3">
        <input type="hidden" name="lessonId" value={lessonId} />
        <label htmlFor="comment-content" className="sr-only">
          Escreva um comentário
        </label>
        <textarea
          id="comment-content"
          name="content"
          rows={3}
          maxLength={1000}
          required
          defaultValue={state.ok ? "" : state.values?.content}
          placeholder="Tem uma dúvida ou quer compartilhar como aplicou a aula?"
          className="input resize-y"
          aria-invalid={state.errors?.content ? true : undefined}
        />
        {state.errors?.content ? <p className="text-danger-600 text-sm">{state.errors.content}</p> : null}
        {!state.ok ? <FormMessage state={state} /> : null}
        <div className="flex justify-end">
          <SubmitButton className="btn btn-primary btn-sm" pendingLabel="Publicando…">
            Publicar comentário
          </SubmitButton>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="text-muted mt-6 text-[15px]">Ninguém comentou ainda. Que tal ser a primeira pessoa?</p>
      ) : (
        <ul className="divide-line mt-6 divide-y">
          {comments.map((comment) => (
            <li key={comment.id} className="flex gap-3.5 py-5 first:pt-0">
              <Avatar name={comment.userName} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-navy-900 text-[15px] font-semibold">{comment.userName}</p>
                  {comment.isStaff ? <span className="badge bg-brand-50 text-brand-700">Equipe</span> : null}
                  <p className="text-muted text-sm">{comment.createdAt}</p>
                </div>
                <p className="text-ink mt-1.5 text-[15px] leading-relaxed whitespace-pre-wrap">{comment.content}</p>
              </div>
              {comment.canDelete ? (
                <form action={deleteCommentAction} className="shrink-0">
                  <input type="hidden" name="commentId" value={comment.id} />
                  <ConfirmSubmitButton
                    message="Apagar este comentário?"
                    className="text-muted hover:bg-danger-50 hover:text-danger-600 grid size-8 place-items-center rounded-lg"
                    aria-label="Apagar comentário"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </ConfirmSubmitButton>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
