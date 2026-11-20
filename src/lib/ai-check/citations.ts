import { cacheLife, cacheTag } from "next/cache";
import { getHome } from "./data";

// "Does Perplexity recommend this store?" Asks Perplexity's Agent API a few
// buyer questions and reports whether the site is mentioned in the answer,
// cited as a source, or only seen in search results. Results are cached for
// a day per site and category, since every question costs money.
//
// API: POST https://api.perplexity.ai/v1/agent with effort "fast", the
// documented replacement for the old Sonar model. Docs:
// https://docs.perplexity.ai/api-reference/agent-post

// PERPLEXITY_API_URL only exists to point tests at a local mock.
const ENDPOINT = process.env.PERPLEXITY_API_URL || "https://api.perplexity.ai/v1/agent";

export const citationsEnabled = () => !!process.env.PERPLEXITY_API_KEY;

export const CATEGORY_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} &'’,.\-/]{1,58}$/u;

export type Source = { url: string; host: string; title: string; cited: boolean };
export type Answer = {
  kind: "discovery" | "brand";
  question: string;
  mentioned: boolean;
  cited: boolean;
  seen: boolean;
  excerpt: string;
  sources: Source[];
};
export type CitationReport = {
  host: string;
  brand: string;
  category: string;
  checkedAt: string;
  answers: Answer[];
  competitors: { host: string; count: number }[];
  costUsd: number | null;
};

export class CitationError extends Error {}

type AgentResponse = {
  status?: string;
  output?: (
    | { type: "message"; content?: { type: string; text?: string; annotations?: { type: string; url?: string; title?: string }[] }[] }
    | { type: "search_results"; results?: { id?: number; url?: string; title?: string }[] }
    | { type: string }
  )[];
  usage?: { cost?: { total_cost?: number } };
};

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Answers arrive as Markdown with inline [web:n] markers; keep plain prose.
function toExcerpt(text: string, max = 700) {
  const plain = text
    .replace(/\s*\[web:\d+\]/g, "")
    .replace(/\*\*|__|`/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("\n"));
  return `${cut.slice(0, stop > max * 0.5 ? stop + 1 : max).trim()} …`;
}

// Pure so it can be tested against a recorded response.
export function parseAnswer(json: AgentResponse, kind: Answer["kind"], question: string, brand: string, domain: string): Answer & { cost: number | null } {
  const items = json.output ?? [];
  const message = items.find((i) => i.type === "message") as Extract<NonNullable<AgentResponse["output"]>[number], { type: "message" }> | undefined;
  const parts = (message?.content ?? []).filter((c) => c.type === "output_text");
  const text = parts.map((p) => p.text ?? "").join("\n");
  const results = items.flatMap((i) => (i.type === "search_results" ? ((i as { results?: { id?: number; url?: string; title?: string }[] }).results ?? []) : []));

  const citedUrls = new Set<string>();
  for (const p of parts) for (const a of p.annotations ?? []) if (a.type === "url_citation" && a.url) citedUrls.add(a.url);
  // Inline markers refer to search results by id; fall back to position.
  for (const m of text.matchAll(/\[web:(\d+)\]/g)) {
    const n = Number(m[1]);
    const r = results.find((x) => x.id === n) ?? results[n];
    if (r?.url) citedUrls.add(r.url);
  }

  const seenUrls = new Map<string, string>();
  for (const r of results) if (r.url) seenUrls.set(r.url, r.title ?? "");
  for (const p of parts) for (const a of p.annotations ?? []) if (a.url && !seenUrls.has(a.url)) seenUrls.set(a.url, a.title ?? "");

  const ours = (url: string) => {
    const h = hostOf(url);
    return h === domain || h.endsWith(`.${domain}`);
  };
  const sources: Source[] = [...seenUrls].map(([url, title]) => ({ url, host: hostOf(url), title, cited: citedUrls.has(url) }));
  const nameRe = brand.length >= 3 ? new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(brand)}([^\\p{L}\\p{N}]|$)`, "iu") : null;

  return {
    kind,
    question,
    mentioned: (nameRe?.test(text) ?? false) || text.toLowerCase().includes(domain),
    cited: sources.some((s) => s.cited && ours(s.url)),
    seen: sources.some((s) => ours(s.url)),
    excerpt: toExcerpt(text),
    sources: sources.sort((a, b) => Number(b.cited) - Number(a.cited)).slice(0, 12),
    cost: json.usage?.cost?.total_cost ?? null,
  };
}

async function ask(question: string): Promise<AgentResponse> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      effort: process.env.PERPLEXITY_EFFORT || "fast",
      input: question,
      stream: false,
      max_output_tokens: 1200,
    }),
    signal: AbortSignal.timeout(60_000),
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("Perplexity request failed", res.status, (await res.text().catch(() => "")).slice(0, 500));
    throw new CitationError("Perplexity didn't answer. Please try again in a minute.");
  }
  const json = (await res.json()) as AgentResponse;
  if (json.status && json.status !== "completed") throw new CitationError("Perplexity didn't finish its answer. Please try again.");
  return json;
}

export function questionsFor(category: string, brand: string, domain: string) {
  return [
    { kind: "discovery" as const, question: `What are the best online stores to buy ${category}?` },
    { kind: "discovery" as const, question: `I'm shopping for ${category}. Which brands or shops would you recommend, and why?` },
    { kind: "brand" as const, question: `Is ${brand} (${domain}) a good place to buy ${category}? What do customers say?` },
  ];
}

export async function getCitations(host: string, category: string): Promise<CitationReport> {
  "use cache";
  cacheLife("days");
  cacheTag(`citations:${host}`);

  const home = await getHome(host);
  if (!home.ok) throw new CitationError(home.error);
  const domain = new URL(home.origin).hostname.replace(/^www\./, "");
  const brand = home.siteName;

  const parsed = await Promise.all(
    questionsFor(category, brand, domain).map(async (q) => parseAnswer(await ask(q.question), q.kind, q.question, brand, domain)),
  );

  const tally = new Map<string, number>();
  for (const a of parsed.filter((a) => a.kind === "discovery")) {
    for (const h of new Set(a.sources.filter((s) => s.cited && s.host && s.host !== domain && !s.host.endsWith(`.${domain}`)).map((s) => s.host))) {
      tally.set(h, (tally.get(h) ?? 0) + 1);
    }
  }
  const costs = parsed.map((p) => p.cost).filter((c): c is number => c !== null);

  return {
    host,
    brand,
    category,
    checkedAt: new Date().toISOString(),
    answers: parsed.map(({ cost, ...a }) => (void cost, a)),
    competitors: [...tally].map(([h, count]) => ({ host: h, count })).sort((a, b) => b.count - a.count).slice(0, 8),
    costUsd: costs.length ? Math.round(costs.reduce((s, c) => s + c, 0) * 10000) / 10000 : null,
  };
}
