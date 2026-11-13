"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { comments, lessonTasks, notes } from "@/db/schema";
import { getCurrentUser, type CurrentUser } from "@/lib/auth/dal";
import { canAccessLesson, getCatalog, locateLesson, type LessonContext } from "@/lib/content";
import { field, type FormState } from "@/lib/forms";
import type { AchievementKey } from "@/lib/gamification";
import { completeLesson, setTaskDone, submitQuiz, type CompletionResult, type QuizResult } from "@/lib/progress";
import { rateLimit } from "@/lib/rate-limit";

type Failure = { ok: false; message: string };

const SESSION_EXPIRED: Failure = { ok: false, message: "Sua sessão expirou. Entre de novo para continuar." };
const NOT_FOUND: Failure = { ok: false, message: "Aula não encontrada." };
const LOCKED: Failure = { ok: false, message: "Esta aula faz parte do plano Pro." };

/**
 * Toda ação de aula passa por aqui: confere o login, se a aula está publicada
 * e se o aluno tem acesso a ela. (Actions podem ser chamadas direto por POST,
 * então a checagem não pode depender só da interface.)
 */
async function authorizeLesson(
  lessonId: unknown,
): Promise<{ ok: true; user: CurrentUser; context: LessonContext } | Failure> {
  const user = await getCurrentUser();
  if (!user) return SESSION_EXPIRED;
  if (typeof lessonId !== "string" || lessonId.length > 40) return NOT_FOUND;

  const context = locateLesson(await getCatalog(), lessonId);
  if (!context) return NOT_FOUND;
  if (!canAccessLesson(user, context.lesson)) return LOCKED;

  return { ok: true, user, context };
}

/* --------------------------- Concluir a aula --------------------------- */

export async function completeLessonAction(
  lessonId: string,
): Promise<{ ok: true; result: CompletionResult; nextLessonId: string | null } | Failure> {
  const auth = await authorizeLesson(lessonId);
  if (!auth.ok) return auth;

  const result = await completeLesson(auth.user.id, auth.context.lesson.id);

  revalidatePath("/", "layout");
  return { ok: true, result, nextLessonId: auth.context.next?.id ?? null };
}

/* ------------------------------- Tarefas ------------------------------- */

export async function toggleTaskAction(
  taskId: string,
  done: boolean,
): Promise<{ ok: true; newAchievements: AchievementKey[] } | Failure> {
  if (typeof taskId !== "string" || typeof done !== "boolean") return NOT_FOUND;

  const [task] = await db
    .select({ id: lessonTasks.id, lessonId: lessonTasks.lessonId })
    .from(lessonTasks)
    .where(eq(lessonTasks.id, taskId))
    .limit(1);
  if (!task) return NOT_FOUND;

  const auth = await authorizeLesson(task.lessonId);
  if (!auth.ok) return auth;

  const newAchievements = await setTaskDone(auth.user.id, task.id, done);
  if (newAchievements.length > 0) revalidatePath("/", "layout");

  return { ok: true, newAchievements };
}

/* ------------------------------ Anotações ------------------------------ */

export async function saveNoteAction(lessonId: string, content: string): Promise<{ ok: true } | Failure> {
  const auth = await authorizeLesson(lessonId);
  if (!auth.ok) return auth;
  if (typeof content !== "string") return NOT_FOUND;

  const text = content.slice(0, 5000);
  await db
    .insert(notes)
    .values({ userId: auth.user.id, lessonId: auth.context.lesson.id, content: text })
    .onConflictDoUpdate({ target: [notes.userId, notes.lessonId], set: { content: text, updatedAt: new Date() } });

  return { ok: true };
}

/* --------------------------------- Quiz -------------------------------- */

const answersSchema = z.record(z.string().max(40), z.string().max(40));

export async function submitQuizAction(
  lessonId: string,
  answers: Record<string, string>,
): Promise<{ ok: true; result: QuizResult } | Failure> {
  const auth = await authorizeLesson(lessonId);
  if (!auth.ok) return auth;

  const parsed = answersSchema.safeParse(answers);
  if (!parsed.success) return { ok: false, message: "Respostas inválidas." };

  const limit = rateLimit(`quiz:${auth.user.id}`, 30, 10 * 60_000);
  if (!limit.ok) return { ok: false, message: "Muitas tentativas seguidas. Respire e tente daqui a pouco." };

  const result = await submitQuiz(auth.user.id, auth.context.lesson.id, parsed.data);
  if (!result) return { ok: false, message: "Esta aula não tem quiz." };

  if (result.xpGained > 0 || result.newAchievements.length > 0) revalidatePath("/", "layout");
  return { ok: true, result };
}

/* ------------------------------ Comentários ---------------------------- */

export async function addCommentAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const auth = await authorizeLesson(field(formData, "lessonId"));
  if (!auth.ok) return { ok: false, message: auth.message };

  const content = field(formData, "content");
  if (content.length < 3) return { ok: false, errors: { content: "Escreva um pouco mais." } };
  if (content.length > 1000) {
    return { ok: false, errors: { content: "O comentário passou de 1.000 caracteres." }, values: { content } };
  }

  const limit = rateLimit(`comment:${auth.user.id}`, 10, 10 * 60_000);
  if (!limit.ok) {
    return { ok: false, message: "Você comentou várias vezes seguidas. Aguarde alguns minutos.", values: { content } };
  }

  await db.insert(comments).values({ lessonId: auth.context.lesson.id, userId: auth.user.id, content });

  revalidatePath(`/aula/${auth.context.lesson.id}`);
  return { ok: true, message: "Comentário publicado." };
}

export async function deleteCommentAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const commentId = field(formData, "commentId");
  const [comment] = await db
    .select({ id: comments.id, userId: comments.userId, lessonId: comments.lessonId })
    .from(comments)
    .where(eq(comments.id, commentId))
    .limit(1);

  // Só o autor ou um administrador pode apagar.
  if (!comment || (comment.userId !== user.id && !user.isAdmin)) return;

  await db.delete(comments).where(eq(comments.id, comment.id));
  revalidatePath(`/aula/${comment.lessonId}`);
  revalidatePath("/admin/comentarios");
}
