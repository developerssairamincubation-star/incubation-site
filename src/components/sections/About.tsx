"use client";

import { motion } from "framer-motion";
import { ABOUT_ROWS } from "@/lib/data";
import { scrollToTarget } from "@/lib/lenis";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-[1728px] px-6 py-24 lg:px-16 lg:py-36">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,46%)_1fr] lg:gap-24">
        <div>
          <Reveal>
            <p className="text-[13px] font-medium tracking-[0.22em] text-ink-soft uppercase">
              About the foundation
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-serif text-[clamp(34px,3.2vw,52px)] leading-[1.15]">
              Why teams choose to build here
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 text-[17px] leading-[1.75] text-ink/90 md:text-[19px]">
              Incubation lets teams preserve their capital while they gain
              the support to move faster. We look closely at what makes each
              venture different, then wrap the right services around it — from a
              first rough prototype to the day it finds real customers.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-6 text-[15px] leading-[1.8] text-ink-soft md:text-[17px]">
              Set up in September 2020 inside Sri Sairam Institutions, the
              foundation puts an engineering campus&rsquo;s R&amp;D depth next
              to a working startup ecosystem — mentors, labs and funding, all on
              one campus.
            </p>
          </Reveal>
        </div>

        <div>
          {ABOUT_ROWS.map((row, i) => (
            <Reveal key={row.label} delay={i * 0.1}>
              <div className="grid gap-2 border-t border-line/60 py-7 md:grid-cols-[180px_1fr] md:gap-10">
                <motion.span
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                  className="font-serif text-[19px] italic text-rust"
                >
                  {row.label}
                </motion.span>
                <p className="text-[16px] leading-[1.7] text-ink/90 md:text-[18px]">
                  {row.text}{" "}
                  {row.link && (
                    <button
                      type="button"
                      onClick={() => scrollToTarget(row.link.href)}
                      className="group inline-flex items-center gap-1 text-rust transition-colors hover:text-ink"
                    >
                      {row.link.label}
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  )}
                </p>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-line/60" />
        </div>
      </div>
    </section>
  );
}
