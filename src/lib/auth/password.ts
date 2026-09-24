import "server-only";
import { createHash, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
) => Promise<Buffer>;

// Must match scripts/hash-password.mjs.
export const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };

/**
 * Checks a password against a hash in the form `scrypt:<salt hex>:<hash hex>`.
 * (No "$" separators: Next's .env loader would try to expand them.)
 */
export async function verifyPassword(password: string, stored: string) {
  const [scheme, saltHex, hashHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  if (expected.length === 0) return false;
  const actual = await scryptAsync(
    password,
    Buffer.from(saltHex, "hex"),
    expected.length,
    SCRYPT_PARAMS,
  );
  return timingSafeEqual(actual, expected);
}

/** Constant-time string comparison (hashing first equalises the lengths). */
export function safeEqual(a: string, b: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}
