import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const url = process.env.DATABASE_URL || "file:./data/app.db";

function connect(): Client {
  if (url.startsWith("file:")) {
    // Garante que a pasta do arquivo SQLite existe.
    mkdirSync(dirname(resolve(url.slice("file:".length))), { recursive: true });
  }
  return createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN || undefined });
}

// Em desenvolvimento o Next recarrega os módulos a cada alteração;
// guardamos a conexão no escopo global para não abrir uma nova toda vez.
const globalForDb = globalThis as unknown as { __vendraDb?: Client };
const client = globalForDb.__vendraDb ?? connect();
if (process.env.NODE_ENV !== "production") globalForDb.__vendraDb = client;

export const db = drizzle(client, { schema });
export { schema };
