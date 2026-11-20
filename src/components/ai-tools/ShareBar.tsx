"use client";

import { CopyButton } from "./CopyButton";
import { track } from "@/lib/analytics";
import { absoluteUrl } from "@/lib/site";

export function ShareBar({ host }: { host: string }) {
  const url = absoluteUrl(`/ai-tools/report/${host}`);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      <CopyButton text={url} label="Copy report link" className="btn btn-secondary btn-sm" onCopied={() => track("report_shared", { method: "copy" })} />
      <a
        className="btn btn-secondary btn-sm"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("report_shared", { method: "linkedin" })}
      >
        Share on LinkedIn
      </a>
    </div>
  );
}
