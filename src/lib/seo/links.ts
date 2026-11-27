import { attr, decode, stripTags, withoutScripts } from "@/lib/ai-check/html";
import { mapLimit, traceUrl } from "@/lib/ai-check/net";
import type { Finding } from "./types";

// Broken link audit for one page: every <a href>, checked for status and
// redirects. Sites that block bots (403/429/999) are reported as
// "couldn't verify" rather than broken.

const MAX_LINKS = 120;
// Stop starting new checks after this long, so the request finishes inside
// the function's 60s limit even on slow sites.
const BUDGET_MS = 40_000;

export type LinkState = "ok" | "redirect" | "broken" | "blocked";
export type LinkResult = { url: string; text: string; internal: boolean; nofollow: boolean; status: number | null; finalUrl: string; hops: number; state: LinkState };

export function pageLinks(html: string, base: string) {
  const origin = new URL(base).origin;
  const host = new URL(base).hostname.replace(/^www\./, "");
  const seen = new Map<string, { url: string; text: string; internal: boolean; nofollow: boolean }>();
  for (const m of withoutScripts(html).matchAll(/<a\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/a>/gi)) {
    const href = attr(m[1], "href");
    if (!href || /^(#|mailto:|tel:|javascript:|sms:|data:)/i.test(href.trim())) continue;
    let url: URL;
    try {
      url = new URL(decode(href), origin);
    } catch {
      continue;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") continue;
    url.hash = "";
    const key = url.toString();
    if (seen.has(key)) continue;
    const img = m[2].match(/<img\b[^>]*>/i)?.[0];
    const text = decode(stripTags(m[2])) || (img ? `[image: ${attr(img, "alt") || "no alt"}]` : attr(m[1], "aria-label") ?? "");
    seen.set(key, { url: key, text: text.slice(0, 90), internal: url.hostname.replace(/^www\./, "") === host, nofollow: /nofollow/i.test(attr(m[1], "rel") ?? "") });
  }
  return [...seen.values()];
}

export async function analyzeLinks(html: string, base: string) {
  const all = pageLinks(html, base);
  const links = all.slice(0, MAX_LINKS);
  const deadline = Date.now() + BUDGET_MS;
  // Once the site itself keeps answering 429, it's throttling us: stop asking.
  let throttledHits = 0;
  const check = async (l: (typeof links)[number]): Promise<LinkResult | null> => {
    if (Date.now() > deadline) return null;
    if (l.internal && throttledHits >= 3) return { ...l, status: 429, finalUrl: l.url, hops: 0, state: "blocked" };
    let hops;
    try {
      hops = await traceUrl(new URL(l.url), { maxHops: 5, timeoutMs: 6000 });
      // Stores rate-limit bursts from one IP; one polite retry clears most 429s.
      if (hops[hops.length - 1].status === 429 && throttledHits < 3) {
        await new Promise((r) => setTimeout(r, 1500));
        hops = await traceUrl(new URL(l.url), { maxHops: 5, timeoutMs: 6000 });
      }
    } catch {
      return { ...l, status: null, finalUrl: l.url, hops: 0, state: "broken" };
    }
    const last = hops[hops.length - 1];
    const status = last.status;
    if (l.internal && status === 429) throttledHits++;
    const state: LinkState =
      status === 401 || status === 403 || status === 429 || status === 999 ? "blocked" : status === null || status >= 400 ? "broken" : hops.length > 1 ? "redirect" : "ok";
    return { ...l, status, finalUrl: last.url, hops: hops.length - 1, state };
  };
  // Gentle on the site itself, faster across the many external hosts.
  const [internal, external] = await Promise.all([mapLimit(links.filter((l) => l.internal), 3, check), mapLimit(links.filter((l) => !l.internal), 8, check)]);
  const results = [...internal, ...external].filter((r): r is LinkResult => r !== null);

  const count = (s: LinkState) => results.filter((r) => r.state === s).length;
  const broken = count("broken");
  const redirects = count("redirect");
  const blocked = count("blocked");
  const internalRedirects = results.filter((r) => r.state === "redirect" && r.internal).length;
  const insecure = results.filter((r) => r.url.startsWith("http:") && r.state !== "broken").length;

  const findings: Finding[] = [
    broken
      ? { tone: "bad", text: `${broken} broken link${broken === 1 ? "" : "s"}. They waste crawl budget and frustrate visitors; fix or remove them.` }
      : { tone: "ok", text: `No broken links among the ${results.length} checked.` },
    internalRedirects
      ? { tone: "warn", text: `${internalRedirects} internal link${internalRedirects === 1 ? " redirects" : "s redirect"}. Update them to point at the final URL; you control these.` }
      : { tone: "ok", text: "Internal links point straight at their final URLs." },
  ];
  if (redirects - internalRedirects > 0) findings.push({ tone: "warn", text: `${redirects - internalRedirects} external link${redirects - internalRedirects === 1 ? " redirects" : "s redirect"}. Usually harmless, but worth updating if the destination moved.` });
  const throttled = results.filter((r) => r.state === "blocked" && r.internal && r.status === 429).length;
  if (throttled) findings.push({ tone: "warn", text: `Your site rate-limited our checker after many requests, so ${throttled} internal link${throttled === 1 ? " wasn't" : "s weren't"} verified. That's protection, not a fault; run the check again in a minute.` });
  if (blocked - throttled > 0) findings.push({ tone: "warn", text: `${blocked - throttled} link${blocked - throttled === 1 ? "" : "s"} refused our checker (common for social networks and marketplaces). Check them by hand.` });
  if (insecure) findings.push({ tone: "warn", text: `${insecure} link${insecure === 1 ? " uses" : "s use"} http:// instead of https://.` });

  const order: Record<LinkState, number> = { broken: 0, blocked: 1, redirect: 2, ok: 3 };
  if (results.length < all.length) findings.push({ tone: "warn", text: `Checked ${results.length} of ${all.length} links${all.length > MAX_LINKS ? ` (the first ${MAX_LINKS})` : ""}${results.length < links.length ? " before the time limit; slow sites take longer" : ""}.` });
  return { results: results.sort((a, b) => order[a.state] - order[b.state]), total: all.length, checked: results.length, findings };
}
