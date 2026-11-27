"use client";

import { WidgetFrame } from "@/components/blog/WidgetFrame";
import type { Heading } from "@/lib/seo/headings";
import type { Finding } from "@/lib/seo/types";
import { Findings, LiveUrlForm, Tally, findingsBadge, useLiveCheck } from "./LiveUrlForm";

type Result = { url: string; title: string; headings: Heading[]; counts: number[]; findings: Finding[] };

const LEVEL_COLOR = ["#0b7a55", "#2f7448", "#4f6f9a", "#6b5ea8", "#8a6d3b", "#7a7a8c"];

export function HeadingChecker() {
  const { status, data, run } = useLiveCheck<Result>("/api/tools/headings");

  return (
    <WidgetFrame
      title="Heading tags checker"
      badge={data && findingsBadge(data.findings)}
      caption="Reads the H1–H6 tags in the HTML crawlers receive, with no JavaScript run, in the order they appear on the page."
    >
      <LiveUrlForm
        label="Page URL"
        button="Check headings"
        status={status}
        onSubmit={run}
        placeholder="yourstore.com/products/linen-shirt"
        hint="Works on any page: homepage, product, collection or blog post."
        doneHint={data && `Read ${data.url}. Nothing is saved on our end.`}
      />

      {data && (
        <>
          <Tally items={data.counts.map((c, i) => ({ label: `H${i + 1}: ${c}`, tone: i === 0 ? (c === 1 ? "ok" : c === 0 ? "bad" : "warn") : undefined }))} />
          <Findings items={data.findings} />
          {data.headings.length > 0 && (
            <>
              <span className="tool-section-title">Outline</span>
              <ol className="result-list" style={{ maxHeight: 460 }}>
                {data.headings.map((h, i) => (
                  <li key={i} style={{ paddingLeft: 12 + (h.level - 1) * 18, alignItems: "baseline" }}>
                    <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: LEVEL_COLOR[h.level - 1], borderRadius: 5, padding: "1px 6px", flex: "none" }}>
                      H{h.level}
                    </span>
                    <span style={{ minWidth: 0, color: h.text ? undefined : "var(--color-bad)", fontWeight: h.level === 1 ? 600 : 400 }}>
                      {h.text || "(empty heading)"}
                      {h.skipped && (
                        <span className="pill pill-warn" style={{ fontSize: 10.5, marginLeft: 6 }}>
                          skipped a level
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </>
      )}
    </WidgetFrame>
  );
}
