export type VideoEmbed = { kind: "iframe" | "file"; src: string };

const YOUTUBE_HOSTS = new Set(["youtube.com", "m.youtube.com", "youtube-nocookie.com", "music.youtube.com"]);

function youtube(id: string | null | undefined): VideoEmbed | null {
  if (!id || !/^[\w-]{6,20}$/.test(id)) return null;
  return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${id}?rel=0` };
}

/** Vídeo guardado no próprio site (pasta public/), ex.: /videos/aula-01.mp4 */
const LOCAL_FILE = /^\/(?!\/)[\w\-./]+\.(mp4|webm|m4v)$/i;

/**
 * Converte o link colado no admin em algo que dá para incorporar na aula.
 * Aceita YouTube, Vimeo, Panda Video, Bunny Stream, arquivos .mp4/.webm (https)
 * e vídeos da pasta public/ do site (/videos/aula.mp4).
 * Retorna null quando o link não é reconhecido.
 */
export function toVideoEmbed(input: string | null | undefined): VideoEmbed | null {
  if (!input) return null;

  const path = input.trim();
  if (LOCAL_FILE.test(path) && !path.includes("..")) return { kind: "file", src: path };

  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") return youtube(url.pathname.split("/")[1]);

  if (YOUTUBE_HOSTS.has(host)) {
    if (url.pathname === "/watch") return youtube(url.searchParams.get("v"));
    const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/);
    return youtube(match?.[1]);
  }

  if (host === "vimeo.com") {
    const match = url.pathname.match(/^\/(\d+)/);
    return match ? { kind: "iframe", src: `https://player.vimeo.com/video/${match[1]}` } : null;
  }

  if (host === "player.vimeo.com" && url.pathname.startsWith("/video/")) {
    return { kind: "iframe", src: `https://player.vimeo.com${url.pathname}` };
  }

  // Players de hospedagem de cursos: usamos o link de incorporação como veio.
  if (host.endsWith(".pandavideo.com.br") || host === "iframe.mediadelivery.net") {
    return { kind: "iframe", src: url.toString() };
  }

  if (/\.(mp4|webm|m4v)$/i.test(url.pathname)) {
    return { kind: "file", src: url.toString() };
  }

  return null;
}
