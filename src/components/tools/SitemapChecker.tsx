"use client";

import { WidgetFrame } from "@/components/blog/WidgetFrame";
import { shortUrl } from "@/lib/seo/format";
import type { ChildSitemap, SampleCheck } from "@/lib/seo/sitemap";
import type { Finding } from "@/lib/seo/types";
import { Findings, LiveUrlForm, findingsBadge, useLiveCheck } from "./LiveUrlForm";

type Result = { host: string; robotsDeclared: string[]; root: string | null; isIndex: boolean; children: ChildSitemap[]; totalUrls: number; sample: SampleCheck[]; findings: Finding[] };

const statusTone = (s: SampleCheck) => (s.status === null || (s.status >= 400 && ![401, 403, 429].includes(s.status)) ? "bad" : s.hops > 0 || s.status >= 400 ? "warn" : "ok");

export function SitemapChecker() {
  const { status, data, run } = useLiveCheck<Result>("/api/tools/sitemap");

  return (
    <WidgetFrame
      title="Sitemap checker"
      badge={data && findingsBadge(data.findings)}
      caption="Finds your sitemap through robots.txt (or /sitemap.xml), reads every child sitemap, and test-loads a sample of the URLs it lists."
    >
      <LiveUrlForm
        label="Website"
        button="Check sitemap"
        status={status}
        onSubmit={run}
        hint={status.kind === "loading" ? "Reading the sitemaps and testing sample URLs. This takes 5 to 30 seconds." : "Enter a domain. We find the sitemap ourselves."}
        doneHint={data?.root && `Read ${data.root}. Nothing is saved on our end.`}
      />

      {data && (
        <>
          <Findings items={data.findings} />
          {data.children.length > 0 && (
            <div className="tool-table-wrap">
              <table className="tool-table">
                <thead>
                  <tr>
                    <th scope="col">Sitemap</th>
                    <th scope="col">URLs</th>
                    <th scope="col">Images</th>
                    <th scope="col">Last modified</th>
                  </tr>
                </thead>
                <tbody>
                  {data.children.map((c) => (
                    <tr key={c.url}>
                      <td>
                        <a href={c.url} target="_blank" rel="noopener nofollow" style={{ fontWeight: 600 }}>
                          {c.label}
                        </a>
                        {c.error && <div className="result-sub" style={{ color: c.error.startsWith("Not read") ? undefined : "var(--color-bad)" }}>{c.error}</div>}
                      </td>
                      <td className="mono">{c.error ? "–" : c.urls.toLocaleString("en-US")}</td>
                      <td className="mono">{c.error ? "–" : c.images.toLocaleString("en-US")}</td>
                      <td>{c.error ? "–" : c.urls === 0 ? "–" : c.lastmod >= c.urls ? "All URLs" : c.lastmod ? `${c.lastmod.toLocaleString("en-US")} of ${c.urls.toLocaleString("en-US")}` : "None"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {data.sample.length > 0 && (
            <>
              <span className="tool-section-title">Sample URLs tested</span>
              <ul className="result-list" style={{ maxHeight: 320 }}>
                {data.sample.map((s) => (
                  <li key={s.url} style={{ alignItems: "center" }}>
                    <span className={`pill pill-${statusTone(s)}`} style={{ fontSize: 11, flex: "none", minWidth: 42, justifyContent: "center" }}>
                      {s.status ?? "fail"}
                    </span>
                    <span className="result-main">
                      <span className="result-url" style={{ fontSize: 12.5, color: "var(--color-text-soft)" }}>{shortUrl(s.url)}</span>
                      {s.hops > 0 && <span className="result-sub">Redirects to {shortUrl(s.finalUrl)}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </WidgetFrame>
  );
}
