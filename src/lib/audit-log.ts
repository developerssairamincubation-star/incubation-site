import "server-only";
import { ensureSchema, getPool, isDatabaseConfigured } from "@/lib/db";
import type { ContentKey } from "@/lib/content/schema";

export type AuditEntry = {
  id: number;
  section: ContentKey;
  message: string;
  createdAt: Date;
};

type Change = { section: ContentKey; message: string };
type Identified = { id: string };

const NOUN: Record<ContentKey, { singular: string; plural: string }> = {
  hero: { singular: "hero image", plural: "hero images" },
  gallery: { singular: "gallery event", plural: "gallery events" },
  startups: { singular: "startup logo", plural: "startup logos" },
  team: { singular: "team member", plural: "team members" },
};

/** A save that changes more than this many items is logged as one summary line. */
const COLLAPSE_ABOVE = 8;
const MAX_NAME_LENGTH = 80;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function displayName(key: ContentKey, item: Identified): string {
  const fields = item as unknown as Record<string, unknown>;
  const name =
    key === "hero"
      ? text(fields.alt)
      : key === "gallery"
        ? text(fields.title) || text(fields.caption)
        : text(fields.name);
  return name.length > MAX_NAME_LENGTH ? `${name.slice(0, MAX_NAME_LENGTH)}…` : name;
}

function describe(verb: string, key: ContentKey, item: Identified) {
  const name = displayName(key, item);
  const noun = NOUN[key].singular;
  return name ? `${verb} ${noun} “${name}”` : `${verb} a ${noun}`;
}

/**
 * Works out what a save changed by comparing items by id, so re-ordering the
 * same items produces no entries at all. Saves that touch many items collapse
 * into one line rather than flooding the log.
 */
export function diffSection(
  key: ContentKey,
  before: readonly Identified[],
  after: readonly Identified[],
): Change[] {
  const beforeById = new Map(before.map((item) => [item.id, item]));
  const afterIds = new Set(after.map((item) => item.id));

  const added = after.filter((item) => !beforeById.has(item.id));
  const removed = before.filter((item) => !afterIds.has(item.id));
  const updated = after.filter((item) => {
    const previous = beforeById.get(item.id);
    return previous !== undefined && JSON.stringify(previous) !== JSON.stringify(item);
  });

  const total = added.length + removed.length + updated.length;
  if (total === 0) return [];

  if (total > COLLAPSE_ABOVE) {
    const parts = [
      added.length && `${added.length} added`,
      removed.length && `${removed.length} removed`,
      updated.length && `${updated.length} updated`,
    ].filter(Boolean);
    return [
      {
        section: key,
        message: `Changed ${total} ${NOUN[key].plural} (${parts.join(", ")})`,
      },
    ];
  }

  return [
    ...added.map((item) => ({ section: key, message: describe("Added", key, item) })),
    ...removed.map((item) => ({ section: key, message: describe("Removed", key, item) })),
    ...updated.map((item) => ({ section: key, message: describe("Updated", key, item) })),
  ];
}

/**
 * Best-effort activity feed, not a durable audit trail: it runs after the
 * content save has committed and never throws, so a logging problem can't
 * fail an edit — at worst that save's entries are missing from the list.
 */
export async function logChanges(changes: Change[]): Promise<void> {
  if (changes.length === 0 || !isDatabaseConfigured()) return;
  try {
    await ensureSchema();
    const placeholders = changes.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(", ");
    await getPool().query(
      `INSERT INTO audit_log (section, message) VALUES ${placeholders}`,
      changes.flatMap((change) => [change.section, change.message]),
    );
  } catch (error) {
    console.error("Couldn't record the change log:", error);
  }
}

/** Most recent first. Bounded so the overview never loads an unbounded table. */
export async function listAuditLog(limit = 200): Promise<AuditEntry[]> {
  if (!isDatabaseConfigured()) return [];
  try {
    await ensureSchema();
    const { rows } = await getPool().query<{
      id: string;
      section: ContentKey;
      message: string;
      created_at: Date;
    }>(
      "SELECT id, section, message, created_at FROM audit_log ORDER BY created_at DESC, id DESC LIMIT $1",
      [limit],
    );
    return rows.map((row) => ({
      id: Number(row.id),
      section: row.section,
      message: row.message,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error("Couldn't load the change log:", error);
    return [];
  }
}
