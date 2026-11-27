import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { CRAWLERS, VERIFIED } from "@/content/ai-crawlers";
import { livePosts } from "@/content/blog";
import { absoluteUrl } from "@/lib/site";

// Fixed dates (not "now") so lastModified only changes when content does —
// search engines learn to ignore lastmod values that change on every build.
const SITE_UPDATED = "2026-10-24";

const staticPages = (blogLastModified?: string): { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly"; lastModified?: string }[] => [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/docs", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly", lastModified: blogLastModified },
  { path: "/ai-tools", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-11-21" },
  { path: "/ai-tools/ai-crawlers", priority: 0.7, changeFrequency: "monthly", lastModified: VERIFIED },
  { path: "/ai-tools/llms-txt-generator", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-11-21" },
  { path: "/ai-tools/robots-txt-tester", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-11-27" },
  { path: "/ai-tools/product-schema-generator", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-11-27" },
  { path: "/ai-tools/ai-readiness-checklist", priority: 0.6, changeFrequency: "monthly", lastModified: "2026-11-21" },
  { path: "/ai-tools/serp-snippet-preview", priority: 0.6, changeFrequency: "monthly", lastModified: "2026-11-27" },
  { path: "/ai-tools/core-web-vitals-checker", priority: 0.6, changeFrequency: "monthly", lastModified: "2026-11-27" },
  { path: "/ai-tools/alt-text-checker", priority: 0.6, changeFrequency: "monthly", lastModified: "2026-11-27" },
  { path: "/ai-tools/shopify-url-inspector", priority: 0.6, changeFrequency: "monthly", lastModified: "2026-11-27" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/support", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/data-deletion", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Scheduled posts have future `published` dates; connection() opts this
  // route out of static generation so "now" is re-checked on every request.
  await connection();
  const POSTS = livePosts();
  return [
    ...staticPages(POSTS[0]?.published).map((p) => ({
      url: absoluteUrl(p.path),
      lastModified: p.lastModified ?? SITE_UPDATED,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...CRAWLERS.map((c) => ({
      url: absoluteUrl(`/ai-tools/ai-crawlers/${c.slug}`),
      lastModified: VERIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.5,
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
