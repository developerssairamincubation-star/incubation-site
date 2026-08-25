import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
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
