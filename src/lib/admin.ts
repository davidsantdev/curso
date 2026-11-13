import "server-only";
import { and, count, desc, eq, gt, gte, isNull, like, lte, ne, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import {
  comments,
  coupons,
  lessonProgress,
  lessons,
  modules,
  payments,
  plans,
  subscriptions,
  tracks,
  users,
  type PaymentStatus,
} from "@/db/schema";
import { getCatalog, loadCompletedLessonIds, summarize, trackLessons } from "@/lib/content";
import { dayKey } from "@/lib/format";
import { monthlyEquivalentCents } from "@/lib/billing";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Últimos N dias (chaves AAAA-MM-DD), do mais antigo para hoje. */
export function lastDays(days: number): string[] {
  return Array.from({ length: days }, (_, index) => dayKey(new Date(Date.now() - (days - 1 - index) * DAY_MS)));
}

function bucketByDay(dates: Date[], days: string[]): Array<{ day: string; value: number }> {
  const counts = new Map(days.map((day) => [day, 0]));
  for (const date of dates) {
    const key = dayKey(date);
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return days.map((day) => ({ day, value: counts.get(day) ?? 0 }));
}

/** Assinatura com acesso válido agora. */
function activeSubscriptionCondition(now: Date): SQL {
  return and(
    eq(subscriptions.status, "ACTIVE"),
    or(isNull(subscriptions.currentPeriodEnd), gt(subscriptions.currentPeriodEnd, now)),
  )!;
}

/* ------------------------------------------------------------------ */
/* Visão geral                                                         */
/* ------------------------------------------------------------------ */

export async function getAdminOverview() {
  const now = new Date();
  const since30 = new Date(now.getTime() - 30 * DAY_MS);
  const days = lastDays(14);
  const since14 = new Date(now.getTime() - 15 * DAY_MS);

  const [
    [{ totalUsers }],
    [{ newUsers }],
    activeSubs,
    [{ revenue }],
    [{ demoPayments }],
    [{ completions }],
    signupDates,
    completionDates,
    recentUsers,
    recentPayments,
    [trackCounts],
    [lessonCounts],
  ] = await Promise.all([
    db.select({ totalUsers: count() }).from(users),
    db.select({ newUsers: count() }).from(users).where(gte(users.createdAt, since30)),
    db
      .select({ priceCents: plans.priceCents, interval: plans.interval, provider: subscriptions.provider })
      .from(subscriptions)
      .innerJoin(plans, eq(plans.id, subscriptions.planId))
      .where(activeSubscriptionCondition(now)),
    db
      .select({ revenue: sql<number>`coalesce(sum(${payments.amountCents}), 0)` })
      .from(payments)
      .where(and(eq(payments.status, "PAID"), gte(payments.createdAt, since30))),
    db
      .select({ demoPayments: count() })
      .from(payments)
      .where(and(eq(payments.provider, "demo"), gte(payments.createdAt, since30))),
    db.select({ completions: count() }).from(lessonProgress).where(gte(lessonProgress.completedAt, since30)),
    db.select({ date: users.createdAt }).from(users).where(gte(users.createdAt, since14)),
    db.select({ date: lessonProgress.completedAt }).from(lessonProgress).where(gte(lessonProgress.completedAt, since14)),
    db
      .select({ id: users.id, name: users.name, email: users.email, createdAt: users.createdAt })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(6),
    db
      .select({
        id: payments.id,
        amountCents: payments.amountCents,
        provider: payments.provider,
        method: payments.method,
        createdAt: payments.createdAt,
        userId: payments.userId,
        userName: users.name,
        planName: plans.name,
      })
      .from(payments)
      .leftJoin(users, eq(users.id, payments.userId))
      .leftJoin(plans, eq(plans.id, payments.planId))
      .where(eq(payments.status, "PAID"))
      .orderBy(desc(payments.createdAt))
      .limit(6),
    db
      .select({ total: count(), published: sql<number>`coalesce(sum(${tracks.published}), 0)` })
      .from(tracks),
    db
      .select({ total: count(), published: sql<number>`coalesce(sum(${lessons.published}), 0)` })
      .from(lessons),
  ]);

  const mrrCents = activeSubs.reduce((sum, sub) => sum + (monthlyEquivalentCents(sub) ?? 0), 0);

  return {
    totalUsers,
    newUsers,
    activeSubscribers: activeSubs.length,
    demoSubscribers: activeSubs.filter((sub) => sub.provider === "demo").length,
    mrrCents,
    revenue30Cents: Number(revenue),
    demoPayments30: demoPayments,
    completions30: completions,
    signupsByDay: bucketByDay(
      signupDates.map((row) => row.date),
      days,
    ),
    completionsByDay: bucketByDay(
      completionDates.map((row) => row.date),
      days,
    ),
    recentUsers,
    recentPayments,
    content: {
      tracks: Number(trackCounts.total),
      publishedTracks: Number(trackCounts.published),
      lessons: Number(lessonCounts.total),
      publishedLessons: Number(lessonCounts.published),
    },
  };
}

/* ------------------------------------------------------------------ */
/* Usuários                                                            */
/* ------------------------------------------------------------------ */

export const USER_FILTERS = ["todos", "pro", "gratis", "admin"] as const;
export type UserFilter = (typeof USER_FILTERS)[number];
export const USERS_PER_PAGE = 25;

export async function listAdminUsers({ q, filter, page }: { q: string; filter: UserFilter; page: number }) {
  const now = new Date();
  const conditions: SQL[] = [];

  const term = q.trim().toLowerCase().slice(0, 80);
  if (term) {
    const pattern = `%${term.replace(/[%_]/g, "")}%`;
    conditions.push(or(like(sql`lower(${users.name})`, pattern), like(sql`lower(${users.email})`, pattern))!);
  }

  const active = activeSubscriptionCondition(now);
  if (filter === "pro") conditions.push(active);
  if (filter === "admin") conditions.push(eq(users.role, "ADMIN"));
  if (filter === "gratis") {
    conditions.push(eq(users.role, "USER"));
    conditions.push(
      or(
        isNull(subscriptions.userId),
        ne(subscriptions.status, "ACTIVE"),
        lte(subscriptions.currentPeriodEnd, now),
      )!,
    );
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        xp: users.xp,
        createdAt: users.createdAt,
        planName: plans.name,
        status: subscriptions.status,
        periodEnd: subscriptions.currentPeriodEnd,
        lessonsDone: sql<number>`(select count(*) from ${lessonProgress} where ${lessonProgress.userId} = ${users.id})`,
      })
      .from(users)
      .leftJoin(subscriptions, eq(subscriptions.userId, users.id))
      .leftJoin(plans, eq(plans.id, subscriptions.planId))
      .where(where)
      .orderBy(desc(users.createdAt))
      .limit(USERS_PER_PAGE)
      .offset((page - 1) * USERS_PER_PAGE),
    db
      .select({ total: count() })
      .from(users)
      .leftJoin(subscriptions, eq(subscriptions.userId, users.id))
      .where(where),
  ]);

  return {
    total,
    pages: Math.max(1, Math.ceil(total / USERS_PER_PAGE)),
    rows: rows.map((row) => ({
      ...row,
      lessonsDone: Number(row.lessonsDone),
      isPro:
        row.status === "ACTIVE" && (row.periodEnd === null || (row.periodEnd !== null && row.periodEnd > now)),
    })),
  };
}

export async function getAdminUser(userId: string) {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      xp: users.xp,
      currentStreak: users.currentStreak,
      longestStreak: users.longestStreak,
      lastActiveDay: users.lastActiveDay,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) return null;

  const [[subscription], userPayments, catalog, completed, allPlans] = await Promise.all([
    db
      .select({
        status: subscriptions.status,
        provider: subscriptions.provider,
        currentPeriodEnd: subscriptions.currentPeriodEnd,
        planName: plans.name,
        planId: plans.id,
      })
      .from(subscriptions)
      .innerJoin(plans, eq(plans.id, subscriptions.planId))
      .where(eq(subscriptions.userId, userId))
      .limit(1),
    db
      .select({
        id: payments.id,
        amountCents: payments.amountCents,
        status: payments.status,
        provider: payments.provider,
        method: payments.method,
        createdAt: payments.createdAt,
        planName: plans.name,
      })
      .from(payments)
      .leftJoin(plans, eq(plans.id, payments.planId))
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt))
      .limit(30),
    getCatalog(),
    loadCompletedLessonIds(userId),
    db.select().from(plans).orderBy(plans.sortOrder),
  ]);

  const now = new Date();
  const active =
    subscription?.status === "ACTIVE" &&
    (subscription.currentPeriodEnd === null || subscription.currentPeriodEnd > now);

  return {
    user,
    subscription: subscription ? { ...subscription, active } : null,
    payments: userPayments,
    plans: allPlans,
    progress: catalog.map((track) => ({
      id: track.id,
      title: track.title,
      color: track.color,
      ...summarize(trackLessons(track), completed),
    })),
  };
}

/* ------------------------------------------------------------------ */
/* Pagamentos                                                          */
/* ------------------------------------------------------------------ */

export const PAYMENT_FILTERS = ["todos", "pagos", "pendentes", "recusados", "reembolsados"] as const;
export type PaymentFilter = (typeof PAYMENT_FILTERS)[number];
export const PAYMENTS_PER_PAGE = 30;

const PAYMENT_FILTER_STATUS: Record<PaymentFilter, PaymentStatus | null> = {
  todos: null,
  pagos: "PAID",
  pendentes: "PENDING",
  recusados: "FAILED",
  reembolsados: "REFUNDED",
};

export async function listAdminPayments({ filter, page }: { filter: PaymentFilter; page: number }) {
  const status = PAYMENT_FILTER_STATUS[filter];
  const where = status ? eq(payments.status, status) : undefined;

  const [rows, [{ total }], byStatus] = await Promise.all([
    db
      .select({
        id: payments.id,
        amountCents: payments.amountCents,
        discountCents: payments.discountCents,
        status: payments.status,
        provider: payments.provider,
        method: payments.method,
        createdAt: payments.createdAt,
        userId: payments.userId,
        userName: users.name,
        userEmail: users.email,
        planName: plans.name,
        couponCode: coupons.code,
      })
      .from(payments)
      .leftJoin(users, eq(users.id, payments.userId))
      .leftJoin(plans, eq(plans.id, payments.planId))
      .leftJoin(coupons, eq(coupons.id, payments.couponId))
      .where(where)
      .orderBy(desc(payments.createdAt))
      .limit(PAYMENTS_PER_PAGE)
      .offset((page - 1) * PAYMENTS_PER_PAGE),
    db.select({ total: count() }).from(payments).where(where),
    db
      .select({
        status: payments.status,
        total: count(),
        amountCents: sql<number>`coalesce(sum(${payments.amountCents}), 0)`,
      })
      .from(payments)
      .groupBy(payments.status),
  ]);

  const summary = new Map(byStatus.map((row) => [row.status, { total: row.total, amountCents: Number(row.amountCents) }]));
  const of = (key: PaymentStatus) => summary.get(key) ?? { total: 0, amountCents: 0 };

  return {
    rows,
    total,
    pages: Math.max(1, Math.ceil(total / PAYMENTS_PER_PAGE)),
    summary: { paid: of("PAID"), pending: of("PENDING"), failed: of("FAILED"), refunded: of("REFUNDED") },
  };
}

/* ------------------------------------------------------------------ */
/* Cupons                                                              */
/* ------------------------------------------------------------------ */

export async function listAdminCoupons() {
  return db.select().from(coupons).orderBy(desc(coupons.createdAt));
}

/* ------------------------------------------------------------------ */
/* Comentários                                                         */
/* ------------------------------------------------------------------ */

export const COMMENTS_PER_PAGE = 30;

export async function listAdminComments(page: number) {
  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        userId: users.id,
        userName: users.name,
        userRole: users.role,
        lessonId: lessons.id,
        lessonTitle: lessons.title,
        trackTitle: tracks.title,
      })
      .from(comments)
      .innerJoin(users, eq(users.id, comments.userId))
      .innerJoin(lessons, eq(lessons.id, comments.lessonId))
      .innerJoin(modules, eq(modules.id, lessons.moduleId))
      .innerJoin(tracks, eq(tracks.id, modules.trackId))
      .orderBy(desc(comments.createdAt))
      .limit(COMMENTS_PER_PAGE)
      .offset((page - 1) * COMMENTS_PER_PAGE),
    db.select({ total: count() }).from(comments),
  ]);

  return { rows, total, pages: Math.max(1, Math.ceil(total / COMMENTS_PER_PAGE)) };
}

/* ------------------------------------------------------------------ */
/* Conteúdo (inclui rascunhos)                                         */
/* ------------------------------------------------------------------ */

export async function getAdminTracks() {
  return db.query.tracks.findMany({
    orderBy: (track, { asc }) => [asc(track.sortOrder), asc(track.createdAt)],
    with: {
      modules: {
        columns: { id: true },
        with: { lessons: { columns: { id: true, published: true } } },
      },
    },
  });
}

export async function getAdminTrack(trackId: string) {
  return db.query.tracks.findFirst({
    where: (track, { eq }) => eq(track.id, trackId),
    with: {
      modules: {
        orderBy: (mod, { asc }) => [asc(mod.sortOrder), asc(mod.createdAt)],
        with: {
          lessons: {
            orderBy: (lesson, { asc }) => [asc(lesson.sortOrder), asc(lesson.createdAt)],
            columns: {
              id: true,
              title: true,
              published: true,
              isFree: true,
              durationMinutes: true,
              videoUrl: true,
            },
            with: { questions: { columns: { id: true } }, tasks: { columns: { id: true } } },
          },
        },
      },
    },
  });
}

export async function getAdminLesson(lessonId: string) {
  return db.query.lessons.findFirst({
    where: (lesson, { eq }) => eq(lesson.id, lessonId),
    with: {
      module: { with: { track: { columns: { id: true, title: true, published: true } } } },
      resources: { orderBy: (resource, { asc }) => [asc(resource.sortOrder)] },
      tasks: { orderBy: (task, { asc }) => [asc(task.sortOrder)] },
      questions: {
        orderBy: (question, { asc }) => [asc(question.sortOrder)],
        with: { options: { orderBy: (option, { asc }) => [asc(option.sortOrder)] } },
      },
    },
  });
}
