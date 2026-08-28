# Index — Personal Developer Portfolio

A production-ready personal portfolio built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui** primitives, **Prisma**, and **PostgreSQL** (SQLite for local dev).

Ground-up brutalist design system: off-white `#fafaf8`, near-black `#18181b`, and a single terracotta accent `#c9694b`. No purple gradients, no glassmorphism, no generic fade-in-up reveals.

## Tech Stack

| Layer      | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | Next.js 15 (App Router)                  |
| Language   | TypeScript (strict, zero `any`)          |
| Styling    | Tailwind CSS 3 + custom Swiss grid       |
| UI         | Radix primitives (shadcn/ui)             |
| Auth       | NextAuth (Credentials + JWT)             |
| DB / ORM   | PostgreSQL + Prisma (SQLite fallback)    |
| Email      | Resend (Nodemailer fallback)             |
| Validation | Zod                                     |
| Forms      | react-hook-form                         |

## Folder Structure

```
.
├── prisma/
│   ├── schema.prisma          # Project + User models
│   └── seed.ts                # 3 realistic seed projects
├── public/
│   └── favicon.svg            # SVG favicon fallback
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── admin/
│   │   │   │   ├── projects/route.ts
│   │   │   │   └── projects/[id]/route.ts
│   │   │   └── contact/route.ts
│   │   ├── admin/
│   │   │   ├── page.tsx          # Dashboard (server)
│   │   │   ├── AdminProjects.tsx # CRUD manager (client)
│   │   │   └── login/
│   │   │       ├── page.tsx
│   │   │       └── LoginForm.tsx
│   │   ├── contact/
│   │   │   ├── page.tsx
│   │   │   └── ContactForm.tsx
│   │   ├── projects/page.tsx
│   │   ├── favicon.ico/route.ts  # Generated favicon (ImageResponse)
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── nav.tsx
│   │   ├── footer.tsx
│   │   ├── project-card.tsx
│   │   └── project-detail.tsx
│   └── lib/
│       ├── auth.ts
│       ├── prisma.ts
│       ├── types.ts
│       └── utils.ts
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

Edit `.env`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="<generated-secret>"
NEXTAUTH_URL="http://localhost:3000"

# Contact form
RESEND_API_KEY="re_your_resend_api_key"   # Optional; SMTP fallback below
CONTACT_EMAIL="you@example.com"
SMTP_HOST="smtp.example.com"              # Only if no Resend key
SMTP_PORT="587"
SMTP_USER="you@example.com"
SMTP_PASS="your-smtp-password"
SMTP_FROM="Portfolio <portfolio@example.com>"
```

### 3. Set up the database (SQLite, local dev)

```bash
npm run db:push
npm run db:seed
```

For **PostgreSQL in production**, change `datasource db { provider = "sqlite" }` in `prisma/schema.prisma` to `provider = "postgresql"` and set `DATABASE_URL` to your Postgres connection string. Then:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000

## Admin

- Login: http://localhost:3000/admin
- Default credentials (from seed): `admin@portfolio.dev` / `admin123`

**Change the password immediately** after first login (`prisma/user.update` or re-seed after editing the seed hash).

## Favicon

The favicon is generated at runtime via `src/app/favicon.ico/route.ts` using `next/server`'s `ImageResponse` — a diagonal terracotta slash through a near-black circle on off-white. It renders cleanly in both dark and light browser tabs. An SVG fallback is also linked in `layout.tsx` via the metadata `icons` export.

## Contact Form

The form at `/contact` posts to `/api/contact`. It uses **Resend** if `RESEND_API_KEY` is set, otherwise falls back to **Nodemailer** using `SMTP_*` vars. Validation is done with Zod on both client and server.

## Seeding

```bash
npm run db:reset   # force-reset + re-seed
npm run db:seed    # just seed
```

## Scripts

| Script             | Purpose                          |
| ------------------ | -------------------------------- |
| `npm run dev`      | Start dev server                 |
| `npm run build`    | Production build                 |
| `npm start`        | Run production build             |
| `npm run lint`     | ESLint                           |
| `npm run db:push`  | Push schema to DB                |
| `npm run db:seed`  | Run seed script                  |
| `npm run db:reset` | Reset DB and re-seed             |

## Security Notes

- API routes validate the session server-side before any CRUD operation.
- Passwords are hashed with `bcryptjs`.
- Auth uses JWT sessions; Credentials provider only.
- The `favicon` and admin routes disable index/follow robots where applicable.
