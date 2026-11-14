// Renderiza quadros soltos (PNG) em vários segundos do vídeo, montando o projeto uma vez só.
// uso: node scripts/quadros.mjs 6.5 33 74.2 ...      ->  out/quadros/<segundo>.png
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const segundos = process.argv.slice(2).map(Number).filter((n) => Number.isFinite(n));
const id = process.env.COMPOSICAO ?? "Aula1";
const pasta = path.resolve("out/quadros");
fs.mkdirSync(pasta, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const port = 3100; // a 3000 é do site (next dev)
const composition = await selectComposition({ serveUrl, id, port });
console.log(`${id}: ${composition.durationInFrames} quadros (${(composition.durationInFrames / composition.fps).toFixed(1)} s)`);

for (const s of segundos) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps));
  const output = path.join(pasta, `${s.toFixed(2).padStart(7, "0")}.png`);
  await renderStill({ composition, serveUrl, output, frame, port, chromiumOptions: { gl: "angle" } });
  console.log("ok", s);
}
