import type { Metadata } from "next";
import Link from "next/link";
import { Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProjectCarousel } from "@/components/project-carousel";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Public projects — real-time infrastructure, state architectures, and developer tooling.",
};

export const dynamic = "force-dynamic";

async function getProjects() {
  return prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-grid py-16 md:py-24">
        <div className="row">
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            <p className="text-[1.0625rem] font-semibold text-subtext">
              Work
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,4rem)] font-bold tracking-tight2">
              A curated index of what I&apos;ve shipped.
            </h1>
            <p className="mt-5 max-w-lg text-subtext">
              Tools, libraries, and infrastructure I designed and built. Each
              entry is a production system, not a tutorial follow-along. Drag,
              swipe, or use the arrow keys to move through them.
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          {projects.length === 0 ? (
            <div className="rounded-2xl border hairline bg-surface p-10 text-center shadow-sm sm:p-14">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-soft text-subtext">
                <Layers className="h-6 w-6" />
              </div>
              <p className="mt-4 font-semibold text-ink">No projects yet</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-subtext">Projects will appear here once published.</p>
              <Link href="/contact" className="btn btn-ghost mt-6 inline-flex">
                Get in touch
              </Link>
            </div>
          ) : (
            <ProjectCarousel projects={projects} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
