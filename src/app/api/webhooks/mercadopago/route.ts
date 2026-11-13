import { revalidatePath } from "next/cache";
import { settleMercadoPagoPayment } from "@/lib/checkout";
import { getPayment, mercadoPagoEnabled, MercadoPagoError, verifyWebhookSignature } from "@/lib/payments/mercadopago";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * Aviso de pagamento do Mercado Pago (webhook).
 *
 * O Mercado Pago chama esta rota sempre que um pagamento muda de situação.
 * Daqui usamos só o ID do pagamento: os dados de verdade são buscados na API
 * do Mercado Pago, com a nossa credencial. Assim, mesmo que alguém invente um
 * aviso, não consegue liberar um plano sem pagamento aprovado.
 *
 * Respostas: 200 = recebido (inclusive avisos que ignoramos);
 *            401 = assinatura inválida; 500 = erro nosso (o Mercado Pago tenta de novo).
 */
export async function POST(request: Request): Promise<Response> {
  if (!mercadoPagoEnabled()) return new Response("Mercado Pago não configurado", { status: 404 });

  const limit = rateLimit(`mp-webhook:${await clientIp()}`, 240, 60_000);
  if (!limit.ok) return new Response("Muitas requisições", { status: 429 });

  const url = new URL(request.url);
  const body = (await request.json().catch(() => null)) as {
    type?: string;
    topic?: string;
    data?: { id?: string | number };
  } | null;

  const queryDataId = url.searchParams.get("data.id");
  const type = url.searchParams.get("type") ?? body?.type ?? url.searchParams.get("topic") ?? body?.topic;
  const paymentId = queryDataId ?? (body?.data?.id != null ? String(body.data.id) : url.searchParams.get("id"));

  const signature = verifyWebhookSignature({
    signature: request.headers.get("x-signature"),
    requestId: request.headers.get("x-request-id"),
    dataId: queryDataId,
  });
  // Assinatura presente, mas errada: recusa. Aviso sem assinatura (o formato antigo, que o Mercado Pago ainda
  // envia em alguns casos) segue normalmente. É seguro: a situação do pagamento é sempre lida na API do
  // Mercado Pago com a nossa credencial, nunca do conteúdo do aviso.
  if (signature === "invalid") return new Response("Assinatura inválida", { status: 401 });

  if (type !== "payment" || !paymentId || !/^\d{1,30}$/.test(paymentId)) {
    return Response.json({ received: true, ignored: "evento não tratado" });
  }

  try {
    const payment = await getPayment(paymentId);
    const result = await settleMercadoPagoPayment(payment);
    if (result === "activated" || result === "refunded") revalidatePath("/", "layout");
    return Response.json({ received: true, result });
  } catch (error) {
    // Pagamento que não existe nesta conta (ex.: teste do painel do Mercado Pago): nada a fazer.
    if (error instanceof MercadoPagoError && error.status === 404) {
      return Response.json({ received: true, ignored: "pagamento não encontrado" });
    }
    console.error("[webhook mercadopago] Falha ao processar o aviso:", error);
    return new Response("Erro ao processar", { status: 500 });
  }
}
