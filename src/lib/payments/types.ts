/**
 * Formato comum das vendas, qualquer que seja a plataforma de pagamento.
 * Cada integração (src/lib/payments/cakto.ts, hotmart.ts) traduz o aviso dela para isto,
 * e `settleSaleEvent` (src/lib/checkout.ts) aplica no banco.
 */

export type PaymentProvider = "cakto" | "hotmart";

export const PROVIDER_NAME: Record<PaymentProvider, string> = {
  cakto: "Cakto",
  hotmart: "Hotmart",
};

export type SaleKind =
  /** Pagamento aprovado: libera o plano. */
  | "approved"
  /** Reembolso, chargeback ou cancelamento depois de aprovado: retira o período daquela venda. */
  | "reverted"
  /** Assinatura cancelada na plataforma: o acesso vai até o fim do período já pago. */
  | "subscription-canceled"
  /** Não muda nada aqui (Pix gerado, boleto gerado, pedido de reembolso em análise…). */
  | "ignored";

export type SaleEvent = {
  provider: PaymentProvider;
  kind: SaleKind;
  /** Nome do evento na plataforma (para os registros). */
  event: string;
  /** Identifica a venda na plataforma (pedido da Cakto, transação da Hotmart). */
  orderId: string | null;
  /** Código da oferta: diz qual plano liberar. */
  offerCode: string | null;
  email: string | null;
  name: string | null;
  /** Valor pago, em centavos. */
  amountCents: number;
  currency: string;
  /** "pix", "cartao", "boleto"… */
  method: string | null;
  paidAt: Date | null;
  /** Id da conta do aluno, devolvido pela plataforma (mandamos no link de pagamento). */
  accountRef: string | null;
};

export type Buyer = { id: string; name: string; email: string };
