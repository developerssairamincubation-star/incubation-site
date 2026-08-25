"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { NAV_LINKS } from "@/lib/data";
import { scrollToTarget } from "@/lib/lenis";
import { useIntro } from "@/components/providers/IntroProvider";

export function Header() {
  const { introDone } = useIntro();
  const [active, setActive] = useState("#home");
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll-spy: highlight the nav link of the section in view.
  useEffect(() => {
    const sections = NAV_LINKS.map((l) =>
      document.querySelector<HTMLElement>(l.href),
    ).filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = (href: string) => {
    setMenuOpen(false);
    scrollToTarget(href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-cream/90 shadow-[0px_0px_13px_rgba(0,0,0,0.08)] backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-[1728px] items-center justify-between px-6 lg:px-10">
        <button
          type="button"
          onClick={() => goTo("#home")}
          aria-label="Sri Sairam Techno Incubator Foundation — home"
        >
          <Image
            id="header-logo"
            src="/images/logo.png"
            alt="Sri Sairam Techno Incubator Foundation"
            width={158}
            height={58}
            priority
            className={clsx(
              "h-12 w-auto transition-opacity duration-500",
              introDone ? "opacity-100" : "opacity-0",
            )}
          />
        </button>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => goTo(link.href)}
              className={clsx(
                "text-[17px] transition-colors",
                active === link.href
                  ? "font-bold text-gold"
                  : "font-medium text-ink hover:text-gold",
              )}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span
            className={clsx(
              "h-[2px] w-7 bg-ink transition-transform",
              menuOpen && "translate-y-[7px] rotate-45",
            )}
          />
          <span
            className={clsx(
              "h-[2px] w-7 bg-ink transition-opacity",
              menuOpen && "opacity-0",
            )}
          />
          <span
            className={clsx(
              "h-[2px] w-7 bg-ink transition-transform",
              menuOpen && "-translate-y-[7px] -rotate-45",
            )}
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-cream lg:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col px-6 py-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => goTo(link.href)}
                  className={clsx(
                    "py-3 text-left text-lg",
                    active === link.href
                      ? "font-bold text-gold"
                      : "font-medium text-ink",
                  )}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
