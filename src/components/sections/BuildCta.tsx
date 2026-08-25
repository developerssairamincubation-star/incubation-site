"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";

const DARK = "#333230";

/**
 * The grey semicircle peeking from the bottom grows as you scroll until it
 * floods the whole section dark, flipping the content to light.
 */
export function BuildCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const circle = section.querySelector("[data-cta-circle]");
      const title = section.querySelector("[data-cta-title]");
      const desc = section.querySelector("[data-cta-desc]");
      const button = section.querySelector("[data-cta-button]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.6,
        },
      });

      // The circle starts as the shallow arc from the design and scales up
      // around its bottom-anchored center until it covers the viewport.
      tl.fromTo(
        circle,
        { scale: 1 },
        { scale: 14, duration: 1, ease: "power2.in" },
      )
        .to(title, { color: "#f6f1e7", duration: 0.18 }, 0.62)
        .to(desc, { color: "rgba(246,241,231,0.85)", duration: 0.18 }, 0.64)
        .to(
          button,
          {
            backgroundColor: "#f6f1e7",
            color: "#c1502a",
            duration: 0.18,
          },
          0.66,
        );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="build" ref={sectionRef} className="relative overflow-hidden">
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Bottom semicircle that floods the section */}
        <div
          data-cta-circle
          aria-hidden
          className="absolute bottom-[-46vw] left-1/2 h-[50vw] w-[110vw] -translate-x-1/2 rounded-[50%] will-change-transform"
          style={{ backgroundColor: DARK }}
        />

        <h2
          data-cta-title
          className="relative z-10 max-w-[900px] font-bold text-[clamp(30px,3vw,44px)] capitalize"
        >
          Have something you&rsquo;re ready to build?
        </h2>
        <p
          data-cta-desc
          className="relative z-10 mt-6 max-w-[560px] text-[17px] leading-relaxed text-ink/80 md:text-[19px]"
        >
          Pitch your idea to the incubation panel. Students, faculty and external
          teams are all welcome.
        </p>
        <button
          type="button"
          data-cta-button
          onClick={() => router.push("/apply")}
          className="relative z-10 mt-10 rounded-[3px] bg-ink px-12 py-3 text-[19px] font-bold text-white transition-transform duration-300 hover:scale-105"
        >
          Apply
        </button>
      </div>
    </section>
  );
}
