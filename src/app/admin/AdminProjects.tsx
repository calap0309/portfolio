"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Project } from "@/lib/types";
import { parseTags, slugify } from "@/lib/utils";

const projectSchema = z.object({
  title: z.string().min(1, "Title required."),
  slug: z
    .string()
    .min(1, "Slug required.")
    .regex(/^[a-z0-9-]+$/, "Lowercase, no spaces."),
  description: z.string().min(10, "Give a real description."),
  coverImage: z.string().url("Must be a URL.").or(z.literal("")).optional(),
  liveUrl: z.string().url("Must be a URL.").or(z.literal("")).optional(),
  githubUrl: z.string().url("Must be a URL.").or(z.literal("")).optional(),
  tags: z.string(),
  featured: z.boolean(),
});

type ProjectFormValues = z.input<typeof projectSchema>;

interface AdminProjectsProps {
  initialProjects: Project[];
}

type Editor = {
  mode: "create" | "edit";
  project?: Project;
} | null;

export function AdminProjects({ initialProjects }: AdminProjectsProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editor, setEditor] = useState<Editor>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      tags: "",
      featured: false,
    },
  });

  const tagsValue = useWatch({ control, name: "tags" });
  const featuredValue = useWatch({ control, name: "featured" });

  function openCreate() {
    reset({
      title: "",
      slug: "",
      description: "",
      coverImage: "",
      liveUrl: "",
      githubUrl: "",
      tags: "",
      featured: false,
    });
    setEditor({ mode: "create" });
  }

  function openEdit(project: Project) {
    reset({
      title: project.title,
      slug: project.slug,
      description: project.description,
      coverImage: project.coverImage ?? "",
      liveUrl: project.liveUrl ?? "",
      githubUrl: project.githubUrl ?? "",
      tags: parseTags(project.tags).join(", "),
      featured: project.featured,
    });
    setEditor({ mode: "edit", project });
  }

  function handleSlugAuto() {
    const title = getValues("title");
    if (title && !getValues("slug")) {
      setValue("slug", slugify(title), { shouldValidate: true });
    }
  }

  async function onSubmit(data: ProjectFormValues) {
    setSubmitting(true);
    setError(null);

    const payload = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      coverImage: data.coverImage,
      liveUrl: data.liveUrl,
      githubUrl: data.githubUrl,
      tags: data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      featured: data.featured,
    };

    const url =
      editor?.mode === "edit"
        ? `/api/admin/projects/${editor.project?.id}`
        : "/api/admin/projects";
    const method = editor?.mode === "edit" ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json()) as { error?: unknown };
        setError(
          typeof body.error === "string"
            ? body.error
            : "Operation failed. Check the fields."
        );
        return;
      }

      setEditor(null);
      router.refresh();

      const dataRes = (await res.json()) as { project: Project };
      const saved = dataRes.project;
      setProjects((prev) =>
        editor?.mode === "edit"
          ? prev.map((p) => (p.id === saved.id ? saved : p))
          : [saved, ...prev]
      );
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Permanently delete this project?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setError("Could not delete.");
        return;
      }

      setProjects((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } catch {
      setError("Network error.");
    }
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xl uppercase tracking-wide">
          Projects ({projects.length})
        </h2>
        <button
          onClick={openCreate}
          className="btn btn-primary"
          type="button"
        >
          + New project
        </button>
      </div>

      {error && (
        <div className="mt-4 border border-terracotta px-4 py-2 font-mono text-sm text-terracotta">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-x-auto border border-nearblack">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-nearblack">
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide">
                Title
              </th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide">
                Slug
              </th>
              <th className="hidden px-4 py-3 font-mono text-xs uppercase tracking-wide md:table-cell">
                Tags
              </th>
              <th className="hidden px-4 py-3 font-mono text-xs uppercase tracking-wide md:table-cell">
                Featured
              </th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-nearblack/50">
                  No projects yet. Create one to get started.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-nearblack/20 last:border-0"
                >
                  <td className="px-4 py-3 font-medium">{project.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-nearblack/60">
                    {project.slug}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="max-w-[16rem] truncate block font-mono text-xs text-nearblack/60">
                      {parseTags(project.tags).join(", ")}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {project.featured ? (
                      <span className="bg-ochre px-2 py-0.5 font-mono text-xs uppercase">
                        Featured
                      </span>
                    ) : (
                      <span className="text-nearblack/40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEdit(project)}
                        className="text-sm link-hover"
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-sm text-terracotta link-hover"
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog.Root
        open={editor !== null}
        onOpenChange={(open) => !open && setEditor(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-nearblack/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto border-4 border-nearblack bg-offwhite p-6 md:p-8">
            <Dialog.Title className="font-mono text-2xl">
              {editor?.mode === "edit" ? "Edit project" : "New project"}
            </Dialog.Title>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 grid gap-5"
            >
              <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block font-mono text-xs uppercase tracking-wide text-nearblack/70"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    {...register("title")}
                    onBlur={handleSlugAuto}
                    className="input-field"
                    autoFocus
                  />
                  {errors.title && (
                    <p className="mt-1 font-mono text-xs text-terracotta">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="slug"
                    className="mb-2 block font-mono text-xs uppercase tracking-wide text-nearblack/70"
                  >
                    Slug
                  </label>
                  <input
                    id="slug"
                    type="text"
                    {...register("slug")}
                    className="input-field"
                  />
                  {errors.slug && (
                    <p className="mt-1 font-mono text-xs text-terracotta">
                      {errors.slug.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block font-mono text-xs uppercase tracking-wide text-nearblack/70"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register("description")}
                  className="input-field resize-y"
                />
                {errors.description && (
                  <p className="mt-1 font-mono text-xs text-terracotta">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="coverImage"
                    className="mb-2 block font-mono text-xs uppercase tracking-wide text-nearblack/70"
                  >
                    Cover image URL
                  </label>
                  <input
                    id="coverImage"
                    type="url"
                    {...register("coverImage")}
                    className="input-field"
                  />
                  {errors.coverImage && (
                    <p className="mt-1 font-mono text-xs text-terracotta">
                      {errors.coverImage.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="tags"
                    className="mb-2 block font-mono text-xs uppercase tracking-wide text-nearblack/70"
                  >
                    Tags (comma separated)
                  </label>
                  <input
                    id="tags"
                    type="text"
                    value={tagsValue}
                    onChange={(e) =>
                      setValue("tags", e.target.value, {
                        shouldValidate: true,
                      })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="liveUrl"
                    className="mb-2 block font-mono text-xs uppercase tracking-wide text-nearblack/70"
                  >
                    Live URL
                  </label>
                  <input
                    id="liveUrl"
                    type="url"
                    {...register("liveUrl")}
                    className="input-field"
                  />
                  {errors.liveUrl && (
                    <p className="mt-1 font-mono text-xs text-terracotta">
                      {errors.liveUrl.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="githubUrl"
                    className="mb-2 block font-mono text-xs uppercase tracking-wide text-nearblack/70"
                  >
                    GitHub URL
                  </label>
                  <input
                    id="githubUrl"
                    type="url"
                    {...register("githubUrl")}
                    className="input-field"
                  />
                  {errors.githubUrl && (
                    <p className="mt-1 font-mono text-xs text-terracotta">
                      {errors.githubUrl.message}
                    </p>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-3 font-mono text-sm">
                <input
                  type="checkbox"
                  checked={featuredValue}
                  onChange={(e) =>
                    setValue("featured", e.target.checked, {
                      shouldValidate: true,
                    })
                  }
                  className="h-4 w-4 accent-terracotta"
                />
                Featured on homepage
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setEditor(null)}
                  className="btn btn-outline"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary disabled:opacity-50"
                >
                  {submitting
                    ? editor?.mode === "edit"
                      ? "Saving…"
                      : "Creating…"
                    : editor?.mode === "edit"
                      ? "Save changes"
                      : "Create project"}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
