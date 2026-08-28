import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/lib/types";
import { parseTags } from "@/lib/utils";

/**
 * Apple-style project card. Hairline-border tile with Apple's layered shadow
 * system; the cover image scales to 1.02 on hover over 0.3s. Used on the
 * homepage's "Selected Work" grid and stacked with a slight stagger.
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
      className={`group col-span-12 flex flex-col overflow-hidden rounded-2xl hairline bg-white shadow-card transition-shadow duration-300 ease-apple hover:shadow-card-hover ${
        wide ? "md:col-span-8 md:col-start-3" : "md:col-span-5"
      } ${wide ? "md:mt-16" : "md:mt-20"}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f5f5f7]">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 ease-apple group-hover:scale-[1.02]"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold tracking-tight2">{project.title}</h3>
          <span className="shrink-0 text-xs font-normal uppercase tracking-wide text-subtext">
            {project.slug}
          </span>
        </div>

        <p className="text-subtext">{project.description}</p>

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full hairline bg-[#f5f5f7] px-3 py-1 text-xs font-medium text-subtext"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-6 pt-2">
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[2.75rem] items-center gap-1 text-[0.875rem] font-semibold text-accent transition-colors hover:text-accent-hover"
            >
              Visit <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[2.75rem] items-center gap-1 text-[0.875rem] font-semibold text-accent transition-colors hover:text-accent-hover"
            >
              <Github className="h-4 w-4" /> Source
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
