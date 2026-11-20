import Link from "next/link";
import { KIND_LABEL } from "@/content/ai-crawlers";
import type { BotRow, Check, Group, Summary } from "@/lib/ai-check/checks";
import { TONE_COLOR } from "../blog/WidgetFrame";
import { CodeBlock } from "./CodeBlock";

const TONE_LABEL = { ok: "Pass", warn: "Warning", bad: "Problem" } as const;

export function scoreTone(score: number | null) {
  return score === null ? "muted" : score >= 85 ? "ok" : score >= 60 ? "warn" : "bad";
}

export function SectionCard({ id, title, score, sub, children }: { id: Group; title: string; score?: number | null; sub?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="report-card" aria-labelledby={`${id}-title`}>
      <header className="report-card-head">
        <div>
          <h2 id={`${id}-title`} style={{ margin: 0, fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>
            {title}
          </h2>
          {sub && <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "var(--color-text-faint)", overflowWrap: "anywhere" }}>{sub}</p>}
        </div>
        {score !== undefined && score !== null && <span className={`score-chip score-${scoreTone(score)}`}>{score}</span>}
      </header>
      <div className="report-card-body">{children}</div>
    </section>
  );
}

export function SectionSkeleton({ id, title, note }: { id: Group; title: string; note: string }) {
  return (
    <section id={id} className="report-card" aria-busy="true" aria-labelledby={`${id}-title`}>
      <header className="report-card-head">
        <h2 id={`${id}-title`} style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>
          {title}
        </h2>
        <span className="spinner" aria-hidden="true" />
      </header>
      <div className="report-card-body">
        <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-faint)" }}>{note}</p>
        <div className="skeleton" style={{ width: "92%" }} />
        <div className="skeleton" style={{ width: "78%" }} />
        <div className="skeleton" style={{ width: "85%" }} />
      </div>
    </section>
  );
}

function FixPanel({ check }: { check: Check }) {
  const fix = check.fix!;
  return (
    <details className="fix">
      <summary>{fix.title}</summary>
      <div className="fix-body">
        {fix.steps && (
          <ul>
            {fix.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}
        {fix.code && <CodeBlock label={fix.code.lang} code={fix.code.text} />}
      </div>
    </details>
  );
}

export function CheckList({ checks }: { checks: Check[] }) {
  return (
    <ul className="check-list">
      {checks.map((c) => (
        <li key={c.id} id={`check-${c.id}`} className={`check-item check-${c.tone}`}>
          <span className="dot" style={{ background: TONE_COLOR[c.tone] }} aria-hidden="true" />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px 10px" }}>
              <strong style={{ fontSize: 15 }}>
                <span className="sr-only">{TONE_LABEL[c.tone]}: </span>
                {c.label}
              </strong>
              {c.tone !== "ok" && <span className={`impact impact-${c.impact}`}>{c.impact} impact</span>}
            </div>
            <p style={{ margin: "3px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "var(--color-text-softer)", overflowWrap: "anywhere" }}>{c.detail}</p>
            {c.fix && c.tone !== "ok" && <FixPanel check={c} />}
          </div>
        </li>
      ))}
    </ul>
  );
}

const ROBOTS_PILL = { allowed: ["ok", "Allowed"], blocked: ["bad", "Blocked"], "no-rules": ["ok", "No rules"] } as const;

export function BotTable({ rows }: { rows: BotRow[] }) {
  return (
    <table className="bot-table">
      <thead>
        <tr>
          <th scope="col">Crawler</th>
          <th scope="col">Type</th>
          <th scope="col">robots.txt</th>
          <th scope="col">Firewall</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const [tone, text] = ROBOTS_PILL[r.robots];
          return (
            <tr key={r.name}>
              <td data-label="Crawler">
                <Link href={`/ai-tools/ai-crawlers/${r.slug}`} className="mono" style={{ fontSize: 13 }}>
                  {r.name}
                </Link>
                <span style={{ display: "block", fontSize: 12, color: "var(--color-text-faintest)" }}>{r.owner}</span>
              </td>
              <td data-label="Type">
                {KIND_LABEL[r.kind].short}
                {!r.answers && <span style={{ display: "block", fontSize: 12, color: "var(--color-text-faintest)" }}>Blocking is a choice; doesn&rsquo;t affect citations</span>}
              </td>
              <td data-label="robots.txt">
                <span className={`pill pill-${r.answers || tone === "ok" ? tone : "warn"}`}>{text}</span>
              </td>
              <td data-label="Firewall">
                {r.firewall === null ? (
                  <span style={{ color: "var(--color-text-faintest)" }}>Not tested</span>
                ) : (
                  <span className={`pill pill-${r.firewall === "ok" ? "ok" : "bad"}`}>{r.firewall === "ok" ? "Gets through" : "Rejected"}</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function CategoryBars({ groups }: { groups: Summary["groups"] }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
      {groups.map((g) => (
        <li key={g.group}>
          <a href={`#${g.group}`} style={{ display: "block", color: "inherit", textDecoration: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 5 }}>
              <span>{g.label}</span>
              <span className="mono" style={{ fontSize: 13, color: g.score === null ? "var(--color-text-faintest)" : undefined }}>
                {g.score === null ? "n/a" : g.score}
              </span>
            </div>
            <div className="cat-bar" role="img" aria-label={`${g.label}: ${g.score === null ? "not applicable" : `${g.score} out of 100`}`}>
              <span className={`cat-fill score-${scoreTone(g.score)}`} style={{ width: `${g.score ?? 0}%` }} />
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
