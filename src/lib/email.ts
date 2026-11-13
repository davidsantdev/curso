import "server-only";
import { site } from "@/config/site";

export type Email = { to: string; subject: string; text: string; html?: string };

/**
 * Envio de e-mail.
 *
 *  - Com RESEND_API_KEY definido, envia de verdade pelo Resend (https://resend.com).
 *    Defina também EMAIL_FROM com um remetente do seu domínio verificado,
 *    por exemplo:  Vendra <contato@seudominio.com.br>
 *  - Sem a chave, em desenvolvimento a mensagem aparece no terminal do `npm run dev`;
 *    em produção, só registramos que o envio foi pulado (sem expor o conteúdo no log).
 *
 * Nunca lança erro: uma falha no e-mail não pode derrubar o cadastro ou o pagamento.
 */
export function emailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export async function sendEmail(email: Email): Promise<{ delivered: boolean }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (apiKey) {
    const apiUrl = (process.env.RESEND_API_URL || "https://api.resend.com").replace(/\/+$/, "");
    try {
      const response = await fetch(`${apiUrl}/emails`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          // "onboarding@resend.dev" é o remetente de testes do Resend (só entrega para o dono da conta).
          from: process.env.EMAIL_FROM?.trim() || `${site.name} <onboarding@resend.dev>`,
          to: [email.to],
          reply_to: site.supportEmail,
          subject: email.subject,
          text: email.text,
          html: email.html,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        const detail = (await response.text().catch(() => "")).slice(0, 300);
        console.error(`[email] O Resend respondeu ${response.status} para "${email.subject}": ${detail}`);
        return { delivered: false };
      }
      return { delivered: true };
    } catch (error) {
      console.error(`[email] Falha ao enviar "${email.subject}":`, error);
      return { delivered: false };
    }
  }

  if (process.env.NODE_ENV === "production") {
    console.warn(`[email] RESEND_API_KEY não configurado — e-mail "${email.subject}" não foi enviado.`);
    return { delivered: false };
  }

  console.log(
    [
      "",
      "──────────── E-MAIL (simulado) ────────────",
      `Para:    ${email.to}`,
      `Assunto: ${email.subject}`,
      "",
      email.text,
      "───────────────────────────────────────────",
      "",
    ].join("\n"),
  );
  return { delivered: false };
}
