export type Plan = {
  id: string;
  name: string;
  price: string;
  priceSuffix: string;
  tagline: string;
  highlight: boolean;
  features: string[];
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    priceSuffix: "/ month",
    tagline: "Get started with AI discoverability for your catalog.",
    highlight: false,
    features: [
      "SEO Tags: meta tags & image alt text for your whole catalog",
      "Page Optimization: SEO scoring & AI suggestions",
      "Store Performance: PageSpeed Insights audits",
      "Search Appearance: structured data, robots.txt, Google Search Console",
      "AI Visibility: llms.txt, agents.md, IndexNow submission",
      "URL Management: broken link detection & HTML sitemap",
      "Keyword Research: 5 Discover searches/week, 2 refreshes/week, 15 saved keywords",
      "40 AI credits / month",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$29",
    priceSuffix: "/ month",
    tagline: "For growing catalogs that need more AI generation headroom.",
    highlight: true,
    features: [
      "Everything in Free",
      "800 AI credits / month",
      "500 Keyword Discover searches/month, 10 refreshes/week",
      "Unlimited saved keywords",
      "Extended SEO Tags & Alt Tags version history",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    priceSuffix: "/ month",
    tagline: "For established stores generating content at higher volume.",
    highlight: false,
    features: [
      "Everything in Growth",
      "1,600 AI credits / month",
      "1,500 Keyword Discover searches/month, 20 refreshes/week",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    price: "$99",
    priceSuffix: "/ month",
    tagline: "For high-volume catalogs and multi-location merchants.",
    highlight: false,
    features: [
      "Everything in Pro",
      "4,000 AI credits / month",
      "5,000 Keyword Discover searches/month, 50 refreshes/week",
    ],
  },
];
