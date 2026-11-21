import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ScoreRing } from "@/components/blog/WidgetFrame";
import { CheckForm } from "@/components/ai-tools/CheckForm";
import { CitationCheck } from "@/components/ai-tools/CitationCheck";
import { CompareForm } from "@/components/ai-tools/CompareForm";
import { BotTable, CategoryBars, CheckList, CrawlerView, SectionCard, SectionSkeleton } from "@/components/ai-tools/ReportParts";
import { EmailReport } from "@/components/ai-tools/EmailReport";
import { RecheckButton } from "@/components/ai-tools/RecheckButton";
import { ReportViewed } from "@/components/ai-tools/ReportViewed";
import { ReviewForm } from "@/components/ai-tools/ReviewForm";
import { ShareBar } from "@/components/ai-tools/ShareBar";
import { WatchForm } from "@/components/ai-tools/WatchForm";
import { GROUPS, botRows, groupScore, homepageChecks, verdict } from "@/lib/ai-check/checks";
import { citationsEnabled } from "@/lib/ai-check/citations";
import { monitorEnabled } from "@/lib/ai-check/monitor";
import { HOSTNAME_PATTERN } from "@/lib/ai-check/net";
import { loadAccess, loadFiles, loadHome, loadProduct, loadSummary } from "@/lib/ai-check/report";
import { pageMetadata } from "@/lib/metadata";

type Props = PageProps<"/ai-tools/report/[domain]">;

// Reports are for sharing, not for search results: thousands of near-identical
// pages would be thin content. Links are still followed.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await params;
  return {
    ...pageMetadata({
      title: `AI visibility report for ${domain}`,
      description: `Can ChatGPT, Claude, Perplexity and Google AI read ${domain}? Crawler access, AI files, homepage and product page checks, with fixes.`,
      path: `/ai-tools/report/${domain}`,
    }),
    robots: { index: false, follow: true },
  };
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(iso)) + " UTC";

export default function ReportPage({ params }: Props) {
  return (
    <div className="container container-narrow" style={{ padding: "40px 24px 96px" }}>
      <nav aria-label="Breadcrumb" style={{ fontSize: 13.5, color: "var(--color-text-faint)" }}>
        <Link href="/ai-tools">Free AI tools</Link> <span aria-hidden="true">/</span> Report
      </nav>
      <Suspense fallback={<ReportShell host={null} />}>
        <Report params={params} />
      </Suspense>
    </div>
  );
}

async function Report({ params }: { params: Props["params"] }) {
  const { domain } = await params;
  // The proxy already 404s malformed hosts; this guards direct renders.
  if (!HOSTNAME_PATTERN.test(domain)) return <p style={{ marginTop: 24 }}>That isn&rsquo;t a valid domain.</p>;
  return <ReportShell host={domain} />;
}

function ReportShell({ host }: { host: string | null }) {
  return (
    <>
      <header style={{ margin: "18px 0 28px" }}>
        <span className="eyebrow">AI visibility report</span>
        <h1 className="mono" style={{ margin: "12px 0 0", fontSize: "clamp(26px,5vw,40px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600, overflowWrap: "anywhere" }}>
          {host ?? "Loading…"}
        </h1>
      </header>
      {host && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Suspense fallback={<SummarySkeleton host={host} />}>
            <SummaryBlock host={host} />
          </Suspense>
          <Suspense fallback={<SectionSkeleton id="access" title={GROUPS.access.label} note="Reading robots.txt and knocking on the door as GPTBot, ClaudeBot and PerplexityBot…" />}>
            <AccessSection host={host} />
          </Suspense>
          <Suspense fallback={<SectionSkeleton id="files" title={GROUPS.files.label} note="Looking for llms.txt, agents.md and your sitemap…" />}>
            <FilesSection host={host} />
          </Suspense>
          <Suspense fallback={<SectionSkeleton id="homepage" title={GROUPS.homepage.label} note="Reading your homepage without JavaScript, the way AI crawlers do…" />}>
            <HomepageSection host={host} />
          </Suspense>
          <Suspense fallback={<SectionSkeleton id="products" title={GROUPS.products.label} note="Finding a product page and checking its schema…" />}>
            <ProductSection host={host} />
          </Suspense>
          <div className="report-card" style={{ padding: 22 }}>
            <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600 }}>How do your competitors compare?</p>
            <p style={{ margin: "0 0 12px", fontSize: 14, color: "var(--color-text-faint)" }}>See {host} side by side with up to two competitors.</p>
            <CompareForm initial={[host]} compact />
          </div>
          <div className="report-card" style={{ padding: 22 }}>
            <p style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>Check another site</p>
            <CheckForm size="sm" buttonLabel="Run report" source="report" />
          </div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--color-text-faint)" }}>
            Reports are cached for about an hour. We fetch public pages only, identify ourselves as SEORatingBot, and store
            nothing about the site. The score measures whether AI assistants can access and understand a site; it can&rsquo;t
            guarantee being cited.
          </p>
        </div>
      )}
    </>
  );
}

function SummarySkeleton({ host }: { host: string }) {
  return (
    <div className="report-card summary-card" aria-busy="true">
      <div className="score-placeholder">
        <span className="spinner" aria-hidden="true" />
      </div>
      <div style={{ flex: "1 1 260px" }}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Checking {host}…</p>
        <p style={{ margin: "6px 0 0", fontSize: 14.5, color: "var(--color-text-faint)" }}>
          This takes 5–15 seconds. Each section below fills in as soon as its checks finish.
        </p>
      </div>
    </div>
  );
}

async function SummaryBlock({ host }: { host: string }) {
  const { home, summary } = await loadSummary(host);
  if (!home.ok || !summary) {
    return (
      <div className="report-card" style={{ padding: 24 }}>
        <span className="pill pill-bad">Couldn&rsquo;t check this site</span>
        <p style={{ margin: "12px 0 0", fontSize: 16, lineHeight: 1.6 }}>{home.ok ? "Something went wrong." : home.error}</p>
        <p style={{ margin: "8px 0 16px", fontSize: 14.5, color: "var(--color-text-faint)" }}>
          If the site loads in your browser, it may block automated requests, which would block AI crawlers too.
        </p>
        <CheckForm size="sm" initial={host} buttonLabel="Try again" source="report-error" />
      </div>
    );
  }
  const v = verdict(summary.score);
  const finalHost = new URL(home.origin).hostname;
  const bare = host.replace(/^www\./, "");
  const redirected = finalHost !== host && finalHost !== `www.${bare}` && finalHost !== bare;
  return (
    <>
      {redirected && (
        <div className="callout" role="note">
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>
            <strong>{host}</strong> redirects to <strong>{finalHost}</strong>, so this report checks that site. Crawlers
            that follow links to {host} land there too.{" "}
            {!host.startsWith("www.") && <Link href={`/ai-tools/report/www.${bare}`} prefetch={false}>Check www.{bare} instead</Link>}
          </p>
        </div>
      )}
      <div className="report-card summary-card">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <ScoreRing value={summary.score} label="AI score" size={148} />
          <span className={`pill pill-${v.tone}`}>{v.text}</span>
        </div>
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <CategoryBars groups={summary.groups} />
          <p style={{ margin: "16px 0 0", fontSize: 13, color: "var(--color-text-faint)" }}>
            {plural(summary.counts.bad, "problem")} · {plural(summary.counts.warn, "warning")} · {summary.counts.ok} passed
            {home.isShopify && " · Shopify store"} · Checked {fmtDate(home.checkedAt)}
          </p>
        </div>
      </div>

      {summary.topFixes.length > 0 && (
        <div className="report-card" style={{ padding: 22 }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 19, fontWeight: 600 }}>Fix these first</h2>
          <ol className="top-fixes">
            {summary.topFixes.map((c) => (
              <li key={c.id}>
                <a href={`#check-${c.id}`}>
                  <span style={{ fontWeight: 600 }}>{c.label}</span>
                  <span className={`impact impact-${c.impact}`}>{c.impact} impact</span>
                </a>
                <p>{c.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 8 }}>
          <RecheckButton host={host} />
          <EmailReport host={host} />
        </span>
        <ShareBar host={host} />
      </div>

      {citationsEnabled() && <CitationCheck host={host} brand={home.siteName} />}

      <ReviewForm host={host} score={summary.score} isShopify={home.isShopify} />
      {monitorEnabled() && <WatchForm host={host} />}
      <ReportViewed score={summary.score} shopify={home.isShopify} />
    </>
  );
}

async function AccessSection({ host }: { host: string }) {
  const data = await loadAccess(host);
  if (!data) return null;
  return (
    <SectionCard id="access" title={GROUPS.access.label} score={groupScore(data.checks)} sub="Can AI crawlers get in? robots.txt rules plus a live firewall test.">
      <CheckList checks={data.checks} />
      <BotTable rows={botRows(data.files, data.probes)} />
    </SectionCard>
  );
}

async function FilesSection({ host }: { host: string }) {
  const data = await loadFiles(host);
  if (!data) return null;
  return (
    <SectionCard id="files" title={GROUPS.files.label} score={groupScore(data.checks)} sub="The files that tell AI assistants and crawlers what your site is and where everything lives.">
      <CheckList checks={data.checks} />
    </SectionCard>
  );
}

async function HomepageSection({ host }: { host: string }) {
  const home = await loadHome(host);
  if (!home.ok) return null;
  const checks = homepageChecks(home);
  return (
    <SectionCard id="homepage" title={GROUPS.homepage.label} score={groupScore(checks)} sub={`What an AI crawler reads at ${home.origin}, without running JavaScript.`}>
      <CheckList checks={checks} />
      {home.isHtml && home.status === 200 && <CrawlerView outline={home.outline} excerpt={home.excerpt} words={home.words} />}
    </SectionCard>
  );
}

async function ProductSection({ host }: { host: string }) {
  const data = await loadProduct(host);
  if (!data) return null;
  if (!data.product.found) {
    return (
      <SectionCard id="products" title={GROUPS.products.label} sub="Not scored">
        <p style={{ margin: 0, fontSize: 14.5, color: "var(--color-text-softer)" }}>
          We couldn&rsquo;t find a product page linked from the homepage, so this section isn&rsquo;t part of the score.
          {data.home.isShopify ? "" : " If this isn't an online store, that's expected."}
        </p>
      </SectionCard>
    );
  }
  return (
    <SectionCard id="products" title={GROUPS.products.label} score={groupScore(data.checks)} sub={<>Checked <a href={data.product.url} rel="nofollow noopener" target="_blank">{data.product.url.replace(/^https?:\/\//, "")}</a></>}>
      <CheckList checks={data.checks} />
    </SectionCard>
  );
}
