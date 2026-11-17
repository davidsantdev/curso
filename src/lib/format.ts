import { site } from "@/config/site";
import type { PaymentStatus, PlanInterval, TrackLevel } from "@/db/schema";

const LOCALE = "pt-BR";
const money = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "BRL" });
const shortDate = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: site.timeZone,
});
const longDate = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: site.timeZone,
});
const dayKeyFormat = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: site.timeZone,
});

/** 4990 → "R$ 49,90" */
export const formatMoney = (cents: number) => money.format(cents / 100);

/** "13 de nov. de 2026" */
export const formatDate = (date: Date) => shortDate.format(date);

/** "13 de novembro de 2026" */
export const formatDateLong = (date: Date) => longDate.format(date);

/** 95 → "1h 35min" */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}min` : `${hours}h`;
}

/** Dia no fuso do site, no formato AAAA-MM-DD (usado na sequência de estudos). */
export function dayKey(date: Date = new Date()): string {
  return dayKeyFormat.format(date);
}

/** Dia anterior a uma chave AAAA-MM-DD. */
export function previousDayKey(key: string): string {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

/** plural(1, "aula", "aulas") → "1 aula" */
export function plural(count: number, singular: string, pluralForm: string): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

export const INTERVAL_LABEL: Record<PlanInterval, { suffix: string; name: string; access: string }> = {
  MONTH: { suffix: "/mês", name: "Mensal", access: "1 mês de acesso" },
  YEAR: { suffix: "/ano", name: "Anual", access: "1 ano de acesso" },
  LIFETIME: { suffix: " uma vez", name: "Vitalício", access: "Acesso vitalício" },
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  PAID: "Pago",
  PENDING: "Aguardando pagamento",
  FAILED: "Não aprovado",
  REFUNDED: "Reembolsado",
};

const PROVIDER_LABEL: Record<string, string> = {
  cakto: "Cakto",
  hotmart: "Hotmart",
  mercadopago: "Mercado Pago",
  manual: "Liberado pela equipe",
  cupom: "Cupom",
  demo: "Demonstração",
};

const METHOD_LABEL: Record<string, string> = {
  pix: "Pix",
  cartao: "Cartão",
  boleto: "Boleto",
  paypal: "PayPal",
  picpay: "PicPay",
  debito: "Débito",
  saldo: "Saldo Mercado Pago",
};

/** Como o pagamento foi feito: "Pix", "Cartão", "Liberado pela equipe"… */
export function paymentWayLabel(provider: string, method?: string | null): string {
  if (method && METHOD_LABEL[method]) return METHOD_LABEL[method];
  return PROVIDER_LABEL[provider] ?? provider;
}

export const LEVEL_LABEL: Record<TrackLevel, string> = {
  INICIANTE: "Iniciante",
  INTERMEDIARIO: "Intermediário",
  AVANCADO: "Avançado",
};

/** "49,90" | "1.234,56" | "49.9" → centavos. Retorna null se não for um valor válido. */
export function parseMoneyToCents(input: string): number | null {
  const cleaned = input.replace(/[^\d.,]/g, "");
  if (!cleaned) return null;
  const normalized = cleaned.includes(",") ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned;
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

/** 4990 → "49,90" (para preencher campos de formulário) */
export function centsToInput(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}
