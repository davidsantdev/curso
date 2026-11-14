import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * Para um vídeo guardado na pasta public/ (ex.: /videos/aula-01.mp4), procura a capa e a legenda com o
 * mesmo nome: /videos/aula-01.jpg (ou .webp/.png) e /videos/aula-01.vtt. Só devolve o que existir.
 */
export function localVideoAssets(src: string): { poster?: string; captions?: string } {
  if (!src.startsWith("/") || src.startsWith("//")) return {};
  const base = src.replace(/\.[a-z0-9]+$/i, "");
  const exists = (file: string) => fs.existsSync(path.join(process.cwd(), "public", file));
  const poster = [".jpg", ".webp", ".png"].map((ext) => base + ext).find(exists);
  const captions = exists(`${base}.vtt`) ? `${base}.vtt` : undefined;
  return { poster, captions };
}
