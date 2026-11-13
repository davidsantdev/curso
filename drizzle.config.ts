import { defineConfig } from "drizzle-kit";

// O drizzle-kit roda fora do Next, então carregamos o .env manualmente.
try {
  process.loadEnvFile(".env");
} catch {
  // sem .env: usa os valores padrão
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:./data/app.db",
    authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
  },
});
