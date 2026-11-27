"use client";

import { useId, useMemo, useState } from "react";
import { CheckRow, WidgetFrame } from "@/components/blog/WidgetFrame";
import { containsPhrase, countPhrase, tokenize, topPhrases } from "@/lib/seo/keywords";
import type { Finding } from "@/lib/seo/types";
import { LiveUrlForm, useLiveCheck } from "./LiveUrlForm";

type PageText = { url: string; title: string; description: string; h1: string[]; text: string };

const SAMPLE =
  "Our relaxed linen shirt is cut from breathable European linen and garment-washed for softness from the first wear. The linen shirt has a relaxed fit through the body, mother-of-pearl buttons and a single chest pocket. Linen gets softer with every wash, so this shirt only gets better. Pair the linen shirt with chinos for summer evenings or wear it open over a tee at the beach. Machine wash cold and line dry to keep the linen looking its best.";

function keywordFindings(keyword: string, words: string[], page: PageText | null): Finding[] {
  const count = countPhrase(words, keyword);
  const density = words.length ? (count / words.length) * 100 : 0;
  const out: Finding[] = [];
  if (!count) out.push({ tone: "bad", text: `“${keyword}” doesn’t appear in the text.` });
  else if (density > 3) out.push({ tone: "bad", text: `“${keyword}” appears ${count} times (${density.toFixed(1)}%). That reads as keyword stuffing; use variations and synonyms instead.` });
  else if (density > 2) out.push({ tone: "warn", text: `“${keyword}” appears ${count} times (${density.toFixed(1)}%). On the high side; make sure it still reads naturally.` });
  else if (density < 0.3 && words.length > 300) out.push({ tone: "warn", text: `“${keyword}” appears ${count} time${count === 1 ? "" : "s"} (${density.toFixed(2)}%). If it’s the page’s main topic, mention it a little more.` });
  else out.push({ tone: "ok", text: `“${keyword}” appears ${count} time${count === 1 ? "" : "s"} (${density.toFixed(1)}%), a natural amount.` });

  const first = words.slice(0, 100).join(" ");
  out.push(containsPhrase(first, keyword) ? { tone: "ok", text: "Used in the first 100 words." } : { tone: "warn", text: "Not in the first 100 words. Mention the topic early." });
  if (page) {
    out.push(containsPhrase(page.title, keyword) ? { tone: "ok", text: "In the title tag." } : { tone: "warn", text: "Not in the title tag, the strongest on-page signal." });
    out.push(page.h1.some((h) => containsPhrase(h, keyword)) ? { tone: "ok", text: "In the H1." } : { tone: "warn", text: "Not in the H1." });
    out.push(containsPhrase(page.description, keyword) ? { tone: "ok", text: "In the meta description." } : { tone: "warn", text: "Not in the meta description. Google bolds matching words in results." });
    const slug = (() => {
      try {
        return decodeURIComponent(new URL(page.url).pathname).replace(/[-_/]+/g, " ");
      } catch {
        return "";
      }
    })();
    out.push(containsPhrase(slug, keyword) ? { tone: "ok", text: "In the URL." } : { tone: "warn", text: "Not in the URL slug." });
  }
  return out;
}

export function KeywordDensity() {
  const id = useId();
  const [mode, setMode] = useState<"url" | "text">("url");
  const [text, setText] = useState(SAMPLE);
  const [keyword, setKeyword] = useState("linen shirt");
  const [n, setN] = useState<1 | 2 | 3>(1);
  const { status, data, run } = useLiveCheck<PageText>("/api/tools/page-text", (d) => {
    setText(d.text);
    // Suggest the page's top two-word phrase as the keyword to check.
    const top = topPhrases(tokenize(d.text), 2, 1)[0];
    if (top) setKeyword(top.phrase);
  });
  const page = mode === "url" ? data : null;

  const words = useMemo(() => tokenize(text), [text]);
  const phrases = useMemo(() => topPhrases(words, n, 20), [words, n]);
  const maxCount = phrases[0]?.count ?? 1;
  const kw = keyword.trim() ? keywordFindings(keyword.trim(), words, page) : [];
  const minutes = Math.max(1, Math.round(words.length / 230));

  return (
    <WidgetFrame
      title="Keyword density checker"
      badge={
        <span className="seg" role="group" aria-label="Input">
          <button type="button" aria-pressed={mode === "url"} onClick={() => setMode("url")}>
            From a URL
          </button>
          <button type="button" aria-pressed={mode === "text"} onClick={() => setMode("text")}>
            Paste text
          </button>
        </span>
      }
      caption="Density is a sanity check, not a ranking formula: Google doesn’t reward a target percentage. Use it to spot stuffing and to confirm a page is clearly about its topic."
    >
      {mode === "url" ? (
        <LiveUrlForm
          label="Page URL"
          button="Analyse page"
          loadingLabel="Reading…"
          status={status}
          onSubmit={run}
          placeholder="yourstore.com/blogs/news/how-to-wash-linen"
          hint="Reads the page’s main content (not the menu or footer), as a crawler sees it. Sample text is shown until you analyse a page."
          doneHint={data && `Read ${data.url}. Nothing is saved on our end.`}
        />
      ) : (
        <div className="field">
          <label htmlFor={`${id}-text`}>Your text</label>
          <textarea id={`${id}-text`} value={text} onChange={(e) => setText(e.target.value)} rows={7} placeholder="Paste a product description, blog post or page copy" />
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <span className="pill">{words.length.toLocaleString("en-US")} words</span>
        <span className="pill">{new Set(words).size.toLocaleString("en-US")} unique</span>
        <span className="pill">~{minutes} min read</span>
        {words.length < 300 && words.length > 0 && <span className="pill pill-warn">Thin content: under 300 words</span>}
      </div>

      <div className="field">
        <label htmlFor={`${id}-kw`}>Target keyword</label>
        <input id={`${id}-kw`} value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. linen shirt" />
      </div>
      {kw.length > 0 && (
        <div aria-live="polite" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {kw.map((f) => (
            <CheckRow key={f.text} tone={f.tone}>
              {f.text}
            </CheckRow>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span className="tool-section-title">Top phrases</span>
        <span className="seg" role="group" aria-label="Phrase length">
          {([1, 2, 3] as const).map((k) => (
            <button key={k} type="button" aria-pressed={n === k} onClick={() => setN(k)}>
              {k} word{k === 1 ? "" : "s"}
            </button>
          ))}
        </span>
      </div>
      {phrases.length === 0 ? (
        <p className="result-sub" style={{ margin: 0 }}>Not enough text for {n}-word phrases yet.</p>
      ) : (
        <div className="tool-table-wrap">
          <table className="tool-table">
            <thead>
              <tr>
                <th scope="col">Phrase</th>
                <th scope="col">Count</th>
                <th scope="col">Density</th>
              </tr>
            </thead>
            <tbody>
              {phrases.map((p) => (
                <tr key={p.phrase}>
                  <td style={{ width: "55%" }}>
                    <button type="button" onClick={() => setKeyword(p.phrase)} title="Check this phrase" style={{ padding: 0, border: 0, background: "none", font: "inherit", color: "var(--color-text)", cursor: "pointer", textAlign: "left", textDecoration: keyword.trim().toLowerCase() === p.phrase ? "underline" : "none" }}>
                      {p.phrase}
                    </button>
                    <div aria-hidden="true" style={{ height: 3, marginTop: 4, borderRadius: 3, width: `${(p.count / maxCount) * 100}%`, background: p.density > 3 ? "var(--color-bad)" : "var(--color-ok)", opacity: 0.6 }} />
                  </td>
                  <td className="mono">{p.count}</td>
                  <td className="mono" style={{ color: p.density > 3 ? "var(--color-bad)" : undefined }}>
                    {p.density.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <span className="result-sub">Click a phrase to check it as your target keyword. Common words like “the” and “with” are left out.</span>
    </WidgetFrame>
  );
}
