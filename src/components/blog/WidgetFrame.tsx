// Shared chrome for the interactive tools embedded in blog posts: a green
// stage with a white card, matching the product mockups on the home page.
export function WidgetFrame({
  title,
  badge,
  caption,
  children,
}: {
  title: string;
  badge?: React.ReactNode;
  caption?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <figure className="widget" style={{ marginLeft: 0, marginRight: 0 }}>
      <div className="widget-card">
        <div className="mock-head" style={{ flexWrap: "wrap" }}>
          <span>{title}</span>
          {badge}
        </div>
        <div className="widget-body">{children}</div>
      </div>
      {caption && <figcaption className="widget-caption">{caption}</figcaption>}
    </figure>
  );
}

export function ScoreRing({ value, label, size = 112 }: { value: number; label: string; size?: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const color = pct >= 80 ? "#0b7a55" : pct >= 50 ? "#c48a1c" : "#b23a34";
  const inner = Math.round(size * 0.78);
  return (
    <div
      role="img"
      aria-label={`${label}: ${pct} out of 100`}
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `conic-gradient(${color} 0 ${pct}%, #e4efe9 ${pct}% 100%)`,
        transition: "background 0.2s ease",
      }}
    >
      <div
        style={{
          width: inner,
          height: inner,
          borderRadius: 999,
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: size * 0.27, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>{pct}</span>
        <span className="mono" style={{ fontSize: 9.5, color: "var(--color-text-faintest)", marginTop: 4, textTransform: "uppercase" }}>
          {label}
        </span>
      </div>
    </div>
  );
}

export type Tone = "ok" | "warn" | "bad";

export const TONE_COLOR: Record<Tone, string> = {
  ok: "var(--color-ok)",
  warn: "#c48a1c",
  bad: "var(--color-bad)",
};

export function CheckRow({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <div className="check-row">
      <span className="dot" style={{ background: TONE_COLOR[tone] }} aria-hidden="true" />
      <span>
        <span className="sr-only">{tone === "ok" ? "Pass: " : tone === "warn" ? "Warning: " : "Problem: "}</span>
        {children}
      </span>
    </div>
  );
}
