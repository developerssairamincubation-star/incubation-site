"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { GALLERY_ITEMS } from "@/lib/data";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { GALLERY_RETURN_KEY, jumpToY } from "@/lib/lenis";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

/**
 * Scroll story (desktop):
 *   1. the cards rise from below and gather as a pile while the section is
 *      pinned,
 *   2. the pile disperses into the scattered, tilted row from the design —
 *      sweeping left first, then settling right, instead of a straight cut,
 *   3. the row becomes a slow infinite conveyor; arrows advance it and
 *      hovering a card pauses the drift and lifts a black gradient caption.
 * On mobile / reduced motion it falls back to a swipeable snap carousel.
 */

// Tilt per card instance, echoing the Figma layout.
const ROTATIONS = [1.26, -5.34, 2.9, -2.72, 3.62, -2.1, 1.8, -3.4];
// 5 unique photos + 3 repeats so the conveyor loop never shows a hole.
const INSTANCES = ROTATIONS.map((rotation, i) => ({
  ...GALLERY_ITEMS[i % GALLERY_ITEMS.length],
  rotation,
  id: i,
}));

const DRIFT_SPEED = 30; // px per second

function GalleryCard({
  item,
  className,
  style,
  href,
}: {
  item: (typeof INSTANCES)[number];
  className?: string;
  style?: React.CSSProperties;
  href: string;
}) {
  return (
    <Link
      href={href}
      data-gallery-card
      className={`group block text-left ${className ?? ""}`}
      style={style}
    >
      <figure
        className="relative aspect-[307/413] w-full overflow-hidden rounded-[17px] shadow-[0px_5px_11px_rgba(0,0,0,0.25)]"
        style={{ transform: `rotate(${item.rotation}deg)` }}
      >
        <Image
          src={item.src}
          alt={item.caption}
          fill
          sizes="(min-width: 1024px) 22vw, 70vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        {/* Black gradient rising from the bottom on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <figcaption className="absolute inset-x-0 bottom-6 translate-y-3 text-center text-[19px] font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {item.caption}
        </figcaption>
      </figure>
    </Link>
  );
}

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const drift = useRef({ offset: 0, active: false, paused: false });

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const cards = Array.from(
          stage.querySelectorAll<HTMLElement>("[data-gallery-card]"),
        );
        const state = drift.current;
        let base: number[] = [];
        let cardW = 0;
        let cycle = 0;

        const measure = () => {
          const stageW = stage.clientWidth;
          cardW = stageW * 0.21;
          const spacing = (stageW - cardW) / 4;
          base = cards.map((_, i) => i * spacing);
          cycle = cards.length * spacing;
          cards.forEach((card) => gsap.set(card, { width: cardW }));
        };
        measure();

        const render = () => {
          const wrap = gsap.utils.wrap(-cardW * 1.05, cycle - cardW * 1.05);
          cards.forEach((card, i) => {
            gsap.set(card, { x: wrap(base[i] + state.offset) });
          });
        };

        // Slow conveyor drift once the disperse has finished.
        const tick = (_t: number, delta: number) => {
          if (!state.active || state.paused) return;
          state.offset -= (DRIFT_SPEED * delta) / 1000;
          render();
        };
        gsap.ticker.add(tick);

        const stackX = () => stage.clientWidth / 2 - cardW / 2;
        // How far the pile sweeps left before settling right into its final
        // row position — a fraction of the stage width, not the final spot.
        const overshoot = () => stage.clientWidth * 0.07;

        // Create a timeline that is played once when the section enters the
        // viewport (rather than being scrubbed by continued scrolling). The
        // section remains pinned while the animation plays, then the conveyor
        // drift takes over automatically.
        const tl = gsap.timeline({ paused: true });
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=170%",
          pin: true,
          invalidateOnRefresh: true,
          onEnter: () => tl.play(),
          onLeave: () => {
            state.active = true;
          },
          onEnterBack: () => {
            // Reset conveyor state and restart the entrance timeline so
            // the stacked -> disperse animation runs again when scrolling
            // back up into the section.
            state.active = false;
            state.offset = 0;
            tl.pause(0);
            tl.restart();
          },
        });

        // 1. Cards rise from below into a slightly messy pile.
        tl.fromTo(
          cards,
          {
            x: (i) => stackX() + (i % 3) * 8 - 8,
            y: "120vh",
            rotation: (i) => ROTATIONS[i] * 2.4,
            scale: 0.92,
          },
          {
            y: "4vh",
            duration: 0.22,
            ease: "power2.out",
            stagger: 0.035,
          },
        )
          // 2. A breath while the pile sits together.
          .to({}, { duration: 0.05 })
          // 3. The pile sweeps left first...
          .to(cards, {
            x: (i) => base[i] - overshoot(),
            y: -10,
            scale: 0.97,
            rotation: (i) => ROTATIONS[i] * 0.5,
            duration: 0.16,
            ease: "power2.out",
            stagger: { each: 0.025, from: "center" },
          })
          // ...then settles right into the final scattered row.
          .to(cards, {
            x: (i) => base[i],
            y: 0,
            scale: 1,
            rotation: (i) => ROTATIONS[i],
            duration: 0.2,
            ease: "power3.inOut",
            stagger: { each: 0.03, from: "center" },
            onComplete: () => {
              state.active = true;
            },
            onReverseComplete: () => {
              state.active = false;
              state.offset = 0;
            },
          })
          .to({}, { duration: 0.55 });

        // Returning from an event page: land on the gallery with the cards
        // already dispersed and the conveyor running, rather than at the top
        // of the page with an empty stage.
        let restoreFrame = 0;
        let restoreTimer = 0;
        if (sessionStorage.getItem(GALLERY_RETURN_KEY)) {
          const restore = () => {
            // Cleared only once the restore actually runs — clearing it at
            // detection time meant StrictMode's throwaway first mount ate the
            // flag and the real mount had nothing left to act on.
            sessionStorage.removeItem(GALLERY_RETURN_KEY);
            ScrollTrigger.refresh();
            measure();
            // Re-evaluate the timeline's function-based values against the
            // freshly measured positions before jumping it to the end.
            tl.invalidate().progress(1);
            state.offset = 0;
            state.active = true;
            render();
            jumpToY(st.start);
            // Re-assert next frame so late scroll restoration can't win.
            restoreFrame = requestAnimationFrame(() => jumpToY(st.start));
          };
          // Deferred a tick so Lenis (created in a parent effect, which runs
          // after this child effect) exists and the pin spacer is laid out
          // before `st.start` is read.
          restoreTimer = window.setTimeout(restore, 120);
        }

        const pause = () => {
          state.paused = true;
        };
        const resume = () => {
          state.paused = false;
        };
        stage.addEventListener("pointerenter", pause);
        stage.addEventListener("pointerleave", resume);

        const onResize = () => {
          measure();
          if (state.active) render();
        };
        window.addEventListener("resize", onResize);

        return () => {
          gsap.ticker.remove(tick);
          stage.removeEventListener("pointerenter", pause);
          stage.removeEventListener("pointerleave", resume);
          window.removeEventListener("resize", onResize);
          window.clearTimeout(restoreTimer);
          cancelAnimationFrame(restoreFrame);
          st.kill();
          tl.kill();
          state.active = false;
          state.offset = 0;
        };
      },
    );

    // Mobile / reduced motion never runs the pinned timeline above, so the
    // return flag is consumed here with a plain jump to the section.
    mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
      if (!sessionStorage.getItem(GALLERY_RETURN_KEY)) return;
      const timer = window.setTimeout(() => {
        sessionStorage.removeItem(GALLERY_RETURN_KEY);
        jumpToY(section.offsetTop);
      }, 120);
      return () => window.clearTimeout(timer);
    });

    return () => mm.revert();
  }, []);

  const nudge = (direction: 1 | -1) => {
    const state = drift.current;
    const stage = stageRef.current;
    if (!stage) return;
    if (!state.active) {
      // Before the pin completes (or on mobile) just scroll the snap track.
      const scroller = stage.querySelector<HTMLElement>("[data-snap-track]");
      scroller?.scrollBy({
        left: direction * scroller.clientWidth * 0.7,
        behavior: "smooth",
      });
      return;
    }
    const step = (stage.clientWidth - stage.clientWidth * 0.21) / 4;
    gsap.to(state, {
      offset: state.offset - direction * step,
      duration: 0.8,
      ease: "power3.out",
    });
  };

  return (
    <section id="gallery" ref={sectionRef} className="relative overflow-hidden">
      <div className="flex min-h-screen flex-col justify-center py-20">
        <h2 className="text-center font-bold text-[clamp(30px,3vw,44px)] capitalize">
          Explore our gallery
        </h2>

        {/* Desktop: pinned stack → disperse → conveyor stage */}
        <div className="relative mt-16 hidden lg:block">
          <div ref={stageRef} className="relative mx-auto h-[56vh] max-w-[1560px] px-8">
            {/* No overflow clipping here — the section above (min-h-screen,
                overflow-hidden) already contains the entrance state (cards
                start at y:120vh) with plenty of vertical headroom, so a
                rotated card's bounding box never gets cut off the way it did
                when this shorter 56vh box was doing the clipping. */}
            <div className="relative h-full z-10">
              {INSTANCES.map((item) => (
                <div key={item.id} className="absolute top-1/2 left-0 -translate-y-1/2">
                  <GalleryCard
                    item={item}
                    href={`/gallery/${item.slug}`}
                    className="will-change-transform"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-1/2 left-2 z-30 -translate-y-1/2 xl:left-6">
            <button
              type="button"
              aria-label="Previous photos"
              onClick={() => nudge(-1)}
              className="flex h-[min(56vh,420px)] w-[72px] items-center justify-center rounded-[28px] border border-white/35 bg-cream/55 text-ink/70 shadow-[0px_10px_40px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all hover:scale-[1.02] hover:text-ink"
            >
              <ArrowIcon className="rotate-180 text-[38px]" />
            </button>
          </div>
          <div className="absolute top-1/2 right-2 z-30 -translate-y-1/2 xl:right-6">
            <button
              type="button"
              aria-label="Next photos"
              onClick={() => nudge(1)}
              className="flex h-[min(56vh,420px)] w-[72px] items-center justify-center rounded-[28px] border border-white/35 bg-cream/55 text-ink/70 shadow-[0px_10px_40px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all hover:scale-[1.02] hover:text-ink"
            >
              <ArrowIcon className="text-[38px]" />
            </button>
          </div>
        </div>

        {/* Mobile / reduced motion: swipeable snap carousel */}
        <div className="mt-12 lg:hidden">
          <div
            data-snap-track
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6"
          >
            {GALLERY_ITEMS.map((item, i) => (
              <GalleryCard
                key={item.src}
                item={{ ...item, rotation: ROTATIONS[i], id: i }}
                href={`/gallery/${item.slug}`}
                className="w-[70vw] max-w-[320px] shrink-0 snap-center"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
