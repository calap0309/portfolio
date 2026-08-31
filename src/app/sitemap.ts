import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio-six-topaz-evd842wqk8.vercel.app";
  const now = new Date();
  const routes = ["", "/projects", "/contact"].map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
  return routes;
}
