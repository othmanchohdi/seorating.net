// The free tools, in the order the hub shows them, in two groups: AI
// visibility and classic SEO. Each tool page links to the others in its group.
export type ToolGroup = "ai" | "seo";

export const AI_TOOLS: readonly { href: string; label: string; text: string; group: ToolGroup }[] = [
  {
    href: "/ai-tools#checker",
    label: "AI visibility report",
    group: "ai",
    text: "Crawler access, firewall test, AI files, homepage and product pages, with copy-paste fixes.",
  },
  {
    href: "/ai-tools/compare",
    label: "Competitor comparison",
    group: "ai",
    text: "Your site against up to two competitors on every AI visibility check.",
  },
  {
    href: "/ai-tools/ai-crawlers",
    label: "AI crawler directory",
    group: "ai",
    text: "What every AI bot does, its user agent and IP list, and whether to block it.",
  },
  {
    href: "/ai-tools/llms-txt-generator",
    label: "llms.txt generator",
    group: "ai",
    text: "Build a valid llms.txt that summarises your site for AI assistants.",
  },
  {
    href: "/ai-tools/robots-txt-tester",
    label: "robots.txt tester",
    group: "ai",
    text: "Test any crawler against any path, with the same rules Google and OpenAI follow.",
  },
  {
    href: "/ai-tools/product-schema-generator",
    label: "Product schema generator",
    group: "ai",
    text: "Build valid Product JSON-LD: price, GTIN, brand, reviews, shipping and returns.",
  },
  {
    href: "/ai-tools/ai-readiness-checklist",
    label: "AI readiness checklist",
    group: "ai",
    text: "Find where the chain from crawl to recommendation breaks for your store.",
  },
  {
    href: "/ai-tools/serp-snippet-preview",
    label: "Search snippet preview",
    group: "ai",
    text: "See how your title and meta description render in Google, and where they get cut.",
  },
  {
    href: "/ai-tools/core-web-vitals-checker",
    label: "Core Web Vitals checker",
    group: "ai",
    text: "Check any site's real LCP, INP and CLS against Google's thresholds at the 75th percentile.",
  },
  {
    href: "/ai-tools/alt-text-checker",
    label: "Alt text checker",
    group: "ai",
    text: "Audit every image's alt text on a live page: missing alt, file names, stuffing and vague wording.",
  },
  {
    href: "/ai-tools/shopify-url-inspector",
    label: "Shopify URL inspector",
    group: "ai",
    text: "Check a path's canonical URL and whether Shopify's default robots.txt lets crawlers in.",
  },
  {
    href: "/ai-tools/llms-txt-checker",
    label: "llms.txt checker",
    group: "ai",
    text: "Fetch any site's live llms.txt and check it against the llmstxt.org format.",
  },
  {
    href: "/ai-tools/structured-data-checker",
    label: "Structured data checker",
    group: "ai",
    text: "Fetch any page's live JSON-LD and see what's missing for merchant listings.",
  },
  {
    href: "/ai-tools/shopify-theme-detector",
    label: "Shopify theme & app detector",
    group: "seo",
    text: "See any store's theme and version, and which apps and pixels it loads.",
  },
  {
    href: "/ai-tools/image-size-checker",
    label: "Image size checker",
    group: "seo",
    text: "Measure every image's real file size, format and dimensions, heaviest first.",
  },
  {
    href: "/ai-tools/heading-checker",
    label: "Heading tags checker",
    group: "seo",
    text: "See a page's H1–H6 outline and catch missing H1s, skipped levels and empty headings.",
  },
  {
    href: "/ai-tools/keyword-density-checker",
    label: "Keyword density checker",
    group: "seo",
    text: "Top phrases on any page or text, and whether your keyword is where it counts.",
  },
  {
    href: "/ai-tools/broken-link-checker",
    label: "Broken link checker",
    group: "seo",
    text: "Check every link on a page for 404s, server errors and redirects.",
  },
  {
    href: "/ai-tools/redirect-checker",
    label: "Redirect & status checker",
    group: "seo",
    text: "Trace any URL hop by hop, and test every http/https and www variant of a domain.",
  },
  {
    href: "/ai-tools/sitemap-checker",
    label: "Sitemap checker",
    group: "seo",
    text: "Find and validate a site's XML sitemap, and test a sample of its URLs.",
  },
  {
    href: "/ai-tools/hreflang-checker",
    label: "Hreflang checker",
    group: "seo",
    text: "Validate language and country codes, x-default and return links on every alternate.",
  },
  {
    href: "/ai-tools/social-share-preview",
    label: "Social share preview",
    group: "seo",
    text: "See how a link looks on Facebook, LinkedIn and X, and check its share image.",
  },
  {
    href: "/ai-tools/schema-generator",
    label: "FAQ & Organization schema generator",
    group: "seo",
    text: "Build FAQPage and Organization JSON-LD, ready to paste into your theme.",
  },
  {
    href: "/ai-tools/utm-builder",
    label: "UTM link & slug builder",
    group: "seo",
    text: "Build consistent campaign links and short, clean URL handles.",
  },
] as const;
