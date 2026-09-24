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
hi

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

## Admin panel (`/admin`)

Sign in at **`/admin`** (not linked from the public site) to add, edit,
reorder and remove:

- **Hero images** — the home-page carousel
- **Gallery events** — label, title, description and up to 5 photos each; each
  event gets its own `/gallery/<slug>` page (the slug never changes once saved,
  so shared links keep working)
- **Startup logos** — logo, name and an optional website the logo links to
- **Team members** — photo, name, role and description (the Team section and
  its menu link appear once at least one member is saved)

Edits stay in the browser until **Save changes**, which updates the live site
immediately. Photos are resized in the browser before upload, so large camera
photos are fine.

### One-time setup on Vercel

1. **Database:** Vercel → this project → Storage → Create Database → **Neon**.
   This adds `DATABASE_URL` automatically.
2. **Image storage:** Storage → Create → **Blob**. This adds
   `BLOB_READ_WRITE_TOKEN` automatically.
3. **Admin login:** run `npm run admin:hash` locally, choose a password
   (12+ characters) at the hidden prompt, and add the printed values plus a
   username to Settings → Environment Variables:
   - `ADMIN_USERNAME` — e.g. `admin`
   - `ADMIN_PASSWORD_HASH` — printed by the script
   - `SESSION_SECRET` — printed by the script
4. **Redeploy.** On first load the database is filled with the site's current
   content, so nothing changes until you edit it.

To change the password later, run `npm run admin:hash` again, replace
`ADMIN_PASSWORD_HASH` and redeploy — every existing session is signed out.

### How it works

- Content lives in Postgres as one validated JSON document per section
  (`src/lib/content/`). The public pages are static and are regenerated when
  you save. Without a `DATABASE_URL` the site falls back to the content in
  `src/lib/data.ts`.
- Sign-in uses a signed, HTTP-only session cookie (12 hours) scoped to
  `/admin`. Every admin page and server action checks it; `src/proxy.ts` only
  redirects early. Five failed sign-ins lock an IP out for 15 minutes.
- Saving is refused if the section changed in another tab since you opened it,
  so edits can't silently overwrite each other.
- Unused uploaded images are deleted automatically. Images shipped in
  `public/images` are never deleted.

### Local development

Copy `.env.example` to `.env.local` and fill in the admin values and a
`DATABASE_URL` (any Postgres works, e.g. `vercel env pull`). Leave
`BLOB_READ_WRITE_TOKEN` empty and uploads are saved to `public/uploads`
(git-ignored) instead.
