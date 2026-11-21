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
    href: "/ai-tools/ai-readiness-checklist",
    label: "AI readiness checklist",
    text: "Find where the chain from crawl to recommendation breaks for your store.",
  },
] as const;
