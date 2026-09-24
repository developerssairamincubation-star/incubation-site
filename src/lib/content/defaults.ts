import { GALLERY_ITEMS, HERO_SLIDES, STARTUP_LOGOS } from "@/lib/data";
import type { SiteContent } from "./schema";

/**
 * The content the site shipped with. It seeds the database the first time
 * each section is read, and is what the site falls back to when no database
 * is configured (e.g. local development without a DATABASE_URL).
 */
export const DEFAULT_CONTENT: SiteContent = {
  hero: HERO_SLIDES.map((slide, i) => ({
    id: `hero-${i + 1}`,
    src: slide.src,
    alt: slide.alt,
  })),
  gallery: GALLERY_ITEMS.map((event) => ({
    id: `event-${event.slug}`,
    slug: event.slug,
    caption: event.caption,
    title: event.title,
    details: event.details,
    photos: event.album.map((photo) => ({ src: photo.src, alt: photo.alt })),
  })),
  startups: STARTUP_LOGOS.map((logo) => ({
    id: `startup-${logo.src.split("/").pop()?.replace(/\.[a-z]+$/, "")}`,
    name: logo.name,
    src: logo.src,
    width: logo.width,
    height: logo.height,
    url: "",
  })),
  team: [],
};
