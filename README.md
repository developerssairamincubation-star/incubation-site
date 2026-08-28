# Sri Sairam Techno Incubator Foundation — Website

Animated single-page marketing site for the incubation foundation, built from the
[Figma design](https://www.figma.com/design/lbq7w8NrKPrC0u2bWJV1GK/Incubation-website).

## Tech stack

- **Next.js 16** (App Router, TypeScript) — static prerender, SEO-friendly
- **Tailwind CSS v4** — design tokens declared in `src/app/globals.css` (`@theme`)
- **GSAP + ScrollTrigger** — scroll-driven animations (counters, gallery, CTA fill, parallax)
- **Framer Motion** — entrance reveals, accordion, mobile menu
- **Lenis** — smooth scrolling, synced with ScrollTrigger
- **Embla Carousel** — hero image carousel (autoplay + parallax).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure

```
src/
  app/
    layout.tsx            # fonts (Montserrat + Source Serif 4), providers, metadata
    page.tsx              # section composition
    globals.css           # design tokens, marquee keyframes, Lenis helpers
  components/
    intro/IntroOverlay.tsx    # fullscreen intro video -> logo flies into header (once per session)
    layout/Header.tsx         # fixed header, scroll-spy nav, mobile menu
    providers/                # IntroProvider (intro state), SmoothScroll (Lenis)
    sections/
      Hero.tsx                # headline + Embla carousel with parallax slides
      StatsBand.tsx           # slot-machine rolling counters (92/32/12/07)
      About.tsx               # "Why founders choose to build here" + vision/mission rows
      FocusAreas.tsx          # 7 thrust areas, hover-to-expand accordion
      Startups.tsx            # dual marquee of startup wordmarks
      Gallery.tsx             # pinned stack -> disperse -> slow conveyor with arrows
      BuildCta.tsx            # semicircle floods the section dark on scroll
      Contact.tsx             # contact info, map embed, message form (mailto)
    ui/                       # Reveal (scroll fade-up), ArrowIcon
  lib/
    data.ts               # all copy/content in one place — edit here
    gsap.ts, lenis.ts     # plugin registration and shared scroll instance
public/
  images/                 # hero slides, gallery photos, logo assets (from Figma)
  videos/logo-intro.mp4   # compressed intro animation (1080p, ~110 KB)
```

## Notes

- **Intro video** plays once per browser session (`sessionStorage`), with a Skip
  button and a 9s failsafe. To make it play on every visit, remove the
  `SESSION_KEY` check in `IntroOverlay.tsx`.
- **Content edits** (stats, focus areas, startups, contact details) live in
  `src/lib/data.ts`.
- The **contact form** has no backend yet — it opens the visitor's mail client
  addressed to `incubation@sairam.edu.in`. Swap `handleSubmit` in `Contact.tsx`
  for an API route when a backend is ready.
- All heavy animations respect `prefers-reduced-motion` and fall back to
  simpler layouts on mobile.
