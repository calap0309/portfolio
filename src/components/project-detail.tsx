import type { Project } from "@/lib/types";
import { parseTags } from "@/lib/utils";

export function ProjectDetail({ project }: { project: Project }) {
  const tags = parseTags(project.tags);

  return (
    <article className="border border-nearblack bg-offwhite p-6">
      <div className="border-b border-nearblack/20 pb-4">
        <h2 className="font-mono text-2xl">{project.title}</h2>
        <span className="mt-1 block font-mono text-xs text-nearblack/50">
          {project.slug}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-nearblack/80">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="border border-nearblack/40 px-2 py-0.5 font-mono text-[0.64rem] uppercase tracking-wider text-nearblack/70"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
