import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";

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
        {/* Apple-style hero — generous whitespace, tight-tracked headline,
            near-black ink, blue CTA. Content is capped at 980px for text. */}
        <section
          className="mx-auto max-w-text px-0 text-center"
          style={{ paddingTop: "clamp(5.5rem, 15vh, 13rem)", paddingBottom: "clamp(4rem, 11vh, 9rem)" }}
        >
          <Reveal>
            <div className="row">
              <div className="col-span-12">
                <span className="inline-flex items-center gap-2 rounded-full border-hairline border px-4 py-1.5 text-[0.8125rem] font-medium text-subtext">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  Available for freelance
                </span>
                <h1
                  className="mx-auto mt-8 max-w-[16ch] text-ink"
                  style={{
                    fontSize: "clamp(2.75rem, 9vw, 5.25rem)",
                    lineHeight: 1.03,
                    letterSpacing: "-0.045em",
                    fontWeight: 700,
                  }}
                >
                  Crafting durable systems for the&nbsp;web
                </h1>
                <p className="mx-auto mt-7 max-w-[46ch] text-[1.0625rem] text-subtext">
                  I&apos;m Calap, a full-stack engineer building real-time
                  infrastructure, state architectures, and developer tooling
                  that scale under load.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-6">
                  <Link href="/projects" className="btn w-full sm:w-auto">
                    View my work
                  </Link>
                  <Link
                    href="/contact"
                    className="btn btn-secondary w-full sm:w-auto"
                  >
                    Get in touch
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Selected Work — billed grid, cards staggered (Apple centered
            asymmetry), each revealed on scroll with a gentle fade-up. */}
        <section className="mx-auto max-w-grid py-16">
          <Reveal>
            <div className="row items-end justify-between hairline-top pt-12">
              <div className="col-span-12 md:col-span-6">
                <p className="text-[0.8125rem] font-semibold uppercase tracking-widest text-subtext">
                  Selected Work
                </p>
                <h2 className="mt-2 text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight2">
                  Projects I&apos;m proud of
                </h2>
              </div>
              <div className="col-span-12 mt-6 md:col-span-6 md:mt-0 md:text-right">
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-accent transition-colors hover:text-accent-hover"
                >
                  All projects
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-apple group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="row mt-16 gap-x-6">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.1} className="col-span-12">
                <ProjectCard project={project} wide={i === 1} />
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
