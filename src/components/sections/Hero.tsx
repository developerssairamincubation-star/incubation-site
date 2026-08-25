"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType } from "embla-carousel";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { HERO_SLIDES, SITE } from "@/lib/data";
import { useIntro } from "@/components/providers/IntroProvider";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { gsap } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/lenis";

const PARALLAX_FACTOR = 0.24;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const { introDone } = useIntro();
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const [selected, setSelected] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 34 }, [
    Autoplay({ delay: 2600, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  // Classic Embla parallax: the image inside each slide drifts against the
  // scroll direction while slides move, which keeps the motion feeling alive.
  const applyParallax = useCallback((api: EmblaCarouselType) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();

    api.scrollSnapList().forEach((snap, snapIndex) => {
      let diffToTarget = snap - scrollProgress;
      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (snapIndex === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = snap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = snap + (1 - scrollProgress);
          }
        });
      }
      const slide = api.slideNodes()[snapIndex];
      const img = slide?.querySelector<HTMLElement>("[data-parallax]");
      if (img) {
        img.style.transform = `translateX(${diffToTarget * PARALLAX_FACTOR * -100}%)`;
      }
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    applyParallax(emblaApi);
    emblaApi
      .on("select", onSelect)
      .on("scroll", applyParallax)
      .on("reInit", applyParallax);
    return () => {
      emblaApi.off("select", onSelect).off("scroll", applyParallax);
    };
  }, [emblaApi, applyParallax]);

  // Gentle scroll parallax on the decorative ring + watermark.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-ring]", {
        y: 130,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to("[data-hero-mark]", {
        y: -90,
        rotate: 8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative overflow-hidden pt-[72px]"
    >
      {/* Decorative parallax layers */}
      <div
        data-hero-ring
        aria-hidden
        className="pointer-events-none absolute top-[38%] left-[-12rem] size-[32rem] rounded-full border-[1.5px] border-gold/30"
      />
      <div
        data-hero-mark
        aria-hidden
        className="pointer-events-none absolute top-[8%] right-[38%] hidden rotate-[17deg] font-bold text-[26rem] leading-none text-gold/[0.06] select-none lg:block"
      >
        *
      </div>

      <div className="mx-auto grid max-w-[1728px] items-center gap-12 px-6 pt-10 pb-16 lg:grid-cols-[1fr_minmax(0,44%)] lg:px-16 lg:pt-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate={introDone ? "show" : "hidden"}
          className="relative z-10 text-center lg:text-left"
        >
          <motion.p
            variants={item}
            className="text-[15px] tracking-[0.14em] text-ink-soft uppercase md:text-[19px]"
          >
            {SITE.name}
          </motion.p>
          <motion.h1
            variants={item}
            className="mt-5 font-bold text-[clamp(34px,3.4vw,52px)] leading-[1.2] capitalize"
          >
            A runway for ideas
            <br />
            that deserve to fly.
          </motion.h1>
          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-[620px] text-[17px] leading-relaxed font-medium text-ink/85 md:text-[19px] lg:mx-0"
          >
            Incubation, labs, mentors and funding — on one engineering campus in
            Chennai. We help you go from first prototype to first customer.
          </motion.p>
          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <button
              type="button"
              onClick={() => router.push("/apply")}
              className="group flex items-center gap-3 rounded-full bg-ink px-7 py-3 text-[17px] font-medium text-white transition-transform duration-300 hover:scale-[1.04] md:text-[19px]"
            >
              Apply for incubation
              <ArrowIcon className="text-[13px] transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => scrollToTarget("#startups")}
              className="group flex items-center gap-3 rounded-full border-[0.5px] border-line bg-cream px-7 py-3 text-[17px] font-medium text-gold shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:scale-[1.04] md:text-[19px]"
            >
              View startups
              <ArrowIcon className="text-[13px] transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={introDone ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            ref={emblaRef}
            className="overflow-hidden rounded-[28px]"
            aria-label="Campus photo carousel"
          >
            <div className="flex touch-pan-y">
              {HERO_SLIDES.map((slide, i) => (
                <div key={slide.src} className="min-w-0 flex-[0_0_100%]">
                  <div className="relative h-[46vh] overflow-hidden rounded-[28px] md:h-[64vh] lg:h-[72vh]">
                    <div data-parallax className="absolute inset-[-15%_-18%]">
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        sizes="(min-width: 1024px) 44vw, 100vw"
                        priority={i === 0}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="mt-5 flex justify-center gap-2"
            role="tablist"
            aria-label="Carousel slides"
          >
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={selected === i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={clsx(
                  "h-2 rounded-full transition-all duration-300",
                  selected === i ? "w-6 bg-gold" : "w-2 bg-ink/25 hover:bg-ink/40",
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
