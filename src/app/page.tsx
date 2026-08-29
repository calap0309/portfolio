import Link from "next/link";
import { ArrowRight, Sparkles, ArrowUpRight, Zap, Layers, Code2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { MagneticWrap } from "@/components/magnetic-button";

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
          style={{ paddingTop: "clamp(5.5rem, 15vh, 13rem)", paddingBottom: "clamp(3rem, 8vh, 6rem)" }}
        >
          <Reveal>
            <div className="row">
              <div className="col-span-12">
                <span className="animate-float inline-flex items-center gap-2 rounded-full border-hairline border bg-surface/60 px-4 py-1.5 text-[0.8125rem] font-medium text-subtext shadow-sm backdrop-blur-md">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  </span>
                  Available for freelance
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
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
                  Crafting <span className="text-gradient">durable systems</span> for
                  the&nbsp;web
                </h1>
                <p className="mx-auto mt-7 max-w-[46ch] text-[1.0625rem] text-subtext">
                  I&apos;m Calap, a full-stack engineer building real-time
                  infrastructure, state architectures, and developer tooling
                  that scale under load.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
                  <MagneticWrap>
                    <Link href="/projects" className="btn group w-full gap-2 sm:w-auto">
                      View my work
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </MagneticWrap>
                  <MagneticWrap>
                    <Link
                      href="/contact"
                      className="btn btn-ghost w-full sm:w-auto"
                    >
                      Get in touch
                    </Link>
                  </MagneticWrap>
                </div>

                {/* Micro trust bar — 3 pillars, Apple minimal */}
                <div className="mx-auto mt-14 grid max-w-xl grid-cols-3 gap-4 border-t border-hairline/60 pt-8 sm:gap-6">
                  {[
                    { icon: Zap, label: "Realtime", sub: "WebSocket · SSE" },
                    { icon: Layers, label: "Systems", sub: "Scale-tested" },
                    { icon: Code2, label: "Tooling", sub: "DX-first" },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-surface-soft text-accent">
                        <item.icon className="h-4.5 w-4.5" />
                      </div>
                      <p className="mt-3 text-[0.8125rem] font-semibold text-ink">{item.label}</p>
                      <p className="text-[0.6875rem] font-medium uppercase tracking-wider text-subtext">{item.sub}</p>
                    </div>
                  ))}
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

          <div className="row mt-16 gap-x-6 gap-y-6">
            {projects.length === 0 ? (
              <div className="col-span-12 rounded-2xl border hairline bg-surface-soft p-14 text-center">
                <p className="text-subtext">No featured projects yet — check back soon.</p>
                <Link href="/projects" className="link mt-3 inline-flex">Browse all work →</Link>
              </div>
            ) : (
              projects.map((project, i) => (
                <Reveal key={project.id} delay={i * 0.08} className="col-span-12">
                  <ProjectCard project={project} wide={i === 1} />
                </Reveal>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
