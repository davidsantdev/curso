/**
 * Regras de gamificação: níveis, XP e conquistas.
 * Arquivo "puro" (sem banco) — pode ser importado no servidor e no navegador.
 */

export const QUIZ_PASS_PERCENT = 70;
export const QUIZ_BONUS_XP = 5;

/* ------------------------------ Níveis ------------------------------ */

export const LEVELS = [
  { min: 0, name: "Curioso" },
  { min: 50, name: "Aprendiz" },
  { min: 150, name: "Vendedor" },
  { min: 300, name: "Lojista" },
  { min: 500, name: "Estrategista" },
  { min: 800, name: "Escalador" },
  { min: 1200, name: "Mestre das Vendas" },
] as const;

export type LevelInfo = {
  number: number;
  name: string;
  /** XP que falta para o próximo nível (0 no nível máximo). */
  remaining: number;
  /** Percentual percorrido dentro do nível atual. */
  progress: number;
  nextName: string | null;
};

export function getLevel(xp: number): LevelInfo {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].min) index = i;
  }
  const current = LEVELS[index];
  const next = LEVELS[index + 1];

  if (!next) {
    return { number: index + 1, name: current.name, remaining: 0, progress: 100, nextName: null };
  }

  const span = next.min - current.min;
  return {
    number: index + 1,
    name: current.name,
    remaining: next.min - xp,
    progress: Math.round(((xp - current.min) / span) * 100),
    nextName: next.name,
  };
}

/* ---------------------------- Conquistas ---------------------------- */

export const ACHIEVEMENTS = [
  { key: "first-lesson", title: "Primeiro passo", description: "Conclua a sua primeira aula", icon: "rocket" },
  { key: "five-lessons", title: "Pegando ritmo", description: "Conclua 5 aulas", icon: "zap" },
  { key: "twenty-lessons", title: "Maratonista", description: "Conclua 20 aulas", icon: "medal" },
  { key: "first-module", title: "Módulo fechado", description: "Conclua um módulo inteiro", icon: "layers" },
  { key: "first-track", title: "Trilha completa", description: "Conclua todas as aulas de uma trilha", icon: "trophy" },
  { key: "quiz-ace", title: "Na mosca", description: "Acerte 100% de um quiz", icon: "target" },
  { key: "task-master", title: "Mão na massa", description: "Marque 10 tarefas práticas como feitas", icon: "list-checks" },
  { key: "streak-3", title: "Constância", description: "Estude 3 dias seguidos", icon: "flame" },
  { key: "streak-7", title: "Semana perfeita", description: "Estude 7 dias seguidos", icon: "calendar-check" },
  { key: "pro", title: "Agora é Pro", description: "Assine um plano e libere todo o conteúdo", icon: "crown" },
] as const;

export type AchievementKey = (typeof ACHIEVEMENTS)[number]["key"];
export type Achievement = (typeof ACHIEVEMENTS)[number];

const BY_KEY = new Map<string, Achievement>(ACHIEVEMENTS.map((a) => [a.key, a]));

export function getAchievement(key: string): Achievement | undefined {
  return BY_KEY.get(key);
}
