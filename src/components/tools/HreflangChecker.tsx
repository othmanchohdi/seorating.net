"use client";

import { WidgetFrame } from "@/components/blog/WidgetFrame";
import type { AlternateCheck } from "@/lib/seo/hreflang";
import type { Finding } from "@/lib/seo/types";
import { Findings, LiveUrlForm, findingsBadge, useLiveCheck } from "./LiveUrlForm";

type Result = { page: string; alternates: AlternateCheck[]; findings: Finding[] };

export function HreflangChecker() {
  const { status, data, run } = useLiveCheck<Result>("/api/tools/hreflang");

  return (
    <WidgetFrame
      title="Hreflang checker"
      badge={data && findingsBadge(data.findings)}
      caption="Reads the page’s hreflang tags, validates each language and country code, then opens every alternate to confirm it loads and links back."
    >
      <LiveUrlForm
        label="Page URL"
        button="Check hreflang"
        status={status}
        onSubmit={run}
        hint={status.kind === "loading" ? "Opening every alternate page. This takes 5 to 30 seconds." : "Enter a page from a store that sells in several languages or countries."}
        doneHint={data && `Read ${data.page}. Nothing is saved on our end.`}
      />

      {data && (
        <>
          <Findings items={data.findings} />
          {data.alternates.length > 0 && (
            <div className="tool-table-wrap">
              <table className="tool-table tool-table-wide">
                <thead>
                  <tr>
                    <th scope="col">Code</th>
                    <th scope="col">URL</th>
                    <th scope="col">Loads</th>
                    <th scope="col">Links back</th>
                  </tr>
                </thead>
                <tbody>
                  {data.alternates.map((a, i) => (
                    <tr key={i}>
                      <td>
                        <span className={`pill pill-${a.problem ? "bad" : "ok"}`} style={{ fontSize: 11.5 }}>
                          {a.hreflang}
                        </span>
                        {a.problem && <div className="result-sub" style={{ marginTop: 4, maxWidth: 220 }}>{a.problem}</div>}
                      </td>
                      <td className="mono" style={{ fontSize: 12, wordBreak: "break-all" }}>
                        {a.href}
                        {a.canonical && <div className="result-sub">Canonical points to {a.canonical}</div>}
                      </td>
                      <td>
                        <span className={`pill pill-${a.status === 200 ? "ok" : "bad"}`} style={{ fontSize: 11 }}>
                          {a.status ?? "fail"}
                        </span>
                      </td>
                      <td>
                        <span className={`pill pill-${a.returnLink ? "ok" : "bad"}`} style={{ fontSize: 11 }}>
                          {a.returnLink ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </WidgetFrame>
  );
}
