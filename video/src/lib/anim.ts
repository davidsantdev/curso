import { Easing, interpolate } from "remotion";
import { FPS } from "./tempo";

/** Saída rápida e pouso suave (expo-out): o padrão de todas as entradas. */
export const SAIDA = Easing.bezier(0.16, 1, 0.3, 1);
/** Começo lento e final rápido: para saídas de cena. */
export const ENTRADA = Easing.bezier(0.7, 0, 0.84, 0);
/** Suave nas duas pontas: para linhas, contadores e mudanças de estado. */
export const SUAVE = Easing.bezier(0.65, 0, 0.35, 1);

/** Progresso de 0 a 1 entre os segundos `inicio` e `inicio + duracao` (tempo absoluto do vídeo). */
export function prog(frame: number, inicio: number, duracao: number, easing: (t: number) => number = SAIDA) {
  const a = inicio * FPS;
  const b = (inicio + Math.max(duracao, 1 / FPS)) * FPS;
  return interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
}

export const entre = (a: number, b: number, t: number) => a + (b - a) * t;
export const limitar = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
