# AGENTS.md

Personal developer portfolio for **Calap** (calap0309). Next.js 15 App Router +
TypeScript (strict, zero `any`) + Tailwind 3 + shadcn/ui + Framer Motion + Prisma +
NextAuth (Credentials/JWT). Apple-inspired design: pure white base, `#1d1d1f` ink,
`#0071e3` accent, hairline `#d2d2d7`, fluid `clamp()` type.

## Dev workflow

Local dev runs on **SQLite**; production deploys to Vercel with **Neon Postgres**.

```bash
npm run db:sqlite:setup   # generate client + push schema.sqlite.prisma (wipes dev.db)
npm run db:sqlite:seed    # seed 6 projects + admin user
DATABASE_URL="file:./dev.db" npm run dev
```

`db:sqlite:setup` runs `--force-reset`, so it **wipes the local DB** every run.
`seed` then fully rebuilds it — and seed is **pruning, not additive**: it deletes
any `Project` whose slug is not in the seed set, so manual local edits to seeded
rows are lost on re-seed. Both are by design: the local DB is fully seed-derived.

Verify with `npm run lint` and `npm run build` (what CI runs in `webpack.yml`;
Node 22, `npm ci`). `npx tsc --noEmit` also passes (`noEmit: true` in tsconfig)
but is **not part of CI**. There is **no test suite**.

## Two Prisma schemas (the gotcha)

`schema.prisma` (Postgres) and `schema.sqlite.prisma` (SQLite) are **identical
except the `provider` field**. Any schema change must be made to **both**, and
the local client regenerated via the SQLite setup script. Same for seed data.
`DATABASE_URL="file:./dev.db"` resolves relative to the schema file, so the local
db lives at `prisma/dev.db`.

## Data model

- **User** — the single admin; `password` is a bcrypt hash. Created by `seed.ts`
  with **hardcoded** creds `admin@portfolio.dev` / the password `firas228` — the
  `ADMIN_EMAIL`/`ADMIN_PASSWORD` vars in `.env.example` are **unused**.
- **Project** — `slug` unique; `tags` is a **JSON string** (default `"[]"`,
  stringify on write via `JSON.stringify`, parse with `parseTags`/`JSON.parse` in
  `src/lib/utils.ts`); `featured` drives homepage placement. Admin CRUD validates
  `slug` as lowercase-alphanumeric-with-dashes server-side.
- **Message** — contact-form submissions, always persisted to the DB (admin
  inbox); email dispatch is best-effort after save (Resend if `RESEND_API_KEY`,
  else Nodemailer via `SMTP_*`). Contact route is rate-limited
  (5 req / 10 min, `src/lib/rate-limit.ts`).

GitHub sync (`npm run sync:github`) pulls calap0309's public repos, filters via
`shouldInclude`, and upserts by slug; it deletes stale projects unless run with
`--keep-manual`. Mapping logic (cover images, tag overrides, featured set,
exclusions, GitHub Pages fallbacks) lives in `src/lib/github-projects.ts`, the
single source shared by the script and the API route. CI runs this **daily at
03:00 UTC** (`sync-github.yml`, needs `DATABASE_URL` + `GITHUB_TOKEN` secrets),
so running it locally is for previewing, not production.

## Design system

All tokens are CSS variables in `globals.css` (RGB triplets, `light` default +
`.dark` override toggled by `theme-toggle.tsx`, applied FOUC-free by an inline
`<head>` script in `layout.tsx`) exposed as Tailwind classes: `bg-appbg`,
`text-ink`, `text-subtext`, `bg-accent` / `accent-hover`, `border-hairline`,
`text-danger`, `surface` / `surface-soft` / `surface-tag`.

- Type scale lives in `tailwind.config.ts` (`fontSize.*`, `tracking-apple`); keep text fluid with `clamp()` and never below 16px on mobile.
- No gradients except the hero glow (`--topwash`), no glassmorphism.
- `components/reveal.tsx` handles scroll reveals and respects `prefers-reduced-motion`; keep that respect in any new animation (`magnetic-button.tsx`, `tilt-card.tsx` check it too).
- `max-w-text` (980px) for copy, `max-w-grid` (1200px) for project grids.

## Conventions

- Server components by default; add `"use client"` only when interactivity requires it.
- Components co-located under `src/components/`; logic under `src/lib/`.
- Forms use react-hook-form + zod (client **and** server validation).
- Every admin API route validates the NextAuth session server-side before mutating (`getServerSession(authOptions)` from `src/lib/auth.ts`).

## Env

`.env.example` is the source of truth for required vars (Postgres URL for prod,
NextAuth secret/URL, Resend or SMTP for the contact form). Local overrides go in
`.env.local`; never commit `.env` files. Note `ADMIN_EMAIL`/`ADMIN_PASSWORD` are
listed there but read nowhere (see Data model).