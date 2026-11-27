"use client";

import { useState } from "react";
import { WidgetFrame } from "@/components/blog/WidgetFrame";
import { shortUrl } from "@/lib/seo/format";
import type { LinkResult, LinkState } from "@/lib/seo/links";
import type { Finding } from "@/lib/seo/types";
import { Findings, LiveUrlForm, findingsBadge, useLiveCheck } from "./LiveUrlForm";

type Result = { url: string; results: LinkResult[]; total: number; checked: number; findings: Finding[] };

const STATE: Record<LinkState, { label: string; tone: "ok" | "warn" | "bad" | undefined }> = {
  broken: { label: "Broken", tone: "bad" },
  blocked: { label: "Couldn’t verify", tone: undefined },
  redirect: { label: "Redirects", tone: "warn" },
  ok: { label: "OK", tone: "ok" },
};

export function BrokenLinkChecker() {
  const { status, data, run } = useLiveCheck<Result>("/api/tools/links");
  const [filter, setFilter] = useState<LinkState | "all">("all");
  const shown = data?.results.filter((r) => filter === "all" || r.state === filter) ?? [];
  const count = (s: LinkState) => data?.results.filter((r) => r.state === s).length ?? 0;

  return (
    <WidgetFrame
      title="Broken link checker"
      badge={data && findingsBadge(data.findings)}
      caption="Checks every link on the page, internal and external, and follows redirects to the final status. Social networks often block automated checks, so those are marked “couldn’t verify”."
    >
      <LiveUrlForm
        label="Page URL"
        button="Find broken links"
        status={status}
        onSubmit={(u) => {
          setFilter("all");
          run(u);
        }}
        placeholder="yourstore.com/pages/about"
        hint={status.kind === "loading" ? "Checking every link. This takes 10 to 40 seconds." : "Checks up to 120 links on one page. Blog posts and policy pages are where broken links usually hide."}
        doneHint={data && `Checked ${data.checked} of ${data.total} links on ${data.url}.`}
      />

      {data && (
        <>
          <Findings items={data.findings} />
          <div className="seg" role="group" aria-label="Filter links">
            {(["all", "broken", "redirect", "blocked", "ok"] as const).map((s) => (
              <button key={s} type="button" aria-pressed={filter === s} onClick={() => setFilter(s)}>
                {s === "all" ? `All ${data.results.length}` : `${STATE[s].label} ${count(s)}`}
              </button>
            ))}
          </div>
          <ul className="result-list">
            {shown.length === 0 && <li className="result-sub">Nothing in this group.</li>}
            {shown.map((r) => (
              <li key={r.url} style={{ alignItems: "center" }}>
                <span className={`pill${STATE[r.state].tone ? ` pill-${STATE[r.state].tone}` : ""}`} style={{ fontSize: 11, flex: "none", minWidth: 42, justifyContent: "center" }}>
                  {r.status ?? "fail"}
                </span>
                <span className="result-main">
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.text || <em>no anchor text</em>}</span>
                  <a href={r.url} target="_blank" rel="noopener nofollow" className="result-url">
                    {shortUrl(r.url)}
                  </a>
                  {r.state === "redirect" && <span className="result-sub">→ {shortUrl(r.finalUrl)}</span>}
                </span>
                <span className="result-sub" style={{ flex: "none" }}>
                  {r.internal ? "Internal" : "External"}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </WidgetFrame>
  );
}
