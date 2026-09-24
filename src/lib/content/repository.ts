import "server-only";
import { cache } from "react";
import { ensureSchema, getPool, isDatabaseConfigured } from "@/lib/db";
import { DEFAULT_CONTENT } from "./defaults";
import {
  CONTENT_KEYS,
  contentSchemas,
  type ContentKey,
  type SiteContent,
} from "./schema";

type Row = { key: string; data: unknown; version: number };

export class ContentConflictError extends Error {
  constructor() {
    super(
      "This section was changed somewhere else (another tab or browser) since you opened it. Reload to see the latest version, then make your changes again.",
    );
  }
}

function parse<K extends ContentKey>(key: K, raw: unknown): SiteContent[K] {
  const result = contentSchemas[key].safeParse(raw);
  if (!result.success) {
    throw new Error(`Stored "${key}" content failed validation`, {
      cause: result.error,
    });
  }
  return result.data as SiteContent[K];
}

/** Copies the shipped content in the first time a section is read. */
async function seed(key: ContentKey) {
  await getPool().query(
    `INSERT INTO site_content (key, data) VALUES ($1, $2::jsonb)
     ON CONFLICT (key) DO NOTHING`,
    [key, JSON.stringify(DEFAULT_CONTENT[key])],
  );
}

/**
 * Everything the public pages render. Deliberately forgiving: if the database
 * is missing or unreachable the visitor still gets the shipped content rather
 * than an error page. Cached per request, so metadata + page share one read.
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  if (!isDatabaseConfigured()) return DEFAULT_CONTENT;

  try {
    await ensureSchema();
    const { rows } = await getPool().query<Row>(
      "SELECT key, data, version FROM site_content",
    );
    const stored = new Map(rows.map((row) => [row.key, row.data]));
    const content = { ...DEFAULT_CONTENT };

    for (const key of CONTENT_KEYS) {
      if (!stored.has(key)) {
        await seed(key);
        continue;
      }
      try {
        Object.assign(content, { [key]: parse(key, stored.get(key)) });
      } catch (error) {
        console.error(error);
      }
    }
    return content;
  } catch (error) {
    console.error("Falling back to shipped content:", error);
    return DEFAULT_CONTENT;
  }
});

/**
 * One section for the admin editor, with its version for conflict checks.
 * Strict on purpose: if the database can't be read we must not hand the
 * editor the shipped defaults, or saving would overwrite the real content.
 */
export async function getSectionForEdit<K extends ContentKey>(
  key: K,
): Promise<{ data: SiteContent[K]; version: number }> {
  await ensureSchema();
  const query = () =>
    getPool().query<Row>(
      "SELECT key, data, version FROM site_content WHERE key = $1",
      [key],
    );

  let { rows } = await query();
  if (rows.length === 0) {
    await seed(key);
    ({ rows } = await query());
  }
  return { data: parse(key, rows[0].data), version: rows[0].version };
}

/**
 * Every string stored anywhere in the content — deliberately schema-agnostic,
 * so image cleanup can never delete something a section still points at,
 * even if that section's shape has changed.
 */
export async function listReferencedStrings(): Promise<Set<string>> {
  await ensureSchema();
  const { rows } = await getPool().query<Row>("SELECT data FROM site_content");
  const found = new Set<string>();
  const walk = (value: unknown) => {
    if (typeof value === "string") found.add(value);
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === "object") Object.values(value).forEach(walk);
  };
  rows.forEach((row) => walk(row.data));
  return found;
}

/**
 * Replaces a section, but only if nobody saved it since `expectedVersion` was
 * read. Returns the new version and the content that was replaced.
 */
export async function saveSection<K extends ContentKey>(
  key: K,
  data: SiteContent[K],
  expectedVersion: number,
): Promise<{ version: number; previous: SiteContent[K] }> {
  await ensureSchema();
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const current = await client.query<Row>(
      "SELECT key, data, version FROM site_content WHERE key = $1 FOR UPDATE",
      [key],
    );
    if (current.rows.length === 0 || current.rows[0].version !== expectedVersion) {
      throw new ContentConflictError();
    }
    const updated = await client.query<{ version: number }>(
      `UPDATE site_content
          SET data = $2::jsonb, version = version + 1, updated_at = now()
        WHERE key = $1
      RETURNING version`,
      [key, JSON.stringify(data)],
    );
    await client.query("COMMIT");
    return {
      version: updated.rows[0].version,
      // Lenient here: an unreadable previous value just means no cleanup.
      previous: (contentSchemas[key].safeParse(current.rows[0].data).data ??
        []) as SiteContent[K],
    };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
