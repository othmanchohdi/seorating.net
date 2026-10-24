import Link from "next/link";
import { Faq } from "@/components/Faq";
import { Logo } from "@/components/Logo";
import { PricingSection } from "@/components/PricingSection";
import { WaitlistForm } from "@/components/WaitlistForm";
import { JsonLd, faqPage, softwareApp } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { INSTALL_URL, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${SITE_NAME}: Shopify SEO & AI Visibility App`,
  absoluteTitle: true,
  description: SITE_DESCRIPTION,
  path: "/",
});

type Tone = "ok" | "warn" | "bad";
const DOT: Record<Tone, string> = { ok: "#3f8a5a", warn: "#d8901f", bad: "#c2413b" };

const HERO_ISSUES: { label: string; count: string; tone: Tone; status: string }[] = [
  { label: "Missing meta descriptions", count: "42 products", tone: "ok", status: "Fixed" },
  { label: "Images without alt text", count: "318 images", tone: "ok", status: "Fixed" },
  { label: "Duplicate title tags", count: "7 pages", tone: "warn", status: "Review" },
  { label: "Broken internal links", count: "3 links", tone: "bad", status: "Open" },
];

const AUDIT_ROWS: { label: string; scope: string; tone: Tone; sev: string; action: string; done?: boolean }[] = [
  { label: "Missing meta description", scope: "42 products", tone: "bad", sev: "Critical", action: "Fix with AI" },
  { label: "Focus keyword not in title", scope: "/collections/sale", tone: "bad", sev: "Critical", action: "Optimize" },
  { label: "Title longer than 60 characters", scope: "11 products", tone: "warn", sev: "Warning", action: "Review" },
  { label: "Thin product description", scope: "8 products", tone: "warn", sev: "Warning", action: "Optimize" },
  { label: "Images without alt text", scope: "318 images", tone: "ok", sev: "Fixed", action: "✓ Done", done: true },
];

const ALT_ROWS = [
  { swatch: "linear-gradient(135deg,#e9e2d4,#cfc3ab)", alt: "Beige relaxed-fit linen shirt with mother-of-pearl buttons, laid flat" },
  { swatch: "linear-gradient(135deg,#c9d6e6,#8fa6c4)", alt: "Model wearing light blue linen trousers with rolled cuffs, side view" },
  { swatch: "linear-gradient(135deg,#d9d2ec,#a99fd6)", alt: "Close-up of lavender linen fabric showing its natural weave" },
];

const SCHEMA_ROWS: { type: string; status: string; tone: Tone }[] = [
  { type: "Product", status: "Active · 142 pages", tone: "ok" },
  { type: "Organization", status: "Active", tone: "ok" },
  { type: "LocalBusiness", status: "Active", tone: "ok" },
  { type: "BreadcrumbList", status: "Active", tone: "ok" },
  { type: "Article", status: "Off", tone: "warn" },
];

const KEYWORDS = [
  { term: "linen shirt men", vol: "22.2K", bar: 64, kd: 41, hard: true },
  { term: "relaxed linen shirt", vol: "6.6K", bar: 38, kd: 24 },
  { term: "linen summer shirt", vol: "4.4K", bar: 28, kd: 19 },
  { term: "breathable button down", vol: "1.9K", bar: 14, kd: 12 },
];

const SPEED = [
  { label: "Performance", score: 78, warn: true },
  { label: "Accessibility", score: 94 },
  { label: "Best practices", score: 96 },
  { label: "SEO", score: 100 },
];

const FAQS = [
  {
    q: "Does it work with my Shopify theme?",
    a: "Yes. SEO Rating runs inside your Shopify admin and works with your existing theme and products. Structured data is added through a theme app embed you switch on once in the theme editor, so no theme code is edited.",
  },
  {
    q: "Will it change my store without asking?",
    a: "No. Every AI-generated change goes through a review step: you see the current and proposed versions side by side, and nothing is published until you approve it. Every save also creates a checkpoint you can restore.",
  },
  {
    q: "What are llms.txt and agents.md?",
    a: "They’re plain-text files that give AI assistants a clean, structured summary of your store: what you sell, your collections and your policies. That helps assistants describe your store accurately instead of guessing from theme markup.",
  },
  {
    q: "How do AI credits work?",
    a: "Anything that calls an AI model, such as writing meta tags, alt text or article drafts, uses credits. Each plan includes a monthly allowance from 40 to 4,000 credits, and the cost of every action is shown before you run it. Audits, templates, schema, robots.txt and PageSpeed tests are free.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The Free plan includes every tool in the app with 40 AI credits a month and no time limit. Paid plans (Growth $29, Pro $49, Scale $99 per month) only raise usage limits.",
  },
  {
    q: "Does it guarantee rankings or AI citations?",
    a: "No tool honestly can. SEO Rating fixes the technical and content issues that hold stores back and makes your store easy for search engines and AI assistants to read. Results depend on your market and competition.",
  },
];

function Ring({ score, size = 58, inner = 46, warn = false }: { score: number; size?: number; inner?: number; warn?: boolean }) {
  const color = warn ? "#d8901f" : "#3f8a5a";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: `conic-gradient(${color} 0 ${score}%, #e4efe9 ${score}% 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: inner,
          height: inner,
          borderRadius: 999,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 600,
          color: warn ? "var(--color-warn)" : "var(--color-ok)",
        }}
      >
        {score}
      </div>
    </div>
  );
}

function FeatureText({
  eyebrow,
  title,
  children,
  points,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  points?: string[];
}) {
  return (
    <div>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="h-feature">{title}</h2>
      <p className="body">{children}</p>
      {points && (
        <ul className="checklist">
          {points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <JsonLd data={[softwareApp, faqPage(FAQS)]} />

      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner split">
          <div>
            <p className="hero-badge">
              <span className="chip">Shopify app</span>
              SEO for Google and AI search
            </p>
            <h1 className="h-display">Find your store&rsquo;s SEO issues. Fix them in a few clicks.</h1>
            <p className="lead" style={{ maxWidth: 540 }}>
              {SITE_NAME} audits your Shopify store, shows exactly what&rsquo;s holding it back, and helps you fix it:
              meta tags, alt text, structured data, broken links and speed. It also makes your store readable to
              ChatGPT, Perplexity and Gemini.
            </p>
            <div className="cta-row" id="install">
              <a href={INSTALL_URL} rel="noopener" className="btn btn-primary">
                Install free on Shopify
              </a>
              <a href="#how" className="btn btn-secondary">
                How it works
              </a>
            </div>
            <ul className="hero-ticks">
              <li>Free plan, no time limit</li>
              <li>No code needed</li>
              <li>Review before anything publishes</li>
            </ul>
          </div>

          {/* Product mockup: pure HTML/CSS, so it costs no image bytes. */}
          <div style={{ position: "relative", minWidth: 0 }} aria-label="Example SEO Rating dashboard" role="img">
            <div className="mock" style={{ borderRadius: 16, boxShadow: "0 30px 60px -30px rgba(10,61,43,0.35),0 2px 6px rgba(23,23,29,0.05)" }}>
              <div
                style={{
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0 16px",
                  borderBottom: "1px solid var(--color-border-soft)",
                  background: "var(--color-surface-alt)",
                }}
              >
                <Logo size={16} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{SITE_NAME}</span>
                <span style={{ fontSize: 12.5, color: "var(--color-text-faintest)" }}>/ Dashboard</span>
                <span style={{ flex: 1 }} />
                <span className="mono" style={{ fontSize: 11, color: "var(--color-text-faintest)" }}>
                  Last scan · 2 min ago
                </span>
              </div>
              <div
                style={{
                  padding: 20,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 20,
                  alignItems: "center",
                  borderBottom: "1px solid var(--color-border-soft)",
                }}
              >
                <div className="score-ring" style={{ background: "conic-gradient(#0b7a55 0 86%,#e4efe9 86% 100%)" }}>
                  <div className="score-ring-inner">
                    <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>86</span>
                    <span className="mono" style={{ fontSize: 10.5, color: "var(--color-text-faintest)", marginTop: 4 }}>
                      SEO SCORE
                    </span>
                  </div>
                </div>
                <div style={{ flex: "1 1 220px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div className="stat-tile">
                    <div className="stat-tile-label">Issues fixed</div>
                    <div className="stat-tile-value">412</div>
                  </div>
                  <div className="stat-tile">
                    <div className="stat-tile-label">Needs review</div>
                    <div className="stat-tile-value" style={{ color: "var(--color-warn)" }}>
                      9
                    </div>
                  </div>
                  <div className="stat-tile">
                    <div className="stat-tile-label">Pages indexed</div>
                    <div className="stat-tile-value">1,284</div>
                  </div>
                  <div className="stat-tile">
                    <div className="stat-tile-label">Mobile speed</div>
                    <div className="stat-tile-value" style={{ color: "#3f8a5a" }}>
                      78
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: "8px 0" }}>
                {HERO_ISSUES.map((it) => (
                  <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px" }}>
                    <span className="dot" style={{ background: DOT[it.tone] }} />
                    <span style={{ flex: 1, fontSize: 14, color: "var(--color-text-body)", minWidth: 0 }}>{it.label}</span>
                    <span className="mono" style={{ fontSize: 12, color: "var(--color-text-faintest)" }}>
                      {it.count}
                    </span>
                    <span className={`pill pill-${it.tone}`}>{it.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="mock"
              style={{ position: "relative", margin: "-12px 0 0 auto", width: "min(250px,100%)", borderRadius: 12, padding: "14px 16px" }}
            >
              <div className="eyebrow" style={{ fontSize: 10.5, marginBottom: 10 }}>
                AI visibility
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 13 }}>
                {[
                  ["llms.txt", "Live ✓"],
                  ["agents.md", "Live ✓"],
                  ["IndexNow", "Connected ✓"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span className="mono">{k}</span>
                    <span style={{ color: "var(--color-ok)", fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH SURFACES */}
      <section aria-label="Search surfaces" style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
        <div
          className="container"
          style={{ padding: "26px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "14px 40px" }}
        >
          <span className="mono-label-muted" style={{ fontSize: 11.5 }}>
            Optimizes for
          </span>
          {["Google", "Bing", "ChatGPT", "Perplexity", "Gemini"].map((s) => (
            <span key={s} style={{ fontSize: 18, fontWeight: 600, color: "#5b5b70" }}>
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" aria-labelledby="how-title" className="container" style={{ padding: "88px 24px 40px" }}>
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2 id="how-title" className="h-section">
            Scan. Fix. Get found.
          </h2>
        </div>
        <ol className="grid-3" style={{ marginTop: 44, padding: 0, listStyle: "none" }}>
          {[
            ["Scan your store", "Your catalog syncs on install. Every product, collection, page and article gets checked for missing tags, alt text, schema, broken links and speed problems."],
            ["Fix with AI or templates", "Generate fixes one by one or in bulk, compare them with what’s live, and publish only what you approve. Every save can be rolled back."],
            ["Get found everywhere", "Turn on structured data, publish llms.txt and agents.md, and push changed URLs to search engines with IndexNow and Google’s Indexing API."],
          ].map(([t, b], i) => (
            <li key={t} className="card" style={{ padding: 28 }}>
              <div className="step-num">{i + 1}</div>
              <h3 style={{ margin: "18px 0 8px", fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>{t}</h3>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--color-text-softer)" }}>{b}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        aria-label="Features"
        className="container"
        style={{ padding: "56px 24px 24px", display: "flex", flexDirection: "column", gap: 96 }}
      >
        {/* Page optimization */}
        <div className="split">
          <FeatureText
            eyebrow="Page optimization"
            title="See every issue, ranked by what matters most"
            points={[
              "SEO Health checklist for products, collections, articles, blogs, pages and your home page",
              "AI Optimizer writes title, description, handle and tags for a focus keyword",
              "Changing a URL handle creates the redirect for you",
            ]}
          >
            A real on-page audit for every page type. Each check shows what&rsquo;s wrong and why it matters, and you
            can fix it right there, with a review step before anything goes live.
          </FeatureText>
          <div className="mock-stage">
            <div className="mock" role="img" aria-label="Example audit results">
              <div className="mock-head">
                <span>Audit results</span>
                <span style={{ display: "flex", gap: 6 }}>
                  <span className="pill pill-bad">2 critical</span>
                  <span className="pill pill-warn">2 warnings</span>
                </span>
              </div>
              {AUDIT_ROWS.map((r) => (
                <div key={r.label} className="mock-row" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 500, color: "var(--color-text-body)" }}>{r.label}</div>
                    <div className="mono" style={{ fontSize: 11, color: "var(--color-text-faintest)", marginTop: 2 }}>
                      {r.scope}
                    </div>
                  </div>
                  <span className={`pill pill-${r.tone}`} style={{ fontSize: 11.5 }}>
                    {r.sev}
                  </span>
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      padding: "6px 11px",
                      borderRadius: 8,
                      whiteSpace: "nowrap",
                      border: `1px solid ${r.done ? "#cfe6d6" : "var(--color-primary)"}`,
                      background: r.done ? "#fff" : "var(--color-primary)",
                      color: r.done ? "var(--color-ok)" : "#fff",
                    }}
                  >
                    {r.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEO tags */}
        <div className="split">
          <div className="mock-stage" style={{ order: 0 }}>
            <div className="mock" style={{ padding: 20 }} role="img" aria-label="Meta title before and after, with a search preview">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Meta title</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--color-text-faintest)" }}>
                  Before → After
                </span>
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "var(--color-bad-bg)",
                  color: "#8a2f2a",
                  textDecoration: "line-through",
                  textDecorationColor: "rgba(138,47,42,0.4)",
                }}
              >
                Linen Shirt – My Store
              </div>
              <div style={{ fontSize: 13.5, padding: "10px 12px", borderRadius: 8, background: "var(--color-ok-bg)", color: "#245a38", marginTop: 8 }}>
                Men&rsquo;s Relaxed Linen Shirt – Breathable Summer Button-Down | Northfield
              </div>
              <div className="mono" style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--color-text-faintest)" }}>
                <span>58 / 60 characters</span>
                <span style={{ color: "var(--color-ok)" }}>Good length</span>
              </div>
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--color-border-soft)" }}>
                <div className="mono-label-muted" style={{ fontSize: 10.5, marginBottom: 10 }}>
                  Search preview
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-soft)" }}>northfield.com › products › linen-shirt</div>
                <div style={{ fontSize: 17, color: "#1a0dab", marginTop: 3, lineHeight: 1.3 }}>
                  Men&rsquo;s Relaxed Linen Shirt – Breathable Summer Button-Down | Northfield
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text-soft)", marginTop: 4, lineHeight: 1.5 }}>
                  Lightweight 100% linen shirt with a relaxed fit. Pre-washed for softness, available in six colours. Free
                  returns within 30 days.
                </div>
              </div>
            </div>
          </div>
          <FeatureText
            eyebrow="SEO tags"
            title="Meta titles and descriptions that earn the click"
            points={["Template mode with variables like {Product title}", "AI Generate writes unique tags per item", "CSV import, plus restore points for every save"]}
          >
            Write them with AI, build a template once and apply it across products, collections, pages, blogs and
            articles, or import a CSV you already have. Preview how each one looks in search before you publish.
          </FeatureText>
        </div>

        {/* Alt text */}
        <div className="split">
          <FeatureText eyebrow="Image alt tags" title="Alt text for every image, written from what’s in it">
            The AI looks at each image and writes a specific, accurate description, across products, collections,
            articles, your Files library and images used in your theme. That&rsquo;s better for image search,
            accessibility and AI assistants.
          </FeatureText>
          <div className="mock-stage">
            <div className="mock" role="img" aria-label="Example generated alt text">
              <div className="mock-head">
                <span>Image alt text</span>
                <span className="pill pill-ok">318 generated</span>
              </div>
              {ALT_ROWS.map((a) => (
                <div key={a.alt} className="mock-row" style={{ display: "grid", gridTemplateColumns: "56px minmax(0,1fr)", gap: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 9, background: a.swatch }} />
                  <div style={{ minWidth: 0 }}>
                    <div className="mono" style={{ fontSize: 11, color: "var(--color-bad)", textDecoration: "line-through" }}>
                      alt=&quot;&quot;
                    </div>
                    <div style={{ color: "var(--color-text-body)", marginTop: 3, lineHeight: 1.4 }}>{a.alt}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI discovery */}
        <div className="split">
          <div
            style={{ background: "var(--color-dark)", borderRadius: 20, padding: "clamp(18px,3vw,32px)", display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}
            role="img"
            aria-label="Example llms.txt file and an AI assistant answer citing the store"
          >
            <div className="code-panel">
              <div className="code-panel-head">
                <span>/llms.txt</span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, fontWeight: 600, color: "#7fd19c" }}>● Published</span>
              </div>
              <pre>
                <span className="c-h"># Northfield</span>
                {"\n"}
                <span className="c-q">&gt; Men&rsquo;s and women&rsquo;s linen clothing, made in Portugal.</span>
                {"\n\n"}
                <span className="c-h">## Collections</span>
                {"\n- [Shirts](/collections/shirts): 42 products\n- [Trousers](/collections/trousers): 18 products\n\n"}
                <span className="c-h">## Policies</span>
                {"\n- [Shipping](/policies/shipping)"}
              </pre>
            </div>
            <div style={{ borderRadius: 12, background: "#fff", padding: "14px 16px", marginLeft: "clamp(0px,4vw,32px)" }}>
              <div style={{ fontSize: 12, color: "var(--color-text-faint)", marginBottom: 6 }}>AI assistant answer</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--color-text-body)" }}>
                Northfield sells relaxed linen shirts in six colours, made in Portugal, with free 30-day returns.
              </div>
              <div
                className="mono"
                style={{ display: "inline-flex", marginTop: 8, fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "var(--color-primary-soft)", color: "var(--color-primary)" }}
              >
                Source: northfield.com
              </div>
            </div>
          </div>
          <FeatureText
            eyebrow="AI visibility"
            title="Make your store readable to AI assistants"
            points={["llms.txt and agents.md generated from your real catalog", "IndexNow pushes changed URLs to Bing and other engines", "Outreach tracker for AI directories and data sources"]}
          >
            Publish <code className="inline-code">llms.txt</code> and <code className="inline-code">agents.md</code>, a
            clean, structured summary of your store, and manage <code className="inline-code">robots.txt</code> rules so
            the right crawlers, including AI crawlers, can reach it.
          </FeatureText>
        </div>

        {/* Search appearance */}
        <div className="split">
          <FeatureText
            eyebrow="Search appearance"
            title="Structured data and indexing, handled"
            points={["Seven schema types plus Local Business", "Google Search Console clicks, impressions and top queries", "Robots.txt editor with per-crawler rules"]}
          >
            Switch on JSON-LD for products, collections, articles, breadcrumbs and more, connect Google Search Console,
            and request indexing for new or updated URLs without leaving Shopify.
          </FeatureText>
          <div className="mock-stage">
            <div className="mock" role="img" aria-label="Example structured data settings">
              <div className="mock-head">
                <span>Structured data</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-ok)" }}>
                  <span className="dot" style={{ width: 7, height: 7, background: "#3f8a5a" }} />
                  Search Console connected
                </span>
              </div>
              {SCHEMA_ROWS.map((s) => (
                <div key={s.type} className="mock-row">
                  <span className="mono" style={{ fontSize: 12.5, color: "var(--color-text-body)", flex: 1, minWidth: 0 }}>
                    {s.type}
                  </span>
                  <span className={`pill pill-${s.tone}`}>{s.status}</span>
                </div>
              ))}
              <div className="mock-row" style={{ background: "var(--color-surface-alt)", padding: "14px 18px" }}>
                <span className="mono" style={{ flex: 1, fontSize: 12, color: "var(--color-text-softer)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                  /products/linen-shirt
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 600, padding: "7px 12px", borderRadius: 8, background: "var(--color-primary)", color: "#fff", whiteSpace: "nowrap" }}>
                  Request indexing
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Keywords + performance */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 20 }}>
          <div className="card" style={{ borderRadius: 20, padding: "clamp(22px,3vw,32px)" }}>
            <span className="eyebrow">Keyword research</span>
            <h3 style={{ margin: "12px 0 8px", fontSize: 24, lineHeight: 1.2, letterSpacing: "-0.02em", fontWeight: 600 }}>
              Real keyword data, wired into the optimizer
            </h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--color-text-softer)" }}>
              Volume, competition and intent for any seed keyword. Link a keyword to a page, or turn it into a full
              article draft for your Shopify blog.
            </p>
            <div style={{ marginTop: 22, border: "1px solid var(--color-border-soft)", borderRadius: 12, overflow: "hidden" }} role="img" aria-label="Example keyword research results">
              <div
                className="mono"
                style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 110px 40px", gap: 10, padding: "9px 14px", background: "var(--color-surface-alt)", fontSize: 10.5, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--color-text-faintest)" }}
              >
                <span>Keyword</span>
                <span>Volume</span>
                <span>KD</span>
              </div>
              {KEYWORDS.map((k) => (
                <div key={k.term} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 110px 40px", gap: 10, alignItems: "center", padding: "10px 14px", borderTop: "1px solid #f3f2f8", fontSize: 13.5 }}>
                  <span style={{ color: "var(--color-text-body)", minWidth: 0 }}>{k.term}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ height: 6, borderRadius: 99, background: "var(--color-primary)", width: k.bar }} />
                    <span className="mono" style={{ fontSize: 11.5, color: "var(--color-text-softer)" }}>
                      {k.vol}
                    </span>
                  </span>
                  <span className="mono" style={{ fontSize: 12, color: k.hard ? "var(--color-warn)" : "var(--color-ok)" }}>
                    {k.kd}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ borderRadius: 20, padding: "clamp(22px,3vw,32px)" }}>
            <span className="eyebrow">Store performance</span>
            <h3 style={{ margin: "12px 0 8px", fontSize: 24, lineHeight: 1.2, letterSpacing: "-0.02em", fontWeight: 600 }}>
              PageSpeed audits, in plain language
            </h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--color-text-softer)" }}>
              Google PageSpeed Insights runs against your home page, a product, a collection and a blog post, with Core
              Web Vitals from real visitors when Google has them.
            </p>
            <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))", gap: 10 }} role="img" aria-label="Example PageSpeed scores">
              {SPEED.map((p) => (
                <div
                  key={p.label}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "14px 6px", border: "1px solid var(--color-border-soft)", borderRadius: 12 }}
                >
                  <Ring score={p.score} warn={p.warn} />
                  <span style={{ fontSize: 11.5, color: "var(--color-text-softer)", textAlign: "center" }}>{p.label}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: "14px 0 0", padding: "12px 14px", borderRadius: 10, background: "var(--color-warn-bg)", fontSize: 13.5, lineHeight: 1.5, color: "#6b4610" }}>
              Your homepage hero image is 2.4 MB. Compressing it would make the page load noticeably faster on mobile.
            </p>
          </div>
        </div>
      </section>

      {/* ALSO INCLUDED */}
      <section aria-label="Also included" className="container" style={{ padding: "72px 24px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,250px),1fr))", gap: 16 }}>
          {[
            ["URL management", "A browsable HTML sitemap, plus broken-link scans that can auto-create redirects for internal links."],
            ["Review before publish", "Every AI change is shown side by side with what’s live. Nothing goes live without your approval."],
            ["Version history", "Every save creates a checkpoint, so you can roll a bulk change back in one step."],
            ["Transparent AI credits", "See the credit cost before you run anything, and your balance at all times. No surprise bills."],
          ].map(([t, b], i) => (
            <div key={t} className={`card${i === 3 ? " card-soft" : ""}`}>
              <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 600, color: i === 3 ? "var(--color-primary-deep)" : undefined }}>{t}</h3>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: i === 3 ? "var(--color-primary-deep-soft)" : "var(--color-text-softer)" }}>{b}</p>
            </div>
          ))}
        </div>
      </section>

      <PricingSection />

      {/* FAQ */}
      <section aria-labelledby="faq-title" style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border-soft)", borderBottom: "1px solid var(--color-border-soft)" }}>
        <div className="container section" style={{ maxWidth: 820 }}>
          <h2 id="faq-title" className="h-feature" style={{ margin: "0 0 32px", textAlign: "center" }}>
            Questions
          </h2>
          <Faq items={FAQS} />
          <p style={{ margin: "24px 0 0", textAlign: "center", fontSize: 15, color: "var(--color-text-softer)" }}>
            More answers in the <Link href="/docs">documentation</Link> or on the <Link href="/support">support page</Link>.
          </p>
        </div>
      </section>

      {/* WORDPRESS WAITLIST */}
      <section id="waitlist" aria-labelledby="waitlist-title" className="container" style={{ padding: "56px 24px" }}>
        <div
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24, border: "1px solid var(--color-border)", borderRadius: 18, padding: "28px clamp(20px,3vw,32px)" }}
        >
          <div style={{ maxWidth: 480 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
              <span className="dot" style={{ background: "#b9b9c9" }} />
              <span className="mono-label-muted" style={{ fontSize: 11.5 }}>
                Coming soon
              </span>
            </div>
            <h2 id="waitlist-title" style={{ margin: "0 0 6px", fontSize: 19, fontWeight: 600 }}>
              WordPress &amp; WooCommerce
            </h2>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--color-text-softer)" }}>
              Not available today. Join the waitlist and we&rsquo;ll email you when it is.
            </p>
          </div>
          <WaitlistForm />
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 16px 88px" }}>
        <div className="container" style={{ borderRadius: 24, background: "var(--color-primary)", padding: "64px clamp(20px,4vw,40px)", textAlign: "center" }}>
          <h2 className="h-section" style={{ margin: "0 auto", maxWidth: 640, color: "#fff" }}>
            Get found by search engines and by AI.
          </h2>
          <p style={{ margin: "16px auto 0", maxWidth: 520, fontSize: 17, lineHeight: 1.6, color: "var(--color-primary-chip)" }}>
            Install free, run your first audit, and see what your store looks like to both.
          </p>
          <a href={INSTALL_URL} rel="noopener" className="btn btn-white" style={{ marginTop: 30, height: 50, fontSize: 16 }}>
            Install on Shopify
          </a>
        </div>
      </section>
    </>
  );
}
