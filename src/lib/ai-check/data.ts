import { cacheLife, cacheTag } from "next/cache";
import {
  type JsonLdNode,
  internalLinks,
  jsonLd,
  linkHref,
  metaContent,
  productLink,
  socialLinks,
  titleTag,
  typesOf,
  visibleText,
  wordCount,
} from "./html";
import { CheckError, safeFetch, textFile } from "./net";

// Cached fetchers for one report. Each part is cached on its own so the
// report page can stream sections as they finish, and a shared report link
// doesn't re-crawl the site for an hour.

// ---------------------------------------------------------------------------
// Homepage

export type HomeData =
  | { ok: false; error: string }
  | {
      ok: true;
      origin: string;
      checkedAt: string;
      status: number;
      isHtml: boolean;
      noindex: boolean;
      title: string;
      description: string;
      canonical: string | null;
      hasLang: boolean;
      ogTitle: string | null;
      ogImage: string | null;
      siteName: string;
      schemaTypes: string[];
      schemaInvalid: boolean;
      words: number;
      isShopify: boolean;
      productUrl: string | null;
      links: { url: string; text: string }[];
      social: string[];
      logo: string | null;
    };

// Every cached piece of a report carries this tag, so "Re-check now" can
// expire them all at once.
export const siteTag = (hostname: string) => `site:${hostname}`;

export async function getHome(host: string): Promise<HomeData> {
  "use cache";
  cacheLife("hours");
  cacheTag(siteTag(host));
  try {
    const res = await safeFetch(new URL(`https://${host}/`));
    if (!res) return { ok: false, error: `We couldn't reach ${host}. The site may be down, or it may block automated requests.` };
    const origin = new URL(res.finalUrl).origin;
    const isHtml = /html/i.test(res.contentType);
    const html = res.status === 200 && isHtml ? res.body : "";
    const ld = jsonLd(html);
    const title = titleTag(html);
    const ogSiteName = metaContent(html, "og:site_name");
    const isShopify =
      !!res.headers["x-shopid"] || /shopify/i.test(res.headers["x-powered-by"] ?? "") || /cdn\.shopify\.com|Shopify\.shop\s*=/.test(html);

    let productUrl = productLink(html, origin);
    if (!productUrl && isShopify) {
      // Shopify exposes a public product feed; use it when the homepage links no products.
      const feed = await safeFetch(new URL("/products.json?limit=5", origin), { maxBytes: 400_000 });
      try {
        const products: { handle?: string }[] = (feed && JSON.parse(feed.body)?.products) ?? [];
        const handle = products.find((p) => p.handle && !/gift/i.test(p.handle))?.handle;
        if (typeof handle === "string") productUrl = `${origin}/products/${encodeURIComponent(handle)}`;
      } catch {}
    }

    const logoNode = ld.nodes.find((n) => typesOf(n).includes("Organization"))?.logo;
    const logo =
      (typeof logoNode === "string" ? logoNode : typeof (logoNode as JsonLdNode)?.url === "string" ? ((logoNode as JsonLdNode).url as string) : null) ??
      (() => {
        const icon = linkHref(html, "apple-touch-icon") ?? linkHref(html, "icon");
        try {
          return icon ? new URL(icon, origin).toString() : null;
        } catch {
          return null;
        }
      })();

    return {
      ok: true,
      origin,
      checkedAt: new Date().toISOString(),
      status: res.status,
      isHtml,
      noindex: /noindex/i.test(`${metaContent(html, "robots") ?? ""} ${res.headers["x-robots-tag"] ?? ""}`),
      title,
      description: metaContent(html, "description") ?? "",
      canonical: linkHref(html, "canonical"),
      hasLang: /<html\b[^>]*\blang\s*=/i.test(html),
      ogTitle: metaContent(html, "og:title"),
      ogImage: metaContent(html, "og:image"),
      siteName: ogSiteName || title.split(/\s[|–—-]\s/)[0] || host,
      schemaTypes: [...new Set(ld.nodes.flatMap(typesOf))],
      schemaInvalid: ld.invalid,
      words: wordCount(visibleText(html)),
      isShopify,
      productUrl,
      links: internalLinks(html, origin),
      social: socialLinks(html),
      logo,
    };
  } catch (err) {
    if (err instanceof CheckError) return { ok: false, error: err.message };
    throw err;
  }
}

// ---------------------------------------------------------------------------
// robots.txt, llms.txt, agents.md, sitemap

export type FilesData = {
  robots: string | null;
  llms: { found: false } | { found: true; hasTitle: boolean; hasSummary: boolean; links: number; shopifyDefault: boolean };
  agents: boolean;
  agentsShopifyDefault: boolean;
  sitemapAtRoot: boolean;
};

// Shopify serves default llms.txt and agents.md files written for shopping
// agents (Shop skill, Universal Commerce Protocol), not a brand summary.
const isShopifyAgentFile = (text: string) => /Universal Commerce Protocol|shop\.com\/SKILL\.md|\/\.well-known\/ucp/i.test(text);

export async function getFiles(origin: string): Promise<FilesData> {
  "use cache";
  cacheLife("hours");
  cacheTag(siteTag(new URL(origin).hostname));
  const [robotsRes, llmsRes, agentsRes, sitemapRes] = await Promise.all(
    ["/robots.txt", "/llms.txt", "/agents.md", "/sitemap.xml"].map((p) => safeFetch(new URL(p, origin), { maxBytes: 300_000 }).catch(() => null)),
  );
  const llms = textFile(llmsRes);
  const agents = textFile(agentsRes);
  return {
    robots: textFile(robotsRes)?.slice(0, 100_000) ?? null,
    llms:
      llms === null
        ? { found: false }
        : {
            found: true,
            hasTitle: /^#\s+\S/m.test(llms),
            hasSummary: /^>\s*\S/m.test(llms),
            links: (llms.match(/\]\(https?:\/\/[^)]+\)/g) ?? []).length,
            shopifyDefault: isShopifyAgentFile(llms),
          },
    agents: agents !== null,
    agentsShopifyDefault: agents !== null && isShopifyAgentFile(agents),
    sitemapAtRoot: !!sitemapRes && sitemapRes.status === 200 && /<(urlset|sitemapindex)\b/i.test(sitemapRes.body),
  };
}

// ---------------------------------------------------------------------------
// Firewall probes: request the homepage identifying as each AI crawler and
// compare with a browser. robots.txt can say "allowed" while a CDN or bot
// manager rejects the crawler outright.

// Official user agent strings where the operator publishes one (see the AI
// crawler directory). Anthropic publishes tokens only, so ClaudeBot uses the
// commonly seen form; servers match on the token either way.
export const PROBES = [
  { name: "GPTBot", ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.4; +https://openai.com/gptbot" },
  { name: "OAI-SearchBot", ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot" },
  { name: "ClaudeBot", ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)" },
  { name: "PerplexityBot", ua: "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)" },
] as const;

const BROWSER_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

export type ProbeResult = { name: string; status: number | null; blocked: boolean };
export type ProbeData = { browser: number | null; browserOk: boolean; bots: ProbeResult[] };

const rejected = (status: number | null, challenged: boolean) => challenged || status === null || status === 401 || status === 403 || status === 429 || status >= 500;

export async function getProbes(origin: string): Promise<ProbeData> {
  "use cache";
  cacheLife("hours");
  cacheTag(siteTag(new URL(origin).hostname));
  const hit = async (ua: string) => {
    const res = await safeFetch(new URL("/", origin), { userAgent: ua, maxBytes: 0 }).catch(() => null);
    return { status: res?.status ?? null, challenged: res?.headers["cf-mitigated"] === "challenge" };
  };
  const [browser, ...bots] = await Promise.all([hit(BROWSER_UA), ...PROBES.map((p) => hit(p.ua))]);
  const browserOk = !rejected(browser.status, browser.challenged);
  return {
    browser: browser.status,
    browserOk,
    // Only call a bot blocked when a browser gets through, so a site that is
    // simply down isn't reported as a firewall problem.
    bots: PROBES.map((p, i) => ({ name: p.name, status: bots[i].status, blocked: browserOk && rejected(bots[i].status, bots[i].challenged) })),
  };
}

// ---------------------------------------------------------------------------
// A product page

export type ProductData =
  | { found: false }
  | {
      found: true;
      url: string;
      status: number;
      title: string;
      description: string;
      words: number;
      ogTitle: string | null;
      ogImage: string | null;
      ogPrice: string | null;
      ogCurrency: string | null;
      schemaInvalid: boolean;
      schema: {
        name: boolean;
        image: boolean;
        description: boolean;
        price: boolean;
        currency: boolean;
        availability: boolean;
        brand: boolean;
        rating: boolean;
      } | null;
    };

const has = (v: unknown) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0);

export async function getProduct(url: string | null): Promise<ProductData> {
  "use cache";
  cacheLife("hours");
  if (!url) return { found: false };
  cacheTag(siteTag(new URL(url).hostname));
  const res = await safeFetch(new URL(url)).catch(() => null);
  if (!res || res.status !== 200 || !/html/i.test(res.contentType)) return { found: false };
  const html = res.body;
  const ld = jsonLd(html);
  const product = ld.nodes.find((n) => typesOf(n).some((t) => t === "Product" || t === "ProductGroup"));
  let schema = null;
  if (product) {
    const offersRaw = product.offers ?? (product.hasVariant as JsonLdNode[] | undefined)?.[0]?.offers;
    const offers = ([] as JsonLdNode[]).concat((offersRaw as JsonLdNode | JsonLdNode[]) ?? []);
    const offer = offers[0] ?? {};
    schema = {
      name: has(product.name),
      image: has(product.image),
      description: has(product.description),
      price: has(offer.price) || has(offer.lowPrice),
      currency: has(offer.priceCurrency),
      availability: has(offer.availability),
      brand: has(product.brand),
      rating: has(product.aggregateRating) || has(product.review),
    };
  }
  return {
    found: true,
    url: res.finalUrl,
    status: res.status,
    title: titleTag(html),
    description: metaContent(html, "description") ?? "",
    words: wordCount(visibleText(html)),
    ogTitle: metaContent(html, "og:title"),
    ogImage: metaContent(html, "og:image"),
    ogPrice: metaContent(html, "product:price:amount") ?? metaContent(html, "og:price:amount"),
    ogCurrency: metaContent(html, "product:price:currency") ?? metaContent(html, "og:price:currency"),
    schemaInvalid: ld.invalid,
    schema,
  };
}
