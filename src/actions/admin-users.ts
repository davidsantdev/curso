"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { plans, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { hashPassword } from "@/lib/auth/password";
import { destroyUserSessions } from "@/lib/auth/session";
import { activateSubscription, revokeSubscription } from "@/lib/billing";
import { field, rawField, type FormState } from "@/lib/forms";
import { parseMoneyToCents } from "@/lib/format";

function refresh(userId: string) {
  revalidatePath("/admin/usuarios");
  revalidatePath(`/admin/usuarios/${userId}`);
  revalidatePath("/admin");
}

/** Libera (ou renova) o acesso pago manualmente — ex.: venda fechada por Pix ou WhatsApp. */
export async function grantAccessAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();

  const userId = field(formData, "userId");
  const planId = field(formData, "planId");
  const amountText = field(formData, "amount");

  const [[user], [plan]] = await Promise.all([
    db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1),
    db.select().from(plans).where(eq(plans.id, planId)).limit(1),
  ]);
  if (!user) return { ok: false, message: "Usuário não encontrado." };
  if (!plan) return { ok: false, errors: { planId: "Escolha um plano" } };

  let paidAmountCents: number | null = null;
  if (amountText) {
    paidAmountCents = parseMoneyToCents(amountText);
    if (paidAmountCents === null) {
      return { ok: false, errors: { amount: "Valor inválido. Exemplo: 49,90" }, values: { amount: amountText } };
    }
  }

  await activateSubscription({
    userId,
    plan,
    provider: "manual",
    providerRef: `manual_${Date.now()}_${admin.id}`,
    paidAmountCents,
  });

  refresh(userId);
  return { ok: true, message: `Acesso liberado no plano ${plan.name}.` };
}

export async function revokeAccessAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const userId = field(formData, "userId");
  await revokeSubscription(userId);
  refresh(userId);
}

export async function setUserRoleAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const userId = field(formData, "userId");
  const role = field(formData, "role") === "ADMIN" ? "ADMIN" : "USER";

  // Ninguém tira o próprio acesso de administrador (evita ficar sem nenhum admin).
  if (userId === admin.id) return;

  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));
  refresh(userId);
}

/** Define uma senha nova para o aluno (para quem não consegue usar o "esqueci minha senha"). */
export async function setUserPasswordAction(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const userId = field(formData, "userId");
  const password = rawField(formData, "password");

  if (password.length < 8) return { ok: false, errors: { password: "A senha precisa ter pelo menos 8 caracteres" } };
  if (password.length > 200) return { ok: false, errors: { password: "A senha é longa demais" } };

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return { ok: false, message: "Usuário não encontrado." };

  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password), updatedAt: new Date() })
    .where(eq(users.id, userId));
  await destroyUserSessions(userId);

  return { ok: true, message: "Senha redefinida. Passe a nova senha para o aluno por um canal seguro." };
}
