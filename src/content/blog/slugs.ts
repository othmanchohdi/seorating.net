// Slug + publish date for every post, kept free of React so src/proxy.ts can
// import it cheaply to gate access by schedule. index.ts fails the build if
// this drifts from POSTS (slugs or dates).
export const POST_SCHEDULE = [
  { slug: "product-descriptions-that-rank-and-convert", published: "2026-12-09" },
  { slug: "core-web-vitals-lcp-shopify", published: "2026-12-07" },
  { slug: "shopify-app-scripts-speed", published: "2026-12-03" },
  { slug: "backlinks-for-small-shopify-brands", published: "2026-11-30" },
  { slug: "shopify-orphan-pages", published: "2026-11-27" },
  { slug: "shopify-internal-linking-guide", published: "2026-11-23" },
  { slug: "shopify-duplicate-urls-canonical", published: "2026-10-31" },
  { slug: "what-is-llms-txt-shopify", published: "2026-10-24" },
  { slug: "how-ai-assistants-choose-stores", published: "2026-10-15" },
  { slug: "shopify-robots-txt-guide", published: "2026-10-06" },
  { slug: "meta-descriptions-that-get-clicked", published: "2026-09-22" },
  { slug: "product-image-alt-text-checklist", published: "2026-09-10" },
  { slug: "shopify-product-schema", published: "2026-08-27" },
  { slug: "reading-pagespeed-report", published: "2026-08-13" },
  { slug: "shopify-seo-checklist-2026", published: "2026-11-18" },
  { slug: "ai-visibility-101-shopify", published: "2026-11-11" },
  { slug: "google-search-console-shopify-guide", published: "2026-11-04" },
] as const;

export const POST_SLUGS = POST_SCHEDULE.map((p) => p.slug);
