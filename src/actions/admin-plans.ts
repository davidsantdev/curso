"use server";

import { and, eq, max, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { plans, PLAN_INTERVALS, type PlanInterval } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { checked, field, lines, rawField, type FormState } from "@/lib/forms";
import { parseMoneyToCents } from "@/lib/format";
import { slugify } from "@/lib/utils";

function isInterval(value: string): value is PlanInterval {
  return (PLAN_INTERVALS as readonly string[]).includes(value);
}

async function uniquePlanSlug(base: string, ignoreId?: string): Promise<string> {
  const root = base || "plano";
  for (let attempt = 1; attempt <= 50; attempt++) {
    const candidate = attempt === 1 ? root : `${root}-${attempt}`;
    const [taken] = await db
      .select({ id: plans.id })
      .from(plans)
      .where(ignoreId ? and(eq(plans.slug, candidate), ne(plans.id, ignoreId)) : eq(plans.slug, candidate))
      .limit(1);
    if (!taken) return candidate;
  }
  return `${root}-${Date.now()}`;
}

function readPlanForm(formData: FormData) {
  const raw = {
    name: field(formData, "name"),
    description: field(formData, "description"),
    price: field(formData, "price"),
    interval: field(formData, "interval"),
    features: rawField(formData, "features"),
    externalPriceId: field(formData, "externalPriceId"),
  };

  const errors: Record<string, string> = {};
  if (raw.name.length < 2) errors.name = "Dê um nome ao plano";
  if (raw.name.length > 60) errors.name = "O nome é longo demais";
  if (raw.description.length > 200) errors.description = "A descrição passou de 200 caracteres";

  const priceCents = parseMoneyToCents(raw.price);
  if (priceCents === null || priceCents < 100) errors.price = "Informe um valor a partir de R$ 1,00. Exemplo: 49,90";
  if (!isInterval(raw.interval)) errors.interval = "Escolha a recorrência";

  return { raw, errors, priceCents: priceCents ?? 0, interval: raw.interval as PlanInterval };
}

export async function createPlanAction(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const { raw, errors, priceCents, interval } = readPlanForm(formData);
  if (Object.keys(errors).length > 0) return { ok: false, errors, values: raw };

  const [{ last }] = await db.select({ last: max(plans.sortOrder) }).from(plans);

  await db.insert(plans).values({
    name: raw.name,
    slug: await uniquePlanSlug(slugify(raw.name)),
    description: raw.description,
    priceCents,
    interval,
    features: lines(raw.features).slice(0, 12),
    externalPriceId: raw.externalPriceId || null,
    // Nasce desativado: revise e ative quando quiser colocar à venda.
    active: false,
    sortOrder: (last ?? 0) + 1,
  });

  revalidatePath("/", "layout");
  return { ok: true, message: "Plano criado (desativado). Revise e ative para colocar à venda." };
}

export async function updatePlanAction(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const id = field(formData, "id");
  const { raw, errors, priceCents, interval } = readPlanForm(formData);
  if (Object.keys(errors).length > 0) return { ok: false, errors, values: raw };

  const [plan] = await db.select({ id: plans.id }).from(plans).where(eq(plans.id, id)).limit(1);
  if (!plan) return { ok: false, message: "Plano não encontrado." };

  await db
    .update(plans)
    .set({
      name: raw.name,
      description: raw.description,
      priceCents,
      interval,
      features: lines(raw.features).slice(0, 12),
      externalPriceId: raw.externalPriceId || null,
      highlighted: checked(formData, "highlighted"),
      active: checked(formData, "active"),
    })
    .where(eq(plans.id, id));

  revalidatePath("/", "layout");
  return { ok: true, message: "Plano salvo." };
}
