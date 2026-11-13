import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, lt, ne } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { SESSION_COOKIE as COOKIE_NAME } from "./constants";

const SESSION_DAYS = 30;

/** No banco fica só o hash: mesmo que alguém leia a tabela, não consegue usar a sessão. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function newToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function createSession(userId: string): Promise<void> {
  const token = newToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  // Aproveita para limpar sessões vencidas deste usuário.
  await db.delete(sessions).where(and(eq(sessions.userId, userId), lt(sessions.expiresAt, new Date())));
}

/** Usuário dono do cookie de sessão atual, ou null. */
export async function readSessionUser() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  const [row] = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, hashToken(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);

  return row?.user ?? null;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  cookieStore.delete(COOKIE_NAME);
}

/** Encerra as sessões do usuário. Com `keepCurrent`, mantém a do navegador atual. */
export async function destroyUserSessions(userId: string, options: { keepCurrent?: boolean } = {}): Promise<void> {
  const token = options.keepCurrent ? (await cookies()).get(COOKIE_NAME)?.value : undefined;

  await db
    .delete(sessions)
    .where(token ? and(eq(sessions.userId, userId), ne(sessions.id, hashToken(token))) : eq(sessions.userId, userId));
}
