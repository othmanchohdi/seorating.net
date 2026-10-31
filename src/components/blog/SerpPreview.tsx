"use client";

import { useId, useState } from "react";
import { WidgetFrame, type Tone } from "./WidgetFrame";

// Google cuts snippets by rendered width, not character count. These are
// rough Arial widths in ems, good enough to show where a desktop result
// would be cut. Real truncation varies by device and query.
const NARROW = new Set("iljtf.,;:!|'()[] ".split(""));
const WIDE = new Set("mwMW@%".split(""));
function emWidth(text: string) {
  let w = 0;
  for (const ch of text) {
    if (NARROW.has(ch)) w += 0.28;
    else if (WIDE.has(ch)) w += 0.85;
    else if (ch >= "A" && ch <= "Z") w += 0.67;
    else w += 0.55;
  }
  return w;
}

const TITLE_PX = 20;
const TITLE_MAX = 600;
const DESC_PX = 14;
const DESC_MAX = 920; // about two lines on desktop

function truncate(text: string, fontPx: number, maxPx: number) {
  if (emWidth(text) * fontPx <= maxPx) return text;
  let out = "";
  for (const ch of text) {
    if (emWidth(out + ch + "…") * fontPx > maxPx) break;
    out += ch;
  }
  return out.replace(/\s+\S*$/, "") + " …";
}

const PRESETS = {
  before: { title: "Linen Shirt – My Store", desc: "" },
  after: {
    title: "Men’s Relaxed Linen Shirt | Northfield",
    desc: "Lightweight 100% linen shirt with a relaxed fit. Pre-washed for softness, available in six colours. Free returns within 30 days.",
  },
  long: {
    title: "Men’s Relaxed Linen Shirt – Breathable Summer Button-Down Shirt in Six Colours | Northfield Clothing Co.",
    desc: "Our best-selling lightweight 100% European linen shirt with a relaxed fit, pre-washed for softness, available in six colours and sizes XS to XXL, with free shipping on orders over $100 and free returns within 30 days of delivery.",
  },
};

function lengthTone(px: number, max: number, min: number): Tone {
  if (px === 0) return "bad";
  if (px > max) return "warn";
  return px < min ? "warn" : "ok";
}

function Bar({ label, chars, px, max, min }: { label: string; chars: number; px: number; max: number; min: number }) {
  const tone = lengthTone(px, max, min);
  const pct = Math.min(100, (px / max) * 100);
  const note = px === 0 ? "missing" : px > max ? "will be cut" : px < min ? "short" : "fits";
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "4px 10px", fontSize: 12.5, marginBottom: 6 }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span className="mono" style={{ color: "var(--color-text-faint)", whiteSpace: "nowrap" }}>
          {chars} chars · ~{Math.round(px)} / {max}px · <span className={`pill pill-${tone}`} style={{ fontSize: 11 }}>{note}</span>
        </span>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: "#eef1ef", overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 99,
            background: tone === "ok" ? "var(--color-primary)" : tone === "warn" ? "#c48a1c" : "var(--color-bad)",
            transition: "width 0.15s ease",
          }}
        />
      </div>
    </div>
  );
}

export function SerpPreview() {
  const id = useId();
  const [title, setTitle] = useState(PRESETS.after.title);
  const [desc, setDesc] = useState(PRESETS.after.desc);

  const titlePx = emWidth(title) * TITLE_PX;
  const descPx = emWidth(desc) * DESC_PX;
  const shownDesc = desc.trim()
    ? truncate(desc, DESC_PX, DESC_MAX)
    : "Linen Shirt. Sale price $68.00. Size. XS S M L XL. Quantity. Add to cart. You may also like …";

  return (
    <WidgetFrame
      title="Search snippet preview"
      badge={
        <span className="seg" role="group" aria-label="Examples">
          {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={title === PRESETS[k].title && desc === PRESETS[k].desc}
              onClick={() => {
                setTitle(PRESETS[k].title);
                setDesc(PRESETS[k].desc);
              }}
            >
              {k === "before" ? "Before" : k === "after" ? "After" : "Too long"}
            </button>
          ))}
        </span>
      }
      caption="Widths are approximate. Google truncates by pixels and may rewrite your description for some queries, so treat this as a guide, not a guarantee."
    >
      <div className="field">
        <label htmlFor={`${id}-t`}>Meta title</label>
        <input id={`${id}-t`} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor={`${id}-d`}>Meta description</label>
        <textarea id={`${id}-d`} rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Leave empty to see what Google might pick instead" />
      </div>

      <Bar label="Title" chars={title.length} px={titlePx} max={TITLE_MAX} min={200} />
      <Bar label="Description" chars={desc.length} px={descPx} max={DESC_MAX} min={400} />

      <div aria-live="polite" style={{ border: "1px solid var(--color-border-soft)", borderRadius: 12, padding: "14px 16px", fontFamily: "Arial, sans-serif" }}>
        <div style={{ fontSize: 12.5, color: "#4d5156" }}>northfield.com › products › linen-shirt</div>
        <div style={{ fontSize: 19, lineHeight: 1.3, color: "#1a0dab", margin: "4px 0 3px", overflowWrap: "anywhere" }}>
          {truncate(title || "Untitled", TITLE_PX, TITLE_MAX)}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.58, color: desc.trim() ? "#4d5156" : "#9a6a6a", overflowWrap: "anywhere" }}>
          {shownDesc}
        </div>
      </div>
    </WidgetFrame>
  );
}
