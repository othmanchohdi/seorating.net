"use client";

import { useId, useState } from "react";
import { CheckRow, WidgetFrame } from "@/components/blog/WidgetFrame";
import { CopyButton } from "@/components/ai-tools/CopyButton";
import type { Finding } from "@/lib/seo/types";

const FIELDS = [
  { key: "utm_source", label: "Source", hint: "Where the click comes from: facebook, newsletter, google", required: true },
  { key: "utm_medium", label: "Medium", hint: "The channel type: social, email, cpc, influencer", required: true },
  { key: "utm_campaign", label: "Campaign", hint: "The promotion: black-friday-2026, spring-launch", required: true },
  { key: "utm_term", label: "Term", hint: "Paid search keyword (optional)", required: false },
  { key: "utm_content", label: "Content", hint: "Which ad or link: hero-banner, story-2 (optional)", required: false },
] as const;

type Key = (typeof FIELDS)[number]["key"];
type Values = Record<Key, string>;

const EMPTY: Values = { utm_source: "", utm_medium: "", utm_campaign: "", utm_term: "", utm_content: "" };

const PRESETS: Record<string, Partial<Values>> = {
  "Instagram bio": { utm_source: "instagram", utm_medium: "social", utm_content: "bio-link" },
  "Facebook ad": { utm_source: "facebook", utm_medium: "paid-social" },
  "Email newsletter": { utm_source: "newsletter", utm_medium: "email" },
  "Google Ads": { utm_source: "google", utm_medium: "cpc" },
  Influencer: { utm_source: "influencer", utm_medium: "referral" },
};

function build(base: string, values: Values): { url: string | null; findings: Finding[] } {
  const findings: Finding[] = [];
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(base.trim()) ? base.trim() : `https://${base.trim()}`);
    if (!url.hostname.includes(".")) throw new Error();
  } catch {
    return { url: null, findings: [{ tone: "bad", text: "Enter the page you’re linking to, like yourstore.com/collections/sale." }] };
  }
  for (const f of FIELDS) {
    const v = values[f.key].trim();
    if (v) url.searchParams.set(f.key, v);
    else url.searchParams.delete(f.key);
  }
  const missing = FIELDS.filter((f) => f.required && !values[f.key].trim()).map((f) => f.label.toLowerCase());
  if (missing.length) findings.push({ tone: "bad", text: `Add a ${missing.join(", ")}. Analytics groups traffic by source, medium and campaign together.` });
  const all = FIELDS.map((f) => values[f.key]).filter(Boolean);
  if (all.some((v) => /[A-Z]/.test(v))) findings.push({ tone: "warn", text: "Uses capitals. UTM values are case-sensitive, so “Facebook” and “facebook” show up as two sources. Stick to lowercase." });
  if (all.some((v) => /\s/.test(v))) findings.push({ tone: "warn", text: "Contains spaces, which become %20 in the link. Use hyphens instead." });
  if (url.hostname.endsWith("myshopify.com")) findings.push({ tone: "warn", text: "Links to your myshopify.com address. Use your real domain so the visit isn’t split across two hosts." });
  if (!findings.length) findings.push({ tone: "ok", text: "Ready to use. The tags show up in GA4 under Traffic acquisition and in Shopify’s sessions reports." });
  return { url: url.toString(), findings };
}

export function UtmBuilder() {
  const id = useId();
  const [base, setBase] = useState("yourstore.com/collections/sale");
  const [values, setValues] = useState<Values>({ ...EMPTY, utm_source: "newsletter", utm_medium: "email", utm_campaign: "black-friday-2026" });
  const { url, findings } = build(base, values);

  return (
    <WidgetFrame title="UTM link builder" caption="Everything runs in your browser. Nothing is sent or saved.">
      <div className="field">
        <label htmlFor={`${id}-base`}>Page URL</label>
        <input id={`${id}-base`} value={base} onChange={(e) => setBase(e.target.value)} spellCheck={false} style={{ fontFamily: "var(--font-mono)", fontSize: 13.5 }} />
      </div>
      <div className="seg" role="group" aria-label="Presets" style={{ flexWrap: "wrap" }}>
        {Object.entries(PRESETS).map(([name, p]) => (
          <button key={name} type="button" onClick={() => setValues({ ...values, utm_term: "", utm_content: "", ...p })}>
            {name}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {FIELDS.map((f) => (
          <div key={f.key} className="field">
            <label htmlFor={`${id}-${f.key}`}>
              {f.label} <span className="mono" style={{ fontWeight: 400, fontSize: 11, color: "var(--color-text-faintest)" }}>{f.key}</span>
            </label>
            <input id={`${id}-${f.key}`} value={values[f.key]} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} placeholder={f.hint} />
          </div>
        ))}
      </div>
      <div className="code-panel">
        <div className="code-panel-head">
          <span>Your link</span>
          {url && <CopyButton text={url} />}
        </div>
        <pre style={{ wordBreak: "break-all" }}>
          <code>{url ?? "–"}</code>
        </pre>
      </div>
      <div aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {findings.map((f) => (
          <CheckRow key={f.text} tone={f.tone}>
            {f.text}
          </CheckRow>
        ))}
      </div>
    </WidgetFrame>
  );
}

// ---------- Slug builder ----------

const SLUG_STOP = new Set("a an and the of for to in on at by with from or is are our your my".split(" "));

export function toSlug(title: string, { dropStopWords = true, maxWords = 0 } = {}) {
  let words = title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  if (dropStopWords && words.length > 3) words = words.filter((w, i) => i === 0 || !SLUG_STOP.has(w));
  if (maxWords) words = words.slice(0, maxWords);
  return words.join("-");
}

const TYPES = { Product: "/products/", Collection: "/collections/", "Blog post": "/blogs/news/", Page: "/pages/" } as const;

export function SlugBuilder() {
  const id = useId();
  const [title, setTitle] = useState("The Relaxed Linen Shirt for Men – Natural Beige (2026 Edition)");
  const [type, setType] = useState<keyof typeof TYPES>("Product");
  const [dropStop, setDropStop] = useState(true);
  const [maxWords, setMaxWords] = useState(6);
  const [domain, setDomain] = useState("yourstore.com");
  const slug = toSlug(title, { dropStopWords: dropStop, maxWords });
  const full = `https://${domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "") || "yourstore.com"}${TYPES[type]}${slug}`;

  const findings: Finding[] = [];
  if (!slug) findings.push({ tone: "bad", text: "Enter a title to build a slug from." });
  else {
    if (slug.length > 60) findings.push({ tone: "warn", text: `${slug.length} characters. Shorter slugs are easier to read and share; aim for 3–6 words.` });
    else findings.push({ tone: "ok", text: `${slug.length} characters, ${slug.split("-").length} words.` });
    if (/\d{4}/.test(slug)) findings.push({ tone: "warn", text: "Contains a year. You’ll want to reuse this URL next year, and changing a slug later needs a redirect." });
  }
  findings.push({ tone: "ok", text: "Lowercase letters, numbers and hyphens only, the safest characters for URLs. Accents are converted." });

  return (
    <WidgetFrame
      title="Slug builder"
      badge={
        <span className="seg" role="group" aria-label="Page type">
          {(Object.keys(TYPES) as (keyof typeof TYPES)[]).map((t) => (
            <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)}>
              {t}
            </button>
          ))}
        </span>
      }
      caption="In Shopify the slug is the “URL handle” under Search engine listing. Changing it on a live page breaks old links unless you tick “Create a URL redirect”."
    >
      <div className="field">
        <label htmlFor={`${id}-title`}>Title</label>
        <input id={`${id}-title`} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "end" }}>
        <div className="field" style={{ flex: "1 1 200px" }}>
          <label htmlFor={`${id}-domain`}>Domain</label>
          <input id={`${id}-domain`} value={domain} onChange={(e) => setDomain(e.target.value)} spellCheck={false} style={{ fontFamily: "var(--font-mono)", fontSize: 13.5 }} />
        </div>
        <div className="field" style={{ flex: "0 1 160px" }}>
          <label htmlFor={`${id}-max`}>Max words: {maxWords || "no limit"}</label>
          <input id={`${id}-max`} type="range" min={0} max={10} value={maxWords} onChange={(e) => setMaxWords(Number(e.target.value))} />
        </div>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, paddingBottom: 8 }}>
          <input type="checkbox" checked={dropStop} onChange={(e) => setDropStop(e.target.checked)} />
          Drop filler words
        </label>
      </div>
      <div className="code-panel">
        <div className="code-panel-head">
          <span>Handle</span>
          {slug && <CopyButton text={slug} />}
        </div>
        <pre>
          <code>{slug || "–"}</code>
        </pre>
      </div>
      <span className="result-url" style={{ whiteSpace: "normal", wordBreak: "break-all", fontSize: 12.5 }}>{full}</span>
      <div aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {findings.map((f) => (
          <CheckRow key={f.text} tone={f.tone}>
            {f.text}
          </CheckRow>
        ))}
      </div>
    </WidgetFrame>
  );
}
