# Calap — Personal Developer Portfolio

> **Live:** https://portfolio-six-topaz-evd842wqk8.vercel.app
>
> **GitHub:** https://github.com/calap0309/portfolio

Calap's personal developer portfolio — a production-ready app built with **Next.js 15 (App Router)**, **TypeScript (strict, zero `any`)**, **Tailwind CSS**, **shadcn/ui** primitives, **Prisma**, and **PostgreSQL** (with an easy **SQLite** fallback for local dev).

Ground-up Swiss-inspired design system: off-white `#fafaf8` paper base `#f7f4f0`, near-black `#18181b`, a single terracotta accent `#c9694b`, and an ochre `#d4a373` secondary. **No purple gradients, no glassmorphism, no fade-in-up reveals.**

The site is deployed to **Vercel** with a **Neon Postgres** database. Project data and the admin user are managed entirely through the app's admin dashboard.

## Tech Stack

| Layer      | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | Next.js 15 (App Router)                  |
| Language   | TypeScript (strict, zero `any`)          |
| Styling    | Tailwind CSS 3 + custom Swiss grid       |
| UI         | Radix primitives (shadcn/ui) + Sheet drawer |
| Animation  | Framer Motion (drag/snap carousel only)  |
| Auth       | NextAuth (Credentials + JWT)             |
| DB / ORM   | PostgreSQL + Prisma (prod) / SQLite (dev)|
| Email      | Resend (Nodemailer fallback)             |
| Validation | Zod                                     |
| Forms      | react-hook-form                         |

## Folder Structure

```
.
├── prisma/
│   ├── schema.prisma          # PostgreSQL schema (production)
│   ├── schema.sqlite.prisma   # Identical models for local SQLite dev
│   ├── seed.ts                # 3 realistic seed projects + admin user
│   └── dev.db                 # Local SQLite database (gitignored)
├── public/
│   └── favicon.svg            # SVG favicon fallback
├── src/
│   ├── app/
│   │   ├── background.tsx     # Layered analog bg: blobs, grid, rAF parallax
│   │   ├── favicon.ico/route.tsx  # Generated favicon (ImageResponse)
│   │   ├── icon.tsx           # Generated PNG icon (ImageResponse)
│   │   ├── globals.css        # Paper base, grain, grid, clamp type, a11y
│   │   ├── layout.tsx         # Root layout w/ Background + safe-areas
│   │   ├── page.tsx           # Homepage (hero + featured projects)
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── admin/projects/(route.ts | [id]/route.ts)
│   │   │   └── contact/route.ts
│   │   ├── admin/
│   │   │   ├── page.tsx             # Dashboard + stat cards (server)
│   │   │   ├── AdminProjects.tsx    # CRUD manager (client)
│   │   │   └── login/(page.tsx | LoginForm.tsx)
│   │   ├── projects/page.tsx        # Horizontal drag carousel page
│   │   └── contact/(page.tsx | ContactForm.tsx)
│   ├── components/
│   │   ├── nav.tsx              # Server wrapper (session)
│   │   ├── nav-client.tsx       # Mobile Sheet drawer menu
│   │   ├── ambient-audio.tsx    # Calm CC0 background music + toggle
│   │   ├── footer.tsx
│   │   ├── project-card.tsx
│   │   ├── project-carousel.tsx # Framer Motion drag/snap carousel
│   │   ├── project-detail.tsx
│   │   └── ui/sheet.tsx         # shadcn/ui Sheet
│   └── lib/
│       ├── auth.ts  ├── prisma.ts  ├── types.ts  └── utils.ts
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Generate a secret and set it:

```bash
openssl rand -base64 32
```

The default `.env` points at your **production PostgreSQL** database. Set
`DATABASE_PROVIDER`/`DATABASE_URL`/`NEXTAUTH_SECRET`/`NEXTAUTH_URL` and the
contact-mail vars (`RESEND_API_KEY` + `CONTACT_EMAIL`, or `SMTP_*`).

### 3. Set up the database — PostgreSQL (production)

```bash
npm run db:push     # prisma db push (uses prisma/schema.prisma)
npm run db:seed     # seeds 3 projects + admin user
```

### 4. Local dev with SQLite (no Postgres needed)

Everything is pre-wired for a zero-install local DB. In a separate terminal /
shell (or before running dev):

```bash
npm run db:sqlite:setup   # generate client + push schema from schema.sqlite.prisma
npm run db:sqlite:seed    # seed the SQLite database
```

> **Note:** when targeting SQLite, run the dev server and any `prisma` commands
> with `DATABASE_URL="file:./dev.db"` in the environment. The SQLite schema file
> is **identical** to the Postgres one — only the `provider` differs — so no
> data-model code changes are needed.

### 5. Run

```bash
npm run dev
```

Open http://localhost:3000

## Admin

- Local login: http://localhost:3000/admin
- Default credentials (from seed): `admin@portfolio.dev` / `admin123`

**Change the password immediately** after first login (`prisma.user.update` or
re-seed after editing the seed hash).

## Projects Carousel (Section III)

`src/components/project-carousel.tsx` implements the horizontal drag slide:

- **Drag** horizontally on desktop; **swipe** one finger on mobile — powered by
  Framer Motion `useMotionValue`, `useTransform`, `drag="x"`,
  `dragConstraints`, `dragElastic={0.1}` and `dragMomentum`.
- **Snap:** on release the nearest card eases to the viewport centre.
- The single MotionValue is mirrored to native `scrollLeft`, so the **standard
  scrollbar stays visible** (overflow is not hidden) and keyboard/pagination
  maths share one source of truth.
- **Indicators:** left/right gradient edge fades + pagination dots below that
  update live while dragging.
- **Responsive cards-per-view:** 1.1 (≈1) mobile, 1.5 tablet, 2.5 desktop.
- **A11y:** the region is focusable and **Left/Right arrow keys** navigate.
- **Performance:** `will-change: transform` on slides; resize is debounced via
  `requestAnimationFrame`; `touch-action: pan-y` preserves vertical scrolling.

## Background (Section IV)

`src/app/background.tsx` (client) layers, behind content:

1. **Base** — warm paper radial gradient defined in `globals.css`
   (#fdfcfa → #efece6).
2. **Texture** — an inline SVG `feTurbulence` fractal-noise data URI on the
   body `::before` pseudo-element, `mix-blend-mode: multiply` at ~4% (2% on
   touch), so the repaint cost is constant and tiny.
3. **Blobs** — two large soft radial-gradient shapes (top-right ochre `#d4c5b2`
   @30%, bottom-left terracotta `#c9694b` @12%). Blur is a CSS variable halved
   on coarse-pointer screens (Section VI).
4. **Grid** — a low-contrast 12-column overlay (5%, `#2d2a24`), large screens only.

The blobs drift on a slow autonomous sine sway and additionally shift ~10px
toward the cursor with `requestAnimationFrame` (not CSS transitions). Parallax
is **disabled on touch** via `(hover: hover)`/`ontouchstart` detection and under
`prefers-reduced-motion`.

## Calm Ambient Music & Aesthetic (Section "No AI Slop")

The brutalist identity is kept (hard edges, no glass/gradient-slop), but the
page is calmed with tasteful, additive layers:

1. **Refined paper texture + slow blob drift + quiet warm field** — the paper
   base is a soft multi-stop radial with a warm light falloff, the film grain is
   two-scale (broad + fine speckle) for an offset-print feel, and a faint
   "printed-sheet" vignette gives edge depth. The blobs breathe on a ~9s sine
   sway combined with the mouse parallax, and a low-opacity ochre wash
   (`rgba(212,163,115,0.10)`) softens contrast. All within the existing palette;
   grain turns to 2% opacity on touch for GPU savings.
2. **Calm background music** — `src/components/ambient-audio.tsx` streams a
   **CC0 public-domain ambient pad** ("bee-hive-pad" by John Bartmann, via
   Wikimedia Commons). It attempts low-volume autoplay (~0.08); if the browser
   blocks it, a small hard-edged **Sound** control (bottom-right, ≥44px) lets
   the visitor start/pause it.

### Self-hosting MP3 (full Safari support)

Safari cannot decode the default OGG track, so for full browser coverage:

1. Put a licensed MP3 at `public/audio/calm.mp3` (see `public/audio/README.md`).
2. Set `NEXT_PUBLIC_AMBIENT_AUDIO_URL=/audio/calm.mp3` in `.env`.
3. Rebuild (NEXT_PUBLIC_ vars are inlined at build time).

The MP3 becomes the primary `<source>`; the CC0 OGG is kept automatically as a
fallback if the MP3 fails to load.

## Favicon (Section V)

- `src/app/favicon.ico/route.tsx` renders a sharp geometric mark (diagonal
  terracotta slash intersecting a near-black circle) via `ImageResponse`.
- `src/app/icon.tsx` generates the PNG `/icon`, and `public/favicon.svg` is
  linked in `layout.tsx` via the metadata `icons` export as a fallback.

## Contact Form

The form at `/contact` posts to `/api/contact` → **Resend** if
`RESEND_API_KEY` is set, otherwise **Nodemailer** via `SMTP_*`. Zod validation
on both client and server.

## Responsive & Mobile Guidelines (Section VI)

Every element is mobile-first. Documented breakpoints:

| Range            | Layout grid | Cards/view (carousel) | Nav                  |
| ---------------- | ----------- | --------------------- | -------------------- |
| < 480px          | 1 col (full-bleed) | ~1           | Sheet drawer         |
| 480–639px        | 4 cols      | ~1                    | Sheet drawer         |
| 640–767px        | 4 cols      | ~1                    | Sheet drawer         |
| 768–1023px       | 8 cols      | 1.5                   | Inline desktop nav   |
| ≥ 1024px         | 12 cols     | 2.5                   | Inline desktop nav   |

Mobile specifics implemented:

- **Viewport & safe areas** — `width=device-width, initial-scale=1` in the
  layout `viewport` export; `env(safe-area-inset-*)` padding on body + drawer.
- **Responsive type** — `clamp()` for all text sizes; body text stays ≥ 16px on
  mobile to prevent iOS auto-zoom.
- **Hamburger → Sheet** — `components/nav-client.tsx` (shadcn/ui `Sheet`),
  closes on every link click, full 44px+ tap targets.
- **Tap targets** — buttons, links, inputs, pagination dots and carousel cards
  all ≥ 44px (`TAP_MIN` / `min-height` utilities).
- **Admin mobile UX** — table keeps `overflow-x-auto`; form controls and action
  buttons are `w-full` on small screens; stat cards stack to 1 column.
- **Background perf** — blur halved (60/80px) and grain @2% on touch; parallax
  disabled; `overflow-x-hidden` guards horizontal scroll.
- **Images** — all use `next/image` with `sizes` for proper srcset generation.

### Manual mobile testing checklist

1. Resize from 320px → 1920px; confirm no horizontal scrollbar appears.
2. Open the Sheet drawer on <768px; verify it closes when tapping any link.
3. On a touch device, swipe the carousel horizontally six times; confirm each
   slide snaps to centre and vertical page scroll still works.
4. Tap every interactive element (nav, buttons, dots, inputs) and confirm the
   effective hit area is ≥ 44×44px.
5. In DevTools device mode, confirm grain opacity ≈ 2% and blob blur reduced.
6. Verify the favicon renders in a dark and light browser tab.

## Scripts

| Script                  | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start dev server                         |
| `npm run build`         | Production build                         |
| `npm start`             | Run production build                     |
| `npm run lint`          | ESLint                                   |
| `npm run db:push`       | Push Postgres schema (schema.prisma)     |
| `npm run db:seed`       | Seed (Postgres)                          |
| `npm run db:reset`      | Reset + re-seed (Postgres)               |
| `npm run db:sqlite:setup` | Generate client + push SQLite schema    |
| `npm run db:sqlite:seed`  | Seed the local SQLite database          |
| `npm run db:generate`   | `prisma generate`                        |

## Security Notes

- API routes validate the session server-side before any CRUD operation.
- Passwords are hashed with `bcryptjs`.
- Auth uses JWT sessions; Credentials provider only.
- The `favicon` and admin routes disable index/follow robots where applicable.

## Animations Policy (Section II)

The only animations allowed are: `scale(0.95)` on button clicks, color-shift on
link hover, and a border glow on input focus. The carousel's drag physics is the
sole exception (it is an interaction, not a reveal). `prefers-reduced-motion` is
respected throughout.
