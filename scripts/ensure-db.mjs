// Roda antes do `npm run dev`.
// Se o banco local ainda não existe, cria as tabelas e carrega os dados iniciais.
// Uso manual:  node scripts/ensure-db.mjs --reset   (apaga e recria o banco local)

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";

try {
  process.loadEnvFile(".env");
} catch {
  // sem .env: usa os valores padrão
}

const url = process.env.DATABASE_URL || "file:./data/app.db";
const reset = process.argv.includes("--reset");

if (!url.startsWith("file:")) {
  console.log("[db] Banco remoto configurado — a criação automática só vale para o SQLite local.");
  console.log("[db] Use `npm run db:push` e `npm run db:seed` quando precisar.");
  process.exit(0);
}

const file = resolve(url.slice("file:".length));
const removeDbFiles = () => {
  for (const suffix of ["", "-wal", "-shm", "-journal"]) rmSync(file + suffix, { force: true });
};

if (reset) {
  removeDbFiles();
  console.log("[db] Banco local apagado.");
}

if (existsSync(file)) process.exit(0);

mkdirSync(dirname(file), { recursive: true });
console.log("[db] Criando o banco de dados local…");

run("criar as tabelas", [resolve("node_modules/drizzle-kit/bin.cjs"), "push", "--force"]);
run("carregar os dados iniciais", [resolve("node_modules/tsx/dist/cli.mjs"), "scripts/seed.ts"]);

console.log("[db] Pronto.");

function run(label, args) {
  const result = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (result.status !== 0) {
    // Não deixa um banco pela metade: a próxima execução tenta de novo.
    removeDbFiles();
    console.error(`[db] Falha ao ${label}.`);
    process.exit(result.status ?? 1);
  }
}
