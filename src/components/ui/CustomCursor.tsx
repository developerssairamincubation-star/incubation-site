"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const LIGHT_COLOR = "#141414";
const DARK_COLOR = "#f6f1e7";
/** Perceptual brightness (YIQ-style, 0-255). Below this, a background reads as "dark". */
const DARK_BRIGHTNESS_THRESHOLD = 150;

function elementBrightness(el: Element | null): number | null {
  let node: Element | null = el;
  while (node && node !== document.documentElement) {
    const bg = getComputedStyle(node).backgroundColor;
    const match = bg.match(
      /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\)/,
    );
    if (match) {
      const [, r, g, b, a] = match;
      const alpha = a === undefined ? 1 : parseFloat(a);
      if (alpha > 0.5) {
        return (Number(r) * 299 + Number(g) * 587 + Number(b) * 114) / 1000;
      }
    }
    node = node.parentElement;
  }
  return null;
}

/**
 * A ring + dot cursor that trails the pointer with a smooth lag, growing over
 * interactive elements and swapping from dark to light (and back) the moment
 * it crosses onto a dark-background section, so it stays visible everywhere.
 * Skips touch devices and prefers-reduced-motion — the native cursor stays.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const setRingX = gsap.quickTo(ring, "x", { duration: 0.10, ease: "power3" });
    const setRingY = gsap.quickTo(ring, "y", { duration: 0.10, ease: "power3" });
    const setDotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const setDotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });

    let isDark = false;
    let lastChecked: Element | null = null;

    const applyColor = (dark: boolean) => {
      if (dark === isDark) return;
      isDark = dark;
      const color = dark ? DARK_COLOR : LIGHT_COLOR;
      gsap.to(ring, { borderColor: color, duration: 0.25 });
      gsap.to(dot, { backgroundColor: color, duration: 0.25 });
    };

    const onMove = (e: MouseEvent) => {
      setRingX(e.clientX);
      setRingY(e.clientY);
      setDotX(e.clientX);
      setDotY(e.clientY);
      gsap.set([ring, dot], { opacity: 1 });

      const target = e.target as Element | null;
      const interactive = target?.closest?.("button, a, input, textarea, [role='button']");
      gsap.to(ring, { scale: interactive ? 1.7 : 1, duration: 0.3, ease: "power3.out" });

      // Checked directly off the event target rather than gated behind a
      // requestAnimationFrame throttle — mousemove is already rate-limited
      // by the browser, and a short ancestor walk is cheap enough to run
      // on every event without visibly costing anything.
      if (target && target !== lastChecked) {
        lastChecked = target;
        const brightness = elementBrightness(target);
        if (brightness !== null) applyColor(brightness < DARK_BRIGHTNESS_THRESHOLD);
      }
    };

    const onLeaveWindow = () => gsap.to([ring, dot], { opacity: 0, duration: 0.2 });

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    document.body.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[200] size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] opacity-0"
        style={{ borderColor: LIGHT_COLOR }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[200] size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{ backgroundColor: LIGHT_COLOR }}
      />
    </>
  );
}
