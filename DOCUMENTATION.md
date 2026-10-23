# Sri Sairam Techno Incubator Foundation — Website & Admin CMS

Technical documentation for the `incubation-website` project.

**Last updated:** 2026-09-29, against commit history through the admin CMS / Vercel
Blob storage work. Regenerate or review this document whenever the schema, routes, or
tech stack change materially.

---

## 1. Project Overview

| | |
|---|---|
| **Name** | `incubation-website` |
| **Organization** | Sri Sairam Techno Incubator Foundation (SSTIF), part of Sri Sairam Institutions |
| **Purpose** | A public marketing website for the incubator, paired with a password-protected admin panel that lets staff update the site's photos and written content without touching code. |

The project is **two applications sharing one Next.js codebase**:

1. **Public landing page** (`/`, `/apply`, `/gallery/[slug]`) — an animated, single-page
   marketing site: hero carousel, stats, about, ecosystem, focus areas, a scrolling
   gallery, startup logos, team, and a contact section. Fully public, indexable.
2. **Admin CMS** (`/admin/*`) — a password-gated panel where staff insert and edit the
   images and text that the landing page renders: hero carousel photos, gallery events
   (each with up to 5 photos), startup logos, and team member profiles. Not indexable
   (`noindex, nofollow`), not linked from the public site.

Content edited in the admin panel is stored in Postgres and read live by the public
pages — there is no build/redeploy step between saving a change and it appearing on
the site.

---

## 2. Frontend

### 2.1 Tech Stack

| Package | Version | Role |
|---|---|---|
| `next` | 16.2.10 | App Router framework (React Server Components, Server Actions) |
| `react` / `react-dom` | 19.2.4 | UI runtime |
| `typescript` | ^5 | Static typing |
| `tailwindcss` / `@tailwindcss/postcss` | ^4 | Styling — CSS-first config (no `tailwind.config.*` file; theme tokens live in `src/app/globals.css`) |
| `gsap` | ^3.15.0 | Scroll-triggered animation (gallery pin/disperse, parallax) |
| `framer-motion` | ^12.42.2 | Component-level motion (menus, reveals) |
| `lenis` | ^1.3.25 | Smooth-scrolling |
| `embla-carousel-react` / `embla-carousel-autoplay` | ^8.6.0 | Hero image carousel |
| `react-easy-crop` | ^6.2.3 | Image crop UI in the admin's upload flow |
| `clsx` | ^2.1.1 | Conditional class names |
| `zod` | ^4.6.5 | Schema validation (shared by content model and forms) |

There is no `pages/` directory — this is exclusively an **App Router** project
(`src/app/`), using route groups `(site)` and `admin/(panel)`.

### 2.2 Typography

The entire site uses a single typeface — **Montserrat**, loaded via `next/font/google`
in `src/app/layout.tsx`:

```ts
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  style: ["normal", "italic"],
});
```

Both a `--font-sans` and `--font-serif` Tailwind theme token exist, but both resolve to
Montserrat — `--font-serif` is kept only so components using a "serif" utility class
still render correctly, per an explicit code comment in `globals.css`.

> **Note:** the existing `README.md` still lists the stack as "Montserrat + Source
> Serif 4." That's out of date — the second typeface was removed. See §9.

### 2.3 Colors

Defined as CSS custom properties in `src/app/globals.css`'s `@theme` block (Tailwind v4
CSS-first config):

| Token | Hex / Value | Typical use |
|---|---|---|
| `--color-cream` | `#f6f1e7` | Page background |
| `--color-cream-soft` | `#efe8d9` | Secondary/soft background (form fields, cards) |
| `--color-paper` | `#fffdf6` | Off-white surface |
| `--color-ink` | `#232323` | Primary text |
| `--color-ink-soft` | `#56503f` | Secondary/muted text |
| `--color-gold` | `#be9e70` | Accent — active nav links, highlights, focus rings |
| `--color-rust` | `#c1502a` | Accent — links, error/danger states |
| `--color-line` | `rgba(117, 111, 97, 0.35)` | Borders and dividers |

### 2.4 Theme / Style

- **Style:** Warm, editorial/minimalist — cream backgrounds, generous whitespace, serif
  display type rendered in Montserrat, gold/rust accents.
- **Dark mode:** **Not implemented.** There is no `prefers-color-scheme` handling and no
  Tailwind `dark:` variant usage anywhere in `src/` — confirmed by search. If dark mode
  is wanted later, it needs to be designed from scratch (new tokens under `@theme` guarded
  by `@media (prefers-color-scheme: dark)`).
- **Motion:** Lenis smooth-scroll on the public site only (explicitly excluded from
  `/admin` via a separate route-group layout); GSAP `ScrollTrigger` for the gallery's
  pin/disperse sequence; `prefers-reduced-motion: reduce` disables the marquee logo
  animation.

### 2.5 Main Sections / Routes

**Public site** (`src/app/(site)/`):

| Route | File | Purpose |
|---|---|---|
| `/` | `(site)/page.tsx` | Landing page — composes Hero, Stats, About, Ecosystem, Focus Areas, Gallery, Startups, Team, Contact |
| `/apply` | `(site)/apply/page.tsx` | Incubation application form (student / startup / partnership tracks) |
| `/gallery/[slug]` | `(site)/gallery/[slug]/page.tsx` | One gallery event's detail page and photos; new events (added after the last build) render on first visit via dynamic params |

**Admin CMS** (`src/app/admin/`), all behind authentication:

| Route | Purpose |
|---|---|
| `/admin/login` | Sign-in form |
| `/admin` | Dashboard — recent-changes activity feed |
| `/admin/hero` | Edit the hero carousel's images and captions |
| `/admin/gallery` | Edit gallery events and their photos |
| `/admin/startups` | Edit the scrolling startup-logo strip |
| `/admin/team` | Edit team member profiles |

`src/proxy.ts` runs on every `/admin*` request (`matcher: ["/admin", "/admin/:path*"]`)
and redirects signed-out visitors to `/admin/login` — but this is explicitly documented
in the code as a convenience only; the real access check (`requireAdmin()`) runs
independently inside every admin page, layout, and Server Action.

---

## 3. Backend

There is **no separate backend service and no REST API** (`src/app/api/` does not
exist). Business logic runs as **Next.js Server Actions** — functions in
`src/app/admin/actions.ts` marked `"use server"`, called directly from client
components as if they were local async functions. The tables below present them in an
endpoint-style format for familiarity, but they are not HTTP routes and have no OpenAPI
spec.

### 3.1 Tech Stack

| Package | Version | Role |
|---|---|---|
| `next` (Server Actions) | 16.2.10 | Request handling / mutation layer |
| `pg` | ^8.23.0 | Raw Postgres driver — **no ORM** (no Prisma/Drizzle/Knex) |
| `zod` | ^4.6.5 | Input validation for all content saves |
| `jose` | ^6.2.12 | JWT signing/verification for the admin session |
| `@vercel/blob` | ^2.8.0 | Image upload storage client |
| `server-only` | ^0.0.1 | Compile-time guard against server code leaking into client bundles |

### 3.2 Roles / Authorization Model

**Single shared admin credential — no RBAC.** There is exactly one account: a
username/password pair set via environment variables (`ADMIN_USERNAME`,
`ADMIN_PASSWORD_HASH`). There is no `users` table and no per-user role. A valid session
JWT always carries the fixed payload `{ role: "admin" }` — "role" here means
"authenticated or not," not a permission tier.

| Aspect | Implementation |
|---|---|
| Credential storage | `ADMIN_PASSWORD_HASH` env var, `scrypt:<salt>:<hash>` format (`N=16384, r=8, p=1`) |
| Credential check | Constant-time comparison for both username and password; both checks always run so a wrong username takes as long as a wrong password |
| Session | Signed JWT (HS256, `jose`), cookie `sstif_admin`, `httpOnly`, `secure` in production, `sameSite: lax`, scoped to `/admin`, 12-hour expiry |
| Signing key | Derived from `SESSION_SECRET` **and** the current admin credentials — rotating the password instantly invalidates all existing sessions |
| Rate limiting | Postgres-backed (`admin_login_attempts`): 5 failed attempts per IP locks that IP out for 15 minutes. No-ops without a database (local dev only) |
| Route protection | `src/proxy.ts` (convenience redirect) **and** `requireAdmin()` (the actual check), called independently in every admin page/layout/Server Action |

### 3.3 Server Actions (`src/app/admin/actions.ts`)

| Action | Signature | Auth | Description |
|---|---|---|---|
| `login` | `(previous: LoginState, formData: FormData) → Promise<LoginState>` | None (this *is* the sign-in) | Validates credentials against env vars, checks IP lockout, creates a session cookie and redirects to `/admin` on success |
| `logout` | `() → Promise<void>` | Session cookie | Deletes the session cookie, redirects to `/admin/login` |
| `uploadImage` | `(formData: FormData) → Promise<{ ok: true; url: string } \| { ok: false; error: string }>` | `requireAdmin()` | Validates file type/size, stores it (Blob or local disk — see §5), returns its public URL |
| `discardUploads` | `(urls: unknown) → Promise<void>` | `requireAdmin()` | Deletes images uploaded during an editing session that was abandoned without saving (capped at 100 URLs per call) |
| `saveContent` | `<K extends ContentKey>(key: K, input: unknown, version: number, sessionUploads: unknown) → Promise<SaveResult<K>>` | `requireAdmin()` | Validates the full section payload with Zod, writes it with optimistic-concurrency locking, logs a human-readable change entry, sweeps orphaned images, revalidates the public pages |

**`SaveResult<K>`:**

```ts
type SaveIssue = { path: (string | number)[]; message: string };

type SaveResult<K> =
  | { ok: true; version: number; data: SiteContent[K] }
  | { ok: false; error: string; issues?: SaveIssue[]; conflict?: boolean };
```

`conflict: true` means another tab/browser saved the same section first — Server Actions
use `SELECT ... FOR UPDATE` with a version check (see §4.2), not last-write-wins.

---

## 4. Database

### 4.1 Tech Stack

| Component | Detail |
|---|---|
| Engine | PostgreSQL (provisioned via Neon through Vercel Storage in production) |
| Driver | `pg` (raw parameterized SQL — **no ORM**) |
| Migrations | None as a separate tool — schema is created idempotently at runtime via `CREATE TABLE IF NOT EXISTS` in `src/lib/db.ts`'s `ensureSchema()`, called lazily on first use |
| Connection pooling | A single `pg.Pool` (`max: 3`) cached on `globalThis` to survive dev hot-reloads and stay lightweight per serverless instance |

### 4.2 Tables

**`site_content`** — one row per content section, storing the entire section as JSON:

| Column | Type | Notes |
|---|---|---|
| `key` | `text` **PK** | `"hero" \| "gallery" \| "startups" \| "team"` |
| `data` | `jsonb NOT NULL` | The section's full content array (see §4.3 for shape) |
| `version` | `integer NOT NULL DEFAULT 1` | Incremented on every save; used for optimistic-concurrency conflict detection |
| `updated_at` | `timestamptz NOT NULL DEFAULT now()` | Last save time |

**`admin_login_attempts`** — failed sign-in tracking for rate limiting:

| Column | Type | Notes |
|---|---|---|
| `ip` | `text NOT NULL` | Client IP (from `x-forwarded-for`) |
| `attempted_at` | `timestamptz NOT NULL DEFAULT now()` | Indexed with `ip` for the 15-minute lockout window query |

**`audit_log`** — the "Recent changes" feed shown on `/admin`:

| Column | Type | Notes |
|---|---|---|
| `id` | `bigserial` **PK** | |
| `section` | `text NOT NULL` | Which content section changed |
| `message` | `text NOT NULL` | Human-readable summary, e.g. `Added team member "Jane Doe"` |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | Indexed descending for the feed query |

Entries are generated by diffing the old vs. new array **by id** on every save (added /
removed / changed items get individual lines; a save touching more than 8 items
collapses into one summary line, e.g. `Changed 12 startup logos (7 added, 2 removed, 3 updated)`).
Logging is best-effort and never blocks a save if it fails.

### 4.3 Content Models

These are the Zod-validated shapes stored inside `site_content.data` — effectively the
application's data models, despite living in one JSONB column per section rather than
in normalized tables.

**`HeroSlide`**

| Field | Type | Constraints |
|---|---|---|
| `id` | `string` | 1–64 chars |
| `src` | `string` | Must be a same-origin path or a `*.public.blob.vercel-storage.com` URL |
| `alt` | `string` | 1–160 chars |

**`GalleryEvent`** (has many `EventPhoto`, max 5)

| Field | Type | Constraints |
|---|---|---|
| `id` | `string` | 1–64 chars |
| `slug` | `string` | URL-safe (`^[a-z0-9]+(-[a-z0-9]+)*$`), ≤80 chars, unique across the section |
| `caption` | `string` | 1–60 chars |
| `title` | `string` | 1–160 chars |
| `details` | `string` | 1–5000 chars |
| `photos` | `EventPhoto[]` | 1–5 items |

**`EventPhoto`**

| Field | Type | Constraints |
|---|---|---|
| `src` | `string` | Same rules as `HeroSlide.src` |
| `alt` | `string` | ≤200 chars |

**`StartupLogo`**

| Field | Type | Constraints |
|---|---|---|
| `id` | `string` | 1–64 chars |
| `name` | `string` | 1–120 chars |
| `src` | `string` | Same rules as above |
| `width`, `height` | `number` | Positive integers, ≤10000 |
| `url` | `string` | Empty, or a valid `http(s)://` URL, ≤500 chars |
| `addedAt` | `number?` | Optional ms-since-epoch; absent on items added before this field existed |

**`TeamMember`**

| Field | Type | Constraints |
|---|---|---|
| `id` | `string` | 1–64 chars |
| `name` | `string` | 1–120 chars |
| `role` | `string` | ≤120 chars, optional-length |
| `bio` | `string` | 1–1500 chars |
| `photo` | `string` | Same rules as above |
| `addedAt` | `number?` | Same as `StartupLogo.addedAt` |

**Section limits:** hero 1–12 slides · gallery ≤40 events · startups ≤300 logos ·
team ≤100 members.

**Fallback behavior:** if `DATABASE_URL` is unset or the database is unreachable, public
pages fall back to a shipped default dataset (`src/lib/data.ts` → `DEFAULT_CONTENT`)
rather than erroring — the site stays up, just not editable.

---

## 5. Image Storage

Uploads go to one of two backends, chosen automatically:

| Condition | Backend | Notes |
|---|---|---|
| `BLOB_READ_WRITE_TOKEN` (or `BLOB_PUB_READ_WRITE_TOKEN`) is set | **Vercel Blob** | Public access, 1-year cache header |
| No Blob token **and** `NODE_ENV !== "production"` | **Local disk** | Saved under `public/uploads/<folder>/`, git-ignored |
| No Blob token **and** production | — | Upload fails with a clear "storage isn't set up" error rather than a silent local write |

Other rules, all enforced server-side regardless of what the browser claims:

- **Size limit:** 3.5 MB per file.
- **Formats:** JPEG, PNG, WebP only — verified by reading the file's binary signature,
  not the MIME type header.
- **Filenames:** always a generated UUID; nothing from the original filename reaches
  storage.
- **Cleanup:** on every save, images no longer referenced by any content are deleted;
  a background sweep also removes uploads orphaned by an abandoned (never-saved)
  editing session after a 24-hour grace period. Original images shipped in
  `public/images/` (the seed content) are never touched by cleanup.

---

## 6. Setup & Installation

### 6.1 Prerequisites

- Node.js (a version compatible with Next.js 16 / React 19)
- npm
- A PostgreSQL database (Neon, via Vercel Storage, is what production uses)
- A Vercel account, for Blob storage and deployment

### 6.2 Clone & Install

```bash
git clone <REPOSITORY_URL>
cd incubation-website
npm install
```

### 6.3 Environment Variables

Copy `.env.example` to `.env.local` and fill in the values below (`.env.local` is
git-ignored — never commit real secrets):

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_USERNAME` | For admin sign-in | The single admin account's username |
| `ADMIN_PASSWORD_HASH` | For admin sign-in | `scrypt:<salt>:<hash>` — generate with `npm run admin:hash` |
| `SESSION_SECRET` | For admin sign-in | ≥32-character random string, also generated by `npm run admin:hash` |
| `DATABASE_URL` | For a persistent CMS | Postgres connection string. Without it, content falls back to shipped defaults and is read-only |
| `BLOB_READ_WRITE_TOKEN` | For uploads in production | Vercel Blob token. Without it locally, uploads save to `public/uploads/` instead |

```bash
# .env.local
ADMIN_USERNAME=<your-admin-username>
ADMIN_PASSWORD_HASH=<generated-by-npm-run-admin:hash>
SESSION_SECRET=<generated-by-npm-run-admin:hash>
DATABASE_URL=<postgresql-connection-string>
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>
```

Generate the admin credentials:

```bash
npm run admin:hash
```

### 6.4 Run Locally

```bash
npm run dev      # http://localhost:3000
npm run lint      # ESLint
npm run build     # production build
npm run start     # serve the production build
```

### 6.5 Production Setup (Vercel)

1. **Database:** Vercel → Storage → Create Database → Neon. This adds `DATABASE_URL`
   to the project automatically.
2. **Image storage:** Vercel → Storage → Create → Blob, set to **Public** access.
   Connect it to Production, Preview, and Development. This adds a Blob token — the
   app accepts either `BLOB_READ_WRITE_TOKEN` or a custom-prefixed name like
   `BLOB_PUB_READ_WRITE_TOKEN`, matching whatever the dashboard generates.
3. **Admin credentials:** run `npm run admin:hash` locally, then add
   `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` / `SESSION_SECRET` under
   Project → Settings → Environment Variables.
4. **Redeploy.** The database schema creates itself on first use; hero, gallery, and
   startup content seed themselves from the shipped defaults on first read.

Rotating the admin password (rerun `npm run admin:hash`, update the env vars, redeploy)
immediately invalidates every existing admin session, since the session-signing key is
derived from the current credentials.

---

## 7. Repository Structure (high level)

```
src/
  app/
    (site)/            Public routes: /, /apply, /gallery/[slug]
    admin/
      login/           /admin/login
      (panel)/         Authenticated routes: dashboard + 4 editors
      actions.ts        All Server Actions (the "backend")
  components/
    admin/              Editor UI (HeroEditor, GalleryEditor, StartupsEditor,
                         TeamEditor, shared list/pagination/crop components)
    sections/           Public-page sections (Hero, Gallery, Startups, Team, ...)
  lib/
    auth/               Session, password hashing, rate limiting
    content/            Zod schemas, Postgres repository, seed defaults
    audit-log.ts         Change-log diffing and storage
    db.ts                 Connection pool + schema creation
    storage.ts            Image upload backends
  proxy.ts               Admin route-guard middleware
public/
  images/                Seed content shipped with the codebase (never deleted)
  uploads/                Local-dev-only uploads (git-ignored)
```

---

## 8. Known Gaps / Out of Scope

- **No automated tests** exist in the repository at the time of writing.
- **No REST API** — anything needing external programmatic access to content would
  need new work (e.g. a Route Handler under `src/app/api/`).
- **No dark mode.**
- **No multi-user admin accounts** — adding one would mean introducing a `users` table,
  per-user credentials, and a real role/permission model in place of the current single
  shared login.
- **Contact form has no backend** — it currently opens a `mailto:` link rather than
  submitting anywhere.

---

## 9. Notes on the Existing `README.md`

While researching this document, two inaccuracies were found in the current
`README.md` (not corrected here, since that file wasn't in scope for this pass):

1. It lists the font stack as "Montserrat + Source Serif 4" — the second typeface was
   removed; the whole site now renders in Montserrat only (see §2.2).
2. It describes content as living in `src/lib/data.ts`, which was true before the
   admin CMS existed. That file is now only the **seed/fallback** dataset — live
   content is read from and written to Postgres (see §4). The same README's later
   "How it works" section does describe the Postgres-backed system correctly, so the
   two sections currently contradict each other.

Worth a follow-up pass to reconcile `README.md` with this document.
