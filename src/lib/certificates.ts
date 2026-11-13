import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { certificates } from "@/db/schema";

export async function listUserCertificates(userId: string) {
  return db.select().from(certificates).where(eq(certificates.userId, userId)).orderBy(desc(certificates.issuedAt));
}

/** Busca pública pelo código de verificação. */
export async function getCertificate(code: string) {
  if (!/^[A-Z0-9]{6,20}$/.test(code)) return null;
  const [certificate] = await db.select().from(certificates).where(eq(certificates.id, code)).limit(1);
  return certificate ?? null;
}
