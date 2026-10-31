"use client";

import { useId, useState } from "react";
import { CheckRow, ScoreRing, WidgetFrame, type Tone } from "./WidgetFrame";

const PRESETS = {
  Empty: "",
  Filename: "IMG_4021_final-2.jpg",
  Stuffed: "linen shirt linen shirts mens linen shirt best linen",
  Vague: "Image of shirt",
  Good: "Beige relaxed-fit linen shirt with mother-of-pearl buttons, laid flat",
};

type Check = { tone: Tone; text: string };

function check(alt: string): Check[] {
  const text = alt.trim();
  if (!text) {
    return [{ tone: "bad", text: "No alt text. A screen reader will skip the image or read the file name. Leave it empty only for decorative images." }];
  }
  const words = text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
  const counts = new Map<string, number>();
  for (const w of words) if (w.length > 3) counts.set(w, (counts.get(w) ?? 0) + 1);
  const repeated = [...counts].filter(([, n]) => n >= 3).map(([w]) => w);
  const looksLikeFile = /\.(jpe?g|png|webp|gif|avif)$/i.test(text) || (/^[\w-]+$/.test(text) && /[_\d]/.test(text));

  return [
    looksLikeFile
      ? { tone: "bad", text: "Looks like a file name, not a description." }
      : { tone: "ok", text: "Written as a description, not a file name." },
    /^(an? )?(image|picture|photo|graphic) of\b/i.test(text)
      ? { tone: "warn", text: "Starts with “image of”. Screen readers already announce images, so cut it." }
      : { tone: "ok", text: "Doesn’t repeat “image of”." },
    repeated.length
      ? { tone: "bad", text: `“${repeated[0]}” appears ${counts.get(repeated[0])} times. That reads as keyword stuffing.` }
      : { tone: "ok", text: "No repeated keywords." },
    words.length < 4
      ? { tone: "warn", text: "Very short. Add what’s shown: colour, material, angle or detail." }
      : { tone: "ok", text: "Includes enough detail to picture the product." },
    text.length > 150
      ? { tone: "warn", text: `${text.length} characters. Long alt text is tiring to listen to; aim for one clear sentence.` }
      : { tone: "ok", text: `${text.length} characters: one concise sentence.` },
  ];
}

const SCORE: Record<Tone, number> = { ok: 20, warn: 10, bad: 0 };

export function AltTextChecker() {
  const id = useId();
  const [alt, setAlt] = useState(PRESETS.Stuffed);
  const results = check(alt);
  // Any outright problem caps the score, so one serious mistake can't hide behind passes.
  const raw = alt.trim() ? results.reduce((s, r) => s + SCORE[r.tone], 0) : 0;
  const score = results.some((r) => r.tone === "bad") ? Math.min(raw, 40) : raw;

  return (
    <WidgetFrame
      title="Alt text checker"
      badge={
        <span className="seg" role="group" aria-label="Examples">
          {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((k) => (
            <button key={k} type="button" aria-pressed={alt === PRESETS[k]} onClick={() => setAlt(PRESETS[k])}>
              {k}
            </button>
          ))}
        </span>
      }
      caption="These checks catch the common mistakes. Only a person looking at the image can confirm the description is actually right."
    >
      <div className="field">
        <label htmlFor={`${id}-alt`}>Alt text for a product photo</label>
        <input id={`${id}-alt`} value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image" />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
        <ScoreRing value={score} label="Alt score" size={104} />
        <div aria-live="polite" style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: 8 }}>
          {results.map((r) => (
            <CheckRow key={r.text} tone={r.tone}>
              {r.text}
            </CheckRow>
          ))}
        </div>
      </div>
      <div className="mono" style={{ fontSize: 12.5, color: "var(--color-text-faint)", borderTop: "1px solid var(--color-border-soft)", paddingTop: 12 }}>
        Screen reader: &ldquo;{alt.trim() || "IMG_4021_final-2.jpg"}, image&rdquo;
      </div>
    </WidgetFrame>
  );
}
