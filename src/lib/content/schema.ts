import { z } from "zod";

/** Max photos per gallery event — the detail-page grid is designed around it. */
export const MAX_EVENT_PHOTOS = 5;

const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

/**
 * Images may be files shipped in /public (the original content), dev-only
 * uploads under /uploads, or files in this project's Vercel Blob store.
 * Anything else is rejected so an arbitrary external URL can never be
 * injected into the page.
 */
export function isAllowedImageUrl(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

export function isBlobUrl(value: string) {
  try {
    return new URL(value).hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

const imageSrc = z
  .string()
  .trim()
  .min(1, "Add an image")
  .refine(isAllowedImageUrl, "Unsupported image location");

const text = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be at most ${max} characters`);

const id = z.string().min(1).max(64);

export const heroSlideSchema = z.object({
  id,
  src: imageSrc,
  alt: text("Description", 160),
});

export const photoSchema = z.object({
  src: imageSrc,
  alt: z.string().trim().max(200),
});

export const galleryEventSchema = z.object({
  id,
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid URL slug")
    .max(80),
  caption: text("Short label", 60),
  title: text("Title", 160),
  details: text("Description", 5000),
  photos: z
    .array(photoSchema)
    .min(1, "Add at least one photo")
    .max(MAX_EVENT_PHOTOS, `An event can have at most ${MAX_EVENT_PHOTOS} photos`),
});

/** Only plain web links — never javascript:, data: or other schemes. */
const websiteUrl = z
  .string()
  .trim()
  .max(500)
  .refine((value) => {
    if (value === "") return true;
    try {
      const { protocol } = new URL(value);
      return protocol === "https:" || protocol === "http:";
    } catch {
      return false;
    }
  }, "Enter a full link starting with https://");

export const startupLogoSchema = z.object({
  id,
  name: text("Startup name", 120),
  src: imageSrc,
  width: z.number().int().positive().max(10000),
  height: z.number().int().positive().max(10000),
  url: websiteUrl,
  /** When the admin added it (ms since epoch) — absent on items that predate this. */
  addedAt: z.number().int().nonnegative().optional(),
});

export const teamMemberSchema = z.object({
  id,
  name: text("Name", 120),
  role: z.string().trim().max(120),
  bio: text("Description", 1500),
  photo: imageSrc,
  /** When the admin added them (ms since epoch) — absent on members that predate this. */
  addedAt: z.number().int().nonnegative().optional(),
});

export const contentSchemas = {
  hero: z.array(heroSlideSchema).min(1, "Keep at least one hero image").max(12),
  gallery: z
    .array(galleryEventSchema)
    .max(40)
    .refine(
      (events) => new Set(events.map((e) => e.slug)).size === events.length,
      "Two events share the same URL slug",
    ),
  startups: z.array(startupLogoSchema).max(300),
  team: z.array(teamMemberSchema).max(100),
} as const;

export type ContentKey = keyof typeof contentSchemas;
export type SiteContent = {
  [K in ContentKey]: z.infer<(typeof contentSchemas)[K]>;
};

export type HeroSlide = z.infer<typeof heroSlideSchema>;
export type GalleryEvent = z.infer<typeof galleryEventSchema>;
export type EventPhoto = z.infer<typeof photoSchema>;
export type StartupLogo = z.infer<typeof startupLogoSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;

export const CONTENT_KEYS = Object.keys(contentSchemas) as ContentKey[];

/** Every image URL a piece of content references — used to find orphans. */
export function imageUrlsOf<K extends ContentKey>(key: K, data: SiteContent[K]) {
  switch (key) {
    case "hero":
      return (data as SiteContent["hero"]).map((s) => s.src);
    case "gallery":
      return (data as SiteContent["gallery"]).flatMap((e) =>
        e.photos.map((p) => p.src),
      );
    case "startups":
      return (data as SiteContent["startups"]).map((s) => s.src);
    case "team":
      return (data as SiteContent["team"]).map((m) => m.photo);
    default:
      return [];
  }
}

export function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)
      .replace(/-+$/g, "") || "event"
  );
}
