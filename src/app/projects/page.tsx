import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProjectCard } from "@/components/project-card";

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
      <main className="py-20">
        <div className="row">
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-terracotta">
              Work
            </p>
            <h1 className="mt-4 font-mono text-4xl md:text-5xl tracking-tight">
              Public index of projects.
            </h1>
            <p className="mt-4 max-w-lg text-base text-nearblack/70">
              Tools, libraries, and infrastructure I designed and shipped. Each
              entry is a production system, not a tutorial follow-along.
            </p>
          </div>
        </div>

        <div className="row mt-16 gap-x-6 gap-y-12">
          {projects.length === 0 ? (
            <div className="col-span-12 border border-dashed border-nearblack/40 p-12 text-center font-mono text-sm text-nearblack/50">
              No projects published yet.
            </div>
          ) : (
            projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={{
                  ...project,
                  createdAt: project.createdAt,
                  updatedAt: project.updatedAt,
                }}
                wide={i % 3 === 1}
              />
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
