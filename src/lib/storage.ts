import "server-only";
import { del, list, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { isBlobUrl } from "@/lib/content/schema";

export const IMAGE_FOLDERS = ["hero", "gallery", "startups", "team"] as const;
export type ImageFolder = (typeof IMAGE_FOLDERS)[number];

// Below next.config's 4 MB server-action cap, which also counts the
// multipart overhead around the file.
export const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024;

export class UploadError extends Error {}

const LOCAL_ROOT = path.join(process.cwd(), "public", "uploads");

// The Vercel dashboard prefixes the variable when a store is connected with a
// custom name (here "BLOB_PUB"), so accept both spellings.
const BLOB_TOKEN = () =>
  process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_PUB_READ_WRITE_TOKEN;

export function isBlobConfigured() {
  return Boolean(BLOB_TOKEN());
}

/** Without a Blob token, development builds save uploads into public/uploads. */
function canUseLocalUploads() {
  return process.env.NODE_ENV !== "production";
}

/**
 * The browser-supplied MIME type is just a claim, so confirm the file really
 * starts with a JPEG, PNG or WebP signature before storing it.
 */
function detectImageType(bytes: Uint8Array): "jpg" | "png" | "webp" | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "png";
  }
  const ascii = (from: number, to: number) =>
    String.fromCharCode(...bytes.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  return null;
}

const CONTENT_TYPES = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

export async function storeImage(file: File, folder: ImageFolder) {
  if (file.size === 0) throw new UploadError("That file is empty.");
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError("That image is too large — the limit is 3.5 MB.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = detectImageType(bytes);
  if (!ext) throw new UploadError("Use a JPG, PNG or WebP image.");

  // Generated names only — nothing from the uploaded filename reaches storage.
  const name = `${folder}/${randomUUID()}.${ext}`;

  if (isBlobConfigured()) {
    const blob = await put(name, Buffer.from(bytes), {
      token: BLOB_TOKEN(),
      access: "public",
      contentType: CONTENT_TYPES[ext],
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return blob.url;
  }

  if (canUseLocalUploads()) {
    await mkdir(path.join(LOCAL_ROOT, folder), { recursive: true });
    await writeFile(path.join(LOCAL_ROOT, name), bytes);
    return `/uploads/${name}`;
  }

  throw new UploadError(
    "Image storage isn't set up yet. Connect Vercel Blob to this project in the Vercel dashboard.",
  );
}

/**
 * Best-effort cleanup of images nothing references any more. Only files this
 * admin uploaded are ever removed — the originals shipped under /images are
 * part of the codebase and are left alone.
 */
export async function removeImages(urls: Iterable<string>) {
  const blobUrls: string[] = [];
  for (const url of new Set(urls)) {
    if (isBlobUrl(url)) {
      blobUrls.push(url);
    } else if (url.startsWith("/uploads/") && canUseLocalUploads()) {
      const file = path.resolve(path.join(process.cwd(), "public", url));
      if (file.startsWith(LOCAL_ROOT + path.sep)) {
        await unlink(file).catch(() => {});
      }
    }
  }
  if (blobUrls.length > 0 && isBlobConfigured()) {
    await del(blobUrls, { token: BLOB_TOKEN() }).catch((error) =>
      console.error("Couldn't delete unused images:", error),
    );
  }
}

// Long enough that a photo uploaded in another open tab — not saved yet —
// is never swept out from under it.
const ORPHAN_GRACE_MS = 24 * 60 * 60 * 1000;

/**
 * Deletes uploads that no content references and that are older than a day —
 * e.g. from an editing session that was closed without saving or discarding.
 * Best-effort: failures are logged, never thrown.
 */
export async function sweepOrphanedImages(referenced: Set<string>) {
  const cutoff = Date.now() - ORPHAN_GRACE_MS;
  const orphans: string[] = [];
  try {
    if (isBlobConfigured()) {
      // Only the admin's own folders — anything else in the store is left
      // alone, even if nothing here references it.
      for (const folder of IMAGE_FOLDERS) {
        let cursor: string | undefined;
        do {
          const page = await list({
            token: BLOB_TOKEN(),
            prefix: `${folder}/`,
            cursor,
            limit: 1000,
          });
          for (const blob of page.blobs) {
            if (!referenced.has(blob.url) && blob.uploadedAt.getTime() < cutoff) {
              orphans.push(blob.url);
            }
          }
          cursor = page.hasMore ? page.cursor : undefined;
        } while (cursor);
      }
    } else if (canUseLocalUploads()) {
      const entries = await readdir(LOCAL_ROOT, { recursive: true }).catch(() => []);
      for (const entry of entries) {
        const file = path.join(LOCAL_ROOT, entry);
        const info = await stat(file);
        const url = `/uploads/${entry.split(path.sep).join("/")}`;
        if (info.isFile() && !referenced.has(url) && info.mtimeMs < cutoff) {
          orphans.push(url);
        }
      }
    }
    if (orphans.length > 0) await removeImages(orphans);
  } catch (error) {
    console.error("Couldn't sweep unused images:", error);
  }
}
