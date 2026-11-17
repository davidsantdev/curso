import { revalidatePath } from "next/cache";
import { settleSaleEvent } from "@/lib/checkout";
import { hotmartEnabled, hotmartProductId, readHotmartEvent, verifyHottok } from "@/lib/payments/hotmart";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * Aviso de venda da Hotmart (webhook 2.0.0). Fica desligado enquanto HOTMART_HOTTOK não estiver definido —
 * hoje a plataforma principal é a Cakto; esta rota existe para religar a Hotmart (ex.: para usar a rede de
 * afiliados dela) sem reescrever nada.
 *
 * Configure em Hotmart → Ferramentas → Webhook (API e notificações):
 *   URL:     https://seudominio.com.br/api/webhooks/hotmart
 *   Versão:  2.0.0
 *   Eventos: Compra aprovada, Compra completa, Compra reembolsada, Chargeback, Compra cancelada
 *            e Cancelamento de assinatura.
 * O "hottok" da conta (aba Autenticação) vai na variável HOTMART_HOTTOK.
 *
 * Respostas: 200 = recebido; 401 = hottok inválido; 500 = erro nosso (a Hotmart tenta de novo).
 */
export async function POST(request: Request): Promise<Response> {
  if (!hotmartEnabled()) return new Response("Hotmart não configurada", { status: 404 });

  const limit = rateLimit(`hotmart-webhook:${await clientIp()}`, 240, 60_000);
  if (!limit.ok) return new Response("Muitas requisições", { status: 429 });

  const body: unknown = await request.json().catch(() => null);
  // A versão 2.0.0 manda o hottok no cabeçalho; a antiga mandava no corpo.
  const hottok =
    request.headers.get("x-hotmart-hottok") ??
    (body && typeof body === "object" ? (body as { hottok?: unknown }).hottok : null);
  if (!verifyHottok(hottok)) return new Response("Hottok inválido", { status: 401 });

  const event = readHotmartEvent(body);
  if (!event) return Response.json({ received: true, ignored: "formato não reconhecido" });

  // Webhook configurado para a conta inteira: ignora vendas de outros produtos.
  const productId = process.env.HOTMART_PRODUCT_ID?.trim();
  const eventProduct = hotmartProductId(body);
  if (productId && eventProduct && eventProduct !== productId) {
    return Response.json({ received: true, ignored: "outro produto" });
  }

  try {
    const result = await settleSaleEvent(event);
    if (result === "activated" || result === "refunded") revalidatePath("/", "layout");
    return Response.json({ received: true, event: event.event, result });
  } catch (error) {
    console.error(`[webhook hotmart] Falha ao processar ${event.event} ${event.orderId ?? ""}:`, error);
    return new Response("Erro ao processar", { status: 500 });
  }
}
