"use client";

import { useState } from "react";
import type { Answer, CitationReport } from "@/lib/ai-check/citations";
import { track } from "@/lib/analytics";

type State = { kind: "idle" } | { kind: "running" } | { kind: "done"; report: CitationReport } | { kind: "error"; message: string };

function Verdict({ a }: { a: Answer }) {
  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 6 }}>
      <span className={`pill pill-${a.mentioned ? "ok" : "bad"}`}>{a.mentioned ? "Mentioned" : "Not mentioned"}</span>
      <span className={`pill pill-${a.cited ? "ok" : a.seen ? "warn" : "bad"}`}>{a.cited ? "Cited as a source" : a.seen ? "Seen, not cited" : "Not in sources"}</span>
    </span>
  );
}

export function CitationCheck({ host, brand }: { host: string; brand: string }) {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState({ kind: "running" });
    track("citations_requested");
    try {
      const res = await fetch("/api/ai-check/citations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host, category: form.get("category"), email: form.get("email") }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Something went wrong. Please try again.");
      const report = body as CitationReport;
      const discovery = report.answers.filter((a) => a.kind === "discovery");
      track("citations_viewed", { mentioned: discovery.filter((a) => a.mentioned).length, cited: discovery.filter((a) => a.cited).length });
      setState({ kind: "done", report });
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  const report = state.kind === "done" ? state.report : null;
  const discovery = report?.answers.filter((a) => a.kind === "discovery") ?? [];
  const brandAnswer = report?.answers.find((a) => a.kind === "brand");

  return (
    <section className="report-card" aria-labelledby="citations-title">
      <header className="report-card-head">
        <div>
          <span className="pill pill-ok" style={{ marginBottom: 8 }}>New</span>
          <h2 id="citations-title" style={{ margin: "8px 0 0", fontSize: 19, fontWeight: 600 }}>
            Does Perplexity recommend {brand}?
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "var(--color-text-faint)" }}>
            We ask Perplexity real buyer questions about your category and show whether you&rsquo;re mentioned, cited as a
            source, or missing, and who gets cited instead.
          </p>
        </div>
      </header>
      <div className="report-card-body">
        {!report && (
          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <label htmlFor="cit-category" className="sr-only">
                What do you sell?
              </label>
              <input id="cit-category" name="category" type="text" required minLength={2} maxLength={60} placeholder="What do you sell? e.g. running shoes" style={{ flex: "2 1 220px", minWidth: 0, height: 44 }} />
              <label htmlFor="cit-email" className="sr-only">
                Email address
              </label>
              <input id="cit-email" name="email" type="email" required autoComplete="email" placeholder="you@store.com" style={{ flex: "1 1 180px", minWidth: 0, height: 44 }} />
              <button type="submit" className="btn btn-primary" style={{ height: 44, fontSize: 14.5 }} disabled={state.kind === "running"}>
                {state.kind === "running" ? "Asking Perplexity…" : "Run citation check"}
              </button>
            </div>
            <p role="status" style={{ margin: 0, fontSize: 12.5, color: state.kind === "error" ? "var(--color-bad)" : "var(--color-text-faintest)" }}>
              {state.kind === "running"
                ? "Asking three questions. This takes 10–30 seconds…"
                : state.kind === "error"
                  ? state.message
                  : "Free. Your email goes to our team, who may follow up with advice. No newsletter."}
            </p>
          </form>
        )}

        {report && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
              <div className="stat-tile" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span className="stat-tile-label">Mentioned</span>
                <span className="stat-tile-value">
                  {discovery.filter((a) => a.mentioned).length}/{discovery.length}
                </span>
                <span style={{ fontSize: 12.5, color: "var(--color-text-faint)" }}>buyer questions</span>
              </div>
              <div className="stat-tile" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span className="stat-tile-label">Cited as a source</span>
                <span className="stat-tile-value">
                  {discovery.filter((a) => a.cited).length}/{discovery.length}
                </span>
                <span style={{ fontSize: 12.5, color: "var(--color-text-faint)" }}>buyer questions</span>
              </div>
            </div>

            {report.competitors.length > 0 && (
              <div>
                <h3 className="mono-label-muted" style={{ margin: "0 0 8px", fontSize: 11 }}>
                  Cited instead of you
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {report.competitors.map((c) => (
                    <span key={c.host} className="chip" style={{ textTransform: "none", letterSpacing: 0, fontSize: 12 }}>
                      {c.host}
                      {c.count > 1 ? ` ×${c.count}` : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {[...discovery, ...(brandAnswer ? [brandAnswer] : [])].map((a) => (
              <details key={a.question} className="fix" style={{ marginTop: 0 }} open={a.kind === "discovery" && a === discovery[0]}>
                <summary style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                  <span style={{ flex: "1 1 240px" }}>“{a.question}”</span>
                  <Verdict a={a} />
                </summary>
                <div className="fix-body">
                  <blockquote className="answer-quote">{a.excerpt || "(No answer text returned.)"}</blockquote>
                  {a.sources.length > 0 && (
                    <ul className="source-list">
                      {a.sources.slice(0, 8).map((s) => (
                        <li key={s.url} className={s.host === host.replace(/^www\./, "") || s.host.endsWith(`.${host.replace(/^www\./, "")}`) ? "ours" : undefined}>
                          <span className={`pill pill-${s.cited ? "ok" : "warn"}`} style={{ fontSize: 10.5 }}>{s.cited ? "Cited" : "Seen"}</span>
                          <a href={s.url} target="_blank" rel="noopener nofollow" style={{ overflowWrap: "anywhere" }}>
                            {s.title || s.host}
                          </a>
                          <span style={{ color: "var(--color-text-faintest)" }}>{s.host}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </details>
            ))}

            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: "var(--color-text-faint)" }}>
              AI answers change between runs, users and locations, so treat this as a snapshot. Asked via Perplexity&rsquo;s API
              for “{report.category}”. Results are kept for 24 hours.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
