import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/**
 * Set just before navigating from an event page back home, so the gallery
 * can restore itself instead of leaving the visitor at the top of the page.
 */
export const GALLERY_RETURN_KEY = "stic-return-to-gallery";

/** Jump straight to a Y offset, keeping Lenis's internal position in sync. */
export function jumpToY(y: number) {
  if (instance) {
    // Remeasure first: right after a route change Lenis can still be holding
    // the previous page's scroll limit (0 for the short event page), which
    // would clamp the target and dump the visitor back at the top.
    instance.resize();
    instance.scrollTo(y, { immediate: true, force: true });
  } else {
    window.scrollTo(0, y);
  }
}

/** Smooth-scroll to an anchor target, falling back to native scrolling. */
export function scrollToTarget(target: string) {
  if (instance) {
    // If a selector is provided, resolve to the element first so Lenis
    // receives either an element or a numeric value (Lenis accepts both).
    const el = typeof target === "string" && target.startsWith("#")
      ? document.querySelector(target) as HTMLElement | null
      : null;
    instance.scrollTo(el ?? target, { offset: -72, duration: 1.4 });
  } else {
    document
      .querySelector(target)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
