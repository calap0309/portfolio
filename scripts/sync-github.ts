/**
 * scripts/sync-github.ts
 * Pulls public repos from GitHub (calap0309) and upserts them into Prisma Project table.
 *
 * Usage:
 *   GITHUB_TOKEN=ghp_xxx DATABASE_URL=postgresql://... npx tsx scripts/sync-github.ts
 *   npm run sync:github
 *
 * Env:
 *   GITHUB_USER  — default calap0309
 *   GITHUB_TOKEN — optional, higher rate limit + private insight
 *   DATABASE_URL — required (Neon / Postgres). Falls back to Prisma default.
 *
 * Idempotent: upsert by slug, delete any project whose slug is not in the fetched set
 * (except it never deletes slugs not owned by GitHub sync if you want to keep manual ones —
 *  see --keep-manual flag).
 */

import { PrismaClient } from "@prisma/client";
import { fetchRepos, mapRepo } from "../src/lib/github-projects";

const USER = process.env.GITHUB_USER || "calap0309";
const KEEP_MANUAL = process.argv.includes("--keep-manual");

async function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  console.log(`→ Fetching repos for ${USER} ${token ? "(authenticated)" : "(anonymous, rate-limited)"}...`);
  const repos = await fetchRepos(USER, token);
  console.log(`  found ${repos.length} repos after filtering`);

  const mapped = repos.map(mapRepo);
  for (const p of mapped) {
    console.log(`  • ${p.slug} — featured=${p.featured} tags=${p.tags} live=${p.liveUrl || "-"}`);
  }

  const prisma = new PrismaClient();

  // ensure admin user exists for FK
  const adminEmail = "admin@portfolio.dev";
  let user = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!user) {
    // create lightweight admin if seed never ran
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash("firas228", 12);
    user = await prisma.user.create({ data: { email: adminEmail, name: "Admin", password: hash } });
    console.log(`  created missing user ${adminEmail}`);
  }

  let upserted = 0;
  for (const proj of mapped) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: { ...proj, userId: user.id },
      create: { ...proj, userId: user.id },
    });
    upserted++;
  }

  if (!KEEP_MANUAL) {
    const keep = mapped.map((p) => p.slug);
    const del = await prisma.project.deleteMany({ where: { slug: { notIn: keep } } });
    if (del.count) console.log(`  deleted ${del.count} stale project(s) not in GitHub`);
  } else {
    console.log(`  --keep-manual: skipping delete of stale slugs`);
  }

  console.log(`✓ Sync complete — ${upserted} upserted`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("sync failed:", e);
  process.exit(1);
});
