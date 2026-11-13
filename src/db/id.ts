import { randomBytes } from "node:crypto";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

/** ID curto, seguro para URL (ex.: "k3f9x0a7b2qd"). Não use como segredo. */
export function createId(size = 12): string {
  const bytes = randomBytes(size);
  let id = "";
  for (let i = 0; i < size; i++) id += ALPHABET[bytes[i] % ALPHABET.length];
  return id;
}
