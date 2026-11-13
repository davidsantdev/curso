import "server-only";
import { cache } from "react";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { comments, lessonProgress, notes, quizAttempts, userTasks, users, type TrackLevel } from "@/db/schema";

/* ------------------------------------------------------------------ */
/* Catálogo publicado (o que o aluno enxerga)                          */
/* ------------------------------------------------------------------ */

export type CatalogLesson = {
  id: string;
  title: string;
  summary: string;
  /** "O que você vai aprender" — público, mesmo em aulas pagas. */
  objectives: string[];
  durationMinutes: number;
  isFree: boolean;
  xpReward: number;
  hasVideo: boolean;
};

export type CatalogModule = {
  id: string;
  title: string;
  description: string;
  lessons: CatalogLesson[];
};

export type CatalogTrack = {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: TrackLevel;
  icon: string;
  color: string;
  modules: CatalogModule[];
};

/** Todas as trilhas publicadas, com módulos e aulas publicados, já em ordem. */
export const getCatalog = cache(async (): Promise<CatalogTrack[]> => {
  const rows = await db.query.tracks.findMany({
    where: (track, { eq }) => eq(track.published, true),
    orderBy: (track, { asc }) => [asc(track.sortOrder), asc(track.createdAt)],
    with: {
      modules: {
        where: (mod, { eq }) => eq(mod.published, true),
        orderBy: (mod, { asc }) => [asc(mod.sortOrder), asc(mod.createdAt)],
        with: {
          lessons: {
            where: (lesson, { eq }) => eq(lesson.published, true),
            orderBy: (lesson, { asc }) => [asc(lesson.sortOrder), asc(lesson.createdAt)],
            columns: {
              id: true,
              title: true,
              summary: true,
              objectives: true,
              durationMinutes: true,
              isFree: true,
              xpReward: true,
              videoUrl: true,
            },
          },
        },
      },
    },
  });

  return rows.map((track) => ({
    id: track.id,
    slug: track.slug,
    title: track.title,
    description: track.description,
    level: track.level,
    icon: track.icon,
    color: track.color,
    modules: track.modules
      .filter((mod) => mod.lessons.length > 0)
      .map((mod) => ({
        id: mod.id,
        title: mod.title,
        description: mod.description,
        lessons: mod.lessons.map(({ videoUrl, ...lesson }) => ({ ...lesson, hasVideo: Boolean(videoUrl) })),
      })),
  }));
});

export function trackLessons(track: CatalogTrack): CatalogLesson[] {
  return track.modules.flatMap((mod) => mod.lessons);
}

/** "free": tudo grátis · "partial": algumas aulas grátis · "pro": só para assinantes. */
export type TrackAccess = "free" | "partial" | "pro";

export function trackAccess(track: CatalogTrack): TrackAccess {
  const all = trackLessons(track);
  const free = all.filter((lesson) => lesson.isFree).length;
  if (all.length > 0 && free === all.length) return "free";
  return free > 0 ? "partial" : "pro";
}

export type ProgressSummary = { total: number; done: number; percent: number; minutes: number };

export function summarize(lessonList: CatalogLesson[], completed: ReadonlySet<string>): ProgressSummary {
  const total = lessonList.length;
  const done = lessonList.filter((lesson) => completed.has(lesson.id)).length;
  const minutes = lessonList.reduce((sum, lesson) => sum + lesson.durationMinutes, 0);
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0, minutes };
}

export type LessonContext = {
  track: CatalogTrack;
  module: CatalogModule;
  lesson: CatalogLesson;
  /** Posição da aula dentro da trilha (começa em 1). */
  position: number;
  total: number;
  previous: CatalogLesson | null;
  next: CatalogLesson | null;
};

export function locateLesson(catalog: CatalogTrack[], lessonId: string): LessonContext | null {
  for (const track of catalog) {
    const all = trackLessons(track);
    const index = all.findIndex((lesson) => lesson.id === lessonId);
    if (index === -1) continue;

    const mod = track.modules.find((m) => m.lessons.some((lesson) => lesson.id === lessonId));
    if (!mod) continue;

    return {
      track,
      module: mod,
      lesson: all[index],
      position: index + 1,
      total: all.length,
      previous: all[index - 1] ?? null,
      next: all[index + 1] ?? null,
    };
  }
  return null;
}

/** Regra do paywall: aula gratuita ou aluno com acesso pago. */
export function canAccessLesson(user: { isPremium: boolean } | null, lesson: { isFree: boolean }): boolean {
  return lesson.isFree || Boolean(user?.isPremium);
}

/** Primeira aula ainda não concluída da trilha. */
export function nextPendingLesson(track: CatalogTrack, completed: ReadonlySet<string>): CatalogLesson | null {
  return trackLessons(track).find((lesson) => !completed.has(lesson.id)) ?? null;
}

/**
 * Qual aula sugerir no "continue de onde parou":
 * a próxima da trilha em que o aluno estudou por último; se ela acabou, a próxima trilha pendente.
 * `isAvailable` filtra as aulas que o aluno pode abrir (ex.: só as gratuitas no plano grátis).
 */
export function pickContinueLesson(
  catalog: CatalogTrack[],
  completed: ReadonlySet<string>,
  lastLessonId: string | null,
  isAvailable: (lesson: CatalogLesson) => boolean = () => true,
): { track: CatalogTrack; lesson: CatalogLesson } | null {
  const lastTrack = lastLessonId ? locateLesson(catalog, lastLessonId)?.track : undefined;
  const ordered = lastTrack ? [lastTrack, ...catalog.filter((track) => track.id !== lastTrack.id)] : catalog;

  for (const track of ordered) {
    const lesson = trackLessons(track).find((item) => !completed.has(item.id) && isAvailable(item));
    if (lesson) return { track, lesson };
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Aula completa                                                       */
/* ------------------------------------------------------------------ */

export async function getLessonDetail(lessonId: string) {
  return db.query.lessons.findFirst({
    where: (lesson, { eq }) => eq(lesson.id, lessonId),
    with: {
      resources: { orderBy: (resource, { asc }) => [asc(resource.sortOrder)] },
      tasks: { orderBy: (task, { asc }) => [asc(task.sortOrder)] },
      questions: {
        orderBy: (question, { asc }) => [asc(question.sortOrder)],
        with: { options: { orderBy: (option, { asc }) => [asc(option.sortOrder)] } },
      },
    },
  });
}

export type LessonDetail = NonNullable<Awaited<ReturnType<typeof getLessonDetail>>>;

/* ------------------------------------------------------------------ */
/* Dados do aluno                                                      */
/* ------------------------------------------------------------------ */

export async function loadCompletedLessonIds(userId: string): Promise<Set<string>> {
  const rows = await db
    .select({ lessonId: lessonProgress.lessonId })
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, userId));
  return new Set(rows.map((row) => row.lessonId));
}

/** Versão com cache por requisição (para páginas). */
export const getCompletedLessonIds = cache(loadCompletedLessonIds);

export async function getLastCompletedLessonId(userId: string): Promise<string | null> {
  const [row] = await db
    .select({ lessonId: lessonProgress.lessonId })
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, userId))
    .orderBy(desc(lessonProgress.completedAt))
    .limit(1);
  return row?.lessonId ?? null;
}

/** O que o aluno já fez dentro de uma aula: tarefas, anotação e melhor quiz. */
export async function getLessonUserState(userId: string, lessonId: string, taskIds: string[]) {
  const [doneTasks, [note], attempts] = await Promise.all([
    taskIds.length
      ? db
          .select({ taskId: userTasks.taskId })
          .from(userTasks)
          .where(and(eq(userTasks.userId, userId), inArray(userTasks.taskId, taskIds)))
      : Promise.resolve([]),
    db
      .select({ content: notes.content })
      .from(notes)
      .where(and(eq(notes.userId, userId), eq(notes.lessonId, lessonId)))
      .limit(1),
    db
      .select({ score: quizAttempts.score, total: quizAttempts.total, passed: quizAttempts.passed })
      .from(quizAttempts)
      .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.lessonId, lessonId)))
      .orderBy(desc(quizAttempts.score))
      .limit(1),
  ]);

  return {
    doneTaskIds: doneTasks.map((row) => row.taskId),
    note: note?.content ?? "",
    bestQuiz: attempts[0] ?? null,
  };
}

export async function listComments(lessonId: string) {
  return db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      userId: comments.userId,
      userName: users.name,
      userRole: users.role,
    })
    .from(comments)
    .innerJoin(users, eq(users.id, comments.userId))
    .where(eq(comments.lessonId, lessonId))
    .orderBy(asc(comments.createdAt))
    .limit(200);
}

export type LessonComment = Awaited<ReturnType<typeof listComments>>[number];

/* ------------------------------------------------------------------ */
/* Aula em destaque (página inicial)                                   */
/* ------------------------------------------------------------------ */

export type FeaturedLesson = {
  lesson: CatalogLesson & { content: string; videoUrl: string | null };
  track: Pick<CatalogTrack, "slug" | "title" | "color">;
  moduleTitle: string;
  /** Posição da aula dentro da trilha (começa em 1). */
  position: number;
  next: CatalogLesson | null;
};

/**
 * A primeira aula GRÁTIS da grade, na ordem em que o aluno vê as trilhas.
 * Ela aparece aberta na página inicial, para qualquer visitante — por isso só aula grátis entra aqui.
 */
export async function getFeaturedLesson(): Promise<FeaturedLesson | null> {
  const catalog = await getCatalog();

  for (const track of catalog) {
    const all = trackLessons(track);
    const index = all.findIndex((lesson) => lesson.isFree);
    if (index === -1) continue;

    const lesson = all[index];
    const row = await db.query.lessons.findFirst({
      where: (item, { and, eq }) => and(eq(item.id, lesson.id), eq(item.isFree, true), eq(item.published, true)),
      columns: { content: true, videoUrl: true },
    });
    if (!row) return null;

    const mod = track.modules.find((item) => item.lessons.some((entry) => entry.id === lesson.id));
    return {
      lesson: { ...lesson, content: row.content, videoUrl: row.videoUrl },
      track: { slug: track.slug, title: track.title, color: track.color },
      moduleTitle: mod?.title ?? "",
      position: index + 1,
      next: all[index + 1] ?? null,
    };
  }

  return null;
}
