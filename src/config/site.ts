/**
 * Identidade do produto. Troque o nome, o slogan e o contato aqui —
 * o restante do site lê tudo deste arquivo.
 */
export const site = {
  name: "Vendra",
  tagline: "Aprenda a vender pela internet sem estoque",
  description:
    "Aprenda do zero a vender pela internet sem ter estoque: monte sua loja, receba pagamentos, automatize com robôs e anuncie no Facebook, Instagram, TikTok e Google.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  /** E-mail de atendimento que aparece no site. Pode ser trocado por variável de ambiente. */
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "contato@vendra.test",
  timeZone: "America/Sao_Paulo",
  /**
   * Pré-estreia: enquanto os vídeos das aulas são gravados, o site avisa que o curso está em produção e que o preço
   * é de estreia, e as aulas ainda sem vídeo aparecem como "vídeo em breve" (somem sozinhas quando o vídeo entra).
   * Troque para `false` quando todas as aulas tiverem vídeo. Lembre de rever os preços dos planos nessa hora.
   */
  prelaunch: true,
} as const;

/**
 * Endereço público do site, ou `null` quando ele roda em um endereço local.
 * Serviços externos (como o webhook da Cakto) não conseguem chamar um endereço "localhost".
 */
export function publicSiteUrl(): string | null {
  try {
    const { hostname } = new URL(site.url);
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]" || !hostname.includes(".")) {
      return null;
    }
    return site.url;
  } catch {
    return null;
  }
}
