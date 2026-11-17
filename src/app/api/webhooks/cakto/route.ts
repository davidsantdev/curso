import { revalidatePath } from "next/cache";
import { settleSaleEvent } from "@/lib/checkout";
import { caktoEnabled, readCaktoEvents, verifyCaktoRequest } from "@/lib/payments/cakto";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * Aviso de venda da Cakto (webhook).
 *
 * Cadastre o webhook na Cakto (painel ou API pública) com:
 *   URL:      https://seudominio.com.br/api/webhooks/cakto
 *   Produtos: o curso
 *   Eventos:  purchase_approved, refund, chargeback e subscription_canceled
 * A chave secreta do webhook vai na variável CAKTO_WEBHOOK_SECRET.
 *
 * Aviso sem assinatura válida é recusado: ninguém consegue liberar um plano inventando uma venda.
 *
 * Respostas: 200 = recebido (inclusive avisos que não mudam nada); 401 = assinatura inválida;
 *            500 = erro nosso. A Cakto NÃO reenvia sozinha depois de um erro: reenvie o evento pelo painel
 *            ou pela API ("Reenviar evento") — o processamento é idempotente, reenviar não libera em dobro.
 */
export async function POST(request: Request): Promise<Response> {
  if (!caktoEnabled()) return new Response("Cakto não configurada", { status: 404 });

  const limit = rateLimit(`cakto-webhook:${await clientIp()}`, 240, 60_000);
  if (!limit.ok) return new Response("Muitas requisições", { status: 429 });

  // A assinatura é calculada sobre o corpo exatamente como chegou, então lemos o texto antes do JSON.
  const rawBody = await request.text();
  let body: unknown = null;
  try {
    body = JSON.parse(rawBody);
  } catch {
    body = null;
  }

  const authentic = verifyCaktoRequest({
    signature: request.headers.get("x-cakto-signature"),
    timestamp: request.headers.get("x-cakto-timestamp"),
    rawBody,
    bodySecret: body && typeof body === "object" ? (body as { secret?: unknown }).secret : null,
  });
  if (!authentic) return new Response("Assinatura inválida", { status: 401 });

  const events = readCaktoEvents(body);
  if (events.length === 0) return Response.json({ received: true, ignored: "formato não reconhecido" });

  try {
    const results = [];
    for (const event of events) results.push(await settleSaleEvent(event));
    if (results.some((result) => result === "activated" || result === "refunded")) revalidatePath("/", "layout");
    return Response.json({ received: true, event: events[0].event, result: results.length === 1 ? results[0] : results });
  } catch (error) {
    console.error(`[webhook cakto] Falha ao processar ${events[0].event} ${events[0].orderId ?? ""}:`, error);
    return new Response("Erro ao processar", { status: 500 });
  }
}
