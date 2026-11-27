"use client";

import { useId, useState } from "react";
import { CheckRow, ScoreRing, WidgetFrame, type Tone } from "./WidgetFrame";

const SAMPLE = `# Northfield

> Men's and women's linen clothing, made in Portugal.

## Main pages
- [Shirts](https://northfield.com/collections/shirts)
- [Trousers](https://northfield.com/collections/trousers)

## Policies
- [Shipping](https://northfield.com/policies/shipping-policy): Free over $100
- [Returns](https://northfield.com/policies/refund-policy): 30 days`;

const SHOPIFY_DEFAULT = /Universal Commerce Protocol|shop\.com\/SKILL\.md|\/\.well-known\/ucp/i;

type Check = { tone: Tone; text: string };

function evaluate(text: string): { checks: Check[]; score: number; shopifyDefault: boolean } {
  const trimmed = text.trim();
  const shopifyDefault = SHOPIFY_DEFAULT.test(trimmed);
  const hasTitle = /^#\s+\S/m.test(trimmed);
  const hasSummary = /^>\s*\S/m.test(trimmed);
  const links = (trimmed.match(/\]\(https?:\/\/[^)]+\)/g) ?? []).length;

  if (!trimmed) {
    return { checks: [{ tone: "bad", text: "Nothing to check yet." }], score: 0, shopifyDefault: false };
  }

  const checks: Check[] = [
    hasTitle ? { tone: "ok", text: "Has a # title line." } : { tone: "bad", text: "No # title line. This should be your site or store name." },
    hasSummary
      ? { tone: "ok", text: "Has a > summary line." }
      : { tone: "bad", text: "No > summary line: one or two plain sentences on what you sell and who it's for." },
    links > 0
      ? { tone: "ok", text: `${links} link${links === 1 ? "" : "s"} to key pages.` }
      : { tone: "warn", text: "No links found. An llms.txt with no links is just a title." },
  ];
  if (shopifyDefault) {
    checks.unshift({
      tone: "warn",
      text: "This is Shopify's default llms.txt: it tells AI shopping agents how to search and check out, but doesn't say what the store sells.",
    });
  }

  const score = shopifyDefault ? 40 : Math.round(((hasTitle ? 1 : 0) + (hasSummary ? 1 : 0) + (links > 0 ? 1 : 0)) * (100 / 3));
  return { checks, score, shopifyDefault };
}

type FetchStatus = { kind: "idle" } | { kind: "loading" } | { kind: "error"; message: string } | { kind: "done"; host: string };

export function LlmsChecker() {
  const id = useId();
  const [text, setText] = useState(SAMPLE);
  const [url, setUrl] = useState("");
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>({ kind: "idle" });
  const result = evaluate(text);

  async function fetchLlms(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = url.trim();
    if (!target || fetchStatus.kind === "loading") return;
    setFetchStatus({ kind: "loading" });
    try {
      const res = await fetch(`/api/llms-fetch?url=${encodeURIComponent(target)}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Couldn't fetch that llms.txt.");
      setText(body.text);
      setFetchStatus({ kind: "done", host: body.host });
    } catch (err) {
      setFetchStatus({ kind: "error", message: err instanceof Error ? err.message : "Couldn't fetch that llms.txt." });
    }
  }

  return (
    <WidgetFrame
      title="llms.txt checker"
      badge={<span className={`pill pill-${result.score >= 80 ? "ok" : result.score >= 40 ? "warn" : "bad"}`}>{result.score}/100</span>}
      caption="Checks the llmstxt.org format: a title, a summary and links to key pages. It can't tell you whether any assistant actually reads the file."
    >
      <form onSubmit={fetchLlms} className="field">
        <label htmlFor={`${id}-url`}>Fetch from a live site</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            id={`${id}-url`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourstore.com"
            spellCheck={false}
            style={{ flex: "1 1 220px", fontFamily: "var(--font-mono)", fontSize: 13.5 }}
          />
          <button type="submit" className="btn btn-secondary btn-sm" disabled={fetchStatus.kind === "loading" || !url.trim()}>
            {fetchStatus.kind === "loading" ? "Fetching…" : "Fetch llms.txt"}
          </button>
        </div>
        <span role="status" style={{ fontSize: 12.5, color: fetchStatus.kind === "error" ? "var(--color-bad)" : "var(--color-text-faintest)" }}>
          {fetchStatus.kind === "error"
            ? fetchStatus.message
            : fetchStatus.kind === "done"
              ? `Loaded ${fetchStatus.host}/llms.txt below.`
              : "Enter a domain to pull its live llms.txt into the box below. Nothing is saved on our end."}
        </span>
      </form>

      <div className="field">
        <label htmlFor={`${id}-file`}>llms.txt</label>
        <textarea
          id={`${id}-file`}
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.6 }}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
        <ScoreRing value={result.score} label="Format" size={92} />
        <div aria-live="polite" style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: 8 }}>
          {result.checks.map((c) => (
            <CheckRow key={c.text} tone={c.tone}>
              {c.text}
            </CheckRow>
          ))}
        </div>
      </div>
    </WidgetFrame>
  );
}
