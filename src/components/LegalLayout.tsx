export type LegalSection = { id: string; label: string };

export function LegalLayout({
  eyebrow = "Legal",
  title,
  lastUpdated,
  sections,
  children,
}: {
  eyebrow?: string;
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
  children: React.ReactNode;
}) {
  return (
    <div className="container container-narrow" style={{ padding: "64px 24px 96px" }}>
      <span className="mono-label">{eyebrow}</span>
      <h1 style={{ margin: "14px 0 0", fontSize: 44, lineHeight: 1.06, letterSpacing: "-0.03em", fontWeight: 600 }}>
        {title}
      </h1>
      <p style={{ margin: "14px 0 0", fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--color-text-faintest)" }}>
        Last updated: {lastUpdated}
      </p>

      <div className="legal-grid" style={{ marginTop: 48 }}>
        <nav className="legal-toc">
          <span className="mono-label-muted" style={{ marginBottom: 2 }}>
            On this page
          </span>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} style={{ color: "var(--color-ink-soft)", lineHeight: 1.4 }}>
              {s.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>{children}</div>
      </div>
    </div>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id}>
      <h2 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em" }}>{title}</h2>
      {children}
    </div>
  );
}
