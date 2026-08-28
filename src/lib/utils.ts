import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseTags(tags: string): string[] {
  try {
    const parsed: unknown = JSON.parse(tags);
    if (Array.isArray(parsed) && parsed.every((t) => typeof t === "string")) {
      return parsed as string[];
    }
    return [];
  } catch {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
