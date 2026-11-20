import { evaluate } from "@/components/blog/robots";
import { SITE_NAME } from "../site";
import type { FilesData, HomeData, ProbeData, ProductData } from "./data";

// Turns fetched data into checks, fixes and scores. Pure functions only, so
// the report page and the Open Graph image compute exactly the same result.

export type Tone = "ok" | "warn" | "bad";
export type Impact = "high" | "medium" | "low";
export type Group = "access" | "files" | "homepage" | "products";
export type Fix = { title: string; code?: { lang: string; text: string }; steps?: string[] };
export type Check = { id: string; group: Group; tone: Tone; impact: Impact; label: string; detail: string; fix?: Fix };
type Home = Extract<HomeData, { ok: true }>;

export const GROUPS: Record<Group, { label: string; weight: number }> = {
  access: { label: "Crawler access", weight: 30 },
  files: { label: "AI files", weight: 20 },
  homepage: { label: "Homepage", weight: 30 },
  products: { label: "Product pages", weight: 20 },
};

// Crawlers that decide whether a site can appear in AI answers.
export const BOTS = [
  { name: "OAI-SearchBot", owner: "OpenAI", purpose: "ChatGPT search", answers: true },
  { name: "ChatGPT-User", owner: "OpenAI", purpose: "Pages users ask ChatGPT about", answers: true },
  { name: "GPTBot", owner: "OpenAI", purpose: "Model training", answers: false },
  { name: "Claude-SearchBot", owner: "Anthropic", purpose: "Claude search", answers: true },
  { name: "ClaudeBot", owner: "Anthropic", purpose: "Model training", answers: false },
  { name: "PerplexityBot", owner: "Perplexity", purpose: "Perplexity search", answers: true },
  { name: "Google-Extended", owner: "Google", purpose: "Gemini training and grounding", answers: false },
  { name: "Googlebot", owner: "Google", purpose: "Google Search and AI Overviews", answers: true },
  { name: "Bingbot", owner: "Microsoft", purpose: "Bing and Copilot", answers: true },
  { name: "Applebot-Extended", owner: "Apple", purpose: "Apple Intelligence training", answers: false },
] as const;

export type BotRow = (typeof BOTS)[number] & { robots: "allowed" | "blocked" | "no-rules"; firewall: "ok" | "blocked" | null };

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
const json = (v: unknown) => `<script type="application/ld+json">\n${JSON.stringify(v, null, 2)}\n</script>`;
const shopifyNote = (home: Home | null, text: string) => (home?.isShopify ? [text] : []);

// ---------------------------------------------------------------------------

export function botRows(files: FilesData, probes: ProbeData): BotRow[] {
  return BOTS.map((b) => {
    const probe = probes.bots.find((p) => p.name === b.name);
    return {
      ...b,
      robots: files.robots === null ? "no-rules" : evaluate(files.robots, b.name, "/").allowed ? "allowed" : "blocked",
      firewall: probe ? (probe.blocked ? "blocked" : "ok") : null,
    };
  });
}

export function accessChecks(home: Home | null, files: FilesData, probes: ProbeData): Check[] {
  const rows = botRows(files, probes);
  const checks: Check[] = [];
  const blocked = rows.filter((r) => r.answers && r.robots === "blocked");

  if (files.robots === null) {
    checks.push({
      id: "robots", group: "access", tone: "warn", impact: "low", label: "robots.txt",
      detail: "Not found. Crawlers assume everything is allowed, but you have no way to steer AI bots or point them to your sitemap.",
    });
  } else if (blocked.length) {
    checks.push({
      id: "robots", group: "access", tone: "bad", impact: "high", label: "AI search crawlers blocked",
      detail: `robots.txt blocks ${blocked.map((b) => b.name).join(", ")} from your homepage, so ${blocked.length === 1 ? "that assistant" : "those assistants"} can't read or cite it.`,
      fix: {
        title: "Allow AI search crawlers in robots.txt",
        code: { lang: "robots.txt", text: blocked.map((b) => `User-agent: ${b.name}\nAllow: /`).join("\n\n") },
        steps: [
          "Add these groups to robots.txt. A crawler with its own group ignores the * rules, so keep any Disallow lines you still need (like /cart) inside each group.",
          ...shopifyNote(home, "On Shopify, edit robots.txt.liquid under Online Store → Themes → Edit code, or let SEO Rating manage it for you."),
        ],
      },
    });
  } else {
    checks.push({ id: "robots", group: "access", tone: "ok", impact: "high", label: "robots.txt", detail: "AI search crawlers are allowed to read your homepage." });
  }

  const walled = probes.bots.filter((b) => b.blocked);
  if (walled.length) {
    checks.push({
      id: "firewall", group: "access", tone: "bad", impact: "high", label: "Firewall blocks AI crawlers",
      detail: `Your server answered a browser normally but rejected requests identifying as ${walled.map((b) => `${b.name} (${b.status ?? "no response"})`).join(", ")}. robots.txt doesn't matter if the firewall turns them away first.`,
      fix: {
        title: "Let AI crawlers through your firewall or CDN",
        steps: [
          "Check your CDN or bot-protection settings. On Cloudflare, look at Security → Bots and AI Crawl Control, and allow the AI search crawlers you want to be cited by.",
          "Real crawlers are verified by IP range, so a rule that allows verified bots is safer than allowing a user agent string.",
          "Some bot managers block unknown automated traffic by default. Our test sends the crawler's user agent from our own server, so a few setups block us but allow the real crawler; confirm in your firewall logs.",
        ],
      },
    });
  } else if (probes.browserOk) {
    checks.push({ id: "firewall", group: "access", tone: "ok", impact: "high", label: "Firewall", detail: `Requests identifying as ${probes.bots.map((b) => b.name).join(", ")} got through.` });
  } else {
    checks.push({
      id: "firewall", group: "access", tone: "warn", impact: "medium", label: "Firewall",
      detail: `Couldn't run the firewall test: the site rejected even a normal browser request from our server (${probes.browser ? `HTTP ${probes.browser}` : "no response"}). Strict bot protection like this often blocks AI crawlers too.`,
    });
  }
  return checks;
}

// ---------------------------------------------------------------------------

function llmsDraft(home: Home) {
  const lines = [`# ${home.siteName}`, "", `> ${home.description || `[One or two plain sentences: what ${home.siteName} sells, to whom, and what makes it different.]`}`, ""];
  if (home.links.length) {
    lines.push("## Main pages", ...home.links.map((l) => `- [${l.text}](${l.url})`), "");
  }
  if (home.isShopify) {
    lines.push(
      "## Policies",
      `- [Shipping](${home.origin}/policies/shipping-policy)`,
      `- [Returns and refunds](${home.origin}/policies/refund-policy)`,
      `- [Contact](${home.origin}/pages/contact)`,
    );
  } else {
    lines.push("## Policies", `- [Shipping](${home.origin}/[shipping-page])`, `- [Returns](${home.origin}/[returns-page])`, `- [Contact](${home.origin}/[contact-page])`);
  }
  return lines.join("\n");
}

function agentsDraft(home: Home) {
  return [
    `# ${home.siteName}`,
    "",
    home.description || `[What ${home.siteName} sells, in one sentence.]`,
    "",
    "## What agents can do here",
    home.isShopify ? `- Browse the full catalog: ${home.origin}/collections/all` : `- Browse products: ${home.origin}/[catalog-page]`,
    home.isShopify ? `- Read product data as JSON: append .json to any product URL` : "- [How an agent can look up products, prices and stock]",
    "",
    "## Policies",
    home.isShopify ? `- Shipping: ${home.origin}/policies/shipping-policy` : "- Shipping: [URL]",
    home.isShopify ? `- Returns: ${home.origin}/policies/refund-policy` : "- Returns: [URL]",
    "",
    "## Contact",
    "- [Support email or contact page]",
  ].join("\n");
}

export function fileChecks(home: Home | null, files: FilesData): Check[] {
  const checks: Check[] = [];

  if (!files.llms.found) {
    checks.push({
      id: "llms", group: "files", tone: "bad", impact: "medium", label: "llms.txt",
      detail: "Not found. An llms.txt gives AI assistants a short, curated summary of your site and its key pages.",
      fix: home
        ? {
            title: "Upload this llms.txt draft (built from your site)",
            code: { lang: "llms.txt", text: llmsDraft(home) },
            steps: [
              "Edit anything in [brackets], trim the links to the pages that matter, and publish it at /llms.txt.",
              ...shopifyNote(home, "Shopify doesn't let you upload files to the site root directly. SEO Rating publishes and updates llms.txt for you."),
            ],
          }
        : undefined,
    });
  } else {
    const l = files.llms;
    const issues = [!l.hasTitle && "no # title", !l.hasSummary && "no > summary line", l.links === 0 && "no links"].filter(Boolean);
    checks.push(
      issues.length
        ? { id: "llms", group: "files", tone: "warn", impact: "medium", label: "llms.txt", detail: `Found, but it has ${issues.join(", ")}. Follow the llmstxt.org format so assistants can parse it.`, fix: home ? { title: "Compare with this draft built from your site", code: { lang: "llms.txt", text: llmsDraft(home) } } : undefined }
        : { id: "llms", group: "files", tone: "ok", impact: "medium", label: "llms.txt", detail: `Found, with a title, a summary and ${plural(l.links, "link")}.` },
    );
  }

  checks.push(
    files.agents
      ? { id: "agents", group: "files", tone: "ok", impact: "low", label: "agents.md", detail: "Found. AI agents have instructions for working with your site." }
      : {
          id: "agents", group: "files", tone: "warn", impact: "low", label: "agents.md",
          detail: "Not found. agents.md tells AI agents what they can do on your site, where your policies live and who to contact.",
          fix: home ? { title: "Start from this agents.md draft", code: { lang: "agents.md", text: agentsDraft(home) }, steps: ["Fill in the [brackets] and publish it at /agents.md."] } : undefined,
        },
  );

  const inRobots = files.robots !== null && /^\s*sitemap\s*:/im.test(files.robots);
  const origin = home?.origin ?? "";
  checks.push(
    inRobots
      ? { id: "sitemap", group: "files", tone: "ok", impact: "medium", label: "XML sitemap", detail: "Listed in robots.txt, so crawlers can find every page." }
      : files.sitemapAtRoot
        ? { id: "sitemap", group: "files", tone: "warn", impact: "low", label: "XML sitemap", detail: "Found at /sitemap.xml but not listed in robots.txt.", fix: { title: "Add this line to robots.txt", code: { lang: "robots.txt", text: `Sitemap: ${origin}/sitemap.xml` } } }
        : { id: "sitemap", group: "files", tone: "bad", impact: "medium", label: "XML sitemap", detail: "Not found at /sitemap.xml or in robots.txt. Crawlers may miss pages that aren't well linked.", fix: { title: "Publish a sitemap", steps: ["Most platforms generate one automatically; find its URL and add a Sitemap: line to robots.txt.", "Then submit it in Google Search Console and Bing Webmaster Tools."] } },
  );
  return checks;
}

// ---------------------------------------------------------------------------

export function homepageChecks(home: HomeData): Check[] {
  if (!home.ok) return [];
  const g = "homepage" as const;
  const checks: Check[] = [];
  if (home.status !== 200 || !home.isHtml) {
    return [{ id: "reach", group: g, tone: "bad", impact: "high", label: "Homepage", detail: `Returned HTTP ${home.status} to our crawler. If AI crawlers get the same response, they can't read your site.` }];
  }
  if (home.noindex) {
    checks.push({ id: "noindex", group: g, tone: "bad", impact: "high", label: "noindex", detail: "The homepage tells search engines not to index it, so it drops out of Google, Bing and the AI answers built on them.", fix: { title: "Remove the noindex directive", steps: ["Look for <meta name=\"robots\" content=\"noindex\"> in the page head, or an X-Robots-Tag header, and remove it."] } });
  }

  const t = home.title;
  checks.push(
    !t
      ? { id: "title", group: g, tone: "bad", impact: "high", label: "Title tag", detail: "Missing. The title is the first thing search engines and assistants read.", fix: { title: "Add a title tag", code: { lang: "html", text: `<title>${home.siteName} | [What you sell, in a few words]</title>` } } }
      : t.length < 15 || t.length > 65
        ? { id: "title", group: g, tone: "warn", impact: "medium", label: "Title tag", detail: `“${t}” is ${t.length} characters. Aim for roughly 30–60 that say what you sell.` }
        : { id: "title", group: g, tone: "ok", impact: "medium", label: "Title tag", detail: `“${t}” (${t.length} characters).` },
  );

  const d = home.description;
  checks.push(
    !d
      ? { id: "desc", group: g, tone: "bad", impact: "medium", label: "Meta description", detail: "Missing. Assistants often lift this as the one-line summary of your site.", fix: { title: "Add a meta description", code: { lang: "html", text: `<meta name="description" content="[What ${home.siteName} sells, who it's for and one reason to choose you, in 120–160 characters.]">` } } }
      : d.length < 70 || d.length > 170
        ? { id: "desc", group: g, tone: "warn", impact: "low", label: "Meta description", detail: `${d.length} characters. Aim for roughly 120–160.` }
        : { id: "desc", group: g, tone: "ok", impact: "low", label: "Meta description", detail: `${d.length} characters, a good length.` },
  );

  const hasOrg = home.schemaTypes.some((s) => /^(Organization|OnlineStore|Store|LocalBusiness|Corporation|Brand)$/.test(s));
  const orgFix: Fix = {
    title: "Add Organization schema (pre-filled from your site)",
    code: {
      lang: "html",
      text: json({
        "@context": "https://schema.org",
        "@type": home.isShopify ? "OnlineStore" : "Organization",
        name: home.siteName,
        url: home.origin,
        ...(home.logo && { logo: home.logo }),
        ...(home.description && { description: home.description }),
        ...(home.social.length && { sameAs: home.social }),
      }),
    },
    steps: ["Paste it into the <head> of your homepage.", ...shopifyNote(home, "On Shopify, SEO Rating adds and maintains this schema without editing theme code.")],
  };
  checks.push(
    home.schemaInvalid
      ? { id: "schema", group: g, tone: "bad", impact: "high", label: "Structured data", detail: "A JSON-LD block on the page doesn't parse, so search engines ignore it entirely. Run it through a JSON validator to find the error." }
      : hasOrg
        ? { id: "schema", group: g, tone: "ok", impact: "high", label: "Structured data", detail: `JSON-LD found: ${home.schemaTypes.join(", ")}.` }
        : home.schemaTypes.length
          ? { id: "schema", group: g, tone: "warn", impact: "high", label: "Structured data", detail: `JSON-LD found (${home.schemaTypes.join(", ")}), but nothing that says who you are.`, fix: orgFix }
          : { id: "schema", group: g, tone: "bad", impact: "high", label: "Structured data", detail: "No JSON-LD found. Schema markup states facts about your business in a form machines can trust.", fix: orgFix },
  );

  checks.push(
    home.words < 80
      ? { id: "text", group: g, tone: "bad", impact: "high", label: "Readable text", detail: `Only about ${plural(home.words, "word")} in the raw HTML. AI crawlers mostly don't run JavaScript, so content rendered in the browser is invisible to them.`, fix: { title: "Put your key content in the HTML", steps: ["Make sure your headline, what you sell and key selling points are in the server-rendered HTML, not loaded by JavaScript.", "View the page source (not the inspector) to see what crawlers see."] } }
      : home.words < 250
        ? { id: "text", group: g, tone: "warn", impact: "medium", label: "Readable text", detail: `About ${home.words} words in the raw HTML. A few more sentences on what you offer helps assistants describe you.` }
        : { id: "text", group: g, tone: "ok", impact: "medium", label: "Readable text", detail: `About ${home.words} words readable without JavaScript.` },
  );

  checks.push(
    home.ogTitle && home.ogImage
      ? { id: "og", group: g, tone: "ok", impact: "low", label: "Open Graph", detail: "Title and image set, so shared links preview well in chats and social apps." }
      : { id: "og", group: g, tone: "warn", impact: "low", label: "Open Graph", detail: "og:title or og:image is missing, so shared links show a bare URL.", fix: { title: "Add Open Graph tags", code: { lang: "html", text: `<meta property="og:title" content="${home.title || home.siteName}">\n<meta property="og:image" content="${home.origin}/[share-image-1200x630].jpg">` } } },
  );

  checks.push(
    home.canonical
      ? { id: "canonical", group: g, tone: "ok", impact: "low", label: "Canonical URL", detail: `Points to ${home.canonical}.` }
      : { id: "canonical", group: g, tone: "warn", impact: "low", label: "Canonical URL", detail: "Not set. A canonical tag tells crawlers which address is the real one.", fix: { title: "Add a canonical tag", code: { lang: "html", text: `<link rel="canonical" href="${home.origin}/">` } } },
  );

  checks.push(
    home.hasLang
      ? { id: "lang", group: g, tone: "ok", impact: "low", label: "Language", detail: "The page declares its language." }
      : { id: "lang", group: g, tone: "warn", impact: "low", label: "Language", detail: "No lang attribute on <html>, so crawlers have to guess.", fix: { title: "Declare the page language", code: { lang: "html", text: `<html lang="en">` } } },
  );
  return checks;
}

// ---------------------------------------------------------------------------

export function productChecks(home: Home | null, product: ProductData): Check[] {
  if (!product.found) return [];
  const g = "products" as const;
  const s = product.schema;
  const checks: Check[] = [];
  const productFix: Fix = {
    title: "Add Product schema (pre-filled from this page)",
    code: {
      lang: "html",
      text: json({
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.ogTitle || product.title || "[Product name]",
        ...(product.ogImage ? { image: product.ogImage } : { image: "[Image URL]" }),
        description: product.description || "[Product description]",
        brand: { "@type": "Brand", name: home?.siteName ?? "[Brand]" },
        offers: {
          "@type": "Offer",
          url: product.url,
          price: product.ogPrice ?? "[Price]",
          priceCurrency: product.ogCurrency ?? "[USD]",
          availability: "https://schema.org/InStock",
        },
      }),
    },
    steps: [
      "Generate this per product from your platform's data so price and stock stay correct.",
      ...shopifyNote(home, "Most Shopify themes should output this. If yours doesn't, SEO Rating adds complete Product schema to every product automatically."),
    ],
  };

  if (product.schemaInvalid && !s) {
    checks.push({ id: "p-schema", group: g, tone: "bad", impact: "high", label: "Product schema", detail: "A JSON-LD block on the product page doesn't parse, so it's ignored.", fix: productFix });
  } else if (!s) {
    checks.push({ id: "p-schema", group: g, tone: "bad", impact: "high", label: "Product schema", detail: "No Product schema on the product page. Assistants and Google Shopping rely on it for price, stock and reviews.", fix: productFix });
  } else {
    checks.push({ id: "p-schema", group: g, tone: "ok", impact: "high", label: "Product schema", detail: "Product JSON-LD found." });
    const missing = [!s.price && "price", !s.currency && "currency", !s.availability && "availability"].filter(Boolean);
    checks.push(
      missing.length
        ? { id: "p-offer", group: g, tone: "bad", impact: "high", label: "Price and stock", detail: `The offer is missing ${missing.join(", ")}. Assistants won't quote a price or say it's in stock without them.`, fix: productFix }
        : { id: "p-offer", group: g, tone: "ok", impact: "high", label: "Price and stock", detail: "Price, currency and availability are all marked up." },
    );
    const extra = [!s.brand && "brand", !s.image && "image", !s.description && "description"].filter(Boolean);
    checks.push(
      extra.length
        ? { id: "p-details", group: g, tone: "warn", impact: "medium", label: "Product details", detail: `Schema is missing ${extra.join(", ")}.` }
        : { id: "p-details", group: g, tone: "ok", impact: "medium", label: "Product details", detail: "Brand, image and description are marked up." },
    );
    checks.push(
      s.rating
        ? { id: "p-reviews", group: g, tone: "ok", impact: "medium", label: "Reviews", detail: "Ratings are marked up, which assistants use when comparing products." }
        : { id: "p-reviews", group: g, tone: "warn", impact: "medium", label: "Reviews", detail: "No rating or review markup. If you collect reviews, make sure your review app outputs AggregateRating schema." },
    );
  }

  checks.push(
    product.words < 120
      ? { id: "p-text", group: g, tone: "warn", impact: "medium", label: "Product description", detail: `About ${plural(product.words, "word")} readable without JavaScript. Assistants recommend products they can describe: materials, sizing, use cases.` }
      : { id: "p-text", group: g, tone: "ok", impact: "medium", label: "Product description", detail: `About ${product.words} words readable without JavaScript.` },
  );
  return checks;
}

// ---------------------------------------------------------------------------

const IMPACT_WEIGHT: Record<Impact, number> = { high: 3, medium: 2, low: 1 };
const TONE_POINTS: Record<Tone, number> = { ok: 1, warn: 0.5, bad: 0 };

export function groupScore(checks: Check[]): number | null {
  if (!checks.length) return null;
  const total = checks.reduce((s, c) => s + IMPACT_WEIGHT[c.impact], 0);
  return Math.round((checks.reduce((s, c) => s + IMPACT_WEIGHT[c.impact] * TONE_POINTS[c.tone], 0) / total) * 100);
}

export type Summary = {
  score: number;
  groups: { group: Group; label: string; score: number | null }[];
  topFixes: Check[];
  counts: { bad: number; warn: number; ok: number };
};

export function summarize(checks: Check[]): Summary {
  const groups = (Object.keys(GROUPS) as Group[]).map((g) => ({ group: g, label: GROUPS[g].label, score: groupScore(checks.filter((c) => c.group === g)) }));
  const scored = groups.filter((g) => g.score !== null);
  const weight = scored.reduce((s, g) => s + GROUPS[g.group].weight, 0);
  const score = weight ? Math.round(scored.reduce((s, g) => s + (g.score as number) * GROUPS[g.group].weight, 0) / weight) : 0;
  const topFixes = checks
    .filter((c) => c.tone !== "ok")
    .sort((a, b) => TONE_POINTS[a.tone] - TONE_POINTS[b.tone] || IMPACT_WEIGHT[b.impact] - IMPACT_WEIGHT[a.impact])
    .slice(0, 3);
  return {
    score,
    groups,
    topFixes,
    counts: { bad: checks.filter((c) => c.tone === "bad").length, warn: checks.filter((c) => c.tone === "warn").length, ok: checks.filter((c) => c.tone === "ok").length },
  };
}

export const verdict = (score: number) =>
  score >= 85 ? { tone: "ok" as Tone, text: "AI-ready" } : score >= 60 ? { tone: "warn" as Tone, text: "Partly visible" } : { tone: "bad" as Tone, text: "Hard for AI to read" };

export const appPitch = `${SITE_NAME} fixes these automatically on Shopify.`;
