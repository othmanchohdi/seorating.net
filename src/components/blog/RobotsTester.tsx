"use client";

import { useId, useState } from "react";
import { evaluate } from "./robots";
import { WidgetFrame } from "./WidgetFrame";

const SAMPLE = `User-agent: *
Disallow: /cart/
Disallow: /checkout
Disallow: /account
Disallow: /collections/*sort_by*
Disallow: /wholesale

User-agent: GPTBot
Disallow: /

User-agent: OAI-SearchBot
Allow: /

Sitemap: https://yourstore.com/sitemap.xml`;

const AGENTS = ["Googlebot", "Bingbot", "OAI-SearchBot", "GPTBot", "PerplexityBot", "ClaudeBot", "Claude-SearchBot"];
const PATHS = ["/products/linen-shirt", "/collections/shirts?sort_by=price-ascending", "/wholesale", "/checkout", "/pages/about"];

export function RobotsTester() {
  const id = useId();
  const [text, setText] = useState(SAMPLE);
  const [agent, setAgent] = useState("OAI-SearchBot");
  const [path, setPath] = useState("/wholesale");
  const result = evaluate(text, agent, path.startsWith("/") ? path : `/${path}`);

  return (
    <WidgetFrame
      title="robots.txt tester"
      badge={<span className={`pill pill-${result.allowed ? "ok" : "bad"}`}>{result.allowed ? "Allowed" : "Blocked"}</span>}
      caption={
        <>
          Try <strong>OAI-SearchBot</strong> on <code className="inline-code">/wholesale</code>: it&rsquo;s allowed, because a crawler
          with its own group ignores every rule under <code className="inline-code">User-agent: *</code>. Edit the file to see how
          rules interact.
        </>
      }
    >
      <div className="field">
        <label htmlFor={`${id}-file`}>robots.txt</label>
        <textarea
          id={`${id}-file`}
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.6 }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        <div className="field">
          <label htmlFor={`${id}-agent`}>Crawler</label>
          <select id={`${id}-agent`} value={agent} onChange={(e) => setAgent(e.target.value)} style={{ height: 44, padding: "0 10px" }}>
            {AGENTS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${id}-path`}>Path</label>
          <input id={`${id}-path`} value={path} onChange={(e) => setPath(e.target.value)} list={`${id}-paths`} spellCheck={false} />
          <datalist id={`${id}-paths`}>
            {PATHS.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>
      </div>

      <div
        aria-live="polite"
        style={{
          borderRadius: 12,
          padding: "14px 16px",
          background: result.allowed ? "var(--color-ok-bg)" : "var(--color-bad-bg)",
          color: result.allowed ? "#245a38" : "#8a2f2a",
          fontSize: 14,
        }}
      >
        <strong>
          {agent} {result.allowed ? "may crawl" : "is asked not to crawl"} {path || "/"}.
        </strong>{" "}
        {result.group === null
          ? "No group applies to this crawler, so everything is allowed."
          : `It follows the "User-agent: ${result.group}" group${result.group !== "*" ? " and ignores the * group" : ""}. `}
        {result.group !== null &&
          (result.rule ? (
            <>
              Deciding rule, line {result.rule.line}:{" "}
              <code className="inline-code">
                {result.rule.allow ? "Allow" : "Disallow"}: {result.rule.pattern}
              </code>
            </>
          ) : (
            "No rule matches this path, so it's allowed."
          ))}
      </div>
    </WidgetFrame>
  );
}
