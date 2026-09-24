"use client";

import { motion } from "framer-motion";
import { ABOUT_ROWS, FOUNDATION_STATS, GLOBAL_COLLAB } from "@/lib/data";
import { scrollToTarget } from "@/lib/lenis";
import { Reveal } from "@/components/ui/Reveal";
import {
  BuildingStatIcon,
  InfraStatIcon,
  RocketStatIcon,
  RupeeStatIcon,
} from "@/components/ui/StatIcons";

const STAT_ICONS = {
  rocket: RocketStatIcon,
  building: BuildingStatIcon,
  rupee: RupeeStatIcon,
  infra: InfraStatIcon,
} as const;

export function About() {
  return (
    <section id="about" className="mx-auto max-w-[1728px] px-6 py-24 lg:px-16 lg:py-36">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,52%)_1fr] lg:gap-24">
        <div>
          <Reveal>
            <p className="text-[13px] font-medium tracking-[0.22em] text-ink-soft uppercase">
              About the foundation
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-serif text-[clamp(34px,3.2vw,52px)] leading-[1.15]">
              Powering innovation, building impact
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 text-[17px] leading-[1.75] text-ink/90 md:text-[19px]">
              Set up in September 2020 inside Sri Sairam Institutions, the
              Sri Sairam Techno Incubator Foundation today hosts over 165
              startups within a sprawling 75,000+ sq ft innovation space,
              working across Artificial Intelligence, Semiconductor Design,
              Robotics, Drones, Marine Technology, Cybersecurity, Blockchain,
              Additive Manufacturing, Agriculture Technology, AR/VR/MR and
              Rescue Technologies.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="mt-6 text-[15px] leading-[1.8] text-ink-soft md:text-[17px]">
              State-of-the-art laboratories, advanced prototyping facilities,
              mentorship, shared services, industry connections and investor
              access have helped our startups collectively secure over ₹10
              crores in external funding — through Startup India Seed Fund,
              iDEX, EDII-TN, StartupTN, Lockheed Martin, IIT Mandi, IIT
              Kharagpur and AMTZ Andhra Pradesh.
            </p>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="mt-6 text-[15px] leading-[1.8] text-ink-soft md:text-[17px]">
              SSTIF has further invested ₹10+ crores of its own toward
              infrastructure and research development. It is an
              MSME-approved Business Incubator and a SEC-TDC Facilitation
              Centre — a national innovation enabler.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-5 self-start sm:gap-6">
          {FOUNDATION_STATS.map((stat, i) => {
            const Icon = STAT_ICONS[stat.icon];
            return (
              <Reveal key={stat.label} delay={0.1 + i * 0.08}>
                <div className="flex h-full flex-col gap-4 rounded-[18px] border border-line/50 bg-paper px-6 py-7 shadow-[0px_10px_30px_rgba(0,0,0,0.04)]">
                  <Icon className="text-[30px] text-rust" />
                  <div>
                    <p className="font-serif text-[clamp(24px,2.4vw,32px)] leading-none text-ink">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[14px] leading-snug text-ink-soft">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <div className="mt-16 grid gap-16 lg:grid-cols-[minmax(0,52%)_1fr] lg:gap-24">
        <Reveal>
          <div className="border-t border-line/60 pt-9">
            <p className="font-serif text-[19px] italic text-rust">
              {GLOBAL_COLLAB.heading}
            </p>
            <p className="mt-4 text-[16px] leading-[1.75] text-ink/90 md:text-[17px]">
              {GLOBAL_COLLAB.text}
            </p>
          </div>
        </Reveal>

        <div>
          {ABOUT_ROWS.map((row, i) => (
            <Reveal key={row.label} delay={i * 0.1}>
              <div className="grid gap-2 border-t border-line/60 py-7 first:border-t-0 first:pt-0 md:grid-cols-[180px_1fr] md:gap-10">
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
