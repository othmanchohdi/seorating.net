"use client";

import { useId, useState } from "react";
import { WidgetFrame, type Tone } from "./WidgetFrame";

// Google's published Core Web Vitals thresholds, assessed at the 75th
// percentile of page loads: https://web.dev/articles/vitals
const METRICS = [
  { key: "lcp", name: "LCP", full: "Largest Contentful Paint", good: 2.5, poor: 4, max: 6, step: 0.1, unit: "s", digits: 1 },
  { key: "inp", name: "INP", full: "Interaction to Next Paint", good: 200, poor: 500, max: 800, step: 10, unit: "ms", digits: 0 },
  { key: "cls", name: "CLS", full: "Cumulative Layout Shift", good: 0.1, poor: 0.25, max: 0.5, step: 0.01, unit: "", digits: 2 },
] as const;

type Key = (typeof METRICS)[number]["key"];

const PRESETS: Record<string, Record<Key, number>> = {
  "Fast theme": { lcp: 1.9, inp: 140, cls: 0.03 },
  "Heavy hero image": { lcp: 4.6, inp: 180, cls: 0.05 },
  "Too many apps": { lcp: 3.1, inp: 420, cls: 0.18 },
};

function rate(value: number, good: number, poor: number): Tone {
  return value <= good ? "ok" : value <= poor ? "warn" : "bad";
}

const LABEL: Record<Tone, string> = { ok: "Good", warn: "Needs improvement", bad: "Poor" };

type Vitals = Record<Key, number | null>;
type Live = { url: string; source: "page" | "origin" | "lab"; score: number | null };
type FetchStatus = { kind: "idle" } | { kind: "loading" } | { kind: "error"; message: string };

const SOURCE: Record<Live["source"], string> = {
  page: "Real Chrome visitors to this exact URL over the last 28 days (75th percentile, mobile).",
  origin: "This URL doesn’t have enough traffic on its own, so these are real Chrome visitors across the whole site over the last 28 days (75th percentile, mobile).",
  lab: "Not enough real-visitor data in Google’s Chrome UX Report, so these come from a single simulated mobile load. INP needs real interactions, so there’s no lab value for it.",
};

export function VitalsMeter() {
  const id = useId();
  const [values, setValues] = useState<Vitals>(PRESETS["Too many apps"]);
  const [url, setUrl] = useState("");
  const [live, setLive] = useState<Live | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>({ kind: "idle" });
  const tones = METRICS.map((m) => (values[m.key] === null ? null : rate(values[m.key]!, m.good, m.poor)));
  const passes = tones.every((t) => t === "ok");

  // Back to manual mode: a metric the live result lacked (lab runs have no INP) starts at its "good" threshold.
  function edit(next: Vitals) {
    setValues(Object.fromEntries(METRICS.map((m) => [m.key, next[m.key] ?? m.good])) as Vitals);
    setLive(null);
    setFetchStatus({ kind: "idle" });
  }

  async function fetchUrl(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = url.trim();
    if (!target || fetchStatus.kind === "loading") return;
    setFetchStatus({ kind: "loading" });
    try {
      const res = await fetch(`/api/web-vitals?url=${encodeURIComponent(target)}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Couldn't test that page.");
      if (body.field) {
        setValues({ lcp: body.field.lcp, inp: body.field.inp, cls: body.field.cls });
        setLive({ url: body.url, source: body.field.scope, score: body.lab?.score ?? null });
      } else if (body.lab) {
        setValues({ lcp: body.lab.lcp, inp: null, cls: body.lab.cls });
        setLive({ url: body.url, source: "lab", score: body.lab.score });
      } else {
        throw new Error("Google returned no Core Web Vitals data for that page.");
      }
      setFetchStatus({ kind: "idle" });
    } catch (err) {
      setFetchStatus({ kind: "error", message: err instanceof Error ? err.message : "Couldn't test that page." });
    }
  }

  const badge =
    live?.source === "lab" ? (
      <span className="pill pill-warn">Lab test only</span>
    ) : (
      <span className={`pill pill-${passes ? "ok" : "bad"}`}>{passes ? "Passes" : "Fails"} Core Web Vitals</span>
    );

  return (
    <WidgetFrame
      title="Core Web Vitals check"
      badge={badge}
      caption={
        live
          ? `${SOURCE[live.source]}${live.score !== null ? ` Lab Performance score: ${live.score}/100.` : ""}`
          : "Check a real page above, or drag the sliders and pick a scenario. A page passes only when all three metrics are good at the 75th percentile of real visits."
      }
    >
      <form onSubmit={fetchUrl} className="field">
        <label htmlFor={`${id}-fetch`}>Check a live page</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            id={`${id}-fetch`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourstore.com"
            spellCheck={false}
            style={{ flex: "1 1 280px", fontFamily: "var(--font-mono)", fontSize: 13.5 }}
          />
          <button type="submit" className="btn btn-secondary btn-sm" disabled={fetchStatus.kind === "loading" || !url.trim()}>
            {fetchStatus.kind === "loading" ? "Testing…" : "Check speed"}
          </button>
        </div>
        <span role="status" style={{ fontSize: 12.5, color: fetchStatus.kind === "error" ? "var(--color-bad)" : "var(--color-text-faintest)" }}>
          {fetchStatus.kind === "error"
            ? fetchStatus.message
            : fetchStatus.kind === "loading"
              ? "Asking Google PageSpeed Insights. This usually takes 10 to 30 seconds."
              : live
                ? `Real data for ${live.url}`
                : "Uses Google’s real-visitor data where the site has enough traffic. Works on any site, Shopify or not."}
        </span>
      </form>

      <div className="seg" role="group" aria-label="Scenarios">
        {Object.entries(PRESETS).map(([name, p]) => (
          <button
            key={name}
            type="button"
            aria-pressed={!live && METRICS.every((m) => values[m.key] === p[m.key])}
            onClick={() => edit(p)}
          >
            {name}
          </button>
        ))}
      </div>

      {METRICS.map((m, i) => {
        const v = values[m.key];
        const tone = tones[i];
        const shown = v ?? 0;
        return (
          <div key={m.key}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <label htmlFor={`${id}-${m.key}`} style={{ fontWeight: 600 }}>
                {m.name} <span style={{ fontWeight: 400, color: "var(--color-text-faint)", fontSize: 13 }}>{m.full}</span>
              </label>
              <span style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                {v === null || tone === null ? (
                  <span className="pill" style={{ fontSize: 11 }}>
                    No data
                  </span>
                ) : (
                  <>
                    <span className="mono" style={{ fontSize: 14, fontWeight: 600 }}>
                      {v.toFixed(m.digits)}
                      {m.unit && ` ${m.unit}`}
                    </span>
                    <span className={`pill pill-${tone}`} style={{ fontSize: 11 }}>
                      {LABEL[tone]}
                    </span>
                  </>
                )}
              </span>
            </div>
            <div className="meter" aria-hidden="true">
              <div style={{ flex: `${(m.good / m.max) * 100} 1 0`, background: "#bfe5cf" }} />
              <div style={{ flex: `${((m.poor - m.good) / m.max) * 100} 1 0`, background: "#f3dfb4" }} />
              <div style={{ flex: `${((m.max - m.poor) / m.max) * 100} 1 0`, background: "#f2c9c6" }} />
              {v !== null && <span className="meter-pin" style={{ left: `${Math.min(100, (v / m.max) * 100)}%` }} />}
            </div>
            <input
              id={`${id}-${m.key}`}
              type="range"
              min={0}
              max={m.max}
              step={m.step}
              value={Math.min(shown, m.max)}
              aria-valuetext={v === null || tone === null ? "No data" : `${v.toFixed(m.digits)} ${m.unit}, ${LABEL[tone]}`}
              onChange={(e) => edit({ ...values, [m.key]: Number(e.target.value) })}
            />
            <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--color-text-faintest)" }}>
              <span>
                good ≤ {m.good}
                {m.unit}
              </span>
              <span>
                poor &gt; {m.poor}
                {m.unit}
              </span>
            </div>
          </div>
        );
      })}
    </WidgetFrame>
  );
}
