"use client";

import Image from "next/image";
import clsx from "clsx";
import type { StartupLogo } from "@/lib/content/schema";
import { scrollToTarget } from "@/lib/lenis";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

const CARD_CLASSES =
  "flex h-[92px] min-w-[150px] items-center justify-center rounded-2xl border border-white/50 bg-white/10 px-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md md:h-[108px] md:min-w-[170px] md:px-8";

function LogoRow({
  items,
  label,
  duplicate = false,
}: {
  items: StartupLogo[];
  label: string;
  /** The copy that makes the loop seamless — hidden from assistive tech. */
  duplicate?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={duplicate || undefined}>
      {items.map((logo) => {
        // Capping every mark at the same height makes square badges read as
        // much smaller than wide wordmarks, so give the squarer ones a taller
        // cap — it evens out the optical weight across the row.
        const isWordmark = logo.width / logo.height >= 1.6;
        const image = (
          <Image
            src={logo.src}
            alt={logo.name}
            width={logo.width}
            height={logo.height}
            // These are final-form, small (≈200px tall) logos, so
            // re-optimising them buys nothing and costs a transformation per
            // logo. Eager, because a lazy logo inside a moving track only
            // starts loading as it slides in — a blank card on the first lap.
            unoptimized
            loading="eager"
            className={clsx(
              "w-auto object-contain",
              isWordmark
                ? "max-h-[46px] md:max-h-[56px]"
                : "max-h-[68px] md:max-h-[84px]",
            )}
          />
        );

        return (
          <span key={`${label}-${logo.id}`} className="flex items-center">
            {logo.url ? (
              <a
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                // The duplicate is aria-hidden, so it must not be tabbable
                // either — otherwise keyboard users hit every link twice.
                tabIndex={duplicate ? -1 : undefined}
                title={`Visit ${logo.name}`}
                className={clsx(
                  CARD_CLASSES,
                  "transition-transform duration-300 hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                )}
              >
                {image}
              </a>
            ) : (
              <span className={CARD_CLASSES}>{image}</span>
            )}
            <span aria-hidden className="mx-4 text-[10px] text-gold">
              ◆
            </span>
          </span>
        );
      })}
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
  label,
}: {
  items: StartupLogo[];
  reverse?: boolean;
  label: string;
}) {
  // The row is rendered twice so the -50% keyframe lands exactly where the
  // loop started.
  return (
    <div className="marquee-track overflow-hidden border-y border-line/50 py-7">
      <div
        className={clsx(
          "flex w-max",
          reverse ? "animate-logos-right" : "animate-logos-left",
        )}
      >
        <LogoRow items={items} label={label} />
        <LogoRow items={items} label={`${label}-copy`} duplicate />
      </div>
    </div>
  );
}

export function Startups({ logos }: { logos: StartupLogo[] }) {
  if (logos.length === 0) return null;

  // Two rows, split by alternating index rather than cutting the list in
  // half, so each row gets a similar mix of wide wordmarks and square badges.
  const rowOne = logos.filter((_, i) => i % 2 === 0);
  const rowTwo = logos.filter((_, i) => i % 2 === 1);

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
        <div className="mt-14 flex flex-col gap-6">
          <MarqueeRow items={rowOne} label="row-1" />
          {rowTwo.length > 0 && (
            <MarqueeRow items={rowTwo} reverse label="row-2" />
          )}
        </div>
      </Reveal>
    </section>
  );
}
