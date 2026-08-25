"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { FOCUS_AREAS } from "@/lib/data";
import { scrollToTarget } from "@/lib/lenis";
import { Reveal } from "@/components/ui/Reveal";

export function FocusAreas() {
  // The design shows one area expanded at a time; hover opens on desktop,
  // tap toggles on touch devices.
  const [open, setOpen] = useState<number | null>(2);

  return (
    <section
      id="thrust-areas"
      className="relative overflow-hidden bg-[#BE9E70] px-6 py-24 lg:px-16 lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-6rem] left-[-8rem] rotate-[12deg] font-bold text-[30rem] leading-none text-gold/[0.14] select-none"
      >
        #
      </div>

      <div className="relative mx-auto grid max-w-[1728px] gap-16 lg:grid-cols-[minmax(0,40%)_1fr] lg:gap-24">
        <div>
          <Reveal>
            <p className="text-[13px] font-medium tracking-[0.22em] text-ink-soft uppercase">
              Focus areas
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-serif text-[clamp(34px,3.2vw,52px)] leading-[1.15]">
              Our core areas of work
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-[460px] text-[16px] leading-[1.75] text-ink/85 md:text-[18px]">
              We&rsquo;re not domain-agnostic. These are the problems our labs,
              mentors and partners are set up to help you solve.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <button
              type="button"
              onClick={() => scrollToTarget("#contact")}
              className="group mt-8 inline-flex items-center gap-2 text-[16px] font-medium text-rust transition-colors hover:text-ink md:text-[17px]"
            >
              Working on one of these? Send us your idea
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </Reveal>
        </div>

        <Reveal className="relative z-10">
          <ul>
            {FOCUS_AREAS.map((area, i) => {
              const isOpen = open === i;
              return (
                <li key={area.title} className="border-t border-line/60 last:border-b">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onMouseEnter={() => setOpen(i)}
                    onFocus={() => setOpen(i)}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="grid w-full grid-cols-[3.5rem_1fr] items-center gap-4 py-6 text-left"
                  >
                    <span className="font-serif text-[15px] italic text-ink-soft/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={clsx(
                        "font-serif text-[clamp(22px,2vw,32px)] transition-colors duration-300",
                        isOpen ? "text-rust" : "text-ink",
                      )}
                    >
                      {area.title}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pr-8 pb-7 pl-[calc(3.5rem+1rem)] text-[16px] leading-[1.7] text-ink-soft md:text-[18px]">
                          {area.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
