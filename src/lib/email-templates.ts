import "server-only";
import { site } from "@/config/site";
import { formatDateLong, formatMoney } from "@/lib/format";
import type { Email } from "@/lib/email";

/**
 * Modelos dos e-mails enviados pela plataforma.
 * Cada modelo gera a versão em HTML e a versão em texto a partir do mesmo conteúdo.
 */

type Message = {
  subject: string;
  /** Texto curto que aparece ao lado do assunto na caixa de entrada. */
  preview: string;
  heading: string;
  paragraphs: string[];
  button?: { label: string; url: string };
  /** Observação em letra menor, depois do botão. */
  footnote?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Primeiro nome, para o cumprimento ("Olá, Maria!"). */
function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "tudo bem";
}

function render(to: string, message: Message): Email {
  const text = [
    message.heading,
    "",
    ...message.paragraphs.flatMap((paragraph) => [paragraph, ""]),
    ...(message.button ? [`${message.button.label}: ${message.button.url}`, ""] : []),
    ...(message.footnote ? [message.footnote, ""] : []),
    "—",
    `${site.name} · ${site.url}`,
    `Dúvidas? Escreva para ${site.supportEmail}`,
  ].join("\n");

  const font = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";
  const paragraphs = message.paragraphs
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;${font}font-size:16px;line-height:1.6;color:#4b4b72;">${escapeHtml(paragraph)}</p>`,
    )
    .join("");

  const button = message.button
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="border-radius:999px;background:#6c5cff;">
         <a href="${escapeHtml(message.button.url)}" style="display:inline-block;padding:14px 28px;${font}font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">${escapeHtml(message.button.label)}</a>
       </td></tr></table>`
    : "";

  const footnote = message.footnote
    ? `<p style="margin:0;${font}font-size:13px;line-height:1.6;color:#8282a3;">${escapeHtml(message.footnote)}</p>`
    : "";

  const html = `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(message.subject)}</title></head>
<body style="margin:0;padding:0;background:#f6f6fd;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(message.preview)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6fd;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
      <tr><td style="padding:0 8px 20px;${font}font-size:22px;font-weight:700;color:#5a48ee;">${escapeHtml(site.name)}</td></tr>
      <tr><td style="background:#ffffff;border-radius:24px;padding:36px 32px;">
        <h1 style="margin:0 0 20px;${font}font-size:24px;line-height:1.25;color:#15154d;">${escapeHtml(message.heading)}</h1>
        ${paragraphs}
        ${button}
        ${footnote}
      </td></tr>
      <tr><td style="padding:20px 8px 0;${font}font-size:13px;line-height:1.6;color:#8282a3;">
        ${escapeHtml(site.name)} · ${escapeHtml(site.tagline)}<br>
        Dúvidas? Responda este e-mail ou escreva para <a href="mailto:${escapeHtml(site.supportEmail)}" style="color:#5a48ee;">${escapeHtml(site.supportEmail)}</a>.
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  return { to, subject: message.subject, text, html };
}

/* ------------------------------------------------------------------ */
/* Modelos                                                             */
/* ------------------------------------------------------------------ */

export function welcomeEmail(user: { name: string; email: string }): Email {
  return render(user.email, {
    subject: `Boas-vindas à ${site.name} — sua primeira aula está liberada`,
    preview: "Comece pela trilha Vender sem estoque, que é grátis.",
    heading: `Olá, ${firstName(user.name)}! Que bom ter você aqui.`,
    paragraphs: [
      "A sua conta está criada e a trilha Vender sem estoque já está liberada, de graça: aulas curtas que explicam, do zero, como vender pela internet sem comprar estoque.",
      "Uma dica: reserve 10 minutos por dia. Cada aula concluída soma pontos e mantém a sua sequência de estudos.",
    ],
    button: { label: "Começar a primeira aula", url: `${site.url}/painel` },
    footnote: "Você recebeu este e-mail porque criou uma conta na plataforma.",
  });
}

export function passwordResetEmail(user: { name: string; email: string }, resetUrl: string): Email {
  return render(user.email, {
    subject: `Redefinir a sua senha — ${site.name}`,
    preview: "O link para criar uma nova senha vale por 1 hora.",
    heading: `Olá, ${firstName(user.name)}!`,
    paragraphs: [
      "Recebemos um pedido para redefinir a sua senha. Clique no botão abaixo para criar uma nova. O link vale por 1 hora e só pode ser usado uma vez.",
    ],
    button: { label: "Criar nova senha", url: resetUrl },
    footnote: "Se não foi você quem pediu, é só ignorar este e-mail: a sua senha continua a mesma.",
  });
}

export function paymentApprovedEmail(
  user: { name: string; email: string },
  purchase: { planName: string; amountCents: number; accessUntil: Date | null },
): Email {
  const access = purchase.accessUntil
    ? `O seu acesso vale até ${formatDateLong(purchase.accessUntil)}. Não existe cobrança automática: quando o período terminar, você decide se quer renovar.`
    : "O seu acesso é vitalício.";

  return render(user.email, {
    subject: `Pagamento confirmado — o ${purchase.planName} está liberado`,
    preview: "Todos os métodos já estão abertos para você.",
    heading: `Tudo certo, ${firstName(user.name)}! O seu plano está ativo.`,
    paragraphs: [
      `Recebemos o seu pagamento de ${formatMoney(purchase.amountCents)} pelo ${purchase.planName}. Todas as trilhas já estão liberadas: loja, site, pagamentos, robôs e anúncios.`,
      access,
    ],
    button: { label: "Ver todas as trilhas", url: `${site.url}/trilhas` },
    footnote: `Guarde este e-mail como comprovante. Se precisar de ajuda com a compra, escreva para ${site.supportEmail}.`,
  });
}

export function accessExpiringEmail(
  user: { name: string; email: string },
  /** `planSlug` null: o plano saiu de venda e o botão leva para a página de planos. */
  subscription: { planName: string; planSlug: string | null; accessUntil: Date },
): Email {
  return render(user.email, {
    subject: `O seu acesso ao ${subscription.planName} termina em breve`,
    preview: `Renove até ${formatDateLong(subscription.accessUntil)} para continuar de onde parou.`,
    heading: `${firstName(user.name)}, o seu acesso termina em ${formatDateLong(subscription.accessUntil)}`,
    paragraphs: [
      `O período do seu ${subscription.planName} está chegando ao fim. Como não fazemos cobrança automática, nada será cobrado: para continuar com todas as trilhas liberadas, é só renovar.`,
      "Ao renovar antes do fim, o novo período é somado ao que você ainda tem. O seu progresso, as anotações e os certificados ficam guardados de qualquer forma.",
    ],
    button: {
      label: "Renovar o meu acesso",
      url: subscription.planSlug ? `${site.url}/checkout/${subscription.planSlug}` : `${site.url}/assinatura#planos`,
    },
  });
}
