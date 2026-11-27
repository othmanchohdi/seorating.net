// The free AI tools, in the order the hub shows them. Each tool page links
// to the others from this list.
export const AI_TOOLS = [
  {
    href: "/ai-tools#checker",
    label: "AI visibility report",
    text: "Crawler access, firewall test, AI files, homepage and product pages, with copy-paste fixes.",
  },
  {
    href: "/ai-tools/compare",
    label: "Competitor comparison",
    text: "Your site against up to two competitors on every AI visibility check.",
  },
  {
    href: "/ai-tools/ai-crawlers",
    label: "AI crawler directory",
    text: "What every AI bot does, its user agent and IP list, and whether to block it.",
  },
  {
    href: "/ai-tools/llms-txt-generator",
    label: "llms.txt generator",
    text: "Build a valid llms.txt that summarises your site for AI assistants.",
  },
  {
    href: "/ai-tools/robots-txt-tester",
    label: "robots.txt tester",
    text: "Test any crawler against any path, with the same rules Google and OpenAI follow.",
  },
  {
    href: "/ai-tools/product-schema-generator",
    label: "Product schema generator",
    text: "Build valid Product JSON-LD: price, GTIN, brand, reviews, shipping and returns.",
  },
  {
    href: "/ai-tools/ai-readiness-checklist",
    label: "AI readiness checklist",
    text: "Find where the chain from crawl to recommendation breaks for your store.",
  },
  {
    href: "/ai-tools/serp-snippet-preview",
    label: "Search snippet preview",
    text: "See how your title and meta description render in Google, and where they get cut.",
  },
  {
    href: "/ai-tools/core-web-vitals-checker",
    label: "Core Web Vitals checker",
    text: "Check any site's real LCP, INP and CLS against Google's thresholds at the 75th percentile.",
  },
  {
    href: "/ai-tools/alt-text-checker",
    label: "Alt text checker",
    text: "Catch file names, keyword stuffing and vague wording in product image alt text.",
  },
  {
    href: "/ai-tools/shopify-url-inspector",
    label: "Shopify URL inspector",
    text: "Check a path's canonical URL and whether Shopify's default robots.txt lets crawlers in.",
  },
  {
    href: "/ai-tools/llms-txt-checker",
    label: "llms.txt checker",
    text: "Fetch any site's live llms.txt and check it against the llmstxt.org format.",
  },
  {
    href: "/ai-tools/structured-data-checker",
    label: "Structured data checker",
    text: "Fetch any page's live JSON-LD and see what's missing for merchant listings.",
  },
] as const;
