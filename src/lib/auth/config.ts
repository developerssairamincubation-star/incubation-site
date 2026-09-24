import "server-only";
import { isDatabaseConfigured } from "@/lib/db";

export type AdminConfig = {
  username: string;
  passwordHash: string;
  sessionSecret: string;
};

/**
 * The admin is switched on entirely through environment variables. Returns
 * the config, or the list of variables still to set.
 */
export function getAdminConfig():
  | { ready: true; config: AdminConfig }
  | { ready: false; missing: string[] } {
  const username = process.env.ADMIN_USERNAME?.trim() ?? "";
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim() ?? "";
  const sessionSecret = process.env.SESSION_SECRET ?? "";

  const missing: string[] = [];
  if (!username) missing.push("ADMIN_USERNAME");
  if (!passwordHash.startsWith("scrypt:")) missing.push("ADMIN_PASSWORD_HASH");
  if (sessionSecret.length < 32) missing.push("SESSION_SECRET (32+ characters)");
  // In production the database also backs login rate-limiting, so refuse to
  // open the login without it.
  if (process.env.NODE_ENV === "production" && !isDatabaseConfigured()) {
    missing.push("DATABASE_URL");
  }

  return missing.length > 0
    ? { ready: false, missing }
    : { ready: true, config: { username, passwordHash, sessionSecret } };
}
