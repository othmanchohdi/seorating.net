"use client";

import { useId, useState } from "react";
import { CheckRow, WidgetFrame } from "./WidgetFrame";

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-");

const HYPE = /\b(best|amazing|world[- ]class|leading|#1|number one|premium quality|unbeatable)\b/i;

export function LlmsTxtBuilder() {
  const id = useId();
  const [name, setName] = useState("Northfield");
  const [summary, setSummary] = useState("Men’s and women’s linen clothing, made in Portugal.");
  const [collections, setCollections] = useState("Shirts: Relaxed and tailored linen shirts\nTrousers: Drawstring and pleated linen trousers\nGift cards");
  const [shipping, setShipping] = useState("Free over $100");
  const [returns, setReturns] = useState("30 days");

  const rows = collections
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [title, ...rest] = l.split(":");
      return { title: title.trim(), desc: rest.join(":").trim() };
    });

  const file = [
    `# ${name || "Your store"}`,
    `> ${summary || "What you sell, and to whom."}`,
    "",
    "## Collections",
    ...rows.map((r) => `- [${r.title}](/collections/${slug(r.title)})${r.desc ? `: ${r.desc}` : ""}`),
    "",
    "## Policies",
    `- [Shipping](/policies/shipping-policy)${shipping ? `: ${shipping}` : ""}`,
    `- [Returns](/policies/refund-policy)${returns ? `: ${returns}` : ""}`,
  ].join("\n");

  const undescribed = rows.filter((r) => !r.desc).map((r) => r.title);
  const checks = [
    summary.trim().length < 20
      ? ({ tone: "bad", text: "Add a one-line summary: what you sell, and to whom." } as const)
      : HYPE.test(summary)
        ? ({ tone: "warn", text: "The summary uses marketing language. Facts an assistant can repeat work better." } as const)
        : ({ tone: "ok", text: "Summary is short and factual." } as const),
    rows.length === 0
      ? ({ tone: "bad", text: "List your main collections." } as const)
      : undescribed.length
        ? ({ tone: "warn", text: `Give ${undescribed.join(", ")} a few words of description.` } as const)
        : ({ tone: "ok", text: `${rows.length} collections, each described.` } as const),
    shipping && returns
      ? ({ tone: "ok", text: "Shipping and returns are stated plainly." } as const)
      : ({ tone: "warn", text: "Add your shipping threshold and returns window." } as const),
  ];

  return (
    <WidgetFrame
      title="llms.txt builder"
      badge={<span className="mono" style={{ fontSize: 11.5, color: "var(--color-text-faintest)" }}>{file.split("\n").length} lines</span>}
      caption="Type your own details and copy the result. Links assume Shopify’s default collection and policy URLs; check that each one opens on your store."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="field">
            <label htmlFor={`${id}-n`}>Store name</label>
            <input id={`${id}-n`} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor={`${id}-s`}>One-line summary</label>
            <input id={`${id}-s`} value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor={`${id}-c`}>Collections (one per line, “Name: description”)</label>
            <textarea id={`${id}-c`} rows={4} value={collections} onChange={(e) => setCollections(e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="field">
              <label htmlFor={`${id}-sh`}>Shipping</label>
              <input id={`${id}-sh`} value={shipping} onChange={(e) => setShipping(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor={`${id}-r`}>Returns</label>
              <input id={`${id}-r`} value={returns} onChange={(e) => setReturns(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
          <div className="code-panel">
            <div className="code-panel-head">
              <span>llms.txt</span>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(file).catch(() => {})}
                style={{ font: "inherit", fontSize: 11.5, color: "#b5ecd2", background: "transparent", border: "1px solid var(--color-dark-border)", borderRadius: 6, padding: "2px 8px", cursor: "pointer" }}
              >
                Copy
              </button>
            </div>
            <pre style={{ fontSize: 12 }}>
              {file.split("\n").map((line, i) => (
                <span key={i} className={line.startsWith("#") ? "c-h" : line.startsWith(">") ? "c-q" : undefined}>
                  {line}
                  {"\n"}
                </span>
              ))}
            </pre>
          </div>
          <div aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {checks.map((c) => (
              <CheckRow key={c.text} tone={c.tone}>
                {c.text}
              </CheckRow>
            ))}
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}
