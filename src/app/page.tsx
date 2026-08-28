import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProjectCard } from "@/components/project-card";

export const dynamic = "force-dynamic";

async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
}

export default async function HomePage() {
  const projects = await getFeaturedProjects();

  return (
    <>
      <Nav />
      <main>
        <section className="py-24 md:py-36">
          <div className="row">
            <div className="col-span-12 md:col-span-8 md:col-start-3">
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-terracotta">
                Calap — Full-Stack Engineer
              </p>
              <h1
                className="mt-6 font-mono leading-none tracking-tighter"
                style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
              >
                CALAP
              </h1>
              <h2 className="mt-4 font-mono leading-tight tracking-tight text-nearblack/80 text-[clamp(1.4rem,4vw,2rem)]">
                Engineering durable systems over chasing&nbsp;trends.
              </h2>
              <p className="mt-6 max-w-xl leading-relaxed text-nearblack/70 text-[clamp(1rem,1rem+0.2vw,1.0625rem)]">
                I build real-time infrastructure, state architectures, and
                developer tooling that scale under load — not marketing pages
                that fade out in a year.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="row items-end justify-between border-t border-nearblack pt-6">
            <div className="col-span-12 md:col-span-6">
              <h2 className="font-mono text-2xl uppercase tracking-wide">
                Selected Work
              </h2>
            </div>
            <div className="col-span-12 md:col-span-6 md:text-right">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-wide link-hover"
              >
                All projects <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="row mt-8 gap-x-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} wide={i === 1} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
