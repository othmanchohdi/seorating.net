"use client";

import { useId, useState } from "react";
import { evaluate } from "./robots";
import { CheckRow, WidgetFrame, type Tone } from "./WidgetFrame";

// The crawl-trap rules from Shopify's default robots.txt (as served in 2026).
const SHOPIFY_DEFAULT_ROBOTS = `User-agent: *
Disallow: /admin
Disallow: /cart/
Disallow: /checkout
Disallow: /checkouts/
Disallow: /orders
Disallow: /account
Disallow: /collections/*sort_by*
Disallow: /*/collections/*sort_by*
Disallow: /collections/*+*
Disallow: /*/collections/*+*
Disallow: /collections/*filter*&*filter*
Disallow: /*/collections/*filter*&*filter*
Disallow: /blogs/*+*
Disallow: /*/blogs/*+*
Disallow: /*?*preview_theme_id=*`;

const TRACKING = /^(utm_\w+|gclid|gbraid|wbraid|fbclid|msclkid|_pos|_sid|_ss|_psq|_v)$/i;

const EXAMPLES = [
  "/collections/shirts/products/linen-shirt",
  "/products/linen-shirt?variant=4211&utm_source=newsletter",
  "/collections/shirts?sort_by=price-ascending",
  "/collections/shirts?filter.v.option.color=Beige&filter.v.option.size=M",
  "/collections/shirts/linen+summer",
  "/en-ca/products/linen-shirt",
  "/collections/shirts?page=2",
];

type Finding = { tone: Tone; text: string };

// Compares two canonical URLs by path + query only, ignoring the domain —
// a live canonical is on the real store's domain, the heuristic one is on
// the fake "yourstore.com" placeholder.
function pathOf(u: string): string {
  try {
    const p = new URL(u);
    return (p.pathname.replace(/\/+$/, "") || "/") + p.search;
  } catch {
    return u;
  }
}

function inspect(input: string) {
  let url: URL;
  try {
    url = new URL(input.trim() || "/", "https://yourstore.com");
  } catch {
    return null;
  }
  const findings: Finding[] = [];
  let path = url.pathname.replace(/\/+$/, "") || "/";
  const params = new URLSearchParams(url.search);
  const kept = new URLSearchParams();

  const locale = path.match(/^\/([a-z]{2}(?:-[a-z]{2})?)(?=\/)/i);
  const rest = locale ? path.slice(locale[0].length) : path;
  if (locale) {
    findings.push({
      tone: "ok",
      text: `/${locale[1]} is a Shopify Markets or language URL. It keeps its own canonical and is linked to the other versions with hreflang tags.`,
    });
  }

  const nested = rest.match(/^\/collections\/[^/]+\/products\/([^/]+)$/);
  if (nested) {
    path = `${locale ? locale[0] : ""}/products/${nested[1]}`;
    findings.push({
      tone: "warn",
      text: "Collection-scoped product URL. It shows the same product as /products/…, so the canonical points there. Internal links should use the short URL too.",
    });
  }

  const tagPage = rest.match(/^\/collections\/[^/]+\/([^/]+)$/);
  if (tagPage && !nested) {
    findings.push(
      tagPage[1].includes("+")
        ? { tone: "bad", text: "Multiple tags joined with +. Shopify’s default robots.txt blocks these combinations to stop endless near-duplicates." }
        : { tone: "warn", text: "Tag-filtered collection. It’s crawlable and often thin; give it unique copy or keep it out of internal links." },
    );
  }

  for (const [key, value] of params) {
    if (key === "variant") {
      findings.push({ tone: "ok", text: "?variant= selects an option on the same product page, so it shares the product’s canonical." });
    } else if (TRACKING.test(key)) {
      findings.push({ tone: "ok", text: `${key} is a tracking parameter. The canonical leaves it out.` });
    } else if (key === "sort_by") {
      findings.push({ tone: "bad", text: "sort_by only reorders the same products. Blocked by Shopify’s default robots.txt." });
    } else if (key.startsWith("filter.")) {
      findings.push({ tone: "warn", text: `${key} is a storefront filter. The canonical points to the unfiltered collection.` });
    } else if (key === "page") {
      kept.set(key, value);
      findings.push({ tone: "ok", text: "Paginated pages should each keep their own canonical rather than pointing to page 1. Check that your theme does." });
    } else {
      findings.push({ tone: "warn", text: `Unknown parameter “${key}”. Check whether it changes the content; if not, it shouldn’t be in links.` });
    }
  }
  const filters = [...params.keys()].filter((k) => k.startsWith("filter."));
  if (filters.length > 1) {
    findings.push({ tone: "bad", text: "Two or more filters combined. Shopify’s default robots.txt blocks these." });
  }

  const robots = evaluate(SHOPIFY_DEFAULT_ROBOTS, "Googlebot", url.pathname + url.search);
  const canonical = `https://yourstore.com${path}${kept.size ? `?${kept}` : ""}`;
  const isCanonical = canonical === `https://yourstore.com${url.pathname.replace(/\/+$/, "") || "/"}${url.search}`;
  if (!findings.length) findings.push({ tone: "ok", text: "A clean, canonical URL. This is the version to link to and to list in your sitemap." });

  return { canonical, isCanonical, crawlable: robots.allowed, rule: robots.rule, findings };
}

type Live = { host: string; canonical: string | null; robots: string | null; finalUrl: string };
type FetchStatus = { kind: "idle" } | { kind: "loading" } | { kind: "error"; message: string } | { kind: "done"; host: string };

export function CanonicalInspector() {
  const id = useId();
  const [input, setInput] = useState(EXAMPLES[1]);
  const [url, setUrl] = useState("");
  const [live, setLive] = useState<Live | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>({ kind: "idle" });
  const r = inspect(input);

  async function fetchUrl(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = url.trim();
    if (!target || fetchStatus.kind === "loading") return;
    setFetchStatus({ kind: "loading" });
    try {
      const res = await fetch(`/api/url-inspect?url=${encodeURIComponent(target)}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Couldn't read that page.");
      setInput(body.path || "/");
      setLive({ host: body.host, canonical: body.canonical, robots: body.robots, finalUrl: body.finalUrl });
      setFetchStatus({ kind: "done", host: body.host });
    } catch (err) {
      setFetchStatus({ kind: "error", message: err instanceof Error ? err.message : "Couldn't read that page." });
    }
  }

  const liveRobots = live && (live.robots !== null ? evaluate(live.robots, "Googlebot", input) : { allowed: true, rule: null, group: null });
  const canonicalMatches = live && r && live.canonical && pathOf(live.canonical) === pathOf(r.canonical);

  return (
    <WidgetFrame
      title="Shopify URL inspector"
      badge={
        live ? (
          <span className={`pill pill-${liveRobots?.allowed ? "ok" : "bad"}`}>{liveRobots?.allowed ? "Crawlable" : "Not crawled"}</span>
        ) : (
          r &&
          (!r.crawlable ? (
            <span className="pill pill-bad">Not crawled</span>
          ) : (
            <span className={`pill pill-${r.isCanonical ? "ok" : "warn"}`}>{r.isCanonical ? "Canonical" : "Duplicate URL"}</span>
          ))
        )
      }
      caption={
        live
          ? "Showing the real canonical tag and real robots.txt read from the live page above, not a simulation."
          : "Paste a path from your own store or pick an example. Results describe Shopify’s default behaviour; heavily customised themes and apps can change it. Fetch a real URL above for your store’s actual behaviour."
      }
    >
      <form onSubmit={fetchUrl} className="field">
        <label htmlFor={`${id}-fetch`}>Fetch from a live site</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            id={`${id}-fetch`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourstore.com/collections/shirts/products/linen-shirt"
            spellCheck={false}
            style={{ flex: "1 1 280px", fontFamily: "var(--font-mono)", fontSize: 13.5 }}
          />
          <button type="submit" className="btn btn-secondary btn-sm" disabled={fetchStatus.kind === "loading" || !url.trim()}>
            {fetchStatus.kind === "loading" ? "Reading…" : "Check URL"}
          </button>
        </div>
        <span role="status" style={{ fontSize: 12.5, color: fetchStatus.kind === "error" ? "var(--color-bad)" : "var(--color-text-faintest)" }}>
          {fetchStatus.kind === "error"
            ? fetchStatus.message
            : fetchStatus.kind === "done"
              ? `Read ${fetchStatus.host} live. Nothing is saved on our end.`
              : "Works on any store, Shopify or not. Leave empty to explore the examples below instead."}
        </span>
      </form>

      <div className="field">
        <label htmlFor={`${id}-url`}>Store URL or path</label>
        <input
          id={`${id}-url`}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setLive(null);
            setFetchStatus({ kind: "idle" });
          }}
          spellCheck={false}
          style={{ fontFamily: "var(--font-mono)", fontSize: 13.5 }}
        />
      </div>
      <div className="seg" role="group" aria-label="Examples">
        {EXAMPLES.map((e, i) => (
          <button
            key={e}
            type="button"
            aria-pressed={input === e}
            onClick={() => {
              setInput(e);
              setLive(null);
              setFetchStatus({ kind: "idle" });
            }}
          >
            Example {i + 1}
          </button>
        ))}
      </div>

      {r ? (
        <div aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            <div className="stat-tile" style={{ minWidth: 0 }}>
              <div className="stat-tile-label">Canonical URL{live && " (live)"}</div>
              <div className="mono" style={{ fontSize: 12.5, marginTop: 6, overflowWrap: "anywhere", color: "var(--color-primary-deep)" }}>
                {live ? (live.canonical ?? "No canonical tag found") : r.canonical}
              </div>
              {live && live.canonical && (
                <div style={{ fontSize: 11.5, marginTop: 6, color: "var(--color-text-faint)" }}>
                  {canonicalMatches ? "Matches Shopify’s default behaviour." : `Shopify’s default behaviour would point to ${r.canonical}.`}
                </div>
              )}
            </div>
            <div className="stat-tile">
              <div className="stat-tile-label">{live ? "robots.txt (live)" : "Default robots.txt"}</div>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                <span className={`pill pill-${(live ? liveRobots?.allowed : r.crawlable) ? "ok" : "bad"}`} style={{ alignSelf: "flex-start" }}>
                  {(live ? liveRobots?.allowed : r.crawlable) ? "Crawlable" : "Blocked"}
                </span>
                {live
                  ? live.robots === null
                    ? <span style={{ fontSize: 11.5, color: "var(--color-text-faint)" }}>No robots.txt found; everything is allowed.</span>
                    : liveRobots?.rule && (
                        <span className="mono" style={{ fontSize: 11.5, color: "var(--color-text-faint)", overflowWrap: "anywhere" }}>
                          {liveRobots.rule.allow ? "Allow" : "Disallow"}: {liveRobots.rule.pattern}
                        </span>
                      )
                  : r.rule && (
                      <span className="mono" style={{ fontSize: 11.5, color: "var(--color-text-faint)", overflowWrap: "anywhere" }}>
                        {r.rule.allow ? "Allow" : "Disallow"}: {r.rule.pattern}
                      </span>
                    )}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {r.findings.map((f) => (
              <CheckRow key={f.text} tone={f.tone}>
                {f.text}
              </CheckRow>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ margin: 0, color: "var(--color-bad)" }}>That doesn&rsquo;t look like a URL.</p>
      )}
    </WidgetFrame>
  );
}
