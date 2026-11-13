import "server-only";
import { and, count, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { createId } from "@/db/id";
import {
  certificates,
  lessonProgress,
  lessons,
  quizAttempts,
  userTasks,
  users,
} from "@/db/schema";
import { grantAchievements } from "@/lib/achievements";
import { getCatalog, loadCompletedLessonIds, locateLesson, trackLessons, type CatalogTrack } from "@/lib/content";
import { dayKey, previousDayKey } from "@/lib/format";
import { QUIZ_BONUS_XP, QUIZ_PASS_PERCENT, type AchievementKey } from "@/lib/gamification";

/* ------------------------------------------------------------------ */
/* Concluir aula                                                       */
/* ------------------------------------------------------------------ */

export type CompletionResult = {
  alreadyCompleted: boolean;
  xpGained: number;
  streak: number;
  newAchievements: AchievementKey[];
  /** Preenchido quando esta aula fechou a trilha e gerou um certificado novo. */
  certificateId: string | null;
  trackCompleted: boolean;
};

export async function completeLesson(userId: string, lessonId: string): Promise<CompletionResult> {
  const nothing: CompletionResult = {
    alreadyCompleted: true,
    xpGained: 0,
    streak: 0,
    newAchievements: [],
    certificateId: null,
    trackCompleted: false,
  };

  const [lesson] = await db
    .select({ id: lessons.id, xpReward: lessons.xpReward })
    .from(lessons)
    .where(eq(lessons.id, lessonId))
    .limit(1);
  if (!lesson) return nothing;

  // A chave primária (usuário + aula) garante que o XP só é dado uma vez.
  const inserted = await db
    .insert(lessonProgress)
    .values({ userId, lessonId })
    .onConflictDoNothing()
    .returning({ lessonId: lessonProgress.lessonId });
  if (inserted.length === 0) return nothing;

  const [user] = await db
    .select({
      name: users.name,
      currentStreak: users.currentStreak,
      longestStreak: users.longestStreak,
      lastActiveDay: users.lastActiveDay,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) return nothing;

  // Sequência de dias: continua se estudou ontem, recomeça se pulou um dia.
  const today = dayKey();
  let streak = user.currentStreak;
  if (user.lastActiveDay !== today) {
    streak = user.lastActiveDay === previousDayKey(today) ? user.currentStreak + 1 : 1;
  }
  streak = Math.max(1, streak);

  await db
    .update(users)
    .set({
      xp: sql`${users.xp} + ${lesson.xpReward}`,
      currentStreak: streak,
      longestStreak: Math.max(user.longestStreak, streak),
      lastActiveDay: today,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  const [catalog, completed] = await Promise.all([getCatalog(), loadCompletedLessonIds(userId)]);
  const context = locateLesson(catalog, lessonId);

  const moduleDone = Boolean(context?.module.lessons.every((item) => completed.has(item.id)));
  const trackDone = Boolean(context && trackLessons(context.track).every((item) => completed.has(item.id)));

  const keys: AchievementKey[] = ["first-lesson"];
  if (completed.size >= 5) keys.push("five-lessons");
  if (completed.size >= 20) keys.push("twenty-lessons");
  if (moduleDone) keys.push("first-module");
  if (trackDone) keys.push("first-track");
  if (streak >= 3) keys.push("streak-3");
  if (streak >= 7) keys.push("streak-7");

  const newAchievements = await grantAchievements(userId, keys);
  const certificateId = trackDone && context ? await issueCertificate(userId, user.name, context.track) : null;

  return {
    alreadyCompleted: false,
    xpGained: lesson.xpReward,
    streak,
    newAchievements,
    certificateId,
    trackCompleted: trackDone,
  };
}

/** Emite o certificado da trilha (uma única vez por aluno). Retorna o código se for novo. */
async function issueCertificate(userId: string, userName: string, track: CatalogTrack): Promise<string | null> {
  const totalMinutes = trackLessons(track).reduce((sum, lesson) => sum + lesson.durationMinutes, 0);

  const inserted = await db
    .insert(certificates)
    .values({
      id: createId(10).toUpperCase(),
      userId,
      trackId: track.id,
      userName,
      trackTitle: track.title,
      totalMinutes,
    })
    .onConflictDoNothing()
    .returning({ id: certificates.id });

  return inserted[0]?.id ?? null;
}

/* ------------------------------------------------------------------ */
/* Quiz                                                                */
/* ------------------------------------------------------------------ */

export type QuizResult = {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  xpGained: number;
  newAchievements: AchievementKey[];
  answers: Array<{
    questionId: string;
    chosenOptionId: string | null;
    correctOptionId: string | null;
    isCorrect: boolean;
    explanation: string;
  }>;
};

export async function submitQuiz(
  userId: string,
  lessonId: string,
  chosen: Record<string, string>,
): Promise<QuizResult | null> {
  const questions = await db.query.quizQuestions.findMany({
    where: (question, { eq }) => eq(question.lessonId, lessonId),
    orderBy: (question, { asc }) => [asc(question.sortOrder)],
    with: { options: true },
  });
  if (questions.length === 0) return null;

  const answers = questions.map((question) => {
    const correct = question.options.find((option) => option.isCorrect) ?? null;
    const chosenOptionId = question.options.some((option) => option.id === chosen[question.id])
      ? chosen[question.id]
      : null;

    return {
      questionId: question.id,
      chosenOptionId,
      correctOptionId: correct?.id ?? null,
      isCorrect: Boolean(correct) && chosenOptionId === correct?.id,
      explanation: question.explanation,
    };
  });

  const total = questions.length;
  const score = answers.filter((answer) => answer.isCorrect).length;
  const percent = Math.round((score / total) * 100);
  const passed = percent >= QUIZ_PASS_PERCENT;

  const [alreadyPassed] = await db
    .select({ id: quizAttempts.id })
    .from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.lessonId, lessonId), eq(quizAttempts.passed, true)))
    .limit(1);

  await db.insert(quizAttempts).values({ userId, lessonId, score, total, passed });

  // O bônus de XP vale só na primeira aprovação.
  let xpGained = 0;
  if (passed && !alreadyPassed) {
    xpGained = QUIZ_BONUS_XP;
    await db
      .update(users)
      .set({ xp: sql`${users.xp} + ${xpGained}`, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  const newAchievements = score === total ? await grantAchievements(userId, ["quiz-ace"]) : [];

  return { score, total, percent, passed, xpGained, newAchievements, answers };
}

/* ------------------------------------------------------------------ */
/* Tarefas práticas                                                    */
/* ------------------------------------------------------------------ */

export async function setTaskDone(userId: string, taskId: string, done: boolean): Promise<AchievementKey[]> {
  if (!done) {
    await db.delete(userTasks).where(and(eq(userTasks.userId, userId), eq(userTasks.taskId, taskId)));
    return [];
  }

  await db.insert(userTasks).values({ userId, taskId }).onConflictDoNothing();

  const [{ total }] = await db.select({ total: count() }).from(userTasks).where(eq(userTasks.userId, userId));
  return total >= 10 ? grantAchievements(userId, ["task-master"]) : [];
}

/* ------------------------------------------------------------------ */
/* Números para o painel                                               */
/* ------------------------------------------------------------------ */

/** Dias (AAAA-MM-DD) com pelo menos uma aula concluída nos últimos `days` dias. */
export async function getActiveDays(userId: string, days: number): Promise<Set<string>> {
  const since = new Date(Date.now() - (days + 1) * 24 * 60 * 60 * 1000);
  const rows = await db
    .select({ completedAt: lessonProgress.completedAt })
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), gte(lessonProgress.completedAt, since)));

  return new Set(rows.map((row) => dayKey(row.completedAt)));
}

export async function getUserCounters(userId: string) {
  const [[lessonsDone], [tasksDone], [certificateCount]] = await Promise.all([
    db.select({ total: count() }).from(lessonProgress).where(eq(lessonProgress.userId, userId)),
    db.select({ total: count() }).from(userTasks).where(eq(userTasks.userId, userId)),
    db.select({ total: count() }).from(certificates).where(eq(certificates.userId, userId)),
  ]);

  return {
    lessonsDone: lessonsDone.total,
    tasksDone: tasksDone.total,
    certificates: certificateCount.total,
  };
}
