import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchRepos, mapRepo } from "@/lib/github-projects";

/**
 * POST /api/admin/sync-github
 * Auth required (same as other admin routes).
 * Fetches GitHub repos and upserts into Project table.
 *
 * Query:
 *   ?keepManual=1  — don't delete stale slugs (keeps hand-added projects)
 */

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const keepManual = url.searchParams.get("keepManual") === "1";

  const userParam = process.env.GITHUB_USER || "calap0309";
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

  try {
    const repos = await fetchRepos(userParam, token);
    const mapped = repos.map(mapRepo);

    const adminEmail = (session.user.email as string) || "admin@portfolio.dev";
    let dbUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!dbUser) {
      // fallback to any user (seed admin)
      dbUser = await prisma.user.findFirst();
      if (!dbUser) {
        return NextResponse.json({ error: "No user found — seed the DB first" }, { status: 500 });
      }
    }

    let upserted = 0;
    for (const proj of mapped) {
      await prisma.project.upsert({
        where: { slug: proj.slug },
        update: { ...proj, userId: dbUser.id },
        create: { ...proj, userId: dbUser.id },
      });
      upserted++;
    }

    let deleted = 0;
    if (!keepManual) {
      const keep = mapped.map((p) => p.slug);
      const res = await prisma.project.deleteMany({ where: { slug: { notIn: keep } } });
      deleted = res.count;
    }

    return NextResponse.json({
      ok: true,
      fetched: repos.length,
      upserted,
      deleted,
      keepManual,
      projects: mapped.map((p) => ({ slug: p.slug, title: p.title, featured: p.featured })),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
