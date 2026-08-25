"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { STATS } from "@/lib/data";
import { gsap } from "@/lib/gsap";

/**
 * A digit column holds 0-9 twice plus a trailing 0 (21 rows, mirroring the
 * Figma "counter lines"). Rolling to row 10+digit gives every digit a full
 * slot-machine spin before it lands.
 */
const COLUMN_DIGITS = [...Array(10).keys(), ...Array(10).keys(), 0];

function RollingNumber({ value }: { value: number }) {
  const digits = String(value).padStart(2, "0").split("").map(Number);

  return (
    <div
      className="flex justify-center overflow-hidden text-[clamp(56px,6vw,96px)] font-semibold tabular-nums"
      aria-label={String(value).padStart(2, "0")}
    >
      {digits.map((digit, i) => (
        <span
          key={i}
          data-digit={digit}
          className="flex h-[1.12em] flex-col items-center leading-[1.12]"
          aria-hidden
        >
          {COLUMN_DIGITS.map((d, j) => (
            <span key={j}>{d}</span>
          ))}
        </span>
      ))}
    </div>
  );
}

export function StatsBand() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const columns = gsap.utils.toArray<HTMLElement>("[data-digit]");
      gsap.fromTo(
        columns,
        { yPercent: 0 },
        {
          // Each digit row is exactly as tall as the clipping window, so
          // rolling to row N means translating by N times the element height.
          yPercent: (_, el: HTMLElement) => {
            const digit = Number(el.dataset.digit);
            return -(10 + digit) * 100;
          },
          duration: 2.4,
          ease: "power4.inOut",
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="bg-ink py-14 text-white">
      <div className="mx-auto grid max-w-[1728px] grid-cols-2 gap-y-12 px-6 lg:grid-cols-4 lg:px-16">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={clsx(
              "flex flex-col items-center gap-3 text-center",
              i > 0 && "lg:border-l lg:border-white/20",
            )}
          >
            <RollingNumber value={stat.value} />
            <p className="text-[19px] font-semibold capitalize md:text-[25px]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
