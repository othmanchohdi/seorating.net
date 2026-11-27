"use client";

import { useId, useState } from "react";
import { WidgetFrame } from "@/components/blog/WidgetFrame";
import type { ImageInfo } from "@/lib/seo/image-meta";
import type { Finding } from "@/lib/seo/types";
import { Findings, LiveUrlForm, findingsBadge, useLiveCheck } from "./LiveUrlForm";

type Result = { url: string; title: string; description: string; image: string | null; imageInfo: ImageInfo | null; siteName: string | null; findings: Finding[] };

const SAMPLE = {
  url: "https://northfield.com/products/relaxed-linen-shirt",
  title: "Relaxed Linen Shirt – Northfield",
  description: "Breathable European linen in a relaxed fit, garment-washed for softness from the first wear. Free returns within 30 days.",
  image: "",
};

const host = (u: string) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
};

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

function ImageBox({ src, ratio = "1.91 / 1" }: { src: string; ratio?: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element -- the visitor's own share image, shown as platforms show it
    <img src={src} alt="" referrerPolicy="no-referrer" style={{ display: "block", width: "100%", aspectRatio: ratio, objectFit: "cover", background: "#e9e9ef" }} />
  ) : (
    <div style={{ aspectRatio: ratio, background: "#e9e9ef", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#8a8a9a" }}>No share image</div>
  );
}

export function SocialPreview() {
  const id = useId();
  const [fields, setFields] = useState(SAMPLE);
  const { status, data, run } = useLiveCheck<Result>("/api/tools/social", (d) => setFields({ url: d.url, title: d.title, description: d.description, image: d.image ?? "" }));

  const set = (k: keyof typeof SAMPLE) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFields({ ...fields, [k]: e.target.value });
  const domain = host(fields.url);

  return (
    <WidgetFrame
      title="Social share preview"
      badge={data && findingsBadge(data.findings)}
      caption="Approximate previews built from your Open Graph and X card tags. Each platform caches previews, so after changing tags re-scrape the URL in its own debugger."
    >
      <LiveUrlForm
        label="Page URL"
        button="Fetch tags"
        loadingLabel="Reading…"
        status={status}
        onSubmit={run}
        placeholder="yourstore.com/products/linen-shirt"
        hint="Fetch a live page, or edit the fields below to draft new tags."
        doneHint={data && `Read the tags on ${data.url}. Edit the fields to try changes.`}
      />

      {data && <Findings items={data.findings} />}

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <div className="field">
          <label htmlFor={`${id}-t`}>Title (og:title) · {fields.title.length}</label>
          <input id={`${id}-t`} value={fields.title} onChange={set("title")} />
        </div>
        <div className="field">
          <label htmlFor={`${id}-i`}>Image URL (og:image)</label>
          <input id={`${id}-i`} value={fields.image} onChange={set("image")} placeholder="https://…/share.jpg" style={{ fontFamily: "var(--font-mono)", fontSize: 13 }} />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${id}-d`}>Description (og:description) · {fields.description.length}</label>
        <textarea id={`${id}-d`} value={fields.description} onChange={set("description")} rows={2} />
      </div>

      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", alignItems: "start" }}>
        <figure style={{ margin: 0, display: "grid", gap: 6 }}>
          <figcaption className="tool-section-title">Facebook</figcaption>
          <div style={{ border: "1px solid #dadde1", background: "#f0f2f5", fontFamily: "Helvetica, Arial, sans-serif" }}>
            <ImageBox src={fields.image} />
            <div style={{ padding: "10px 12px", borderTop: "1px solid #dadde1" }}>
              <div style={{ fontSize: 12, color: "#606770", textTransform: "uppercase" }}>{domain}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#1d2129", lineHeight: 1.25, marginTop: 3 }}>{clip(fields.title, 88)}</div>
              <div style={{ fontSize: 14, color: "#606770", marginTop: 3, lineHeight: 1.35 }}>{clip(fields.description, 110)}</div>
            </div>
          </div>
        </figure>

        <figure style={{ margin: 0, display: "grid", gap: 6 }}>
          <figcaption className="tool-section-title">LinkedIn</figcaption>
          <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, overflow: "hidden", background: "#fff", fontFamily: "-apple-system, system-ui, sans-serif" }}>
            <ImageBox src={fields.image} />
            <div style={{ padding: "10px 12px", background: "#eef3f8" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,.9)", lineHeight: 1.3 }}>{clip(fields.title, 70)}</div>
              <div style={{ fontSize: 12, color: "rgba(0,0,0,.6)", marginTop: 4 }}>{domain}</div>
            </div>
          </div>
        </figure>

        <figure style={{ margin: 0, display: "grid", gap: 6 }}>
          <figcaption className="tool-section-title">X (Twitter)</figcaption>
          <div style={{ position: "relative", border: "1px solid #cfd9de", borderRadius: 16, overflow: "hidden", fontFamily: "-apple-system, system-ui, sans-serif" }}>
            <ImageBox src={fields.image} />
            <span style={{ position: "absolute", left: 10, bottom: 10, background: "rgba(0,0,0,.77)", color: "#fff", fontSize: 13, padding: "1px 6px", borderRadius: 4, maxWidth: "calc(100% - 20px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {clip(fields.title, 70)}
            </span>
          </div>
          <span style={{ fontSize: 13, color: "#536471" }}>From {domain}</span>
        </figure>
      </div>

      {data?.imageInfo?.width && (
        <p className="result-sub" style={{ margin: 0 }}>
          Share image: {data.imageInfo.width}×{data.imageInfo.height}px{data.imageInfo.format ? `, ${data.imageInfo.format.toUpperCase()}` : ""}. Recommended: 1200×630px JPEG or PNG under 5 MB.
        </p>
      )}
    </WidgetFrame>
  );
}
