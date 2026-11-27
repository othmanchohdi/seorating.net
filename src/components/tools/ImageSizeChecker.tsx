"use client";

import { WidgetFrame } from "@/components/blog/WidgetFrame";
import { formatBytes } from "@/lib/seo/format";
import type { ImageResult } from "@/lib/seo/images";
import type { Finding } from "@/lib/seo/types";
import { Findings, LiveUrlForm, Tally, findingsBadge, useLiveCheck } from "./LiveUrlForm";

type Result = { url: string; images: ImageResult[]; totalBytes: number; measured: number; findings: Finding[]; capped: boolean };

const fileName = (src: string) => {
  try {
    return decodeURIComponent(new URL(src).pathname.split("/").pop() || src);
  } catch {
    return src;
  }
};

export function ImageSizeChecker() {
  const { status, data, run } = useLiveCheck<Result>("/api/tools/images");
  const max = Math.max(1, ...(data?.images.map((i) => i.bytes ?? 0) ?? [1]));

  return (
    <WidgetFrame
      title="Image size checker"
      badge={data && findingsBadge(data.findings)}
      caption="Downloads each image the way a browser would (WebP or AVIF where the CDN supports it) and reads its real size and dimensions. Heaviest first."
    >
      <LiveUrlForm
        label="Page URL"
        button="Check images"
        loadingLabel="Measuring…"
        status={status}
        onSubmit={run}
        placeholder="yourstore.com/products/linen-shirt"
        hint={status.kind === "loading" ? "Measuring every image. This takes 5 to 20 seconds." : "Checks up to 40 images from the page’s HTML. Images added later by JavaScript aren’t included."}
        doneHint={data && `Measured ${data.measured} of ${data.images.length} images on ${data.url}${data.capped ? " (the first 40)" : ""}.`}
      />

      {data && (
        <>
          <Tally
            items={[
              { label: `${formatBytes(data.totalBytes)} total`, tone: data.totalBytes > 3 * 1048576 ? "bad" : data.totalBytes > 1.5 * 1048576 ? "warn" : "ok" },
              { label: `${data.images.filter((i) => i.tone === "bad").length} to fix`, tone: data.images.some((i) => i.tone === "bad") ? "bad" : "ok" },
              { label: `${data.images.filter((i) => i.tone === "warn").length} to improve`, tone: data.images.some((i) => i.tone === "warn") ? "warn" : "ok" },
            ]}
          />
          <Findings items={data.findings} />
          {data.images.length > 0 && (
            <ul className="result-list">
              {data.images.map((img) => (
                <li key={img.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary third-party images, not ours to optimise */}
                  <img src={img.src} alt="" loading="lazy" referrerPolicy="no-referrer" width={48} height={48} style={{ objectFit: "cover", borderRadius: 6, flex: "none", background: "var(--color-border-soft)" }} />
                  <span className="result-main">
                    <span style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
                      <strong className="mono" style={{ fontSize: 13.5 }}>{img.bytes !== null ? formatBytes(img.bytes) : "size unknown"}</strong>
                      <span className="result-sub">
                        {[img.format?.toUpperCase(), img.width && img.height ? `${img.width}×${img.height}px` : null].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    <span aria-hidden="true" style={{ height: 4, borderRadius: 4, background: "var(--color-border-soft)", overflow: "hidden" }}>
                      <span style={{ display: "block", height: "100%", width: `${((img.bytes ?? 0) / max) * 100}%`, background: img.tone === "bad" ? "var(--color-bad)" : img.tone === "warn" ? "#c48a1c" : "var(--color-ok)" }} />
                    </span>
                    {img.issues.map((t) => (
                      <span key={t} className="result-sub">
                        {t}
                      </span>
                    ))}
                    <span className="result-url">{fileName(img.src)}</span>
                  </span>
                  <span className={`pill pill-${img.tone}`} style={{ fontSize: 11, flex: "none" }}>
                    {img.tone === "ok" ? "Good" : img.tone === "warn" ? "Improve" : "Fix"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </WidgetFrame>
  );
}
