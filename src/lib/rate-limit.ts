import "server-only";
import { headers } from "next/headers";

/**
 * Limite de tentativas em memória (janela deslizante).
 * Funciona bem com um único servidor. Em hospedagem serverless ou com várias
 * instâncias, troque por um armazenamento compartilhado (Redis/Upstash).
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterMinutes: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((time) => now - time < windowMs);

  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfterMinutes: Math.max(1, Math.ceil((windowMs - (now - hits[0])) / 60_000)) };
  }

  hits.push(now);
  buckets.set(key, hits);

  // Limpeza simples para o mapa não crescer para sempre.
  if (buckets.size > 5_000) {
    for (const [bucketKey, times] of buckets) {
      if (times.every((time) => now - time >= windowMs)) buckets.delete(bucketKey);
    }
  }

  return { ok: true, retryAfterMinutes: 0 };
}

export async function clientIp(): Promise<string> {
  const headerList = await headers();
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "local";
}
