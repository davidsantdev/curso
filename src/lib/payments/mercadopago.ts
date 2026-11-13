import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Cliente mínimo da API do Mercado Pago (Checkout Pro: Pix, cartão e boleto).
 *
 * Fluxo: criamos uma "preferência" com o valor → o aluno paga na página do
 * Mercado Pago → o Mercado Pago avisa o nosso webhook → buscamos o pagamento
 * na API (a fonte da verdade) e só então liberamos o plano.
 *
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro
 */

const API_URL = (process.env.MERCADOPAGO_API_URL || "https://api.mercadopago.com").replace(/\/+$/, "");

export function mercadoPagoEnabled(): boolean {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN?.trim());
}

export class MercadoPagoError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
  ) {
    super(`Mercado Pago respondeu ${status}`);
    this.name = "MercadoPagoError";
  }
}

async function request<T>(
  path: string,
  init: { method?: "GET" | "POST"; body?: unknown; idempotencyKey?: string } = {},
): Promise<T> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!token) throw new Error("MERCADOPAGO_ACCESS_TOKEN não está configurado.");

  const response = await fetch(`${API_URL}${path}`, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.idempotencyKey ? { "X-Idempotency-Key": init.idempotencyKey } : {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new MercadoPagoError(response.status, (await response.text().catch(() => "")).slice(0, 600));
  }
  return (await response.json()) as T;
}

/* ------------------------------------------------------------------ */
/* Cobrança                                                            */
/* ------------------------------------------------------------------ */

type PreferenceInput = {
  /** Nossa referência (id da linha em `payments`). Volta em todo aviso de pagamento. */
  reference: string;
  title: string;
  amountCents: number;
  payer: { email: string; name: string };
  /** Nome que aparece na fatura do cartão. */
  statementDescriptor: string;
  /** Para onde o aluno volta depois de pagar. `null` em endereço local (o Mercado Pago não aceita). */
  returnUrl: string | null;
  notificationUrl: string | null;
};

export async function createPreference(input: PreferenceInput): Promise<{ id: string; url: string }> {
  const [firstName, ...rest] = input.payer.name.trim().split(/\s+/);

  const preference = await request<{ id: string; init_point?: string; sandbox_init_point?: string }>(
    "/checkout/preferences",
    {
      method: "POST",
      idempotencyKey: input.reference,
      body: {
        items: [
          {
            id: input.reference,
            title: input.title,
            quantity: 1,
            currency_id: "BRL",
            unit_price: Math.round(input.amountCents) / 100,
          },
        ],
        payer: { email: input.payer.email, name: firstName, surname: rest.join(" ") || undefined },
        external_reference: input.reference,
        statement_descriptor: input.statementDescriptor,
        payment_methods: { installments: 12 },
        ...(input.returnUrl
          ? {
              back_urls: { success: input.returnUrl, pending: input.returnUrl, failure: input.returnUrl },
              auto_return: "approved",
            }
          : {}),
        ...(input.notificationUrl ? { notification_url: input.notificationUrl } : {}),
      },
    },
  );

  const url = preference.init_point || preference.sandbox_init_point;
  if (!preference.id || !url) throw new Error("O Mercado Pago não devolveu o link de pagamento.");
  return { id: preference.id, url };
}

/* ------------------------------------------------------------------ */
/* Consulta de pagamentos                                              */
/* ------------------------------------------------------------------ */

export type MercadoPagoPayment = {
  id: number | string;
  /** approved | pending | in_process | authorized | in_mediation | rejected | cancelled | refunded | charged_back */
  status: string;
  status_detail?: string | null;
  external_reference?: string | null;
  transaction_amount?: number | null;
  currency_id?: string | null;
  /** credit_card | debit_card | bank_transfer (Pix) | ticket (boleto) | account_money… */
  payment_type_id?: string | null;
  /** pix | visa | master | bolbradesco… */
  payment_method_id?: string | null;
  date_approved?: string | null;
};

export async function getPayment(paymentId: string): Promise<MercadoPagoPayment> {
  return request<MercadoPagoPayment>(`/v1/payments/${encodeURIComponent(paymentId)}`);
}

/** Todos os pagamentos (tentativas) feitos para uma referência nossa, do mais novo para o mais antigo. */
export async function searchPaymentsByReference(reference: string): Promise<MercadoPagoPayment[]> {
  const query = new URLSearchParams({
    external_reference: reference,
    sort: "date_created",
    criteria: "desc",
    limit: "20",
  });
  const data = await request<{ results?: MercadoPagoPayment[] }>(`/v1/payments/search?${query}`);
  return data.results ?? [];
}

/** "pix" | "cartao" | "boleto" | "saldo" — ou null quando ainda não se sabe. */
export function paymentMethodOf(payment: MercadoPagoPayment): string | null {
  if (payment.payment_method_id === "pix") return "pix";
  switch (payment.payment_type_id) {
    case "credit_card":
    case "debit_card":
    case "prepaid_card":
      return "cartao";
    case "ticket":
      return "boleto";
    case "bank_transfer":
      return "pix";
    case "account_money":
      return "saldo";
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Webhook                                                             */
/* ------------------------------------------------------------------ */

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Confere o cabeçalho `x-signature` do aviso.
 * O Mercado Pago assina o texto `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`
 * com HMAC-SHA256 usando a "assinatura secreta" do webhook.
 *
 *  - "valid":          assinatura confere;
 *  - "invalid":        veio assinatura, mas não confere (recuse o aviso);
 *  - "missing":        o aviso veio sem assinatura;
 *  - "not-configured": MERCADOPAGO_WEBHOOK_SECRET não foi definido.
 */
export function verifyWebhookSignature(input: {
  signature: string | null;
  requestId: string | null;
  dataId: string | null;
}): "valid" | "invalid" | "missing" | "not-configured" {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim();
  if (!secret) return "not-configured";
  if (!input.signature) return "missing";

  const parts = new Map(
    input.signature.split(",").map((part) => {
      const [key, ...value] = part.split("=");
      return [key.trim().toLowerCase(), value.join("=").trim()] as const;
    }),
  );
  const ts = parts.get("ts");
  const v1 = parts.get("v1");
  if (!ts || !v1) return "invalid";

  // A documentação pede o id em minúsculas quando ele tem letras; aceitamos as duas formas.
  const ids = input.dataId ? [...new Set([input.dataId, input.dataId.toLowerCase()])] : [null];

  for (const id of ids) {
    const manifest = `${id ? `id:${id};` : ""}${input.requestId ? `request-id:${input.requestId};` : ""}ts:${ts};`;
    const expected = createHmac("sha256", secret).update(manifest).digest("hex");
    if (safeEqual(expected, v1.toLowerCase())) return "valid";
  }
  return "invalid";
}
