"use client";

import { useId, useState } from "react";
import { CheckRow } from "@/components/blog/WidgetFrame";
import type { Finding } from "@/lib/seo/types";

// The "enter a URL, fetch, show status" pattern every live SEO tool shares.

export type LiveStatus = { kind: "idle" } | { kind: "loading" } | { kind: "error"; message: string } | { kind: "done" };

export function useLiveCheck<T>(endpoint: string, onData?: (data: T) => void) {
  const [status, setStatus] = useState<LiveStatus>({ kind: "idle" });
  const [data, setData] = useState<T | null>(null);

  async function run(url: string) {
    const target = url.trim();
    if (!target || status.kind === "loading") return;
    setStatus({ kind: "loading" });
    try {
      const res = await fetch(`${endpoint}?url=${encodeURIComponent(target)}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Couldn't read that page.");
      setData(body as T);
      onData?.(body as T);
      setStatus({ kind: "done" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Couldn't read that page." });
    }
  }

  return { status, data, setData, run };
}

export function LiveUrlForm({
  label,
  placeholder = "yourstore.com",
  button,
  loadingLabel = "Checking…",
  hint,
  doneHint,
  status,
  onSubmit,
  initial = "",
}: {
  label: string;
  placeholder?: string;
  button: string;
  loadingLabel?: string;
  hint: React.ReactNode;
  doneHint?: React.ReactNode;
  status: LiveStatus;
  onSubmit: (url: string) => void;
  initial?: string;
}) {
  const id = useId();
  const [url, setUrl] = useState(initial);
  const loading = status.kind === "loading";
  return (
    <form
      className="field"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(url);
      }}
    >
      <label htmlFor={id}>{label}</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          id={id}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          autoCapitalize="none"
          inputMode="url"
          style={{ flex: "1 1 260px", fontFamily: "var(--font-mono)", fontSize: 13.5 }}
        />
        <button type="submit" className="btn btn-secondary btn-sm" disabled={loading || !url.trim()}>
          {loading ? loadingLabel : button}
        </button>
      </div>
      <span role="status" style={{ fontSize: 12.5, color: status.kind === "error" ? "var(--color-bad)" : "var(--color-text-faintest)" }}>
        {status.kind === "error" ? status.message : status.kind === "done" && doneHint ? doneHint : hint}
      </span>
    </form>
  );
}

// A row of tone-coloured count pills summarising a result.
export function Tally({ items }: { items: { label: string; tone?: "ok" | "warn" | "bad" }[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {items.map((i) => (
        <span key={i.label} className={`pill${i.tone ? ` pill-${i.tone}` : ""}`}>
          {i.label}
        </span>
      ))}
    </div>
  );
}

export const plural = (n: number, word: string, many = `${word}s`) => `${n} ${n === 1 ? word : many}`;

export function Findings({ items }: { items: Finding[] }) {
  return (
    <div aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((f) => (
        <CheckRow key={f.text} tone={f.tone}>
          {f.text}
        </CheckRow>
      ))}
    </div>
  );
}

// Overall badge from a list of findings.
export function findingsBadge(items: Finding[]) {
  const bad = items.filter((f) => f.tone === "bad").length;
  const warn = items.filter((f) => f.tone === "warn").length;
  if (bad) return <span className="pill pill-bad">{plural(bad, "problem")}</span>;
  if (warn) return <span className="pill pill-warn">{plural(warn, "warning")}</span>;
  return <span className="pill pill-ok">Looks good</span>;
}
