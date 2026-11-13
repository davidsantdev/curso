"use server";

import { and, eq, gt, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { site } from "@/config/site";
import { db } from "@/db";
import { passwordResets, users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession, destroyUserSessions, hashToken, newToken } from "@/lib/auth/session";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail, welcomeEmail } from "@/lib/email-templates";
import { field, rawField, zodErrors, type FormState } from "@/lib/forms";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { safeInternalPath } from "@/lib/utils";

const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Informe um e-mail válido"));

const passwordSchema = z
  .string()
  .min(8, "A senha precisa ter pelo menos 8 caracteres")
  .max(200, "A senha é longa demais");

const signupSchema = z.object({
  name: z.string().trim().min(2, "Informe o seu nome").max(80, "O nome é longo demais"),
  email: emailSchema,
  password: passwordSchema,
});

const tooManyAttempts = (minutes: number) =>
  `Muitas tentativas. Tente de novo em ${minutes} ${minutes === 1 ? "minuto" : "minutos"}.`;

/* ------------------------------ Cadastro ------------------------------ */

export async function signupAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const raw = {
    name: field(formData, "name"),
    email: field(formData, "email"),
    password: rawField(formData, "password"),
  };
  const values = { name: raw.name, email: raw.email };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, errors: zodErrors(parsed.error), values };

  const limit = rateLimit(`signup:${await clientIp()}`, 10, 60 * 60_000);
  if (!limit.ok) return { ok: false, message: tooManyAttempts(limit.retryAfterMinutes), values };

  const { name, email, password } = parsed.data;
  const emailTaken: FormState = {
    ok: false,
    errors: { email: "Já existe uma conta com este e-mail. Que tal entrar?" },
    values,
  };

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) return emailTaken;

  let userId: string;
  try {
    const [created] = await db
      .insert(users)
      .values({ name, email, passwordHash: await hashPassword(password) })
      .returning({ id: users.id });
    userId = created.id;
  } catch {
    // Dois cadastros simultâneos com o mesmo e-mail: o banco barra o segundo.
    return emailTaken;
  }

  await createSession(userId);

  // O e-mail de boas-vindas sai depois da resposta, para o cadastro não ficar esperando.
  after(() => sendEmail(welcomeEmail({ name, email })));

  redirect(safeInternalPath(field(formData, "next")) ?? "/painel");
}

/* -------------------------------- Login ------------------------------- */

export async function loginAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const email = field(formData, "email").toLowerCase();
  const password = rawField(formData, "password");
  const values = { email };

  if (!email || !password) return { ok: false, message: "Informe o e-mail e a senha.", values };

  const limit = rateLimit(`login:${await clientIp()}:${email}`, 8, 10 * 60_000);
  if (!limit.ok) return { ok: false, message: tooManyAttempts(limit.retryAfterMinutes), values };

  const [user] = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // Mesmo quando a conta não existe, fazemos o cálculo do hash:
  // assim o tempo de resposta não revela quais e-mails estão cadastrados.
  const valid = user ? await verifyPassword(password, user.passwordHash) : (await hashPassword(password), false);
  if (!user || !valid) return { ok: false, message: "E-mail ou senha incorretos.", values };

  await createSession(user.id);
  redirect(safeInternalPath(field(formData, "next")) ?? "/painel");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

/* -------------------------- Recuperar a senha ------------------------- */

export async function requestPasswordResetAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = emailSchema.safeParse(field(formData, "email"));
  if (!parsed.success) return { ok: false, errors: { email: "Informe um e-mail válido" } };

  const limit = rateLimit(`reset:${await clientIp()}`, 5, 60 * 60_000);
  if (!limit.ok) return { ok: false, message: tooManyAttempts(limit.retryAfterMinutes) };

  const email = parsed.data;
  const [user] = await db.select({ id: users.id, name: users.name }).from(users).where(eq(users.email, email)).limit(1);

  if (user) {
    const token = newToken();
    await db.insert(passwordResets).values({
      id: hashToken(token),
      userId: user.id,
      expiresAt: new Date(Date.now() + 60 * 60_000),
    });

    await sendEmail(passwordResetEmail({ name: user.name, email }, `${site.url}/redefinir-senha/${token}`));
  }

  // A resposta é a mesma exista ou não a conta (não revelamos quem está cadastrado).
  return {
    ok: true,
    message: "Se existir uma conta com este e-mail, enviamos um link para você criar uma nova senha.",
  };
}

export async function resetPasswordAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const token = field(formData, "token");
  const password = rawField(formData, "password");
  const confirmation = rawField(formData, "confirmation");

  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) return { ok: false, errors: { password: parsed.error.issues[0].message } };
  if (password !== confirmation) return { ok: false, errors: { confirmation: "As senhas não são iguais" } };

  const now = new Date();
  const [reset] = await db
    .select({ id: passwordResets.id, userId: passwordResets.userId })
    .from(passwordResets)
    .where(and(eq(passwordResets.id, hashToken(token)), isNull(passwordResets.usedAt), gt(passwordResets.expiresAt, now)))
    .limit(1);

  if (!reset) return { ok: false, message: "Este link expirou ou já foi usado. Peça um novo." };

  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password), updatedAt: now })
    .where(eq(users.id, reset.userId));
  await db.update(passwordResets).set({ usedAt: now }).where(eq(passwordResets.id, reset.id));

  // Quem estava logado com a senha antiga é desconectado.
  await destroyUserSessions(reset.userId);

  redirect("/entrar?aviso=senha-redefinida");
}
