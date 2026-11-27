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

// Any outright problem caps the score, so one serious mistake can't hide behind passes.
function scoreOf(alt: string, results: Check[]) {
  const raw = alt.trim() ? results.reduce((s, r) => s + SCORE[r.tone], 0) : 0;
  return results.some((r) => r.tone === "bad") ? Math.min(raw, 40) : raw;
}

type LiveImage = { src: string; alt: string | null };
type Graded = LiveImage & { tone: Tone; score: number; issue: string };
type FetchStatus = { kind: "idle" } | { kind: "loading" } | { kind: "error"; message: string };

function grade(images: LiveImage[]): Graded[] {
  const uses = new Map<string, number>();
  for (const { alt } of images) if (alt?.trim()) uses.set(alt.trim().toLowerCase(), (uses.get(alt.trim().toLowerCase()) ?? 0) + 1);
  return images
    .map((img): Graded => {
      if (img.alt === null) return { ...img, tone: "bad", score: 0, issue: "No alt attribute. Screen readers fall back to the file name." };
      if (!img.alt.trim()) return { ...img, tone: "warn", score: 50, issue: "Empty alt, so it’s treated as decorative. Fine for icons and backgrounds, not for product photos." };
      const results = check(img.alt);
      const score = scoreOf(img.alt, results);
      const worst = results.find((r) => r.tone === "bad") ?? results.find((r) => r.tone === "warn");
      const dupes = uses.get(img.alt.trim().toLowerCase()) ?? 0;
      if (worst) return { ...img, tone: worst.tone, score, issue: worst.text };
      if (dupes > 1) return { ...img, tone: "warn", score: Math.min(score, 80), issue: `Same alt text on ${dupes} images. Say what’s different about each shot.` };
      return { ...img, tone: "ok", score, issue: "Looks good." };
    })
    .sort((a, b) => a.score - b.score);
}

const fileName = (src: string) => {
  try {
    return decodeURIComponent(new URL(src).pathname.split("/").pop() || src);
  } catch {
    return src;
  }
};

export function AltTextChecker() {
  const id = useId();
  const [alt, setAlt] = useState(PRESETS.Stuffed);
  const [url, setUrl] = useState("");
  const [live, setLive] = useState<{ url: string; images: Graded[]; capped: boolean } | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>({ kind: "idle" });
  const results = check(alt);
  const score = scoreOf(alt, results);

  async function fetchUrl(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = url.trim();
    if (!target || fetchStatus.kind === "loading") return;
    setFetchStatus({ kind: "loading" });
    try {
      const res = await fetch(`/api/alt-fetch?url=${encodeURIComponent(target)}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Couldn't read that page.");
      const images = grade(body.images ?? []);
      setLive({ url: body.url, images, capped: !!body.capped });
      const first = images.find((i) => i.alt?.trim());
      if (first) setAlt(first.alt!);
      setFetchStatus({ kind: "idle" });
    } catch (err) {
      setFetchStatus({ kind: "error", message: err instanceof Error ? err.message : "Couldn't read that page." });
    }
  }

  const counts = live && {
    missing: live.images.filter((i) => i.alt === null).length,
    empty: live.images.filter((i) => i.alt !== null && !i.alt.trim()).length,
    problems: live.images.filter((i) => i.alt?.trim() && i.tone !== "ok").length,
    good: live.images.filter((i) => i.tone === "ok").length,
  };

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
      <form onSubmit={fetchUrl} className="field">
        <label htmlFor={`${id}-fetch`}>Check every image on a live page</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            id={`${id}-fetch`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourstore.com/products/linen-shirt"
            spellCheck={false}
            style={{ flex: "1 1 280px", fontFamily: "var(--font-mono)", fontSize: 13.5 }}
          />
          <button type="submit" className="btn btn-secondary btn-sm" disabled={fetchStatus.kind === "loading" || !url.trim()}>
            {fetchStatus.kind === "loading" ? "Reading…" : "Check images"}
          </button>
        </div>
        <span role="status" style={{ fontSize: 12.5, color: fetchStatus.kind === "error" ? "var(--color-bad)" : "var(--color-text-faintest)" }}>
          {fetchStatus.kind === "error"
            ? fetchStatus.message
            : live
              ? `Read ${live.capped ? "the first " : ""}${live.images.length} image${live.images.length === 1 ? "" : "s"} from ${live.url}. Nothing is saved on our end.`
              : "Product pages work best. Works on any site, Shopify or not. Images added later by JavaScript aren’t included, just as many crawlers miss them."}
        </span>
      </form>

      {live && counts && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {live.images.length === 0 ? (
            <CheckRow tone="warn">No images found in the page&rsquo;s HTML. They may be loaded by JavaScript, which crawlers often don&rsquo;t run.</CheckRow>
          ) : (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <span className={`pill pill-${counts.missing ? "bad" : "ok"}`}>{counts.missing} missing alt</span>
                <span className={`pill pill-${counts.problems ? "warn" : "ok"}`}>{counts.problems} to improve</span>
                <span className="pill">{counts.empty} decorative (empty)</span>
                <span className="pill pill-ok">{counts.good} good</span>
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, maxHeight: 360, overflowY: "auto", border: "1px solid var(--color-border-soft)", borderRadius: 10 }}>
                {live.images.map((img) => (
                  <li key={img.src} style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
                    <button
                      type="button"
                      onClick={() => setAlt(img.alt ?? "")}
                      aria-pressed={img.alt !== null && img.alt === alt}
                      style={{ display: "flex", gap: 12, alignItems: "center", width: "100%", padding: "10px 12px", background: "none", border: 0, textAlign: "left", cursor: "pointer", font: "inherit", color: "inherit" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary third-party images, not ours to optimise */}
                      <img src={img.src} alt="" loading="lazy" referrerPolicy="no-referrer" width={44} height={44} style={{ objectFit: "cover", borderRadius: 6, flex: "none", background: "var(--color-border-soft)" }} />
                      <span style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {img.alt === null ? <em>No alt</em> : img.alt.trim() ? img.alt : <em>alt=&quot;&quot;</em>}
                        </span>
                        <span style={{ fontSize: 12.5, color: "var(--color-text-faint)" }}>{img.issue}</span>
                        <span className="mono" style={{ fontSize: 11, color: "var(--color-text-faintest)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {fileName(img.src)}
                        </span>
                      </span>
                      <span className={`pill pill-${img.tone}`} style={{ fontSize: 11, flex: "none" }}>
                        {img.alt === null ? "Missing" : img.alt.trim() ? img.score : "Empty"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <span style={{ fontSize: 12.5, color: "var(--color-text-faintest)" }}>Click an image to see the full breakdown below, or edit its alt text to try a better version.</span>
            </>
          )}
        </div>
      )}

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
