"use server";

import { and, count, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser } from "@/lib/auth/dal";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { destroySession, destroyUserSessions } from "@/lib/auth/session";
import { field, rawField, zodErrors, type FormState } from "@/lib/forms";
import { rateLimit } from "@/lib/rate-limit";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Informe o seu nome").max(80, "O nome é longo demais"),
  email: z.string().trim().toLowerCase().pipe(z.email("Informe um e-mail válido")),
});

export async function updateProfileAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();

  const raw = { name: field(formData, "name"), email: field(formData, "email") };
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, errors: zodErrors(parsed.error), values: raw };

  const { name, email } = parsed.data;

  const [taken] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, email), ne(users.id, user.id)))
    .limit(1);
  if (taken) return { ok: false, errors: { email: "Este e-mail já está em uso por outra conta." }, values: raw };

  await db.update(users).set({ name, email, updatedAt: new Date() }).where(eq(users.id, user.id));

  revalidatePath("/", "layout");
  return { ok: true, message: "Dados atualizados." };
}

export async function changePasswordAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();

  const current = rawField(formData, "current");
  const password = rawField(formData, "password");
  const confirmation = rawField(formData, "confirmation");

  if (password.length < 8) return { ok: false, errors: { password: "A senha precisa ter pelo menos 8 caracteres" } };
  if (password.length > 200) return { ok: false, errors: { password: "A senha é longa demais" } };
  if (password !== confirmation) return { ok: false, errors: { confirmation: "As senhas não são iguais" } };

  const [row] = await db.select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, user.id)).limit(1);
  if (!row || !(await verifyPassword(current, row.passwordHash))) {
    return { ok: false, errors: { current: "A senha atual não confere" } };
  }

  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password), updatedAt: new Date() })
    .where(eq(users.id, user.id));

  // Desconecta os outros aparelhos; este continua logado.
  await destroyUserSessions(user.id, { keepCurrent: true });

  return { ok: true, message: "Senha alterada. Os outros aparelhos foram desconectados." };
}

/**
 * Exclui a conta e tudo o que está ligado a ela (progresso, anotações, comentários,
 * certificados e assinatura). Os pagamentos ficam no histórico financeiro, sem o vínculo com a pessoa.
 */
export async function deleteAccountAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();

  const limit = rateLimit(`delete-account:${user.id}`, 5, 10 * 60_000);
  if (!limit.ok) return { ok: false, message: "Muitas tentativas. Aguarde alguns minutos e tente de novo." };

  const [row] = await db.select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, user.id)).limit(1);
  if (!row || !(await verifyPassword(rawField(formData, "password"), row.passwordHash))) {
    return { ok: false, errors: { password: "A senha não confere" } };
  }

  if (user.isAdmin) {
    const [{ total }] = await db.select({ total: count() }).from(users).where(eq(users.role, "ADMIN"));
    if (total <= 1) {
      return {
        ok: false,
        message: "Você é o único administrador. Torne outra conta administradora antes de excluir esta.",
      };
    }
  }

  await destroySession();
  await db.delete(users).where(eq(users.id, user.id));

  redirect("/entrar?aviso=conta-excluida");
}
