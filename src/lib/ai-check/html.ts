// Small, dependency-free HTML readers for the checker. They work on the raw
// HTML an AI crawler receives, which is the point: no JavaScript is run.

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
  return decode(
    (main ?? html)
      .replace(/<(script|style|noscript|svg|template|head)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z#0-9]+;/gi, " "),
  );
}

export const wordCount = (text: string) => text.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;

// Internal links with readable anchor text, for drafting llms.txt.
export function internalLinks(html: string, origin: string, max = 14): { url: string; text: string }[] {
  const seen = new Set<string>();
  const out: { url: string; text: string }[] = [];
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = attr(m[1], "href");
    const text = decode(m[2].replace(/<[^>]+>/g, " "));
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
