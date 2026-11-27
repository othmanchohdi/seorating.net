import { attr, linkHref } from "@/lib/ai-check/html";
import { mapLimit, safeFetch } from "@/lib/ai-check/net";
import type { Finding, Tone } from "./types";

// hreflang audit: read a page's language/region alternates, validate the
// codes, then fetch each alternate to confirm it loads, links back, and
// isn't canonicalised elsewhere. Google ignores pairs that don't link back.

const MAX_ALTERNATES = 20;

export type Alternate = { hreflang: string; href: string };

export function alternates(html: string, base: string): Alternate[] {
  const out: Alternate[] = [];
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const rel = (attr(tag, "rel") ?? "").toLowerCase().split(/\s+/);
    const hreflang = attr(tag, "hreflang");
    const href = attr(tag, "href");
    if (!rel.includes("alternate") || !hreflang || !href) continue;
    let abs = href;
    try {
      abs = new URL(href, base).toString();
    } catch {}
    out.push({ hreflang: hreflang.trim(), href: abs });
  }
  return out;
}

const languageNames = new Intl.DisplayNames(["en"], { type: "language", fallback: "code" });
const regionNames = new Intl.DisplayNames(["en"], { type: "region", fallback: "code" });

// Returns null if the code is valid, else what's wrong with it.
export function codeProblem(code: string): string | null {
  if (code.toLowerCase() === "x-default") return null;
  if (code.includes("_")) return `Uses an underscore. Write it as “${code.replace(/_/g, "-")}”.`;
  const m = code.match(/^([a-z]{2,3})(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?$/i);
  if (!m) return "Isn't a language code, or language-region pair like en-GB.";
  const [, lang, , region] = m;
  if (languageNames.of(lang.toLowerCase()) === lang.toLowerCase()) return `“${lang}” isn't a language code. ${/^(us|uk|gb|eu|ca|au)$/i.test(lang) ? "The language must come first, e.g. en-US." : ""}`.trim();
  if (region) {
    if (region.toUpperCase() === "UK") return "The United Kingdom's region code is GB, not UK (en-GB).";
    if (region.toUpperCase() === "EU") return "EU isn't a country. hreflang regions must be single countries.";
    if (regionNames.of(region.toUpperCase()) === region.toUpperCase()) return `“${region}” isn't a country code.`;
  }
  return null;
}

const norm = (u: string) => {
  try {
    const url = new URL(u);
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return u;
  }
};

export type AlternateCheck = Alternate & { problem: string | null; status: number | null; returnLink: boolean; canonical: string | null; tone: Tone };

export async function analyzeHreflang(html: string, pageUrl: string) {
  const alts = alternates(html, pageUrl);
  const findings: Finding[] = [];
  if (!alts.length) {
    findings.push({ tone: "warn", text: "No hreflang tags on this page. That's fine if the store has one language and market; add them when you sell in several (Shopify Markets adds them automatically for its subfolders and domains)." });
    return { page: pageUrl, alternates: [] as AlternateCheck[], findings };
  }

  const self = norm(pageUrl);
  const unique = alts.slice(0, MAX_ALTERNATES);
  const checks: AlternateCheck[] = await mapLimit(unique, 5, async (a) => {
    const problem = codeProblem(a.hreflang);
    if (norm(a.href) === self) return { ...a, problem, status: 200, returnLink: true, canonical: null, tone: problem ? "bad" : "ok" };
    const res = await safeFetch(new URL(a.href)).catch(() => null);
    if (!res || res.status !== 200) return { ...a, problem, status: res?.status ?? null, returnLink: false, canonical: null, tone: "bad" };
    const back = alternates(res.body, res.finalUrl).some((b) => norm(b.href) === self);
    const canonicalHref = linkHref(res.body, "canonical");
    const canonical = canonicalHref ? norm(new URL(canonicalHref, res.finalUrl).toString()) : null;
    const canonOk = !canonical || canonical === norm(a.href) || canonical === norm(res.finalUrl);
    const tone: Tone = problem || !back ? "bad" : !canonOk || norm(res.finalUrl) !== norm(a.href) ? "warn" : "ok";
    return { ...a, problem, status: res.status, returnLink: back, canonical: canonOk ? null : canonical, tone };
  });

  const codes = alts.map((a) => a.hreflang.toLowerCase());
  const dupes = [...new Set(codes.filter((c, i) => codes.indexOf(c) !== i))].map((c) => alts.find((a) => a.hreflang.toLowerCase() === c)!.hreflang);
  const invalid = checks.filter((c) => c.problem);
  const noReturn = checks.filter((c) => c.status === 200 && !c.returnLink);
  const failing = checks.filter((c) => c.status !== 200);
  const canon = checks.filter((c) => c.canonical);

  findings.push({ tone: "ok", text: `${alts.length} hreflang alternate${alts.length === 1 ? "" : "s"}: ${[...new Set(alts.map((a) => a.hreflang))].join(", ")}.` });
  findings.push(alts.some((a) => norm(a.href) === self) ? { tone: "ok", text: "The page lists itself, as it should." } : { tone: "bad", text: "The page doesn't list itself. Each page must include a hreflang tag pointing to its own URL." });
  findings.push(codes.includes("x-default") ? { tone: "ok", text: "x-default is set for visitors who match no listed language." } : { tone: "warn", text: "No x-default. Add one pointing to your main or language-picker page." });
  if (dupes.length) findings.push({ tone: "bad", text: `Duplicate codes: ${dupes.join(", ")}. Each language-region should point to exactly one URL.` });
  if (invalid.length) findings.push({ tone: "bad", text: `${invalid.length} invalid code${invalid.length === 1 ? "" : "s"}: ${invalid[0].hreflang}. ${invalid[0].problem}` });
  if (alts.some((a) => !/^https?:\/\//i.test(a.href))) findings.push({ tone: "bad", text: "Some alternates use relative URLs. hreflang URLs must be absolute." });
  if (failing.length) findings.push({ tone: "bad", text: `${failing.length} alternate${failing.length === 1 ? " doesn't" : "s don't"} return HTTP 200, so Google ignores ${failing.length === 1 ? "it" : "them"}.` });
  findings.push(noReturn.length ? { tone: "bad", text: `${noReturn.length} alternate${noReturn.length === 1 ? " doesn't" : "s don't"} link back to this page. Without return links Google ignores the pair.` } : { tone: "ok", text: "Every alternate that loads links back to this page." });
  if (canon.length) findings.push({ tone: "warn", text: `${canon.length} alternate${canon.length === 1 ? " is" : "s are"} canonicalised to a different URL, which contradicts the hreflang tag.` });
  if (alts.length > MAX_ALTERNATES) findings.push({ tone: "warn", text: `Checked the first ${MAX_ALTERNATES} of ${alts.length} alternates.` });

  return { page: pageUrl, alternates: checks, findings };
}
