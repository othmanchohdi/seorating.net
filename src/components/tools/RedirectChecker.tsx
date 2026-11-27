"use client";

import { WidgetFrame } from "@/components/blog/WidgetFrame";
import type { Hop } from "@/lib/ai-check/net";
import type { Variant } from "@/lib/seo/redirects";
import type { Finding, Tone } from "@/lib/seo/types";
import { Findings, LiveUrlForm, findingsBadge, useLiveCheck } from "./LiveUrlForm";

type Result = { url: string; hops: Hop[]; variants: Variant[]; findings: Finding[] };

const LABEL: Record<number, string> = { 200: "OK", 301: "Moved permanently", 302: "Found (temporary)", 303: "See other", 307: "Temporary redirect", 308: "Permanent redirect", 403: "Forbidden", 404: "Not found", 410: "Gone", 429: "Too many requests", 500: "Server error", 503: "Unavailable" };

function hopTone(h: Hop): Tone {
  if (h.status === null || h.status >= 400) return "bad";
  if (h.status === 302 || h.status === 303 || h.status === 307) return "warn";
  return "ok";
}

export function RedirectChecker() {
  const { status, data, run } = useLiveCheck<Result>("/api/tools/redirects");

  return (
    <WidgetFrame
      title="Redirect & status checker"
      badge={data && findingsBadge(data.findings)}
      caption="Follows the URL one hop at a time and shows every status code on the way. For a homepage it also tests the http, https, www and non-www versions."
    >
      <LiveUrlForm
        label="URL"
        button="Trace redirects"
        loadingLabel="Tracing…"
        status={status}
        onSubmit={run}
        placeholder="yourstore.com or http://yourstore.com/old-page"
        hint="Enter a full URL to trace it, or just a domain to also test every http/https and www variant."
      />

      {data && (
        <>
          <Findings items={data.findings} />
          <span className="tool-section-title">Redirect chain</span>
          <ol className="result-list" style={{ maxHeight: "none" }}>
            {data.hops.map((h, i) => (
              <li key={i} style={{ alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 12, color: "var(--color-text-faintest)", flex: "none", width: 18 }}>
                  {i + 1}
                </span>
                <span className={`pill pill-${hopTone(h)}`} style={{ fontSize: 11, flex: "none", minWidth: 42, justifyContent: "center" }}>
                  {h.status ?? "fail"}
                </span>
                <span className="result-main">
                  <span className="result-url" style={{ fontSize: 12.5, color: "var(--color-text-soft)", whiteSpace: "normal", wordBreak: "break-all" }}>{h.url}</span>
                  <span className="result-sub">
                    {h.status ? LABEL[h.status] ?? `HTTP ${h.status}` : "No response"}
                    {h.ms > 0 && ` · ${h.ms} ms`}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          {data.variants.length > 0 && (
            <>
              <span className="tool-section-title">Domain variants</span>
              <div className="tool-table-wrap">
                <table className="tool-table tool-table-wide">
                  <thead>
                    <tr>
                      <th scope="col">Typed as</th>
                      <th scope="col">Path</th>
                      <th scope="col">Ends on</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.variants.map((v) => {
                      const last = v.hops[v.hops.length - 1];
                      return (
                        <tr key={v.url}>
                          <td className="mono" style={{ fontSize: 12.5 }}>{v.url.replace(/\/$/, "")}</td>
                          <td>
                            <span style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                              {v.hops.map((h, i) => (
                                <span key={i} className={`pill pill-${hopTone(h)}`} style={{ fontSize: 10.5 }}>
                                  {h.status ?? "fail"}
                                </span>
                              ))}
                            </span>
                          </td>
                          <td className="mono" style={{ fontSize: 12.5, wordBreak: "break-all" }}>{last.status === 200 ? last.url : "–"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </WidgetFrame>
  );
}
