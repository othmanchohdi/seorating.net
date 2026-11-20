import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { evaluate } from "@/components/blog/robots";
import { absoluteUrl } from "./site";

// Server side of the free AI visibility checker on /ai-tools. It fetches a
// site's public files the way an AI crawler would and reports what it finds.
// Everything here is read-only and limited to a handful of small requests.

const USER_AGENT = `Mozilla/5.0 (compatible; SEORatingBot/1.0; +${absoluteUrl("/ai-tools")})`;
const TIMEOUT_MS = 8000;
const MAX_BYTES = 1_500_000;
const MAX_REDIRECTS = 4;

export type Tone = "ok" | "warn" | "bad";
export type Check = { id: string; tone: Tone; label: string; detail: string };
export type BotResult = { name: string; owner: string; purpose: string; allowed: boolean | null };
export type CheckReport = {
  url: string;
  score: number;
  bots: BotResult[];
  files: Check[];
  page: Check[];
};

// Crawlers that decide whether a site can appear in AI answers. Search and
// user-triggered fetchers matter most; training crawlers are listed so owners
// can see the difference.
const BOTS: Omit<BotResult, "allowed">[] = [
  { name: "OAI-SearchBot", owner: "OpenAI", purpose: "ChatGPT search" },
  { name: "ChatGPT-User", owner: "OpenAI", purpose: "Fetches pages users ask about" },
  { name: "GPTBot", owner: "OpenAI", purpose: "Model training" },
  { name: "Claude-SearchBot", owner: "Anthropic", purpose: "Claude search" },
  { name: "ClaudeBot", owner: "Anthropic", purpose: "Model training" },
  { name: "PerplexityBot", owner: "Perplexity", purpose: "Perplexity search" },
  { name: "Google-Extended", owner: "Google", purpose: "Gemini training and grounding" },
  { name: "Googlebot", owner: "Google", purpose: "Google Search and AI Overviews" },
  { name: "Bingbot", owner: "Microsoft", purpose: "Bing and Copilot" },
  { name: "Applebot-Extended", owner: "Apple", purpose: "Apple Intelligence" },
];

// Bots whose access affects being cited in answers, as opposed to training.
const ANSWER_BOTS = new Set(["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "PerplexityBot", "Googlebot", "Bingbot"]);

export class CheckError extends Error {}

export function normalizeUrl(input: string): URL {
  const raw = input.trim();
  if (!raw || raw.length > 500) throw new CheckError("Enter a website address, like yourstore.com.");
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    throw new CheckError("That doesn't look like a website address.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new CheckError("Only http and https addresses can be checked.");
  if (url.username || url.password) throw new CheckError("Addresses with a username or password can't be checked.");
  if (url.port && url.port !== "80" && url.port !== "443") throw new CheckError("Only standard web ports can be checked.");
  if (!url.hostname.includes(".") || isIP(url.hostname)) throw new CheckError("Enter a public domain name, like yourstore.com.");
  return url;
}

function isPrivateAddress(address: string): boolean {
  if (isIP(address) === 4) {
    const [a, b] = address.split(".").map(Number);
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }
  const v6 = address.toLowerCase();
  if (v6.startsWith("::ffff:")) return isPrivateAddress(v6.slice(7));
  return v6 === "::" || v6 === "::1" || v6.startsWith("fc") || v6.startsWith("fd") || v6.startsWith("fe8") || v6.startsWith("fe9") || v6.startsWith("fea") || v6.startsWith("feb");
}

// Refuse anything that resolves to a private or loopback address, so the
// checker can't be used to probe internal networks.
async function assertPublicHost(hostname: string) {
  let addresses: { address: string }[];
  try {
    addresses = await lookup(hostname, { all: true });
  } catch {
    throw new CheckError(`We couldn't find ${hostname}. Check the spelling and try again.`);
  }
  if (!addresses.length || addresses.some((a) => isPrivateAddress(a.address))) {
    throw new CheckError("That address can't be checked.");
  }
}

type Fetched = { status: number; contentType: string; body: string; finalUrl: string } | null;

async function readCapped(res: Response): Promise<string> {
  if (!res.body) return "";
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (size < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    size += value.byteLength;
  }
  reader.cancel().catch(() => {});
  return new TextDecoder().decode(Buffer.concat(chunks).subarray(0, MAX_BYTES));
}

// fetch() with redirects followed by hand, so every hop is re-checked.
async function safeFetch(start: URL): Promise<Fetched> {
  let url = start;
  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      await assertPublicHost(url.hostname);
      const res = await fetch(url, {
        redirect: "manual",
        headers: { "User-Agent": USER_AGENT, Accept: "text/html,text/plain,*/*;q=0.8" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      });
      const location = res.headers.get("location");
      if (res.status >= 300 && res.status < 400 && location) {
        res.body?.cancel().catch(() => {});
        url = new URL(location, url);
        if (url.protocol !== "https:" && url.protocol !== "http:") return null;
        continue;
      }
      return {
        status: res.status,
        contentType: res.headers.get("content-type") ?? "",
        body: await readCapped(res),
        finalUrl: url.toString(),
      };
    }
  } catch (err) {
    if (err instanceof CheckError) throw err;
  }
  return null;
}

// A plain-text file only counts if it really is one: many sites answer every
// unknown path with their HTML 404 page and a 200 status.
function textFile(f: Fetched): string | null {
  if (!f || f.status !== 200) return null;
  if (/text\/html/i.test(f.contentType) || /^\s*<(!doctype|html)/i.test(f.body)) return null;
  return f.body;
}

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"))?.slice(2).find((v) => v !== undefined) ?? null;

function metaContent(html: string, key: string): string | null {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const name = (attr(tag, "name") ?? attr(tag, "property"))?.toLowerCase();
    if (name === key) return attr(tag, "content");
  }
  return null;
}

function decode(s: string) {
  return s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}

function schemaTypes(html: string): string[] {
  const types = new Set<string>();
  const collect = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(collect);
    if (!node || typeof node !== "object") return;
    const obj = node as Record<string, unknown>;
    const t = obj["@type"];
    (Array.isArray(t) ? t : [t]).forEach((v) => typeof v === "string" && types.add(v));
    if (obj["@graph"]) collect(obj["@graph"]);
  };
  for (const m of html.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      collect(JSON.parse(m[1].trim()));
    } catch {
      types.add("(invalid JSON-LD)");
    }
  }
  return [...types];
}

function visibleWords(html: string): number {
  const text = html
    .replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ");
  return text.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export async function runCheck(input: string): Promise<CheckReport> {
  const start = normalizeUrl(input);
  await assertPublicHost(start.hostname);

  const home = await safeFetch(new URL("/", start));
  if (!home) throw new CheckError(`We couldn't reach ${start.hostname}. The site may be down or blocking automated requests.`);
  // Check files on the host the site actually lives on (e.g. after www redirect).
  const origin = new URL(home.finalUrl).origin;
  const [robotsRes, llmsRes, agentsRes, sitemapRes] = await Promise.all(
    ["/robots.txt", "/llms.txt", "/agents.md", "/sitemap.xml"].map((p) => safeFetch(new URL(p, origin))),
  );

  // --- AI crawler access ---------------------------------------------------
  const robots = textFile(robotsRes);
  const bots: BotResult[] = BOTS.map((b) => ({ ...b, allowed: robots === null ? null : evaluate(robots, b.name, "/").allowed }));
  const blockedAnswerBots = bots.filter((b) => ANSWER_BOTS.has(b.name) && b.allowed === false);

  // --- AI files ------------------------------------------------------------
  const files: Check[] = [];
  files.push(
    robots === null
      ? { id: "robots", tone: "warn", label: "robots.txt", detail: "Not found. Crawlers will assume everything is allowed, but you have no control over AI bots." }
      : blockedAnswerBots.length
        ? { id: "robots", tone: "bad", label: "robots.txt", detail: `Blocks ${blockedAnswerBots.map((b) => b.name).join(", ")} from your homepage, so those assistants can't read or cite it.` }
        : { id: "robots", tone: "ok", label: "robots.txt", detail: "Found, and AI search crawlers can reach your homepage." },
  );

  const llms = textFile(llmsRes);
  if (llms === null) {
    files.push({ id: "llms", tone: "bad", label: "llms.txt", detail: "Not found. An llms.txt gives AI assistants a short, curated summary of your site and its key pages." });
  } else {
    const hasTitle = /^#\s+\S/m.test(llms);
    const hasSummary = /^>\s*\S/m.test(llms);
    const links = (llms.match(/\]\(https?:\/\/[^)]+\)/g) ?? []).length;
    const issues = [!hasTitle && "no # title", !hasSummary && "no > summary line", links === 0 && "no links"].filter(Boolean);
    files.push(
      issues.length
        ? { id: "llms", tone: "warn", label: "llms.txt", detail: `Found, but it has ${issues.join(", ")}. Follow the llmstxt.org format so assistants can parse it.` }
        : { id: "llms", tone: "ok", label: "llms.txt", detail: `Found, with a title, a summary and ${plural(links, "link")}.` },
    );
  }

  files.push(
    textFile(agentsRes) === null
      ? { id: "agents", tone: "warn", label: "agents.md", detail: "Not found. agents.md tells AI agents how to use your site: what they can do, where policies live and who to contact." }
      : { id: "agents", tone: "ok", label: "agents.md", detail: "Found. AI agents have instructions for working with your site." },
  );

  const sitemapInRobots = robots !== null && /^\s*sitemap\s*:/im.test(robots);
  const sitemapAtRoot = !!sitemapRes && sitemapRes.status === 200 && /<(urlset|sitemapindex)\b/i.test(sitemapRes.body);
  files.push(
    sitemapInRobots || sitemapAtRoot
      ? { id: "sitemap", tone: "ok", label: "XML sitemap", detail: sitemapInRobots ? "Listed in robots.txt, so crawlers can find every page." : "Found at /sitemap.xml. Add a Sitemap: line to robots.txt too." }
      : { id: "sitemap", tone: "bad", label: "XML sitemap", detail: "Not found at /sitemap.xml or in robots.txt. Crawlers may miss pages that aren't linked well." },
  );

  // --- Homepage signals ----------------------------------------------------
  const page: Check[] = [];
  const html = home.status === 200 && /html/i.test(home.contentType) ? home.body : "";
  if (!html) {
    page.push({ id: "reach", tone: "bad", label: "Homepage", detail: `Returned HTTP ${home.status} to our crawler. If AI bots get the same response, they can't read your site.` });
  } else {
    const robotsMeta = `${metaContent(html, "robots") ?? ""} ${home.contentType}`.toLowerCase();
    if (/noindex/.test(robotsMeta)) page.push({ id: "noindex", tone: "bad", label: "Indexing", detail: "The homepage has a noindex tag, so search engines and AI search will drop it." });

    const title = decode(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    page.push(
      !title
        ? { id: "title", tone: "bad", label: "Title tag", detail: "Missing. The title is the first thing search engines and assistants read." }
        : title.length < 15 || title.length > 65
          ? { id: "title", tone: "warn", label: "Title tag", detail: `“${title}” is ${title.length} characters. Aim for roughly 30–60.` }
          : { id: "title", tone: "ok", label: "Title tag", detail: `“${title}” (${title.length} characters).` },
    );

    const desc = decode(metaContent(html, "description") ?? "");
    page.push(
      !desc
        ? { id: "desc", tone: "bad", label: "Meta description", detail: "Missing. Assistants often lift this as the one-line summary of your site." }
        : desc.length < 70 || desc.length > 170
          ? { id: "desc", tone: "warn", label: "Meta description", detail: `${desc.length} characters. Aim for roughly 120–160.` }
          : { id: "desc", tone: "ok", label: "Meta description", detail: `${desc.length} characters, a good length.` },
    );

    const types = schemaTypes(html);
    const useful = types.filter((t) => /^(Organization|OnlineStore|LocalBusiness|Store|WebSite|Product|BreadcrumbList|FAQPage)$/.test(t));
    page.push(
      types.includes("(invalid JSON-LD)")
        ? { id: "schema", tone: "bad", label: "Structured data", detail: "A JSON-LD block on the page doesn't parse, so it's ignored entirely." }
        : useful.length
          ? { id: "schema", tone: "ok", label: "Structured data", detail: `JSON-LD found: ${types.join(", ")}.` }
          : types.length
            ? { id: "schema", tone: "warn", label: "Structured data", detail: `JSON-LD found (${types.join(", ")}), but no Organization or WebSite schema to say who you are.` }
            : { id: "schema", tone: "bad", label: "Structured data", detail: "No JSON-LD found. Schema markup states facts about your business in a form machines can trust." },
    );

    const og = metaContent(html, "og:title") && metaContent(html, "og:image");
    page.push(
      og
        ? { id: "og", tone: "ok", label: "Open Graph", detail: "Title and image set, so links to your site preview well in chats and social apps." }
        : { id: "og", tone: "warn", label: "Open Graph", detail: "og:title or og:image is missing, so shared links show a bare URL." },
    );

    const canonical = (html.match(/<link\b[^>]*rel\s*=\s*["']?canonical["']?[^>]*>/i) ?? [])[0];
    page.push(
      canonical
        ? { id: "canonical", tone: "ok", label: "Canonical URL", detail: `Points to ${attr(canonical, "href") ?? "a URL"}.` }
        : { id: "canonical", tone: "warn", label: "Canonical URL", detail: "Not set. A canonical tag tells crawlers which address is the real one." },
    );

    const words = visibleWords(html);
    page.push(
      words < 80
        ? { id: "text", tone: "bad", label: "Readable text", detail: `Only about ${words} words in the raw HTML. AI crawlers mostly don't run JavaScript, so content rendered client-side is invisible to them.` }
        : words < 250
          ? { id: "text", tone: "warn", label: "Readable text", detail: `About ${words} words in the raw HTML. More descriptive text helps assistants understand what you offer.` }
          : { id: "text", tone: "ok", label: "Readable text", detail: `About ${words} words readable without JavaScript.` },
    );

    page.push(
      /<html\b[^>]*\blang\s*=/i.test(html)
        ? { id: "lang", tone: "ok", label: "Language", detail: "The page declares its language." }
        : { id: "lang", tone: "warn", label: "Language", detail: "No lang attribute on <html>, so crawlers have to guess the language." },
    );
  }

  // --- Score ---------------------------------------------------------------
  // Crawler access is weighted heaviest: nothing else matters if bots can't get in.
  const answerBots = bots.filter((b) => ANSWER_BOTS.has(b.name));
  const access = answerBots.filter((b) => b.allowed !== false).length / answerBots.length;
  const points = (checks: Check[]) => checks.reduce((s, c) => s + (c.tone === "ok" ? 1 : c.tone === "warn" ? 0.5 : 0), 0) / Math.max(1, checks.length);
  const score = Math.round(access * 35 + points(files) * 30 + points(page) * 35);

  return { url: origin, score, bots, files, page };
}
