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
      <main className="py-16 md:py-20">
        <div className="row">
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-terracotta">
              Work
            </p>
            <h1 className="mt-4 font-mono text-4xl tracking-tight md:text-5xl">
              Public index of projects.
            </h1>
            <p className="mt-4 max-w-lg text-base text-nearblack/70">
              Tools, libraries, and infrastructure I designed and shipped. Each
              entry is a production system, not a tutorial follow-along. Drag,
              swipe, or use the arrow keys to move through them.
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          {projects.length === 0 ? (
            <div className="border border-dashed border-nearblack/40 p-12 text-center font-mono text-sm text-nearblack/50">
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
