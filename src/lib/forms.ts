import type { ZodError } from "zod";

/** Estado devolvido pelas Server Actions de formulário (usado com useActionState). */
export type FormState = {
  ok: boolean;
  /** Mensagem geral (sucesso ou erro). */
  message?: string;
  /** Erro por campo: { email: "E-mail inválido" } */
  errors?: Record<string, string>;
  /** Valores enviados, para o formulário não "esvaziar" quando há erro. */
  values?: Record<string, string>;
};

export const EMPTY_FORM_STATE: FormState = { ok: false };

/** Primeiro erro de cada campo. */
export function zodErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/** Lê um campo de texto do FormData (sempre string, sem espaços nas pontas). */
export function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** Igual a `field`, mas sem remover espaços (para senhas e textos longos). */
export function rawField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

/** Checkbox marcado? */
export function checked(formData: FormData, name: string): boolean {
  const value = formData.get(name);
  return value === "on" || value === "true" || value === "1";
}

/** Textarea com um item por linha → lista sem linhas vazias. */
export function lines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
