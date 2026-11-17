"use server";

import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { normalizeCouponCode } from "@/lib/checkout";
import { field, type FormState } from "@/lib/forms";

/* -------------------------------- Cupons ------------------------------- */

/**
 * Cupons de cortesia: liberam o plano sem pagar (parcerias, criadores de conteúdo, presentes).
 * Descontos parciais são criados na Cakto, que é onde o pagamento acontece.
 */
export async function createCouponAction(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const values = {
    code: field(formData, "code"),
    maxRedemptions: field(formData, "maxRedemptions"),
    expiresAt: field(formData, "expiresAt"),
  };
  const errors: Record<string, string> = {};

  const code = normalizeCouponCode(values.code);
  if (code.length < 3) errors.code = "Use pelo menos 3 letras ou números, sem espaços.";
  const percentOff = 100;

  let maxRedemptions: number | null = null;
  if (values.maxRedemptions) {
    maxRedemptions = Number(values.maxRedemptions);
    if (!Number.isInteger(maxRedemptions) || maxRedemptions < 1) errors.maxRedemptions = "Informe um número a partir de 1.";
  }

  let expiresAt: Date | null = null;
  if (values.expiresAt) {
    // O cupom vale até o fim do dia escolhido, no horário de Brasília.
    expiresAt = /^\d{4}-\d{2}-\d{2}$/.test(values.expiresAt) ? new Date(`${values.expiresAt}T23:59:59-03:00`) : null;
    if (!expiresAt || Number.isNaN(expiresAt.getTime())) errors.expiresAt = "Data inválida.";
    else if (expiresAt <= new Date()) errors.expiresAt = "Escolha uma data a partir de hoje.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, message: "Revise os campos destacados.", errors, values };

  const [existing] = await db.select({ id: coupons.id }).from(coupons).where(eq(coupons.code, code)).limit(1);
  if (existing) return { ok: false, errors: { code: "Já existe um cupom com este código." }, values };

  await db.insert(coupons).values({ code, percentOff, maxRedemptions, expiresAt });

  revalidatePath("/admin/cupons");
  return { ok: true, message: `Cupom ${code} criado.` };
}

/** Liga ou desliga um cupom (desligado, ele deixa de ser aceito no checkout). */
export async function toggleCouponAction(formData: FormData): Promise<void> {
  await requireAdmin();
  await db
    .update(coupons)
    .set({ active: not(coupons.active) })
    .where(eq(coupons.id, field(formData, "couponId")));
  revalidatePath("/admin/cupons");
}

export async function deleteCouponAction(formData: FormData): Promise<void> {
  await requireAdmin();
  // Os pagamentos que usaram o cupom continuam no histórico (o vínculo fica vazio).
  await db.delete(coupons).where(eq(coupons.id, field(formData, "couponId")));
  revalidatePath("/admin/cupons");
}
