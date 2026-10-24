import type { MetadataRoute } from "next";
import { POSTS } from "@/content/blog";
import { absoluteUrl } from "@/lib/site";

// Fixed dates (not "now") so lastModified only changes when content does —
// search engines learn to ignore lastmod values that change on every build.
const SITE_UPDATED = "2026-10-24";

const PAGES: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly"; lastModified?: string }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/docs", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly", lastModified: POSTS[0]?.published },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/support", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/data-deletion", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((p) => ({
      url: absoluteUrl(p.path),
      lastModified: p.lastModified ?? SITE_UPDATED,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...POSTS.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: p.updated ?? p.published,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: [absoluteUrl(`/blog/${p.slug}/opengraph-image`)],
    })),
  ];
}
