// Ajusta o volume do vídeo para -14 LUFS (a referência do YouTube) sem mexer na imagem.
// Mede primeiro e depois aplica um ganho linear (sem compressor), com pico máximo de -1 dBTP.
// uso: node scripts/masterizar.mjs out/aula-01.mp4
import { execSync } from "node:child_process";
import fs from "node:fs";

const entrada = process.argv[2] ?? "out/aula-01.mp4";
const temporario = entrada.replace(/\.mp4$/, "-master.mp4");
const alvo = "I=-14:TP=-1.0:LRA=11";
const ffmpeg = (args) => `npx remotion ffmpeg -hide_banner -nostats ${args}`;

const medicao = execSync(ffmpeg(`-i "${entrada}" -vn -af loudnorm=${alvo}:print_format=json -f null - 2>&1`), {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});
const m = JSON.parse(medicao.slice(medicao.lastIndexOf("{"), medicao.lastIndexOf("}") + 1));
const filtro =
  `loudnorm=${alvo}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}` +
  `:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true:print_format=summary`;

execSync(
  ffmpeg(
    `-y -i "${entrada}" -map 0:v:0 -map 0:a:0 -c:v copy -af ${filtro} -ar 48000 -c:a aac -b:a 320k -movflags +faststart "${temporario}"`,
  ),
  { stdio: ["ignore", "ignore", "ignore"] },
);
fs.renameSync(temporario, entrada);
console.log(`ok: ${entrada} ajustado para -14 LUFS (antes: ${m.input_i} LUFS, pico ${m.input_tp} dBTP)`);
