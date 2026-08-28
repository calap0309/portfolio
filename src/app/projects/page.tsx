import type { Metadata } from "next";
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
            <div className="rounded-2xl hairline bg-surface-soft p-14 text-center text-subtext">
              No projects published yet.
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
