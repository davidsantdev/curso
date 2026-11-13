// Carrega o .env (se existir) antes de qualquer outro módulo dos scripts.
// Importe este arquivo PRIMEIRO: os imports são avaliados na ordem em que aparecem.
try {
  process.loadEnvFile(".env");
} catch {
  // sem .env: usa os valores padrão
}
