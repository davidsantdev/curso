import { relations, sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createId } from "./id";

/* ------------------------------------------------------------------ */
/* Helpers de coluna                                                   */
/* ------------------------------------------------------------------ */

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => createId());

const timestamp = (name: string) => integer(name, { mode: "timestamp_ms" });
const bool = (name: string) => integer(name, { mode: "boolean" });

const createdAt = () =>
  timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date());

const updatedAt = () =>
  timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date());

/* ------------------------------------------------------------------ */
/* Enums                                                               */
/* ------------------------------------------------------------------ */

export const ROLES = ["USER", "ADMIN"] as const;
export const PLAN_INTERVALS = ["MONTH", "YEAR", "LIFETIME"] as const;
export const SUBSCRIPTION_STATUSES = ["ACTIVE", "PAST_DUE", "CANCELED"] as const;
export const PAYMENT_STATUSES = ["PAID", "PENDING", "FAILED", "REFUNDED"] as const;
export const TRACK_LEVELS = ["INICIANTE", "INTERMEDIARIO", "AVANCADO"] as const;

export type Role = (typeof ROLES)[number];
export type PlanInterval = (typeof PLAN_INTERVALS)[number];
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type TrackLevel = (typeof TRACK_LEVELS)[number];

/* ------------------------------------------------------------------ */
/* Contas                                                              */
/* ------------------------------------------------------------------ */

export const users = sqliteTable("users", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ROLES }).notNull().default("USER"),
  xp: integer("xp").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  /** Último dia com estudo, no formato AAAA-MM-DD (fuso do site). */
  lastActiveDay: text("last_active_day"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const sessions = sqliteTable(
  "sessions",
  {
    /** SHA-256 do token guardado no cookie (o token em si nunca é salvo). */
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const passwordResets = sqliteTable("password_resets", {
  /** SHA-256 do token enviado por e-mail. */
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: createdAt(),
});

/* ------------------------------------------------------------------ */
/* Planos e pagamentos                                                 */
/* ------------------------------------------------------------------ */

export const plans = sqliteTable("plans", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  priceCents: integer("price_cents").notNull(),
  interval: text("interval", { enum: PLAN_INTERVALS }).notNull(),
  features: text("features", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .$defaultFn(() => []),
  highlighted: bool("highlighted").notNull().default(false),
  active: bool("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  /**
   * Link de pagamento da oferta deste plano: https://pay.cakto.com.br/abc123 (Cakto) ou
   * https://pay.hotmart.com/A12345678B?off=abc123 (Hotmart). O código da oferta no link identifica o plano
   * quando a plataforma avisa a venda. (A coluna tem o nome antigo, de quando guardava o "ID no gateway":
   * mantido para não precisar migrar o banco.)
   */
  paymentLink: text("external_price_id"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: id(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  planId: text("plan_id")
    .notNull()
    .references(() => plans.id),
  status: text("status", { enum: SUBSCRIPTION_STATUSES }).notNull().default("ACTIVE"),
  /** "demo", "manual" (liberado pelo admin) ou o nome do gateway. */
  provider: text("provider").notNull().default("manual"),
  providerRef: text("provider_ref"),
  /** Fim do período pago. `null` = acesso vitalício. */
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: bool("cancel_at_period_end").notNull().default(false),
  /** Fim de período para o qual o e-mail "seu acesso está acabando" já foi enviado. */
  expiryNoticeFor: timestamp("expiry_notice_for"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const coupons = sqliteTable("coupons", {
  id: id(),
  /** Sempre em maiúsculas, sem espaços (ex.: BEMVINDO20). */
  code: text("code").notNull().unique(),
  percentOff: integer("percent_off").notNull(),
  /** Quantas vezes pode ser usado. `null` = sem limite. */
  maxRedemptions: integer("max_redemptions"),
  redemptions: integer("redemptions").notNull().default(0),
  expiresAt: timestamp("expires_at"),
  active: bool("active").notNull().default(true),
  createdAt: createdAt(),
});

export const payments = sqliteTable(
  "payments",
  {
    /** Também é a referência enviada ao gateway (external_reference). */
    id: id(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    planId: text("plan_id").references(() => plans.id, { onDelete: "set null" }),
    /** Valor cobrado, já com o desconto do cupom. */
    amountCents: integer("amount_cents").notNull(),
    currency: text("currency").notNull().default("BRL"),
    status: text("status", { enum: PAYMENT_STATUSES }).notNull().default("PAID"),
    /** "cakto", "hotmart", "manual", "cupom" ou "demo". */
    provider: text("provider").notNull(),
    /** ID da venda na plataforma (na Cakto, o id do pedido; na Hotmart, o código da transação). */
    providerRef: text("provider_ref"),
    /** ID da cobrança criada no gateway, quando o gateway usa uma (Cakto e Hotmart não usam). */
    providerCheckoutId: text("provider_checkout_id"),
    /** Link para o aluno continuar um pagamento que ficou pendente. */
    checkoutUrl: text("checkout_url"),
    /** "pix", "cartao", "boleto"… */
    method: text("method"),
    couponId: text("coupon_id").references(() => coupons.id, { onDelete: "set null" }),
    discountCents: integer("discount_cents").notNull().default(0),
    paidAt: timestamp("paid_at"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("payments_user_idx").on(t.userId),
    index("payments_status_idx").on(t.status),
    // O mesmo pagamento do gateway nunca é registrado duas vezes.
    uniqueIndex("payments_provider_ref_idx").on(t.provider, t.providerRef),
  ],
);

/* ------------------------------------------------------------------ */
/* Conteúdo: trilha > módulo > aula                                    */
/* ------------------------------------------------------------------ */

export const tracks = sqliteTable("tracks", {
  id: id(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  level: text("level", { enum: TRACK_LEVELS }).notNull().default("INICIANTE"),
  /** Chave do ícone (ver src/components/track-icon.tsx). */
  icon: text("icon").notNull().default("package"),
  /** Chave do tema de cor (ver src/lib/theme.ts). */
  color: text("color").notNull().default("violet"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: bool("published").notNull().default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const modules = sqliteTable(
  "modules",
  {
    id: id(),
    trackId: text("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    published: bool("published").notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("modules_track_idx").on(t.trackId)],
);

export const lessons = sqliteTable(
  "lessons",
  {
    id: id(),
    moduleId: text("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    summary: text("summary").notNull().default(""),
    videoUrl: text("video_url"),
    durationMinutes: integer("duration_minutes").notNull().default(5),
    /** "O que você vai aprender": aparece para todos, inclusive quem não assinou. */
    objectives: text("objectives", { mode: "json" })
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'`),
    /** Texto da aula em Markdown. */
    content: text("content").notNull().default(""),
    /** Aula liberada para quem está no plano grátis. */
    isFree: bool("is_free").notNull().default(false),
    xpReward: integer("xp_reward").notNull().default(10),
    sortOrder: integer("sort_order").notNull().default(0),
    published: bool("published").notNull().default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("lessons_module_idx").on(t.moduleId)],
);

export const lessonResources = sqliteTable(
  "lesson_resources",
  {
    id: id(),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    url: text("url").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("lesson_resources_lesson_idx").on(t.lessonId)],
);

export const lessonTasks = sqliteTable(
  "lesson_tasks",
  {
    id: id(),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("lesson_tasks_lesson_idx").on(t.lessonId)],
);

export const quizQuestions = sqliteTable(
  "quiz_questions",
  {
    id: id(),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    explanation: text("explanation").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("quiz_questions_lesson_idx").on(t.lessonId)],
);

export const quizOptions = sqliteTable(
  "quiz_options",
  {
    id: id(),
    questionId: text("question_id")
      .notNull()
      .references(() => quizQuestions.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    isCorrect: bool("is_correct").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("quiz_options_question_idx").on(t.questionId)],
);

/* ------------------------------------------------------------------ */
/* Progresso do aluno                                                  */
/* ------------------------------------------------------------------ */

export const lessonProgress = sqliteTable(
  "lesson_progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at")
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] })],
);

export const userTasks = sqliteTable(
  "user_tasks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    taskId: text("task_id")
      .notNull()
      .references(() => lessonTasks.id, { onDelete: "cascade" }),
    doneAt: timestamp("done_at")
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.userId, t.taskId] })],
);

export const quizAttempts = sqliteTable(
  "quiz_attempts",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    total: integer("total").notNull(),
    passed: bool("passed").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("quiz_attempts_user_lesson_idx").on(t.userId, t.lessonId)],
);

export const notes = sqliteTable(
  "notes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    content: text("content").notNull().default(""),
    updatedAt: updatedAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] })],
);

export const comments = sqliteTable(
  "comments",
  {
    id: id(),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("comments_lesson_idx").on(t.lessonId)],
);

export const userAchievements = sqliteTable(
  "user_achievements",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** Chave da conquista (ver src/lib/gamification.ts). */
    key: text("key").notNull(),
    unlockedAt: timestamp("unlocked_at")
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.userId, t.key] })],
);

export const certificates = sqliteTable(
  "certificates",
  {
    /** Código público de verificação. */
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    trackId: text("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    /** Cópias do momento da emissão, para o certificado não mudar depois. */
    userName: text("user_name").notNull(),
    trackTitle: text("track_title").notNull(),
    totalMinutes: integer("total_minutes").notNull().default(0),
    issuedAt: timestamp("issued_at")
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [uniqueIndex("certificates_user_track_idx").on(t.userId, t.trackId)],
);

/* ------------------------------------------------------------------ */
/* Relações (usadas pelo db.query)                                     */
/* ------------------------------------------------------------------ */

export const tracksRelations = relations(tracks, ({ many }) => ({
  modules: many(modules),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  track: one(tracks, { fields: [modules.trackId], references: [tracks.id] }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, { fields: [lessons.moduleId], references: [modules.id] }),
  resources: many(lessonResources),
  tasks: many(lessonTasks),
  questions: many(quizQuestions),
}));

export const lessonResourcesRelations = relations(lessonResources, ({ one }) => ({
  lesson: one(lessons, { fields: [lessonResources.lessonId], references: [lessons.id] }),
}));

export const lessonTasksRelations = relations(lessonTasks, ({ one }) => ({
  lesson: one(lessons, { fields: [lessonTasks.lessonId], references: [lessons.id] }),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one, many }) => ({
  lesson: one(lessons, { fields: [quizQuestions.lessonId], references: [lessons.id] }),
  options: many(quizOptions),
}));

export const quizOptionsRelations = relations(quizOptions, ({ one }) => ({
  question: one(quizQuestions, { fields: [quizOptions.questionId], references: [quizQuestions.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
  plan: one(plans, { fields: [subscriptions.planId], references: [plans.id] }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  lesson: one(lessons, { fields: [comments.lessonId], references: [lessons.id] }),
}));

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export type User = typeof users.$inferSelect;
export type Plan = typeof plans.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
export type Track = typeof tracks.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type LessonResource = typeof lessonResources.$inferSelect;
export type LessonTask = typeof lessonTasks.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type QuizOption = typeof quizOptions.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
