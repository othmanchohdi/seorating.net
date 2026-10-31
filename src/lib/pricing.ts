// Mirrors the app's real billing config (shopify.server.ts) and limits
// (app/services/limits.ts) in the SEO Rating app repo.
// Update both together.

export type Plan = {
  id: string;
  name: string;
  price: number;
  tagline: string;
  highlight: boolean;
  credits: number;
  features: string[];
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    tagline: "Every tool, with a small monthly AI allowance.",
    highlight: false,
    credits: 40,
    features: [
      "All modules included, nothing feature-locked",
      "40 AI credits / month",
      "5 keyword Discover searches / week",
      "15 saved keywords",
      "Restore your latest version checkpoint",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 29,
    tagline: "For stores optimizing every week.",
    highlight: true,
    credits: 800,
    features: [
      "Everything in Free",
      "800 AI credits / month",
      "500 keyword Discover searches / month",
      "Unlimited saved keywords",
      "30 days of version history",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    tagline: "For larger catalogs and regular content.",
    highlight: false,
    credits: 1600,
    features: [
      "Everything in Growth",
      "1,600 AI credits / month",
      "1,500 keyword Discover searches / month",
      "20 keyword refreshes / week",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    price: 99,
    tagline: "For high-volume catalogs and content teams.",
    highlight: false,
    credits: 4000,
    features: [
      "Everything in Pro",
      "4,000 AI credits / month",
      "5,000 keyword Discover searches / month",
      "50 keyword refreshes / week",
    ],
  },
];

// Per-action costs, from AI_CREDIT_COSTS in the app.
export const CREDIT_COSTS: { action: string; credits: number }[] = [
  { action: "AI meta title & description (per product)", credits: 3 },
  { action: "AI image alt text (per image)", credits: 7 },
  { action: "Page Optimization title, handle or tags suggestion", credits: 2 },
  { action: "Page Optimization description suggestion", credits: 8 },
  { action: "Article topic ideas (6 per click)", credits: 3 },
  { action: "Full article draft", credits: 27 },
  { action: "llms.txt generation", credits: 8 },
  { action: "agents.md generation", credits: 10 },
];
