import "server-only";
import { caktoCheckoutUrl, caktoEnabled, parseCaktoLink } from "./cakto";
import { hotmartCheckoutUrl, hotmartEnabled, parseHotmartLink } from "./hotmart";
import type { Buyer, PaymentProvider } from "./types";

/**
 * O link de pagamento de cada plano (Admin → Planos) diz em qual plataforma ele é vendido:
 * https://pay.cakto.com.br/… = Cakto · https://pay.hotmart.com/… = Hotmart.
 */
export type PaymentLink = { provider: PaymentProvider; url: string; offerCode: string | null };

export function parsePaymentLink(input: string | null | undefined): PaymentLink | null {
  const cakto = parseCaktoLink(input);
  if (cakto) return { provider: "cakto", ...cakto };
  const hotmart = parseHotmartLink(input);
  if (hotmart) return { provider: "hotmart", ...hotmart };
  return null;
}

/** A plataforma está configurada (tem a chave para conferir os avisos de venda)? */
export function providerReady(provider: PaymentProvider): boolean {
  return provider === "cakto" ? caktoEnabled() : hotmartEnabled();
}

/** Alguma plataforma de pagamento está configurada? */
export function anyProviderReady(): boolean {
  return caktoEnabled() || hotmartEnabled();
}

/** O link do plano só vende se a plataforma dele estiver configurada (senão a venda não seria liberada). */
export function sellableLink(input: string | null | undefined): PaymentLink | null {
  const link = parsePaymentLink(input);
  return link && providerReady(link.provider) ? link : null;
}

/** Link de pagamento com os dados do aluno já preenchidos. */
export function personalizedCheckoutUrl(link: PaymentLink, buyer: Buyer): string {
  return link.provider === "cakto" ? caktoCheckoutUrl(link.url, buyer) : hotmartCheckoutUrl(link.url, buyer);
}
