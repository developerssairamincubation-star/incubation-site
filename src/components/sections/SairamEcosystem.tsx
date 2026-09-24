"use client";

import { ECOSYSTEM_CONTENT, ECOSYSTEM_LINK, ECOSYSTEM_STATS } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

export function SairamEcosystem() {
  return (
    <section className="border-t border-line/40 bg-cream-soft/50 px-6 py-24 lg:px-16 lg:py-32">
      <div className="mx-auto grid max-w-[1728px] gap-14 lg:grid-cols-[minmax(0,52%)_1fr] lg:gap-24">
        <div>
          <Reveal>
            <p className="text-[13px] font-medium tracking-[0.22em] text-ink-soft uppercase">
              {ECOSYSTEM_CONTENT.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-serif text-[clamp(30px,2.8vw,44px)] leading-[1.2]">
              {ECOSYSTEM_CONTENT.heading}
            </h2>
          </Reveal>
          {ECOSYSTEM_CONTENT.paragraphs.map((text, i) => (
            <Reveal key={i} delay={0.16 + i * 0.08}>
              <p className="mt-6 text-[16px] leading-[1.8] text-ink-soft first:mt-8 md:text-[18px]">
                {text}
              </p>
            </Reveal>
          ))}
          <Reveal delay={0.32}>
            <a
              href={ECOSYSTEM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-9 inline-flex items-center gap-3 rounded-full border-[0.5px] border-line bg-paper px-7 py-3 text-[16px] font-medium text-gold shadow-[0_0_8px_rgba(0,0,0,0.06)] transition-transform duration-300 hover:scale-[1.04] md:text-[18px]"
            >
              Know more about the ecosystem
              <ArrowIcon className="text-[12px] transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-4 sm:gap-5">
            {ECOSYSTEM_STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={0.1 + i * 0.08}>
                <div className="flex h-full flex-col justify-between gap-3 rounded-[16px] border border-line/50 bg-paper px-4 py-6 text-center shadow-[0px_10px_28px_rgba(0,0,0,0.04)]">
                  <p className="font-serif text-[clamp(20px,2vw,28px)] leading-none text-ink">
                    {stat.value}
                  </p>
                  <p className="text-[12px] leading-tight text-ink-soft uppercase tracking-[0.06em] md:text-[13px]">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.34}>
            <div className="flex items-center gap-4 rounded-[18px] border border-gold/40 bg-gold/10 px-6 py-6">
              <span aria-hidden className="font-serif text-[40px] leading-none text-gold/70">
                &ldquo;
              </span>
              <p className="font-serif text-[18px] italic text-ink md:text-[20px]">
                {ECOSYSTEM_CONTENT.quote}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
