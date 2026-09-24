"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminConfig } from "@/lib/auth/config";
import { safeEqual, verifyPassword } from "@/lib/auth/password";
import {
  clearFailedLogins,
  isLockedOut,
  LOCKOUT_MESSAGE,
  recordFailedLogin,
} from "@/lib/auth/rate-limit";
import { createSession, deleteSession, requireAdmin } from "@/lib/auth/session";
import { diffSection, logChanges } from "@/lib/audit-log";
import {
  ContentConflictError,
  getSectionForEdit,
  listReferencedStrings,
  saveSection,
} from "@/lib/content/repository";
import {
  CONTENT_KEYS,
  contentSchemas,
  imageUrlsOf,
  slugify,
  type ContentKey,
  type SiteContent,
} from "@/lib/content/schema";
import {
  IMAGE_FOLDERS,
  removeImages,
  storeImage,
  sweepOrphanedImages,
  UploadError,
  type ImageFolder,
} from "@/lib/storage";

// ---------------------------------------------------------------- sign-in

export type LoginState = { error?: string; username?: string };

async function clientIp() {
  const h = await headers();
  // Vercel sets x-forwarded-for itself, so clients can't spoof the first hop.
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export async function login(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const setup = getAdminConfig();
  if (!setup.ready) return { error: "Admin sign-in isn't set up yet." };

  const username = String(formData.get("username") ?? "").trim().slice(0, 200);
  const password = String(formData.get("password") ?? "").slice(0, 500);
  const ip = await clientIp();

  if (await isLockedOut(ip)) return { error: LOCKOUT_MESSAGE, username };

  // Both checks always run, so a wrong username takes as long as a wrong
  // password and the response time doesn't reveal which one was wrong.
  const usernameMatches = safeEqual(username, setup.config.username);
  const passwordMatches = await verifyPassword(password, setup.config.passwordHash);

  if (!usernameMatches || !passwordMatches) {
    await recordFailedLogin(ip);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { error: "Incorrect username or password.", username };
  }

  await clearFailedLogins(ip);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------- uploads

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  await requireAdmin();

  const file = formData.get("file");
  const folder = formData.get("folder") as ImageFolder;
  if (!(file instanceof File)) return { ok: false, error: "No file was received." };
  if (!IMAGE_FOLDERS.includes(folder)) {
    return { ok: false, error: "Unknown upload location." };
  }

  try {
    return { ok: true, url: await storeImage(file, folder) };
  } catch (error) {
    if (error instanceof UploadError) return { ok: false, error: error.message };
    console.error(error);
    return { ok: false, error: "The upload failed. Please try again." };
  }
}

/** Deletes images uploaded in an editing session that was then discarded. */
export async function discardUploads(urls: unknown) {
  await requireAdmin();
  if (!Array.isArray(urls)) return;
  const referenced = await listReferencedStrings();
  await removeImages(
    urls
      .filter((url): url is string => typeof url === "string")
      .slice(0, 100)
      .filter((url) => !referenced.has(url)),
  );
}

// ---------------------------------------------------------------- saving

export type SaveIssue = { path: (string | number)[]; message: string };

export type SaveResult<K extends ContentKey> =
  | { ok: true; version: number; data: SiteContent[K] }
  | { ok: false; error: string; issues?: SaveIssue[]; conflict?: boolean };

/**
 * New gallery events arrive without a slug; give each one a unique URL slug
 * from its title. Existing events keep the slug they were published with, so
 * shared links never break.
 */
async function withEventSlugs(input: unknown) {
  if (!Array.isArray(input)) return input;
  const { data: stored } = await getSectionForEdit("gallery");
  const publishedSlugs = new Map(stored.map((event) => [event.id, event.slug]));

  const events = input.map((event) => {
    if (!event || typeof event !== "object") return event;
    const slug = publishedSlugs.get(String(event.id));
    return slug ? { ...event, slug } : event;
  });

  const taken = new Set(
    events.map((e) => (typeof e?.slug === "string" ? e.slug : "")).filter(Boolean),
  );
  return events.map((event) => {
    if (!event || typeof event !== "object" || event.slug) return event;
    const base = slugify(String(event.title ?? ""));
    let slug = base;
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
    taken.add(slug);
    return { ...event, slug };
  });
}

export async function saveContent<K extends ContentKey>(
  key: K,
  input: unknown,
  version: number,
  sessionUploads: unknown,
): Promise<SaveResult<K>> {
  await requireAdmin();
  if (!CONTENT_KEYS.includes(key)) return { ok: false, error: "Unknown section." };

  try {
    const prepared = key === "gallery" ? await withEventSlugs(input) : input;
    const parsed = contentSchemas[key].safeParse(prepared);
    if (!parsed.success) {
      return {
        ok: false,
        error: "Some fields need attention.",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.filter(
            (part): part is string | number => typeof part !== "symbol",
          ),
          message: issue.message,
        })),
      };
    }
    const data = parsed.data as SiteContent[K];

    const saved = await saveSection(key, data, Number(version));

    // Recorded after the save has committed and never throws. Known gap:
    // saveSection returns `previous = []` if the stored row failed to
    // re-validate, which would list existing items as newly added once.
    await logChanges(
      diffSection(
        key,
        saved.previous as readonly { id: string }[],
        data as readonly { id: string }[],
      ),
    );

    // Remove images this save made unused — replaced or deleted items, plus
    // anything uploaded while editing that didn't make it into the save — but
    // never one that any section still references.
    const referenced = await listReferencedStrings();
    const candidates = [
      ...imageUrlsOf(key, saved.previous),
      ...(Array.isArray(sessionUploads) ? sessionUploads : []),
    ].filter((url): url is string => typeof url === "string");
    await removeImages(candidates.filter((url) => !referenced.has(url)));
    // And anything abandoned earlier (a tab closed without saving).
    await sweepOrphanedImages(referenced);

    revalidatePath("/");
    revalidatePath("/admin");
    if (key === "gallery") revalidatePath("/gallery/[slug]", "page");

    return { ok: true, version: saved.version, data };
  } catch (error) {
    if (error instanceof ContentConflictError) {
      return { ok: false, error: error.message, conflict: true };
    }
    console.error(error);
    return {
      ok: false,
      error: "Couldn't save your changes. Check your connection and try again.",
    };
  }
}
