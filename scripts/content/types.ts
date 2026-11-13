import type { TrackLevel } from "../../src/db/schema";

/** A primeira opção de cada pergunta é a correta (a ordem é embaralhada ao salvar). */
export type QuizSeed = { text: string; explanation: string; options: [string, ...string[]] };

export type LessonSeed = {
  title: string;
  summary: string;
  /** "O que você vai aprender" — aparece para todos, inclusive quem não assinou. */
  learn: string[];
  minutes?: number;
  /** Texto da aula em Markdown. */
  content?: string;
  tasks?: string[];
  quiz?: QuizSeed[];
};

export type ModuleSeed = { title: string; description: string; lessons: LessonSeed[] };

export type TrackSeed = {
  slug: string;
  title: string;
  description: string;
  level: TrackLevel;
  icon: string;
  color: string;
  /** Todas as aulas da trilha liberadas no plano grátis. */
  free?: boolean;
  modules: ModuleSeed[];
};
