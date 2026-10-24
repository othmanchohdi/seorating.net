import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

function Radar({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <rect width="120" height="120" rx="26.5" fill="#0b1a14" />
      <circle cx="60" cy="60" r="51.9" stroke="#2e3f38" strokeWidth="5.4" fill="none" />
      <circle cx="60" cy="60" r="36.2" stroke="#63766d" strokeWidth="5.2" fill="none" />
      <circle cx="60" cy="60" r="21.25" stroke="#e8fff4" strokeWidth="5.3" fill="none" />
      <circle cx="60" cy="60" r="6" fill="#52f184" />
    </svg>
  );
}

// One template for every social card, so shares look consistent.
export function ogImage({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(160deg, #0b7a55 0%, #075c40 100%)",
          color: "#fff",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -160, top: -160, width: 620, height: 620, borderRadius: 999, border: "2px solid rgba(255,255,255,0.12)", display: "flex" }} />
        <div style={{ position: "absolute", right: -60, top: -60, width: 420, height: 420, borderRadius: 999, border: "2px solid rgba(255,255,255,0.12)", display: "flex" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Radar size={56} />
          <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>SEO Rating</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 980 }}>
          <span style={{ fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: "#c9f2dd" }}>{eyebrow}</span>
          <span style={{ fontSize: title.length > 60 ? 58 : 68, fontWeight: 600, lineHeight: 1.08, letterSpacing: -1.5 }}>{title}</span>
        </div>
        <span style={{ fontSize: 24, color: "#d4f3e4" }}>{footer}</span>
      </div>
    ),
    OG_SIZE,
  );
}
