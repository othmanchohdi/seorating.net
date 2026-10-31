import type { Category, Post } from "./types";
import { POST_SLUGS } from "./slugs";
import { post as llmsTxt } from "./what-is-llms-txt-shopify";
import { post as aiAssistants } from "./how-ai-assistants-choose-stores";
import { post as robotsTxt } from "./shopify-robots-txt-guide";
import { post as metaDescriptions } from "./meta-descriptions-that-get-clicked";
import { post as altText } from "./product-image-alt-text-checklist";
import { post as productSchema } from "./shopify-product-schema";
import { post as pageSpeed } from "./reading-pagespeed-report";
import { post as duplicateUrls } from "./shopify-duplicate-urls-canonical";

export type { Category, Post };

export const CATEGORIES: Category[] = ["AI search", "On-page", "Technical SEO", "Speed"];

// Newest first.
export const POSTS: Post[] = [duplicateUrls, llmsTxt, aiAssistants, robotsTxt, metaDescriptions, altText, productSchema, pageSpeed].sort((a, b) =>
  b.published.localeCompare(a.published),
);

const missing = POSTS.map((p) => p.slug).filter((s) => !(POST_SLUGS as readonly string[]).includes(s));
if (missing.length || POSTS.length !== POST_SLUGS.length) {
  throw new Error(`content/blog/slugs.ts is out of sync with POSTS: ${missing.join(", ") || "count mismatch"}`);
}

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export function relatedPosts(post: Post, count = 3) {
  const same = POSTS.filter((p) => p.slug !== post.slug && p.category === post.category);
  const rest = POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category);
  return [...same, ...rest].slice(0, count);
}

export function categorySlug(c: Category) {
  return c.toLowerCase().replace(/\s+/g, "-");
}

export function formatDate(iso: string, month: "short" | "long" = "short") {
  return new Intl.DateTimeFormat("en-US", { month, day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}
