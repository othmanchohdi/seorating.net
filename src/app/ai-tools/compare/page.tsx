import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CompareForm } from "@/components/ai-tools/CompareForm";
import { scoreTone } from "@/components/ai-tools/ReportParts";
import { homepageChecks, verdict, type Check, type Tone } from "@/lib/ai-check/checks";
import { HOSTNAME_PATTERN } from "@/lib/ai-check/net";
import { loadAccess, loadFiles, loadProduct, loadSummary } from "@/lib/ai-check/report";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Compare AI Visibility: Your Site vs Competitors",
    description: "Compare how visible your store is to ChatGPT, Claude, Perplexity and Google AI against up to two competitors: crawler access, AI files, schema and product pages.",
    path: "/ai-tools/compare",
  }),
  // Comparisons are per-visitor query strings; only the empty form is worth indexing.
  robots: { index: false, follow: true },
};

const MAX_SITES = 3;

// The checks worth comparing, in the order a store owner cares about them.
const ROWS: { id: string; label: string }[] = [
  { id: "robots", label: "AI search crawlers allowed" },
  { id: "firewall", label: "Firewall lets AI crawlers in" },
  { id: "llms", label: "llms.txt" },
  { id: "agents", label: "agents.md" },
  { id: "sitemap", label: "XML sitemap" },
  { id: "schema", label: "Organization schema" },
  { id: "text", label: "Readable text" },
  { id: "title", label: "Title tag" },
  { id: "desc", label: "Meta description" },
  { id: "p-schema", label: "Product schema" },
  { id: "p-offer", label: "Price and stock markup" },
  { id: "p-reviews", label: "Review markup" },
];

const CELL: Record<Tone, string> = { ok: "Pass", warn: "Warning", bad: "Problem" };

function parseSites(raw: string | string[] | undefined) {
  const list = (Array.isArray(raw) ? raw.join(",") : (raw ?? "")).split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return [...new Set(list)].filter((h) => HOSTNAME_PATTERN.test(h)).slice(0, MAX_SITES);
}

async function siteData(host: string) {
  const [{ home, summary }, access, files, product] = await Promise.all([loadSummary(host), loadAccess(host), loadFiles(host), loadProduct(host)]);
  const checks: Check[] = [...(access?.checks ?? []), ...(files?.checks ?? []), ...homepageChecks(home), ...(product?.checks ?? [])];
  return { host, home, summary, byId: new Map(checks.map((c) => [c.id, c])) };
}

export default function ComparePage({ searchParams }: PageProps<"/ai-tools/compare">) {
  return (
    <div className="container" style={{ padding: "40px 24px 96px", maxWidth: 1080 }}>
      <nav aria-label="Breadcrumb" style={{ fontSize: 13.5, color: "var(--color-text-faint)" }}>
        <Link href="/ai-tools">Free AI tools</Link> <span aria-hidden="true">/</span> Compare
      </nav>
      <span className="eyebrow" style={{ display: "block", width: "fit-content", marginTop: 28 }}>
        Competitor comparison
      </span>
      <h1 style={{ margin: "14px 0 0", maxWidth: 760, fontSize: "clamp(32px,5vw,46px)", lineHeight: 1.08, letterSpacing: "-0.03em", fontWeight: 600 }}>
        Who&rsquo;s easier for AI to recommend: you or your competitors?
      </h1>
      <p className="lead" style={{ maxWidth: 660, fontSize: 17.5 }}>
        Compare up to three sites on crawler access, AI files, schema and product pages. Takes 10–20 seconds.
      </p>
      <Suspense fallback={<div className="report-card" style={{ padding: 22, marginTop: 28 }}><CompareForm /></div>}>
        <Comparison searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Comparison({ searchParams }: { searchParams: PageProps<"/ai-tools/compare">["searchParams"] }) {
  const sites = parseSites((await searchParams).sites);
  return (
    <>
      <div className="report-card" style={{ padding: 22, marginTop: 28 }}>
        <CompareForm initial={sites} />
      </div>
      {sites.length >= 2 && (
        <Suspense
          fallback={
            <div className="report-card summary-card" aria-busy="true" style={{ marginTop: 24 }}>
              <span className="spinner" aria-hidden="true" />
              <p style={{ margin: 0, fontSize: 15 }}>Checking {sites.join(", ")}… each site takes 5–15 seconds, in parallel.</p>
            </div>
          }
        >
          <CompareTable sites={sites} />
        </Suspense>
      )}
    </>
  );
}

async function CompareTable({ sites }: { sites: string[] }) {
  const data = await Promise.all(sites.map(siteData));
  const scored = data.filter((d) => d.summary);
  const best = scored.length ? Math.max(...scored.map((d) => d.summary!.score)) : null;
  const groups = scored[0]?.summary?.groups.map((g) => ({ group: g.group, label: g.label })) ?? [];

  return (
    <div className="report-card" style={{ marginTop: 24, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Check</span>
              </th>
              {data.map((d) => (
                <th key={d.host} scope="col">
                  <Link href={`/ai-tools/report/${d.host}`} prefetch={false} className="mono" style={{ overflowWrap: "anywhere" }}>
                    {d.host}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="compare-score">
              <th scope="row">AI score</th>
              {data.map((d) =>
                d.summary ? (
                  <td key={d.host}>
                    <span className={`score-chip score-${scoreTone(d.summary.score)}`} style={{ fontSize: 20 }}>
                      {d.summary.score}
                    </span>
                    <span style={{ display: "block", marginTop: 6, fontSize: 12.5, color: "var(--color-text-faint)" }}>
                      {verdict(d.summary.score).text}
                      {d.summary.score === best && scored.length > 1 ? " · Leader" : ""}
                    </span>
                  </td>
                ) : (
                  <td key={d.host} style={{ fontSize: 13, color: "var(--color-bad)" }}>
                    {d.home.ok ? "Couldn't check" : d.home.error}
                  </td>
                ),
              )}
            </tr>
            {groups.map((g) => (
              <tr key={g.group}>
                <th scope="row">{g.label}</th>
                {data.map((d) => {
                  const s = d.summary?.groups.find((x) => x.group === g.group)?.score ?? null;
                  return (
                    <td key={d.host}>
                      <span className="mono" style={{ fontSize: 14, color: s === null ? "var(--color-text-faintest)" : undefined }}>
                        {s ?? "n/a"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
            {ROWS.map((row) => (
              <tr key={row.id}>
                <th scope="row">{row.label}</th>
                {data.map((d) => {
                  const c = d.byId.get(row.id);
                  return <td key={d.host}>{c ? <span className={`pill pill-${c.tone}`} title={c.detail}>{CELL[c.tone]}</span> : <span style={{ color: "var(--color-text-faintest)" }}>—</span>}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ margin: 0, padding: "14px 18px", fontSize: 13, color: "var(--color-text-faint)", borderTop: "1px solid var(--color-border-soft)" }}>
        Hover a result for details, or open a site&rsquo;s full report for the fixes. Results are cached for about an hour.
      </p>
    </div>
  );
}
