import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { Buyer, SaleEvent, SaleKind } from "./types";

/**
 * CAKTO
 * -----
 * A Cakto cobra (Pix, cartão, boleto), cuida de afiliados e reembolsos e avisa esta plataforma a cada
 * venda por webhook. O aluno estuda aqui. Documentação: https://docs.cakto.com.br/conceitos/webhooks
 *
 * Segurança: cada aviso vem assinado (cabeçalho X-Cakto-Signature: v1=HMAC-SHA256 de "{timestamp}.{corpo}",
 * com a chave secreta do webhook) e com o horário do envio (X-Cakto-Timestamp). Recusamos assinatura errada
 * e aviso com mais de 5 minutos (para ninguém reaproveitar um aviso antigo). Sem o cabeçalho, vale o campo
 * `secret` do corpo, comparado com a mesma chave.
 */

export function caktoEnabled(): boolean {
  return Boolean(process.env.CAKTO_WEBHOOK_SECRET?.trim());
}

function sameText(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

const TOLERANCE_SECONDS = 5 * 60;

export function verifyCaktoRequest(input: {
  signature: string | null;
  timestamp: string | null;
  rawBody: string;
  bodySecret: unknown;
  nowSeconds?: number;
}): boolean {
  const secret = process.env.CAKTO_WEBHOOK_SECRET?.trim();
  if (!secret) return false;

  if (input.signature) {
    const timestamp = input.timestamp?.trim() ?? "";
    const seconds = Number(timestamp);
    const now = input.nowSeconds ?? Date.now() / 1000;
    if (!/^\d{9,12}$/.test(timestamp) || Math.abs(now - seconds) > TOLERANCE_SECONDS) return false;

    const expected = createHmac("sha256", secret).update(`${timestamp}.`).update(input.rawBody, "utf8").digest("hex");
    // Se um dia vier "v1=…,v2=…", comparamos só a versão que conhecemos.
    const v1 = input.signature
      .split(",")
      .map((part) => part.trim())
      .find((part) => part.startsWith("v1="))
      ?.slice(3);
    return Boolean(v1) && sameText(v1!.toLowerCase(), expected);
  }

  return typeof input.bodySecret === "string" && sameText(input.bodySecret.trim(), secret);
}

/* ------------------------------------------------------------------ */
/* Link de pagamento                                                   */
/* ------------------------------------------------------------------ */

export type CaktoLink = { url: string; offerCode: string };

/** Valida o link de pagamento da oferta (https://pay.cakto.com.br/abc123). O código no caminho é o id da oferta. */
export function parseCaktoLink(input: string | null | undefined): CaktoLink | null {
  if (!input) return null;
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "pay.cakto.com.br") return null;
  const match = url.pathname.match(/^\/([A-Za-z0-9_-]{4,40})\/?$/);
  if (!match) return null;
  return { url: url.toString(), offerCode: match[1] };
}

/**
 * Link de pagamento com o nome e o e-mail do aluno já preenchidos (parâmetros `name` e `email` da Cakto).
 * O id da conta vai em `sck`, que a Cakto devolve no aviso de venda; se não voltar, a venda é ligada pelo e-mail.
 */
export function caktoCheckoutUrl(link: string, buyer: Buyer): string {
  const url = new URL(link);
  url.searchParams.set("name", buyer.name);
  url.searchParams.set("email", buyer.email);
  url.searchParams.set("sck", buyer.id);
  return url.toString();
}

/* ------------------------------------------------------------------ */
/* Aviso de venda                                                      */
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
  purchase_approved: "approved",
  refund: "reverted",
  chargeback: "reverted",
  subscription_canceled: "subscription-canceled",
  // refund_requested: o pedido ainda pode ser contestado; quando o reembolso sai, chega "refund".
  // subscription_renewed: cada cobrança aprovada já chega como purchase_approved.
};

const METHODS: Record<string, string> = {
  pix: "pix",
  credit_card: "cartao",
  boleto: "boleto",
  picpay: "picpay",
  applepay: "cartao",
  googlepay: "cartao",
};

function readOrder(event: string, raw: unknown): SaleEvent {
  const data = obj(raw);
  const customer = obj(data.customer);
  const offer = obj(data.offer);
  const paidAt = str(data.paidAt);
  const paid = paidAt ? new Date(paidAt) : null;
  const method = str(data.paymentMethod)?.toLowerCase() ?? null;

  return {
    provider: "cakto",
    kind: KINDS[event] ?? "ignored",
    event,
    orderId: str(data.id),
    offerCode: str(offer.id),
    email: (str(customer.email) ?? str(data.customerEmail))?.toLowerCase() ?? null,
    name: str(customer.name) ?? str(data.customerName),
    amountCents: Math.max(0, Math.round((num(data.amount) ?? num(data.baseAmount) ?? num(offer.price) ?? 0) * 100)),
    currency: (str(data.currency) ?? str(offer.currency) ?? "BRL").toUpperCase(),
    method: method ? (METHODS[method] ?? method) : null,
    paidAt: paid && !Number.isNaN(paid.getTime()) ? paid : null,
    accountRef: str(data.sck),
  };
}

/** Lê o aviso da Cakto. Na versão 2 do webhook, `data` é uma lista de pedidos. */
export function readCaktoEvents(body: unknown): SaleEvent[] {
  const root = obj(body);
  const event = str(root.event)?.toLowerCase();
  if (!event) return [];
  const orders = Array.isArray(root.data) ? root.data : [root.data];
  return orders.map((order) => readOrder(event, order));
}
