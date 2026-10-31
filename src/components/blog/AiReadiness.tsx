"use client";

import { useState } from "react";
import { ScoreRing, WidgetFrame } from "./WidgetFrame";

// Each item maps to the stage of the answer pipeline it unblocks.
const STAGES = ["Found", "Fetched", "Understood", "Recommended"] as const;
type Stage = (typeof STAGES)[number];

const ITEMS: { key: string; label: string; stage: Stage; weight: number }[] = [
  { key: "indexed", label: "Key pages are indexed in Google and Bing", stage: "Found", weight: 15 },
  { key: "indexnow", label: "Changed pages are pushed with IndexNow", stage: "Found", weight: 5 },
  { key: "robots", label: "AI search crawlers aren’t blocked in robots.txt", stage: "Fetched", weight: 20 },
  { key: "text", label: "Product facts are in page text, not only images", stage: "Understood", weight: 15 },
  { key: "schema", label: "Product, Organization and Breadcrumb schema", stage: "Understood", weight: 15 },
  { key: "meta", label: "Specific meta titles and descriptions", stage: "Understood", weight: 10 },
  { key: "llms", label: "A current llms.txt summarising the store", stage: "Understood", weight: 5 },
  { key: "consistent", label: "Name, policies and facts match everywhere", stage: "Recommended", weight: 10 },
  { key: "reviews", label: "Reviews that shoppers can see, marked up", stage: "Recommended", weight: 5 },
];

export function AiReadiness() {
  const [on, setOn] = useState<Set<string>>(() => new Set(["indexed", "indexnow", "text", "meta"]));
  const toggle = (k: string) => {
    const next = new Set(on);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    setOn(next);
  };

  const score = ITEMS.reduce((s, i) => s + (on.has(i.key) ? i.weight : 0), 0);
  const stageDone = (stage: Stage) => ITEMS.filter((i) => i.stage === stage).every((i) => on.has(i.key));
  // A store only gets as far as the first stage that isn't covered.
  const reached = STAGES.findIndex((s) => !stageDone(s));
  const furthest = reached === -1 ? STAGES.length : reached;

  return (
    <WidgetFrame
      title="AI search readiness"
      badge={<span className={`pill pill-${furthest === STAGES.length ? "ok" : "warn"}`}>{furthest === STAGES.length ? "Ready to be cited" : `Stops at: ${STAGES[furthest]}`}</span>}
      caption="Tick what your store already does. An assistant has to find, fetch and understand a page before it can recommend it, so a gap early in the chain blocks everything after it. The score is a rough guide, not a measurement."
    >
      <ol aria-label="Answer pipeline" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: `repeat(${STAGES.length}, minmax(0,1fr))`, gap: 6, alignItems: "start" }}>
        {STAGES.map((s, i) => {
          const done = i < furthest;
          return (
            <li key={s} style={{ textAlign: "center" }}>
              <div
                style={{
                  height: 8,
                  borderRadius: 99,
                  background: done ? "var(--color-primary)" : i === furthest ? "#f3dfb4" : "#e6ebe8",
                  transition: "background 0.2s ease",
                }}
              />
              <div className="mono" style={{ fontSize: 10.5, marginTop: 6, overflowWrap: "anywhere", color: done ? "var(--color-primary)" : "var(--color-text-faintest)" }}>
                {s}
                <span className="sr-only">{done ? " (covered)" : " (not covered)"}</span>
              </div>
            </li>
          );
        })}
      </ol>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
        <ScoreRing value={score} label="Readiness" size={104} />
        <fieldset style={{ flex: "1 1 280px", border: 0, margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          <legend className="sr-only">Checklist</legend>
          {ITEMS.map((i) => (
            <label key={i.key} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
              <input type="checkbox" checked={on.has(i.key)} onChange={() => toggle(i.key)} />
              <span style={{ flex: 1 }}>{i.label}</span>
              <span className="mono" style={{ fontSize: 10.5, color: "var(--color-text-faintest)", whiteSpace: "nowrap" }}>
                {i.stage}
              </span>
            </label>
          ))}
        </fieldset>
      </div>
    </WidgetFrame>
  );
}
