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

export function VitalsMeter() {
  const id = useId();
  const [values, setValues] = useState<Record<Key, number>>(PRESETS["Too many apps"]);
  const tones = METRICS.map((m) => rate(values[m.key], m.good, m.poor));
  const passes = tones.every((t) => t === "ok");

  return (
    <WidgetFrame
      title="Core Web Vitals check"
      badge={<span className={`pill pill-${passes ? "ok" : "bad"}`}>{passes ? "Passes" : "Fails"} Core Web Vitals</span>}
      caption="Drag the sliders or pick a scenario. A page passes only when all three metrics are good at the 75th percentile of real visits."
    >
      <div className="seg" role="group" aria-label="Scenarios">
        {Object.entries(PRESETS).map(([name, p]) => (
          <button
            key={name}
            type="button"
            aria-pressed={METRICS.every((m) => values[m.key] === p[m.key])}
            onClick={() => setValues(p)}
          >
            {name}
          </button>
        ))}
      </div>

      {METRICS.map((m, i) => {
        const v = values[m.key];
        const tone = tones[i];
        return (
          <div key={m.key}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <label htmlFor={`${id}-${m.key}`} style={{ fontWeight: 600 }}>
                {m.name} <span style={{ fontWeight: 400, color: "var(--color-text-faint)", fontSize: 13 }}>{m.full}</span>
              </label>
              <span style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                <span className="mono" style={{ fontSize: 14, fontWeight: 600 }}>
                  {v.toFixed(m.digits)}
                  {m.unit && ` ${m.unit}`}
                </span>
                <span className={`pill pill-${tone}`} style={{ fontSize: 11 }}>
                  {LABEL[tone]}
                </span>
              </span>
            </div>
            <div className="meter" aria-hidden="true">
              <div style={{ flex: `${(m.good / m.max) * 100} 1 0`, background: "#bfe5cf" }} />
              <div style={{ flex: `${((m.poor - m.good) / m.max) * 100} 1 0`, background: "#f3dfb4" }} />
              <div style={{ flex: `${((m.max - m.poor) / m.max) * 100} 1 0`, background: "#f2c9c6" }} />
              <span className="meter-pin" style={{ left: `${Math.min(100, (v / m.max) * 100)}%` }} />
            </div>
            <input
              id={`${id}-${m.key}`}
              type="range"
              min={0}
              max={m.max}
              step={m.step}
              value={v}
              aria-valuetext={`${v.toFixed(m.digits)} ${m.unit}, ${LABEL[tone]}`}
              onChange={(e) => setValues({ ...values, [m.key]: Number(e.target.value) })}
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
