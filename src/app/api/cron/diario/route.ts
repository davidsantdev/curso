import { timingSafeEqual } from "node:crypto";
import { and, eq, gt, isNotNull, isNull, lt, lte, ne, or } from "drizzle-orm";
import { db } from "@/db";
import { passwordResets, payments, plans, sessions, subscriptions, users } from "@/db/schema";
import { reconcilePayment } from "@/lib/checkout";
import { sendEmail } from "@/lib/email";
import { accessExpiringEmail } from "@/lib/email-templates";
import { mercadoPagoEnabled } from "@/lib/payments/mercadopago";

/**
 * Rotina diária. Deve ser chamada uma vez por dia por um agendador
 * (na Vercel, o arquivo vercel.json já agenda; em outro servidor, use o cron do sistema):
 *
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://seusite.com/api/cron/diario
 *
 * O que ela faz:
 *   1. avisa por e-mail quem tem o acesso terminando nos próximos 3 dias;
 *   2. confere no Mercado Pago os pagamentos que ainda estão aguardando
 *      (rede de segurança caso algum aviso automático se perca);
 *   3. encerra cobranças abandonadas há mais de 10 dias;
 *   4. apaga sessões e links de senha vencidos.
 */

export const maxDuration = 60;

const DAY_MS = 24 * 60 * 60 * 1000;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(request: Request): Promise<Response> {
  if (!process.env.CRON_SECRET?.trim()) return new Response("CRON_SECRET não configurado", { status: 503 });
  if (!authorized(request)) return new Response("Não autorizado", { status: 401 });

  const now = new Date();

  /* 1. Acessos terminando ------------------------------------------- */
  const expiring = await db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      planName: plans.name,
      planSlug: plans.slug,
      planActive: plans.active,
      accessUntil: subscriptions.currentPeriodEnd,
    })
    .from(subscriptions)
    .innerJoin(users, eq(users.id, subscriptions.userId))
    .innerJoin(plans, eq(plans.id, subscriptions.planId))
    .where(
      and(
        eq(subscriptions.status, "ACTIVE"),
        // Planos ativados no modo demonstração não recebem o aviso.
        ne(subscriptions.provider, "demo"),
        isNotNull(subscriptions.currentPeriodEnd),
        gt(subscriptions.currentPeriodEnd, now),
        lte(subscriptions.currentPeriodEnd, new Date(now.getTime() + 3 * DAY_MS)),
        // Um aviso por período: só envia se ainda não avisou sobre este vencimento.
        or(isNull(subscriptions.expiryNoticeFor), ne(subscriptions.expiryNoticeFor, subscriptions.currentPeriodEnd)),
      ),
    )
    .limit(200);

  let expiryNotices = 0;
  for (const row of expiring) {
    if (!row.accessUntil) continue;
    await sendEmail(
      accessExpiringEmail(row, {
        planName: row.planName,
        // Plano que saiu de venda: o botão leva para a página de planos, e não para um checkout que não existe mais.
        planSlug: row.planActive ? row.planSlug : null,
        accessUntil: row.accessUntil,
      }),
    );
    await db.update(subscriptions).set({ expiryNoticeFor: row.accessUntil }).where(eq(subscriptions.userId, row.userId));
    expiryNotices++;
  }

  /* 2. Pagamentos aguardando ---------------------------------------- */
  let reconciled = 0;
  let activated = 0;
  if (mercadoPagoEnabled()) {
    const waiting = await db
      .select({ id: payments.id })
      .from(payments)
      .where(
        and(
          eq(payments.provider, "mercadopago"),
          eq(payments.status, "PENDING"),
          gt(payments.createdAt, new Date(now.getTime() - 10 * DAY_MS)),
        ),
      )
      .limit(100);

    for (const payment of waiting) {
      try {
        if ((await reconcilePayment(payment.id)) === "activated") activated++;
        reconciled++;
      } catch (error) {
        console.error(`[cron] Falha ao conferir o pagamento ${payment.id}:`, error);
      }
    }
  }

  /* 3. Cobranças abandonadas ---------------------------------------- */
  const abandoned = await db
    .update(payments)
    .set({ status: "FAILED" })
    .where(and(eq(payments.status, "PENDING"), lt(payments.createdAt, new Date(now.getTime() - 10 * DAY_MS))))
    .returning({ id: payments.id });

  /* 4. Limpeza ------------------------------------------------------- */
  await db.delete(sessions).where(lt(sessions.expiresAt, now));
  await db.delete(passwordResets).where(lt(passwordResets.expiresAt, new Date(now.getTime() - DAY_MS)));

  return Response.json({
    ok: true,
    expiryNotices,
    paymentsChecked: reconciled,
    paymentsActivated: activated,
    paymentsClosed: abandoned.length,
  });
}
