import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userAchievements } from "@/db/schema";
import type { AchievementKey } from "@/lib/gamification";

/** Desbloqueia conquistas e devolve apenas as que o usuário ainda não tinha. */
export async function grantAchievements(userId: string, keys: AchievementKey[]): Promise<AchievementKey[]> {
  if (keys.length === 0) return [];

  const inserted = await db
    .insert(userAchievements)
    .values(keys.map((key) => ({ userId, key })))
    .onConflictDoNothing()
    .returning({ key: userAchievements.key });

  return inserted.map((row) => row.key as AchievementKey);
}

/** Conquistas do usuário: chave → data em que foi desbloqueada. */
export async function getUnlockedAchievements(userId: string): Promise<Map<string, Date>> {
  const rows = await db
    .select({ key: userAchievements.key, unlockedAt: userAchievements.unlockedAt })
    .from(userAchievements)
    .where(eq(userAchievements.userId, userId));

  return new Map(rows.map((row) => [row.key, row.unlockedAt]));
}
