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
          className="mx-auto max-w-text px-0"
          style={{ paddingTop: "clamp(6rem, 15vh, 12rem)", paddingBottom: "clamp(4rem, 10vh, 8rem)" }}
        >
          <div className="row">
            <div className="col-span-12">
              <p className="text-[1.0625rem] font-semibold text-subtext">
                Hi, I&apos;m Calap — full-stack engineer.
              </p>
              <h1
                className="mt-5 text-ink"
                style={{
                  fontSize: "clamp(3rem, 10vw, 5.5rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.045em",
                  fontWeight: 700,
                }}
              >
                I build durable systems for the&nbsp;web.
              </h1>
              <p className="mt-8 max-w-[540px] text-[1.0625rem] text-subtext">
                Full-stack developer crafting real-time infrastructure, state
                architectures, and developer tooling that scale under load.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link href="/projects" className="btn">
                  View my work
                </Link>
                <Link href="/contact" className="btn btn-secondary">
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Work — billed grid, cards staggered (Apple centered
            asymmetry), each revealed on scroll with a gentle fade-up. */}
        <section className="mx-auto max-w-grid py-16">
          <Reveal>
            <div className="row items-end justify-between hairline-top pt-10">
              <div className="col-span-12 md:col-span-6">
                <h2 className="text-[clamp(1.8rem,4vw,2.75rem)] font-bold tracking-tight2">
                  Selected Work
                </h2>
              </div>
              <div className="col-span-12 md:col-span-6 md:text-right">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-accent transition-colors hover:text-accent-hover"
                >
                  All projects <ArrowRight className="h-4 w-4" />
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
