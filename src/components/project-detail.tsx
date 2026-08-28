import type { Project } from "@/lib/types";
import { parseTags } from "@/lib/utils";

export function ProjectDetail({ project }: { project: Project }) {
  const tags = parseTags(project.tags);

  return (
    <article className="rounded-2xl hairline bg-white p-6 shadow-card">
      <div className="hairline-b pb-4">
        <h2 className="text-2xl font-bold tracking-tight2">{project.title}</h2>
        <span className="mt-1 block text-xs font-normal uppercase tracking-wide text-subtext">
          {project.slug}
        </span>
      </div>
      <p className="mt-4 text-subtext">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full hairline bg-[#f5f5f7] px-3 py-1 text-xs font-medium text-subtext"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
