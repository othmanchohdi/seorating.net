import { decode } from "@/lib/ai-check/html";
import { mapLimit, safeFetch, textFile, traceUrl } from "@/lib/ai-check/net";
import type { Finding } from "./types";

// Sitemap audit: find the sitemap (robots.txt first, then the usual paths),
// read the index and its child sitemaps, count URLs by type, and spot-check
// a sample of the listed URLs for redirects and errors.

const SITEMAP_BYTES = 8_000_000;
const MAX_CHILDREN = 15;
const SAMPLE_SIZE = 12;

const locs = (xml: string) => [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?\s*<\/loc>/gi)].map((m) => decode(m[1]));

// "sitemap_products_1.xml?from=…" -> "Products". Shopify names its children by type.
function childLabel(url: string) {
  const file = new URL(url).pathname.split("/").pop() ?? url;
  const shopify = file.match(/sitemap_([a-z]+)_\d+/i)?.[1];
  if (shopify) return shopify.charAt(0).toUpperCase() + shopify.slice(1);
  return file.replace(/\.xml(\.gz)?$/i, "") || file;
}

export type ChildSitemap = { url: string; label: string; urls: number; lastmod: number; images: number; truncated: boolean; error: string | null };
export type SampleCheck = { url: string; status: number | null; finalUrl: string; hops: number };

async function readSitemap(url: string): Promise<{ xml: string | null; error: string | null; truncated: boolean }> {
  if (/\.gz(\?|$)/i.test(url)) return { xml: null, error: "Gzipped sitemap; we can't read .gz files yet.", truncated: false };
  const res = await safeFetch(new URL(url), { maxBytes: SITEMAP_BYTES }).catch(() => null);
  if (!res) return { xml: null, error: "Couldn't be reached.", truncated: false };
  if (res.status !== 200) return { xml: null, error: `Returns HTTP ${res.status}.`, truncated: false };
  if (!/<(urlset|sitemapindex)\b/i.test(res.body)) return { xml: null, error: "Isn't a valid XML sitemap (no <urlset> or <sitemapindex>).", truncated: false };
  return { xml: res.body, error: null, truncated: res.body.length >= SITEMAP_BYTES - 1 && !/<\/(urlset|sitemapindex)>\s*$/i.test(res.body) };
}

export async function analyzeSitemap(origin: string) {
  const robots = textFile(await safeFetch(new URL("/robots.txt", origin)).catch(() => null));
  const declared = [...(robots ?? "").matchAll(/^\s*sitemap\s*:\s*(\S+)/gim)].map((m) => m[1]);
  const candidates = [...new Set([...declared, `${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`])];

  let rootUrl: string | null = null;
  let rootXml: string | null = null;
  for (const c of candidates) {
    const r = await readSitemap(c);
    if (r.xml) {
      rootUrl = c;
      rootXml = r.xml;
      break;
    }
  }

  const findings: Finding[] = [];
  if (!rootUrl || !rootXml) {
    findings.push({ tone: "bad", text: `No sitemap found at ${declared.length ? "the address in robots.txt or " : ""}/sitemap.xml. Without one, search engines and AI crawlers find pages only by following links.` });
    return { robotsDeclared: declared, root: null, isIndex: false, children: [], totalUrls: 0, sample: [], findings };
  }

  const isIndex = /<sitemapindex\b/i.test(rootXml);
  const children: ChildSitemap[] = [];
  let pageUrls: string[] = [];

  const summarise = (url: string, xml: string | null, error: string | null, truncated: boolean): ChildSitemap => ({
    url,
    label: childLabel(url),
    urls: xml ? (xml.match(/<url>/gi) ?? []).length : 0,
    lastmod: xml ? (xml.match(/<lastmod>/gi) ?? []).length : 0,
    images: xml ? (xml.match(/<image:image>/gi) ?? []).length : 0,
    truncated,
    error,
  });

  if (isIndex) {
    const childUrls = locs(rootXml);
    const read = await mapLimit(childUrls.slice(0, MAX_CHILDREN), 4, async (u) => ({ u, r: await readSitemap(u) }));
    for (const { u, r } of read) {
      children.push(summarise(u, r.xml, r.error, r.truncated));
      if (r.xml) pageUrls.push(...locs(r.xml).slice(0, 400));
    }
    for (const u of childUrls.slice(MAX_CHILDREN)) children.push({ url: u, label: childLabel(u), urls: 0, lastmod: 0, images: 0, truncated: false, error: "Not read (we check the first 15)." });
  } else {
    children.push(summarise(rootUrl, rootXml, null, false));
    pageUrls = locs(rootXml);
  }

  // Spread the sample across the list so every child sitemap is represented.
  const step = Math.max(1, Math.floor(pageUrls.length / SAMPLE_SIZE));
  const picks = pageUrls.filter((_, i) => i % step === 0).slice(0, SAMPLE_SIZE);
  const sample: SampleCheck[] = await mapLimit(picks, 6, async (u) => {
    try {
      const hops = await traceUrl(new URL(u), { maxHops: 5, timeoutMs: 6000 });
      const last = hops[hops.length - 1];
      return { url: u, status: last?.status ?? null, finalUrl: last?.url ?? u, hops: hops.length - 1 };
    } catch {
      return { url: u, status: null, finalUrl: u, hops: 0 };
    }
  });

  // Shopify splits big types into several files with the same name; number them.
  const seenLabels = new Map<string, number>();
  for (const c of children) {
    const n = (seenLabels.get(c.label) ?? 0) + 1;
    seenLabels.set(c.label, n);
    if (n > 1) c.label = `${c.label} (part ${n})`;
  }

  const totalUrls = children.reduce((s, c) => s + c.urls, 0);
  const host = new URL(origin).hostname.replace(/^www\./, "");
  const offHost = pageUrls.filter((u) => {
    try {
      return new URL(u).hostname.replace(/^www\./, "") !== host;
    } catch {
      return true;
    }
  }).length;
  const insecure = pageUrls.filter((u) => u.startsWith("http:")).length;
  // 401/403/429 usually mean the site rate-limited or blocked our checker, not a dead page.
  const blocked = sample.filter((s) => s.status === 401 || s.status === 403 || s.status === 429);
  const broken = sample.filter((s) => (s.status === null || s.status >= 400) && !blocked.includes(s));
  const redirected = sample.filter((s) => s.hops > 0 && s.status !== null && s.status < 400);
  const failedChildren = children.filter((c) => c.error && !c.error.startsWith("Not read"));

  findings.push({ tone: "ok", text: `Found ${isIndex ? `a sitemap index with ${children.length} sitemap${children.length === 1 ? "" : "s"}` : "a sitemap"} listing ${totalUrls.toLocaleString("en-US")} URL${totalUrls === 1 ? "" : "s"}.` });
  findings.push(
    declared.length
      ? { tone: "ok", text: "robots.txt points crawlers to the sitemap." }
      : { tone: "warn", text: "robots.txt doesn't list the sitemap. Add a “Sitemap:” line so every crawler finds it, not just ones that guess /sitemap.xml." },
  );
  if (failedChildren.length) findings.push({ tone: "bad", text: `${failedChildren.length} child sitemap${failedChildren.length === 1 ? " fails" : "s fail"} to load: ${failedChildren[0].error}` });
  if (children.some((c) => c.urls > 50_000)) findings.push({ tone: "bad", text: "A sitemap lists more than 50,000 URLs, the limit per file. Split it up." });
  if (children.some((c) => c.truncated)) findings.push({ tone: "warn", text: "A sitemap is very large; we read the first 8 MB. The limit is 50 MB uncompressed." });
  if (offHost) findings.push({ tone: "bad", text: `${offHost} URL${offHost === 1 ? " is" : "s are"} on a different domain. Sitemaps may only list URLs on their own site.` });
  if (insecure) findings.push({ tone: "warn", text: `${insecure} URL${insecure === 1 ? " uses" : "s use"} http:// instead of https://.` });
  const noLastmod = children.reduce((s, c) => s + Math.max(0, c.urls - c.lastmod), 0);
  if (totalUrls) {
    findings.push(
      noLastmod / totalUrls > 0.1
        ? { tone: "warn", text: `${noLastmod.toLocaleString("en-US")} URLs have no <lastmod>. Accurate dates help search engines recrawl what changed.` }
        : { tone: "ok", text: "URLs include <lastmod> dates." },
    );
  }
  if (sample.length) {
    findings.push(
      broken.length
        ? { tone: "bad", text: `${broken.length} of ${sample.length} sampled URLs are broken or unreachable. Sitemaps should only list live pages.` }
        : redirected.length
          ? { tone: "warn", text: `${redirected.length} of ${sample.length} sampled URLs redirect. List the final URL instead.` }
          : blocked.length
            ? { tone: "warn", text: `${blocked.length} of ${sample.length} sampled URLs refused our checker (HTTP 401, 403 or 429), so we couldn't confirm them. Check them in a browser.` }
            : { tone: "ok", text: `All ${sample.length} sampled URLs load directly with no redirects.` },
    );
  }

  return { robotsDeclared: declared, root: rootUrl, isIndex, children, totalUrls, sample, findings };
}
