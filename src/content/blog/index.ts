import type { Category, Post } from "./types";
import { POST_SCHEDULE, POST_SLUGS } from "./slugs";
import { post as llmsTxt } from "./what-is-llms-txt-shopify";
import { post as aiAssistants } from "./how-ai-assistants-choose-stores";
import { post as robotsTxt } from "./shopify-robots-txt-guide";
import { post as metaDescriptions } from "./meta-descriptions-that-get-clicked";
import { post as altText } from "./product-image-alt-text-checklist";
import { post as productSchema } from "./shopify-product-schema";
import { post as pageSpeed } from "./reading-pagespeed-report";
import { post as duplicateUrls } from "./shopify-duplicate-urls-canonical";
import { post as seoChecklist } from "./shopify-seo-checklist-2026";
import { post as aiVisibility101 } from "./ai-visibility-101-shopify";
import { post as searchConsole } from "./google-search-console-shopify-guide";
import { post as internalLinking } from "./shopify-internal-linking-guide";
import { post as backlinks } from "./backlinks-for-small-shopify-brands";
import { post as coreWebVitalsLcp } from "./core-web-vitals-lcp-shopify";

export type { Category, Post };

export const CATEGORIES: Category[] = ["Strategy", "AI search", "On-page", "Technical SEO", "Speed", "Internal linking", "Backlinks"];

// Newest first.
export const POSTS: Post[] = [
  coreWebVitalsLcp,
  backlinks,
  internalLinking,
  duplicateUrls,
  llmsTxt,
  aiAssistants,
  robotsTxt,
  metaDescriptions,
  altText,
  productSchema,
  pageSpeed,
  seoChecklist,
  aiVisibility101,
  searchConsole,
].sort((a, b) => b.published.localeCompare(a.published));

const missing = POSTS.map((p) => p.slug).filter((s) => !(POST_SLUGS as readonly string[]).includes(s));
if (missing.length || POSTS.length !== POST_SLUGS.length) {
  throw new Error(`content/blog/slugs.ts is out of sync with POSTS: ${missing.join(", ") || "count mismatch"}`);
}

const dateMismatch = POSTS.filter((p) => POST_SCHEDULE.find((s) => s.slug === p.slug)?.published !== p.published);
if (dateMismatch.length) {
  throw new Error(`content/blog/slugs.ts published dates are out of sync with POSTS: ${dateMismatch.map((p) => p.slug).join(", ")}`);
}

// A post's `published` date is a schedule, not just a sort key: proxy.ts
// blocks its URL with a real 404 until this date, so scheduling a post just
// means giving it a future date — no other step needed.
export function isPublished(published: string, now: Date = new Date()) {
  return published <= now.toISOString().slice(0, 10);
}

// Posts that are live right now. Use this (not POSTS) for anything that
// lists, links to or advertises posts — the blog index, sitemap, RSS and
// llms.txt all call this after `await connection()` so a scheduled post
// appears the moment its date arrives, without a rebuild.
export function livePosts(now: Date = new Date()) {
  return POSTS.filter((p) => isPublished(p.published, now));
}

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

// The article page itself stays statically prerendered (see
// /blog/[slug]/page.tsx), so this freezes "now" once at build/module-load
// time instead of reading Date() during that page's render — Next's
// prerenderer rejects a fresh, non-deterministic Date() read inside a
// static page, and correctly so: the alternative is this value silently
// going stale between builds, which is an acceptable trade for a
// related-posts widget.
const BUILD_TIME = new Date();

export function relatedPosts(post: Post, count = 3) {
  const live = livePosts(BUILD_TIME).filter((p) => p.slug !== post.slug);
  const same = live.filter((p) => p.category === post.category);
  const rest = live.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, count);
}

export function categorySlug(c: Category) {
  return c.toLowerCase().replace(/\s+/g, "-");
}

export function formatDate(iso: string, month: "short" | "long" = "short") {
  return new Intl.DateTimeFormat("en-US", { month, day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}
