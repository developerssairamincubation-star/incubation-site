"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIntro } from "@/components/providers/IntroProvider";

const SESSION_KEY = "stic-intro-seen";
/**
 * The logo mark occupies this crop of the 1920x1080 source video (see
 * logo-mark.jpg) and sits exactly centered within it — 510 + 900/2 = 960
 * (half of 1920), 90 + 900/2 = 540 (half of 1080) — so we only ever need the
 * displayed video box's own center and width to place it, regardless of how
 * large or small that box is rendered.
 */
const MARK_SIZE_IN_VIDEO = 900;
const VIDEO_W = 1920;

/**
 * Full-screen intro: plays the logo animation video once per browser session,
 * then flies the finished logo mark into the header logo position. Unmounts
 * once the intro context flips to done.
 */
export function IntroOverlay() {
  const { introDone, finishIntro } = useIntro();
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const markRef = useRef<HTMLImageElement>(null);
  const startedFlight = useRef(false);

  const flyToHeader = useCallback(() => {
    if (startedFlight.current) return;
    startedFlight.current = true;
    sessionStorage.setItem(SESSION_KEY, "1");

    const overlay = overlayRef.current;
    const video = videoRef.current;
    const mark = markRef.current;
    const headerLogo = document.getElementById("header-logo");

    const done = () => {
      document.documentElement.style.overflow = "";
      finishIntro();
    };

    if (!overlay || !mark || !headerLogo) {
      done();
      return;
    }

    // Place the mark image exactly over the logo as rendered inside the
    // (now deliberately smaller) video box, so the swap from video to image
    // is invisible. The video box shares the source's 16:9 aspect ratio, so
    // there's no object-fit letterboxing to account for — just its own
    // rendered width and center.
    const videoBox = video?.getBoundingClientRect();
    const scale = videoBox ? videoBox.width / VIDEO_W : 1;
    const centerX = videoBox ? videoBox.left + videoBox.width / 2 : window.innerWidth / 2;
    const centerY = videoBox ? videoBox.top + videoBox.height / 2 : window.innerHeight / 2;
    const markSize = MARK_SIZE_IN_VIDEO * scale;
    gsap.set(mark, {
      opacity: 1,
      width: markSize,
      height: markSize,
      left: centerX - markSize / 2,
      top: centerY - markSize / 2,
    });

    // The header shows the horizontal lockup; the mark lands on its icon
    // portion (a square on the left edge of the lockup).
    const target = headerLogo.getBoundingClientRect();
    const targetSize = target.height * 1.15;

    const tl = gsap.timeline({ onComplete: done });
    tl.to(video, { opacity: 0, duration: 0.25 }, 0)
      .to(
        mark,
        {
          left: target.left - targetSize * 0.06,
          top: target.top + (target.height - targetSize) / 2,
          width: targetSize,
          height: targetSize,
          duration: 1.05,
          ease: "power3.inOut",
        },
        0.05,
      )
      .to(mark, { opacity: 0, duration: 0.3 }, "-=0.28")
      .to(overlay, { opacity: 0, duration: 0.45, ease: "power2.out" }, "-=0.3");
  }, [finishIntro]);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      finishIntro();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    videoRef.current?.play().catch(() => flyToHeader());

    // Safety net: never trap the user if the video stalls.
    const failsafe = window.setTimeout(() => flyToHeader(), 9000);
    return () => {
      window.clearTimeout(failsafe);
      document.documentElement.style.overflow = "";
    };
  }, [finishIntro, flyToHeader]);

  if (introDone) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "var(--color-cream)" }}
      aria-label="Intro animation"
    >
      {/* Deliberately smaller than fullscreen — aspect-video matches the
          source exactly, so the video fills this box with no letterboxing. */}
      <div className="aspect-video w-[clamp(220px,42vw,460px)]">
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          src="/videos/logo-intro.mp4"
          muted
          playsInline
          preload="auto"
          onEnded={flyToHeader}
          onError={flyToHeader}
        />
      </div>
      {/* Final video frame's logo mark — the element that flies to the header. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={markRef}
        src="/images/logo-mark.jpg"
        alt=""
        className="pointer-events-none absolute opacity-0"
      />
      <button
        type="button"
        onClick={flyToHeader}
        className="absolute right-8 bottom-8 rounded-full border border-line px-5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-cream-soft"
      >
        Skip intro
      </button>
    </div>
  );
}
