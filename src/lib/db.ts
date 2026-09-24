import "server-only";
import { Pool } from "pg";

declare global {
  // Survives hot reloads in development so we don't leak connections.
  var __sstifPool: Pool | undefined;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  globalThis.__sstifPool ??= new Pool({
    connectionString,
    // Serverless instances are short-lived and Neon's pooler fronts the
    // real connections, so keep each instance's footprint tiny.
    max: 3,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 8_000,
  });
  return globalThis.__sstifPool;
}

let schemaReady: Promise<void> | null = null;

/**
 * Creates the tables on first use (once per server instance). Idempotent, so
 * a brand-new database needs no manual migration step.
 */
export function ensureSchema() {
  schemaReady ??= getPool()
    .query(
      `CREATE TABLE IF NOT EXISTS site_content (
         key        text PRIMARY KEY,
         data       jsonb NOT NULL,
         version    integer NOT NULL DEFAULT 1,
         updated_at timestamptz NOT NULL DEFAULT now()
       );
       CREATE TABLE IF NOT EXISTS admin_login_attempts (
         ip           text NOT NULL,
         attempted_at timestamptz NOT NULL DEFAULT now()
       );
       CREATE INDEX IF NOT EXISTS admin_login_attempts_ip_time
         ON admin_login_attempts (ip, attempted_at);
       CREATE TABLE IF NOT EXISTS audit_log (
         id         bigserial PRIMARY KEY,
         section    text NOT NULL,
         message    text NOT NULL,
         created_at timestamptz NOT NULL DEFAULT now()
       );
       CREATE INDEX IF NOT EXISTS audit_log_created_at_idx
         ON audit_log (created_at DESC);`,
    )
    .then(() => undefined)
    .catch((error) => {
      // Let the next call retry (e.g. two cold starts racing on a fresh DB).
      schemaReady = null;
      throw error;
    });
  return schemaReady;
}
