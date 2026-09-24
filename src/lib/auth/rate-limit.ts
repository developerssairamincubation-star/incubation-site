import "server-only";
import { ensureSchema, getPool, isDatabaseConfigured } from "@/lib/db";

const WINDOW_MINUTES = 15;
const MAX_FAILURES = 5;

/**
 * Failed-login throttling, keyed by client IP and stored in Postgres so it
 * holds across serverless instances. Without a database (local development
 * only — production refuses to log in without one) it's a no-op.
 */
export async function isLockedOut(ip: string) {
  if (!isDatabaseConfigured()) return false;
  await ensureSchema();
  const { rows } = await getPool().query<{ count: string }>(
    `SELECT count(*) FROM admin_login_attempts
      WHERE ip = $1 AND attempted_at > now() - make_interval(mins => $2)`,
    [ip, WINDOW_MINUTES],
  );
  return Number(rows[0].count) >= MAX_FAILURES;
}

export async function recordFailedLogin(ip: string) {
  if (!isDatabaseConfigured()) return;
  const pool = getPool();
  await pool.query("INSERT INTO admin_login_attempts (ip) VALUES ($1)", [ip]);
  // Keep the table from growing forever.
  await pool.query(
    "DELETE FROM admin_login_attempts WHERE attempted_at < now() - interval '1 day'",
  );
}

export async function clearFailedLogins(ip: string) {
  if (!isDatabaseConfigured()) return;
  await getPool().query("DELETE FROM admin_login_attempts WHERE ip = $1", [ip]);
}

export const LOCKOUT_MESSAGE = `Too many failed attempts. Try again in ${WINDOW_MINUTES} minutes.`;
