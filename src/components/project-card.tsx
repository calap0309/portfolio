import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/lib/types";
import { parseTags } from "@/lib/utils";

/**
 * Apple-style project card. Hairline-border tile with Apple's layered shadow
 * system; the cover image scales to 1.02 on hover over 0.3s. Primary "Visit"
 * links translate their arrow on hover. Used on the homepage's Selected Work
 * grid, stacked with a slight stagger (wide = the centre-featured card).
 */
export function ProjectCard({
  project,
  wide = false,
}: {
  project: Project;
  wide?: boolean;
}) {
  const tags = parseTags(project.tags);

  return (
    <article
      className={`group col-span-12 flex flex-col overflow-hidden rounded-2xl border-hairline border bg-surface shadow-card transition-shadow duration-300 ease-apple hover:shadow-card-hover ${
        wide ? "md:col-span-8 md:col-start-3" : "md:col-span-5"
      } ${wide ? "md:mt-10" : "md:mt-14"}`}
    >
      {/* Cover — image zooms gently on hover (1.02 over 0.3s). */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-soft">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-apple group-hover:scale-[1.03]"
          />
        )}
        {!project.coverImage && (
          <div className="flex h-full items-center justify-center text-[0.875rem] font-medium text-subtext/70">
            {project.title}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold tracking-tight2 text-ink">
            {project.title}
          </h3>
          {project.coverImage && (
            <span
              className="ml-auto hidden shrink-0 items-center text-[0.75rem] font-medium uppercase tracking-wider text-subtext sm:inline-flex"
              aria-hidden
            >
              {project.slug}
            </span>
          )}
        </div>

        <p className="mt-3 text-subtext">{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface-tag px-3 py-1 text-xs font-medium text-subtext transition-colors duration-200 hover:bg-surface-soft"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-7 pt-6">
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex min-h-[2.75rem] items-center gap-1 text-[0.875rem] font-semibold text-accent transition-colors hover:text-accent-hover"
            >
              Visit
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-apple group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex min-h-[2.75rem] items-center gap-1.5 text-[0.875rem] font-semibold text-accent transition-colors hover:text-accent-hover"
            >
              <Github className="h-4 w-4" /> Source
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
