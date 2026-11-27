import { mapLimit, traceUrl, type Hop } from "@/lib/ai-check/net";
import type { Finding } from "./types";

// Redirect & status audit: the full hop-by-hop chain for a URL, plus, for a
// homepage, whether every http/https and www/non-www variant lands on the
// same final address in one hop.

export type Variant = { url: string; hops: Hop[] };

function chainFindings(hops: Hop[]): Finding[] {
  const out: Finding[] = [];
  const last = hops[hops.length - 1];
  const redirects = hops.slice(0, -1);
  if (last.status === null) {
    const loop = hops.length > 1 && hops.slice(0, -1).some((h) => h.url === last.url);
    out.push({ tone: "bad", text: loop ? "Redirect loop: the chain comes back to a URL it already visited." : `Couldn't reach ${last.url}.` });
  } else if (last.status >= 400) {
    out.push({ tone: "bad", text: `Ends in HTTP ${last.status}. ${last.status === 404 ? "The page doesn't exist." : last.status >= 500 ? "The server errored." : last.status === 403 || last.status === 429 ? "The site refused our checker; it may load fine in a browser." : ""}`.trim() });
  } else if (last.status >= 300) {
    out.push({ tone: "bad", text: `Stops on a ${last.status} with no Location header.` });
  } else {
    out.push({ tone: "ok", text: `Ends in HTTP ${last.status} at ${last.url}.` });
  }
  if (!redirects.length) out.push({ tone: "ok", text: "No redirects." });
  else if (redirects.length === 1) out.push({ tone: "ok", text: "One redirect, which is fine." });
  else out.push({ tone: "warn", text: `${redirects.length} redirects in a row. Each hop adds delay and can leak link value; point links straight at the final URL.` });
  const temporary = redirects.filter((h) => h.status === 302 || h.status === 303 || h.status === 307);
  if (temporary.length) out.push({ tone: "warn", text: `${temporary.length === 1 ? "A" : temporary.length} temporary redirect${temporary.length === 1 ? "" : "s"} (${[...new Set(temporary.map((t) => t.status))].join(", ")}). For permanent moves use 301 or 308 so search engines move the ranking to the new URL.` });
  if (last.url.startsWith("http:") && last.status !== null && last.status < 400) out.push({ tone: "bad", text: "Ends on http://, not https://." });
  return out;
}

export async function analyzeRedirects(target: URL) {
  const hops = await traceUrl(target);
  const findings = chainFindings(hops);

  let variants: Variant[] = [];
  if (target.pathname === "/" && !target.search) {
    const bare = target.hostname.replace(/^www\./, "");
    const urls = [`http://${bare}/`, `http://www.${bare}/`, `https://${bare}/`, `https://www.${bare}/`];
    variants = await mapLimit(urls, 4, async (u) => ({ url: u, hops: await traceUrl(new URL(u)).catch(() => [{ url: u, status: null, location: null, ms: 0 }]) }));
    const finals = new Set(variants.filter((v) => v.hops[v.hops.length - 1].status === 200).map((v) => v.hops[v.hops.length - 1].url));
    const reachable = variants.filter((v) => v.hops[v.hops.length - 1].status !== null);
    const long = variants.filter((v) => v.hops.length > 2);
    if (reachable.length && finals.size > 1) findings.push({ tone: "bad", text: `The four ways to type your domain end on ${finals.size} different URLs. Pick one (e.g. https://www.) and redirect the rest to it, or search engines may index duplicates.` });
    else if (finals.size === 1) findings.push({ tone: "ok", text: `Every variant ends on ${[...finals][0]}.` });
    if (long.length) findings.push({ tone: "warn", text: `${long.length} variant${long.length === 1 ? " takes" : "s take"} more than one redirect to reach the final URL (often http → https → www). Redirect straight to the final address.` });
  }
  return { hops, variants, findings };
}
