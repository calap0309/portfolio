# Calap — Personal Developer Portfolio

> **Live:** https://portfolio-six-topaz-evd842wqk8.vercel.app
>
> **GitHub:** https://github.com/calap0309/portfolio

Calap's personal developer portfolio — a production-ready app built with **Next.js 15 (App Router)**, **TypeScript (strict, zero `any`)**, **Tailwind CSS**, **shadcn/ui** primitives, **Prisma**, and **PostgreSQL** (with an easy **SQLite** fallback for local dev).

The design is **Apple-inspired**: clean, typography-driven, spacious, and minimal. Pure white base, near-black ink `#1d1d1f`, Apple blue `#0071e3`, medium gray `#86868b` secondary text, and `#d2d2d7` 0.5px hairlines — emulating the apple.com aesthetic. **No gradients (except subtle hero glows), no glassmorphism, no particle effects, no dark mode by default.**

Deployed to **Vercel** with a **Neon Postgres** database. Project data and the admin user are managed entirely through the app's admin dashboard.

## Tech Stack

| Layer      | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | Next.js 15 (App Router)                  |
| Language   | TypeScript (strict, zero `any`)          |
| Styling    | Tailwind CSS 3 + custom 12-col grid      |
| UI         | Radix primitives (shadcn/ui) + Sheet drawer |
| Animation  | Framer Motion (drag/snap carousel) + IntersectionObserver reveals |
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
│   └── favicon.svg            # SVG favicon fallback (Apple "C" monogram)
├── src/
│   ├── app/
│   │   ├── background.tsx     # Layered white bg: hero glow + static blue blob
│   │   ├── favicon.ico/route.tsx  # Generated favicon (ImageResponse)
│   │   ├── icon.tsx           # Generated PNG icon (ImageResponse)
│   │   ├── globals.css        # Apple palette, type scale, shadows, a11y
│   │   ├── layout.tsx         # Root layout w/ Background + safe-areas
│   │   ├── page.tsx           # Homepage (Apple hero + featured projects)
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
│   │   ├── nav-client.tsx       # Mobile Sheet drawer menu (blur backdrop)
│   │   ├── reveal.tsx           # Apple-style IntersectionObserver reveal
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

## Design System (Section II)

The palette and type mirror apple.com product pages:

| Token      | Value                           | Use                              |
| ---------- | ------------------------------- | -------------------------------- |
| `appbg`    | `#ffffff`                       | Background (pure white, not off-white) |
| `ink`      | `#1d1d1f`                       | Text primary (Apple's dark gray) |
| `subtext`  | `#86868b`                       | Subtitles & metadata             |
| `accent`   | `#0071e3` (hover `#0077ed`)     | CTAs and interactive elements    |
| `hairline` | `#d2d2d7`                        | 0.5px section separators         |
| `danger`   | `#d70015` (Apple system red)    | Validation / destructive states  |

- **Fonts:** SF Pro Display stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, …). Headings `font-weight: 700`, subheadings `600`.
- **Hero:** `clamp(3rem, 10vw, 5.5rem)` with `letter-spacing: -0.045em` and `padding-top: clamp(6rem, 15vh, 12rem)`.
- **Body:** `1.0625rem` (17px) with Apple's exact `line-height: 1.47059`.
- **Scale:** perfect fourth (1.333x), all fluid via `clamp()`, never below 16px on mobile.
- **Layout:** `max-width: 980px` for text (`max-w-text`), `1200px` for project grids (`max-w-grid`), 12-column grid with `gap`.
- **Shadows:** cards use `0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.02)`; hover lifts to `0 20px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)`.
- **Reveals:** `components/reveal.tsx` uses an IntersectionObserver to fade content in with a `translateY(20px) → 0` transition (0.6s ease-out), respecting `prefers-reduced-motion`.
- **Micro-interactions:** focus rings shift to blue; buttons scale to 1.02 on hover with a shadow lift; card images scale to 1.02 over 0.3s on hover.

### Background (Section IV)

`src/app/background.tsx` layers behind content:

1. **Pure white** base (`#ffffff`).
2. **Hero glow** — a soft radial `#f5f5f7` wash at the top fading to white.
3. **One static blue blob** — `radial-gradient` of `#0071e3` at 5% opacity, `blur(150px)`, in the hero only. **Static, not animated.** Blur is halved on touch/coarse screens via a CSS variable.

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

Set `DATABASE_URL`/`NEXTAUTH_SECRET`/`NEXTAUTH_URL`, and the contact-mail vars
(`RESEND_API_KEY` + `CONTACT_EMAIL`, or `SMTP_*`).

### 3. Set up the database — PostgreSQL (production)

```bash
npm run db:push     # prisma db push (uses prisma/schema.prisma)
npm run db:seed     # seeds 3 projects + admin user
```

### 4. Local dev with SQLite (no Postgres needed)

```bash
npm run db:sqlite:setup   # generate client + push schema from schema.sqlite.prisma
npm run db:sqlite:seed    # seed the SQLite database
```

> **Note:** when targeting SQLite, run the dev server with
> `DATABASE_URL="file:./dev.db"` in the environment — the URL is resolved
> relative to the Prisma schema folder, so the db lives at `prisma/dev.db`.
> The SQLite schema file is **identical** to the Postgres one — only the
> `provider` differs — so no data-model code changes are needed.

### 5. Run

```bash
npm run dev
```

Open http://localhost:3000

## Admin

- Local login: http://localhost:3000/admin
- Default credentials (from seed): `admin@portfolio.dev` / `firas228`

**Change the password immediately** after first login.

## Projects Carousel (Section III)

`src/components/project-carousel.tsx` implements the horizontal drag slide:

- **Drag** horizontally on desktop; **swipe** on mobile — Framer Motion
  `useMotionValue`, `useTransform`, `drag="x"`, `dragConstraints`,
  `dragElastic={0.1}`, `dragMomentum`.
- **Snap:** on release the nearest card eases to the viewport centre.
- The MotionValue is mirrored to native `scrollLeft`, so the **standard
  scrollbar stays visible** (overflow is not hidden).
- **Indicators:** left/right white gradient edge fades + pagination dots
  (small gray circles; active is a blue pill) that update live while dragging,
  with full 44px tap targets.
- **Responsive cards-per-view:** 1.1 (≈1 + 10px peek) mobile, 1.5 tablet, 2.5 desktop.
- **A11y:** the region is focusable and **Left/Right arrow keys** navigate.
- **Performance:** `will-change: transform` on slides; resize debounced via
  `requestAnimationFrame`; `touch-action: pan-y` preserves vertical scrolling.

## Favicon (Section V)

`src/app/favicon.ico/route.tsx`, `src/app/icon.tsx`, and `public/favicon.svg`
each render an Apple-style minimalist "C" monogram — bold, `#1d1d1f`, on pure
white — crisp in both dark and light browser tabs. The SVG is linked in
`layout.tsx` via the metadata `icons` export as a fallback.

## Contact Form

The form at `/contact` posts to `/api/contact` → **Resend** if
`RESEND_API_KEY` is set, otherwise **Nodemailer** via `SMTP_*`. Zod validation
on both client and server.

## Responsive & Mobile Guidelines (Section VI)

| Range      | Layout grid | Cards/view (carousel) | Nav           |
| ---------- | ----------- | --------------------- | ------------- |
| < 480px    | 1 col       | ~1                    | Sheet drawer  |
| 480–639px  | 4 cols      | ~1                    | Sheet drawer  |
| 640–767px  | 4 cols      | ~1                    | Sheet drawer  |
| 768–1023px | 8 cols      | 1.5                   | Inline nav    |
| ≥ 1024px   | 12 cols     | 2.5                   | Inline nav    |

Implemented: `env(safe-area-inset-*)` padding, `clamp()` type (body ≥ 16px on
mobile to avoid iOS zoom), hamburger → shadcn/ui Sheet with blur backdrop, 44px+
tap targets everywhere, `overflow-x-auto` on the admin table, full-width form
controls on small screens, blur halved on touch, `overflow-x-hidden` body guard,
and `next/image` with `sizes` for proper srcset.

### Manual mobile testing checklist

1. Resize 320px → 1920px; confirm no horizontal scrollbar.
2. Open the Sheet drawer on <768px; verify it closes on any link tap.
3. Swipe the carousel on touch; confirm each slide snaps to centre and vertical scroll still works.
4. Tap every interactive element and confirm ≥ 44×44px hit area.
5. In DevTools device mode, confirm the blue blob blur is reduced.
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
- Admin + favicon routes disable index/follow robots where applicable.

## Animations Policy (Section II)

Allowed: scroll-reveal (0.6s ease-out fade-up), `scale(1.02)` on button hover /
image hover, background-color/interaction transitions, and the carousel's drag
physics. `prefers-reduced-motion` is respected throughout via `reveal.tsx` and
`globals.css`.
