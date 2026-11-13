import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { plans, subscriptions, type PlanInterval, type Role, type SubscriptionStatus } from "@/db/schema";
import { dayKey, previousDayKey } from "@/lib/format";
import { readSessionUser } from "./session";

export type CurrentSubscription = {
  planId: string;
  planName: string;
  planSlug: string;
  interval: PlanInterval;
  priceCents: number;
  status: SubscriptionStatus;
  provider: string;
  currentPeriodEnd: Date | null;
  /** Dentro do período pago (ou vitalício). */
  active: boolean;
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isAdmin: boolean;
  /** Tem acesso ao conteúdo pago (assinatura ativa ou administrador). */
  isPremium: boolean;
  xp: number;
  /** Sequência de dias estudando — já zerada se o aluno perdeu um dia. */
  streak: number;
  longestStreak: number;
  createdAt: Date;
  subscription: CurrentSubscription | null;
};

export function isSubscriptionActive(
  subscription: { status: SubscriptionStatus; currentPeriodEnd: Date | null } | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!subscription || subscription.status !== "ACTIVE") return false;
  return subscription.currentPeriodEnd === null || subscription.currentPeriodEnd > now;
}

/**
 * Usuário logado (ou null). O `cache` evita repetir as consultas quando
 * várias partes da mesma página pedem o usuário.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const user = await readSessionUser();
  if (!user) return null;

  const [row] = await db
    .select({ subscription: subscriptions, plan: plans })
    .from(subscriptions)
    .innerJoin(plans, eq(plans.id, subscriptions.planId))
    .where(eq(subscriptions.userId, user.id))
    .limit(1);

  const subscription: CurrentSubscription | null = row
    ? {
        planId: row.plan.id,
        planName: row.plan.name,
        planSlug: row.plan.slug,
        interval: row.plan.interval,
        priceCents: row.plan.priceCents,
        status: row.subscription.status,
        provider: row.subscription.provider,
        currentPeriodEnd: row.subscription.currentPeriodEnd,
        active: isSubscriptionActive(row.subscription),
      }
    : null;

  const today = dayKey();
  const streakAlive = user.lastActiveDay === today || user.lastActiveDay === previousDayKey(today);
  const isAdmin = user.role === "ADMIN";

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isAdmin,
    isPremium: isAdmin || Boolean(subscription?.active),
    xp: user.xp,
    streak: streakAlive ? user.currentStreak : 0,
    longestStreak: user.longestStreak,
    createdAt: user.createdAt,
    subscription,
  };
});

/** Para páginas e actions que exigem login. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");
  return user;
}

/** Para páginas e actions exclusivas da administração. */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (!user.isAdmin) redirect("/painel");
  return user;
}
