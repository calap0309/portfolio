import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/lib/types";
import { parseTags } from "@/lib/utils";

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
      className={`group border border-nearblack bg-offwhite ${
        wide ? "md:col-span-8 md:col-start-4" : "md:col-span-5"
      } col-span-12 flex flex-col ${
        wide ? "md:mt-24" : "md:mt-12"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-nearblack">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-mono text-lg leading-tight">{project.title}</h3>
          <span className="shrink-0 font-mono text-xs text-nearblack/60">
            {project.slug}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-nearblack/80">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="border border-nearblack/40 px-2 py-0.5 font-mono text-[0.64rem] uppercase tracking-wider text-nearblack/70"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-2">
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 decoration-terracotta link-hover"
            >
              Visit <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-nearblack/60 link-hover"
            >
              <Github className="h-4 w-4" /> Source
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
