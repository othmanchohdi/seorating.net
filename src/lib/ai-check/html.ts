// Small, dependency-free HTML readers for the checker. They work on the raw
// HTML an AI crawler receives, which is the point: no JavaScript is run.

// A tag, allowing ">" inside quoted attribute values (Alpine/Vue attributes
// like @click="a => b" are common on storefronts).
const TAG = /<(?:[^>"']|"[^"]*"|'[^']*')*>/g;
const stripTags = (s: string) => s.replace(TAG, " ");

export const attr = (tag: string, name: string) =>
  tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s"'>]+))`, "i"))?.slice(2).find((v) => v !== undefined) ?? null;

export function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function metaContent(html: string, key: string): string | null {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const name = (attr(tag, "name") ?? attr(tag, "property"))?.toLowerCase();
    if (name === key) {
      const content = attr(tag, "content");
      return content === null ? null : decode(content);
    }
  }
  return null;
}

export function titleTag(html: string) {
  return decode(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
}

export function linkHref(html: string, rel: string): string | null {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const rels = (attr(tag, "rel") ?? "").toLowerCase().split(/\s+/);
    if (rels.includes(rel)) return attr(tag, "href");
  }
  return null;
}

export type JsonLdNode = Record<string, unknown>;

// Every JSON-LD node on the page, flattened out of arrays and @graph.
export function jsonLd(html: string): { nodes: JsonLdNode[]; invalid: boolean } {
  const nodes: JsonLdNode[] = [];
  let invalid = false;
  const collect = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(collect);
    if (!node || typeof node !== "object") return;
    const obj = node as JsonLdNode;
    if (obj["@type"]) nodes.push(obj);
    if (obj["@graph"]) collect(obj["@graph"]);
  };
  for (const m of html.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      collect(JSON.parse(m[1].trim()));
    } catch {
      invalid = true;
    }
  }
  return { nodes, invalid };
}

export const typesOf = (node: JsonLdNode): string[] => {
  const t = node["@type"];
  return (Array.isArray(t) ? t : [t]).filter((v): v is string => typeof v === "string");
};

// Text a crawler can read without JavaScript. Uses <main> when the page has
// one, so navigation menus and footers don't inflate the count.
export function visibleText(html: string): string {
  const main = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/i)?.[1];
  // Decode the common entities first, then blank out any others.
  return decode(
    (main ?? html)
      .replace(/<(script|style|noscript|svg|template|head)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(TAG, " "),
  )
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const wordCount = (text: string) => text.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;

// Internal links with readable anchor text, for drafting llms.txt.
export function internalLinks(html: string, origin: string, max = 14): { url: string; text: string }[] {
  const seen = new Set<string>();
  const out: { url: string; text: string }[] = [];
  for (const m of html.matchAll(/<a\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/a>/gi)) {
    const href = attr(m[1], "href");
    const text = decode(stripTags(m[2]));
    if (!href || text.length < 2 || text.length > 60) continue;
    let url: URL;
    try {
      url = new URL(href, origin);
    } catch {
      continue;
    }
    if (url.origin !== origin || url.pathname === "/") continue;
    if (/\/(cart|account|search|login|checkout|cdn)(\/|$)/i.test(url.pathname)) continue;
    const key = url.pathname.replace(/\/$/, "");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ url: `${origin}${key}`, text });
    if (out.length >= max) break;
  }
  return out;
}

const SOCIAL = /^https?:\/\/(www\.)?(facebook\.com|instagram\.com|x\.com|twitter\.com|tiktok\.com|youtube\.com|linkedin\.com|pinterest\.com)\/(?!sharer|share|intent|dialog|hashtag)[^\s"'?#]+/i;

export function socialLinks(html: string): string[] {
  const found = new Set<string>();
  for (const m of html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
    const s = m[1].match(SOCIAL)?.[0];
    if (s) found.add(s.replace(/\/$/, ""));
  }
  return [...found].slice(0, 6);
}

// The first linked product that is a real product (not a gift card).
export function productLink(html: string, origin: string): string | null {
  for (const m of html.matchAll(/href\s*=\s*["']([^"']*\/products?\/[^"'?#]+)/gi)) {
    try {
      const url = new URL(m[1], origin);
      if (url.origin === origin && /\/products?\/[^/]+\/?$/.test(url.pathname) && !/gift/i.test(url.pathname)) return url.toString();
    } catch {}
  }
  return null;
}

// h1–h3 in document order, as a crawler sees the page structure.
export function headings(html: string, max = 16): { level: number; text: string }[] {
  const out: { level: number; text: string }[] = [];
  for (const m of html.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    const text = decode(stripTags(m[2]));
    if (text) out.push({ level: Number(m[1]), text: text.slice(0, 120) });
    if (out.length >= max) break;
  }
  return out;
}

export function imageStats(html: string) {
  const imgs = html.match(/<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi) ?? [];
  // An empty alt is fine for decorative images; only a missing one is a gap.
  return { total: imgs.length, missingAlt: imgs.filter((t) => attr(t, "alt") === null).length };
}

// True when the HTML is mostly an empty shell that JavaScript fills in later.
export function looksLikeAppShell(html: string, words: number) {
  const scripts = (html.match(/<script\b/gi) ?? []).length;
  return words < 80 && (scripts >= 5 || /<div id=["'](root|app|__next|__nuxt)["'][^>]*>\s*<\/div>/i.test(html));
}

// Every content image with its alt as written (null = no alt attribute,
// "" = marked decorative), deduped by URL. Lazy-loading themes keep the real
// URL in data-src/srcset, and tracking pixels and inline data: images are skipped,
// as are <img> strings inside scripts (client-side templates, not real images).
export function pageImages(html: string, base: string, max = 80): { src: string; alt: string | null }[] {
  const out = new Map<string, string | null>();
  const markup = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ");
  for (const tag of markup.match(/<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi) ?? []) {
    if (attr(tag, "width") === "1" || attr(tag, "height") === "1") continue;
    const raw = attr(tag, "src") ?? attr(tag, "data-src") ?? attr(tag, "srcset")?.split(/\s+/)[0] ?? attr(tag, "data-srcset")?.split(/\s+/)[0];
    if (!raw || raw.startsWith("data:")) continue;
    let src: string;
    try {
      src = new URL(decode(raw), base).toString();
    } catch {
      continue;
    }
    if (out.has(src)) continue;
    const alt = attr(tag, "alt");
    out.set(src, alt === null ? null : decode(alt));
    if (out.size >= max) break;
  }
  return [...out].map(([src, alt]) => ({ src, alt }));
}
