"use client";

import { useState } from "react";
import Link from "next/link";
import type { CheckReport } from "@/lib/ai-check";
import { CheckRow, ScoreRing, WidgetFrame } from "./blog/WidgetFrame";
import { INSTALL_URL } from "@/lib/site";

type State = { kind: "idle" } | { kind: "loading"; site: string } | { kind: "done"; report: CheckReport } | { kind: "error"; message: string };

const verdict = (score: number) =>
  score >= 80
    ? { tone: "ok", text: "AI-ready" }
    : score >= 50
      ? { tone: "warn", text: "Partly visible" }
      : { tone: "bad", text: "Hard for AI to read" };

function GroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mono-label-muted" style={{ margin: "4px 0 0", fontSize: 11 }}>
      {children}
    </h3>
  );
}

export function AiVisibilityChecker() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const site = (new FormData(e.currentTarget).get("site") as string).trim();
    if (!site) return;
    setState({ kind: "loading", site });
    try {
      const res = await fetch("/api/ai-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: site }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Something went wrong. Please try again.");
      setState({ kind: "done", report: body as CheckReport });
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  const report = state.kind === "done" ? state.report : null;
  const v = report && verdict(report.score);

  return (
    <WidgetFrame
      title="AI visibility checker"
      badge={v ? <span className={`pill pill-${v.tone}`}>{v.text}</span> : <span className="pill pill-ok">Free</span>}
      caption="We fetch your homepage, robots.txt, llms.txt, agents.md and sitemap the way an AI crawler would. Nothing is stored, and the score is a guide to what assistants can read, not a guarantee of being cited."
    >
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <label htmlFor="ai-check-site" className="sr-only">
          Website address
        </label>
        <input
          id="ai-check-site"
          name="site"
          type="text"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          spellCheck={false}
          required
          placeholder="yourstore.com"
          style={{ flex: "1 1 220px", minWidth: 0, height: 46, fontSize: 15.5 }}
        />
        <button type="submit" className="btn btn-primary" style={{ height: 46, fontSize: 15 }} disabled={state.kind === "loading"}>
          {state.kind === "loading" ? "Checking…" : "Check my site"}
        </button>
      </form>

      <div role="status" aria-live="polite">
        {state.kind === "loading" && (
          <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-faint)" }}>Reading {state.site} like an AI crawler. This takes a few seconds…</p>
        )}
        {state.kind === "error" && <p style={{ margin: 0, fontSize: 14, color: "var(--color-bad)" }}>{state.message}</p>}
      </div>

      {report && v && (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
            <ScoreRing value={report.score} label="AI score" size={112} />
            <div style={{ flex: "1 1 240px" }}>
              <p className="mono" style={{ margin: 0, fontSize: 12, color: "var(--color-text-faintest)", overflowWrap: "anywhere" }}>
                {report.url}
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 15, lineHeight: 1.55 }}>
                {[...report.files, ...report.page].filter((c) => c.tone !== "ok").length === 0
                  ? "Every check passed. AI assistants can find, read and understand this site."
                  : `${[...report.files, ...report.page].filter((c) => c.tone === "bad").length} problems and ${[...report.files, ...report.page].filter((c) => c.tone === "warn").length} warnings found. Each one below says what to fix.`}
              </p>
            </div>
          </div>

          <GroupTitle>AI crawler access</GroupTitle>
          <div style={{ overflowX: "auto" }}>
            <table className="credit-table" style={{ width: "100%", fontSize: 13.5 }}>
              <thead>
                <tr>
                  <th scope="col">Crawler</th>
                  <th scope="col">Used for</th>
                  <th scope="col">Homepage</th>
                </tr>
              </thead>
              <tbody>
                {report.bots.map((b) => (
                  <tr key={b.name}>
                    <td>
                      <span className="mono" style={{ fontSize: 12.5 }}>{b.name}</span>
                      <span style={{ display: "block", fontSize: 12, color: "var(--color-text-faintest)" }}>{b.owner}</span>
                    </td>
                    <td>{b.purpose}</td>
                    <td>
                      <span className={`pill pill-${b.allowed === false ? "bad" : "ok"}`}>
                        {b.allowed === false ? "Blocked" : b.allowed === null ? "No rules" : "Allowed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <GroupTitle>AI files</GroupTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {report.files.map((c) => (
              <CheckRow key={c.id} tone={c.tone}>
                <strong>{c.label}:</strong> {c.detail}
              </CheckRow>
            ))}
          </div>

          <GroupTitle>Homepage signals</GroupTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {report.page.map((c) => (
              <CheckRow key={c.id} tone={c.tone}>
                <strong>{c.label}:</strong> {c.detail}
              </CheckRow>
            ))}
          </div>

          <ReviewForm site={report.url} score={report.score} />
        </>
      )}
    </WidgetFrame>
  );
}

type ReviewStatus = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

function ReviewForm({ site, score }: { site: string; score: number }) {
  const [status, setStatus] = useState<ReviewStatus>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = (new FormData(e.currentTarget).get("email") as string).trim();
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/ai-check/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, site, score }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      setStatus({ kind: "sent" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  return (
    <div className="card card-soft" style={{ padding: 18, borderRadius: 12 }}>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--color-primary-deep)" }}>Want help fixing these?</p>
      <p style={{ margin: "6px 0 12px", fontSize: 14, lineHeight: 1.55, color: "var(--color-text-softer)" }}>
        Get a free review of {site.replace(/^https?:\/\//, "")} from our team: what to fix first, and what {INSTALL_URL ? "the app" : "SEO Rating"} can fix
        for you on Shopify.{" "}
        {INSTALL_URL ? (
          <a href={INSTALL_URL} rel="noopener">Or install the app free.</a>
        ) : (
          <Link href="/#features">See what the app does.</Link>
        )}
      </p>
      {status.kind === "sent" ? (
        <p role="status" style={{ margin: 0, fontSize: 14, color: "var(--color-ok)" }}>
          Thanks! We&rsquo;ll reply within 1 business day.
        </p>
      ) : (
        <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <label htmlFor="ai-check-email" className="sr-only">
            Email address
          </label>
          <input
            id="ai-check-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@store.com"
            style={{ flex: "1 1 200px", minWidth: 0, height: 44 }}
          />
          <button type="submit" className="btn btn-dark" style={{ height: 44, fontSize: 14.5 }} disabled={status.kind === "sending"}>
            {status.kind === "sending" ? "Sending…" : "Get my free review"}
          </button>
          {status.kind === "error" && (
            <span role="status" style={{ flexBasis: "100%", fontSize: 12.5, color: "var(--color-bad)" }}>
              {status.message}
            </span>
          )}
        </form>
      )}
    </div>
  );
}
