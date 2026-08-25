"use client";

import clsx from "clsx";
import {
  DPIIT_RECOGNISED_STARTUPS,
  NON_DPIIT_RECOGNISED_STARTUPS,
} from "@/lib/data";
import { scrollToTarget } from "@/lib/lenis";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

function MarqueeRow({
  items,
  reverse = false,
  offset = 0,
  label,
}: {
  items: string[];
  reverse?: boolean;
  offset?: number;
  label: string;
}) {
  // Rotate the list so the repeated loop doesn't start on the same name.
  const names = [...items.slice(offset), ...items.slice(0, offset)];
  const half = (
    <div className="flex shrink-0 items-center">
      {names.map((startup, index) => (
        <span key={`${label}-${startup}-${index}`} className="flex items-center">
          <span
            className={clsx(
              "rounded-full border border-line/40 bg-paper/80 px-5 py-2 text-[15px] font-medium whitespace-nowrap text-ink/90 shadow-[0px_8px_20px_rgba(0,0,0,0.05)] md:px-7 md:py-3 md:text-[18px]",
            )}
          >
            {startup}
          </span>
          <span aria-hidden className="mx-4 text-[10px] text-gold">◆</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee-track overflow-hidden border-y border-line/50 py-7">
      <div
        className={clsx(
          "flex w-max",
          reverse ? "animate-marquee-right" : "animate-marquee-left",
        )}
      >
        {half}
        <div aria-hidden>{half}</div>
      </div>
    </div>
  );
}

export function Startups() {
  return (
    <section id="startups" className="relative overflow-hidden py-24 lg:py-36">
      {/* Decorative watermark, kept low in the section (and clipped by
          overflow-hidden above) so it never sits under the fixed header. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-3rem] right-[-2rem] hidden -rotate-6 font-bold text-[14rem] leading-none text-gold/[0.12] select-none lg:block"
      >
        {"<>"}
      </div>

      <div className="relative mx-auto max-w-[1728px] px-6 lg:px-16">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <h2 className="font-bold text-[clamp(28px,2.6vw,40px)] capitalize">
              <span className="relative inline-block">
                <span
                  aria-hidden
                  className="absolute inset-x-[-4px] bottom-1 h-[38%] bg-gold/25"
                />
                <span className="relative">Startups</span>
              </span>{" "}
              building from this campus
            </h2>
            <button
              type="button"
              onClick={() => scrollToTarget("#contact")}
              className="group flex items-center gap-3 rounded-full border-[0.5px] border-line bg-cream px-7 py-3 text-[17px] font-medium text-gold shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:scale-[1.04] md:text-[19px]"
            >
              Join them
              <ArrowIcon className="text-[13px] transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-14">
          <p className="mx-auto max-w-[1728px] px-6 pb-5 text-[19px] font-medium tracking-[0.12em] text-ink-soft uppercase md:text-[25px] lg:px-16">
            DPIIT Recognized Startups
          </p>
          <MarqueeRow items={DPIIT_RECOGNISED_STARTUPS} label="dpiit" />
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-14">
          <p className="mx-auto max-w-[1728px] px-6 pb-5 text-[19px] font-medium tracking-[0.12em] text-ink-soft uppercase md:text-[25px] lg:px-16">
            Non DPIIT Recognized Startups
          </p>
          <MarqueeRow
            items={NON_DPIIT_RECOGNISED_STARTUPS}
            reverse
            offset={15}
            label="non-dpiit"
          />
        </div>
      </Reveal>
    </section>
  );
}
