/**
 * Shared GitHub → Prisma mapper.
 * Single source of truth for both scripts/sync-github.ts and the API route.
 * Keeps cover images, featured flags, and tag logic consistent.
 */

export type GhRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  topics?: string[];
  fork: boolean;
  private: boolean;
  size: number;
  updated_at: string;
};

const COVERS: Record<string, string> = {
  "poker-room": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
  "event-horizon": "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&q=80",
  "blaze-anime": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
  noctuary: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800&q=80",
  "lumen-journal": "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
  "lumen-notes": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
  portfolio: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  "portfolio-website": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  portfolio2: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
};

const TAG_OVERRIDES: Record<string, string[]> = {
  "poker-room": ["JavaScript", "Game", "Poker", "Canvas"],
  "event-horizon": ["TypeScript", "Canvas", "Physics", "WebGL"],
  "blaze-anime": ["JavaScript", "React", "Anime", "API"],
  noctuary: ["HTML", "CSS", "Editorial", "Magazine"],
  "lumen-journal": ["JavaScript", "CSS", "Journal", "Local-First"],
  "lumen-notes": ["JavaScript", "Markdown", "Notes", "PWA"],
};

const FEATURED = new Set(["poker-room", "event-horizon", "blaze-anime"]);

const EXCLUDE = new Set(["calap0309", "portfolio", "portfolio2", "portfolio-website"]);

/** Humanize repo name: poker-room -> Poker Room */
export function humanize(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Build cover for any repo — known map or fallback Unsplash code */
export function coverFor(name: string): string {
  return COVERS[name] ?? "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80";
}

/** Resolve tags */
export function tagsFor(repo: GhRepo): string[] {
  if (TAG_OVERRIDES[repo.name]) return TAG_OVERRIDES[repo.name];
  const base = [];
  if (repo.language) base.push(repo.language);
  if (repo.topics?.length) base.push(...repo.topics.slice(0, 3).map(humanize));
  return base.length ? base.slice(0, 4) : ["Project"];
}

/** Should this repo become a portfolio project? */
export function shouldInclude(repo: GhRepo): boolean {
  if (repo.fork || repo.private) return false;
  if (EXCLUDE.has(repo.name)) return false;
  // Keep only repos worth showing: one that has a real description, an
  // explicit curated cover, or a live homepage. Additionally drop truly empty
  // repos (GitHub reports size 0) even if they carry a placeholder description
  // (e.g. a bare test repo like "fgfggd") — those would otherwise appear with
  // a generic filler description.
  const isEmpty = repo.size === 0;
  const hasCuratedCover = Object.prototype.hasOwnProperty.call(COVERS, repo.name);
  if (isEmpty && !hasCuratedCover) return false;
  const hasDescription = Boolean(repo.description?.trim());
  const hasHomepage = Boolean(repo.homepage?.trim());
  return hasDescription || hasCuratedCover || hasHomepage;
}

export type MappedProject = {
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  liveUrl: string;
  githubUrl: string;
  tags: string; // JSON stringified
  featured: boolean;
};

export function mapRepo(repo: GhRepo): MappedProject {
  const title = humanize(repo.name);
  const desc =
    repo.description?.trim() ||
    `${title} — built by Calap. See the repo for details, setup, and live demo.`;
  // prefer explicit homepage, otherwise GitHub Pages convention if repo looks like a pages site
  let liveUrl = repo.homepage?.trim() || "";
  // auto Pages fallback for known pages repos if homepage empty but repo has been pushed recently and is not API-only
  const pagesCandidates = new Set(["poker-room", "event-horizon", "noctuary", "lumen-journal", "lumen-notes"]);
  if (!liveUrl && pagesCandidates.has(repo.name)) {
    liveUrl = `https://calap0309.github.io/${repo.name}/`;
  }
  return {
    title,
    slug: repo.name.toLowerCase(),
    description: desc.slice(0, 280),
    coverImage: coverFor(repo.name),
    liveUrl,
    githubUrl: repo.html_url,
    tags: JSON.stringify(tagsFor(repo)),
    featured: FEATURED.has(repo.name),
  };
}

/** Fetch repos for a user via GitHub API (token optional but recommended). */
export async function fetchRepos(username: string, token?: string): Promise<GhRepo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&direction=desc`;
  const res = await fetch(url, { headers, next: { revalidate: 0 } });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GitHub API ${res.status}: ${txt.slice(0, 500)}`);
  }
  const data = (await res.json()) as GhRepo[];
  return data.filter(shouldInclude);
}
