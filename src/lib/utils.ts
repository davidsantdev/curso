/** Junta classes CSS ignorando valores vazios. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** "Tráfego Pago na Prática" → "trafego-pago-na-pratica" */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Iniciais para o avatar: "Maria Clara Souza" → "MS" */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/** Só aceita caminhos internos (evita redirecionar para outro site após o login). */
export function safeInternalPath(path: string | null | undefined): string | null {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return null;
  return path;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Evita palavra de uma letra sozinha na linha (como "o", "a", "e", "é"): ela fica presa à palavra seguinte
 * por um espaço que não quebra. Uma palavra curta no fim do texto fica presa à anterior.
 */
export function keepShortWordsTogether(text: string): string {
  const NBSP = "\u00a0";
  return text.replace(/(?<=^|\s)([aeoáàéêóô])\s+/giu, `$1${NBSP}`).replace(/\s+(\S{1,2})$/u, `${NBSP}$1`);
}
