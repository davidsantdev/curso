"use client";

import { toast } from "@/components/toaster";
import { getAchievement, type AchievementKey } from "@/lib/gamification";

/** Um aviso para cada conquista desbloqueada. */
export function announceAchievements(keys: AchievementKey[]) {
  for (const key of keys) {
    const achievement = getAchievement(key);
    if (!achievement) continue;
    toast({ tone: "celebrate", title: `Conquista desbloqueada: ${achievement.title}`, description: achievement.description });
  }
}
