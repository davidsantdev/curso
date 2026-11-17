import "server-only";
import { timingSafeEqual } from "node:crypto";
import type { Buyer, SaleEvent, SaleKind } from "./types";

/**
 * HOTMART
 * -------
 * A Hotmart cobra (Pix, cartão, boleto), cuida de afiliados e reembolsos e avisa esta plataforma a cada
 * venda por webhook (Hotmart → Ferramentas → Webhook, versão 2.0.0). O aluno estuda aqui, na plataforma.
 * Quem libera ou corta o acesso é `settleSaleEvent`, em src/lib/checkout.ts.
 * (Hoje a plataforma principal é a Cakto; a Hotmart fica pronta para ser religada com HOTMART_HOTTOK.)
 *
 * Segurança: todo aviso traz o "hottok" da sua conta (cabeçalho X-HOTMART-HOTTOK). Aviso sem o hottok
 * certo é recusado, então ninguém consegue inventar uma venda.
 */

export function hotmartEnabled(): boolean {
  return Boolean(process.env.HOTMART_HOTTOK?.trim());
}

/** Compara o hottok recebido com o configurado, em tempo constante. */
export function verifyHottok(received: unknown): boolean {
  const expected = process.env.HOTMART_HOTTOK?.trim();
  if (!expected || typeof received !== "string" || !received.trim()) return false;
  const given = Buffer.from(received.trim());
  const wanted = Buffer.from(expected);
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}

/* ------------------------------------------------------------------ */
/* Link de pagamento                                                   */
/* ------------------------------------------------------------------ */

export type HotmartLink = { url: string; offerCode: string | null };

/**
 * Valida o link de pagamento colado no admin, por exemplo
 * https://pay.hotmart.com/A12345678B?off=abc123 — o `off` é o código da oferta, que identifica o plano.
 */
export function parseHotmartLink(input: string | null | undefined): HotmartLink | null {
  if (!input) return null;
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "pay.hotmart.com") return null;
  if (!/^\/[A-Za-z0-9]{5,20}\/?$/.test(url.pathname)) return null;
  const offerCode = url.searchParams.get("off")?.trim() || null;
  return { url: url.toString(), offerCode };
}

/**
 * Link de pagamento com o nome e o e-mail do aluno já preenchidos. O id da conta vai em `xcod`,
 * que a Hotmart devolve no aviso de venda: assim a compra cai na conta certa mesmo que o aluno
 * troque o e-mail no checkout.
 */
export function hotmartCheckoutUrl(link: string, buyer: Buyer): string {
  const url = new URL(link);
  url.searchParams.set("email", buyer.email);
  url.searchParams.set("name", buyer.name);
  url.searchParams.set("xcod", buyer.id);
  if (!url.searchParams.has("sck")) url.searchParams.set("sck", "plataforma");
  return url.toString();
}

/* ------------------------------------------------------------------ */
/* Aviso de venda (webhook 2.0.0)                                      */
/* ------------------------------------------------------------------ */

type Json = Record<string, unknown>;

const obj = (value: unknown): Json => (value && typeof value === "object" && !Array.isArray(value) ? (value as Json) : {});

function str(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function num(value: unknown): number | null {
  const n = typeof value === "string" ? Number(value.replace(",", ".")) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

const KINDS: Record<string, SaleKind> = {
  PURCHASE_APPROVED: "approved",
  PURCHASE_COMPLETE: "approved",
  PURCHASE_REFUNDED: "reverted",
  PURCHASE_CHARGEBACK: "reverted",
  PURCHASE_CANCELED: "reverted",
  SUBSCRIPTION_CANCELLATION: "subscription-canceled",
};

const METHODS: Record<string, string> = {
  PIX: "pix",
  CREDIT_CARD: "cartao",
  BILLET: "boleto",
  PAYPAL: "paypal",
  GOOGLE_PAY: "cartao",
  DIRECT_DEBIT: "debito",
};

/** Id numérico do produto no aviso (para ignorar vendas de outros produtos da conta). */
export function hotmartProductId(body: unknown): string | null {
  return str(obj(obj(obj(body).data).product).id);
}

/** Lê o aviso da Hotmart de forma tolerante (campos ausentes viram null). Null se não for um aviso de evento. */
export function readHotmartEvent(body: unknown): SaleEvent | null {
  const root = obj(body);
  const event = str(root.event)?.toUpperCase();
  if (!event) return null;

  const data = obj(root.data);
  const purchase = obj(data.purchase);
  const buyer = obj(data.buyer);
  const subscriber = obj(obj(data.subscription).subscriber);
  const price = obj(purchase.price);
  const approved = num(purchase.approved_date);
  const value = num(price.value) ?? num(obj(purchase.full_price).value) ?? 0;
  const type = str(obj(purchase.payment).type)?.toUpperCase() ?? null;

  return {
    provider: "hotmart",
    kind: KINDS[event] ?? "ignored",
    event,
    orderId: str(purchase.transaction),
    offerCode: str(obj(purchase.offer).code),
    email: (str(buyer.email) ?? str(subscriber.email) ?? str(obj(data.subscriber).email))?.toLowerCase() ?? null,
    name: str(buyer.name) ?? str(subscriber.name) ?? str(obj(data.subscriber).name),
    amountCents: Math.max(0, Math.round(value * 100)),
    currency: (str(price.currency_value) ?? str(price.currency_code) ?? "BRL").toUpperCase(),
    method: type ? (METHODS[type] ?? type.toLowerCase()) : null,
    paidAt: approved ? new Date(approved) : null,
    accountRef: str(obj(purchase.origin).xcod),
  };
}
