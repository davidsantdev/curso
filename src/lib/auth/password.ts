import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

// scrypt (nativo do Node): N=2^15, r=8, p=1.
const COST = 32768;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;
const KEY_LENGTH = 64;
const MAX_MEMORY = 64 * 1024 * 1024;

function derive(password: string, salt: Buffer, cost: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      KEY_LENGTH,
      { N: cost, r: BLOCK_SIZE, p: PARALLELIZATION, maxmem: MAX_MEMORY },
      (error, key) => (error ? reject(error) : resolve(key)),
    );
  });
}

/** Gera o hash no formato `scrypt$custo$sal$chave`. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, COST);
  return `scrypt$${COST}$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, cost, salt, key] = stored.split("$");
  if (algorithm !== "scrypt" || !cost || !salt || !key) return false;

  const costNumber = Number(cost);
  if (!Number.isInteger(costNumber) || costNumber < 1024 || costNumber > COST * 4) return false;

  try {
    const expected = Buffer.from(key, "base64url");
    const actual = await derive(password, Buffer.from(salt, "base64url"), costNumber);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
