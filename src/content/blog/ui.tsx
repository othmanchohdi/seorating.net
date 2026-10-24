import Link from "next/link";
import { INSTALL_URL } from "@/lib/site";

// Small building blocks shared by the article bodies.

export function Code({ children }: { children: React.ReactNode }) {
  return <code className="inline-code">{children}</code>;
}

export function CodeBlock({ file, children }: { file: string; children: string }) {
  return (
    <div className="code-panel">
      <div className="code-panel-head">
        <span>{file}</span>
      </div>
      <pre>
        {children.split("\n").map((line, i) => (
          <span key={i} className={line.startsWith("#") ? "c-h" : line.startsWith(">") ? "c-q" : undefined}>
            {line}
            {"\n"}
          </span>
        ))}
      </pre>
    </div>
  );
}

export function Note({ label = "Note", children }: { label?: string; children: React.ReactNode }) {
  return (
    <aside className="callout">
      <span className="callout-label">{label}</span>
      {children}
    </aside>
  );
}

export function AppCta({ title, body }: { title: string; body: string }) {
  return (
    <aside
      style={{
        marginTop: 36,
        padding: 26,
        borderRadius: 16,
        border: "1px solid var(--color-border)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 18,
      }}
    >
      <div style={{ maxWidth: 400 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: "var(--color-ink)", lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontSize: 15, lineHeight: 1.55, color: "var(--color-text-softer)", marginTop: 4 }}>{body}</div>
      </div>
      <a href={INSTALL_URL} rel="noopener" className="btn btn-primary" style={{ height: 44, fontSize: 15, textDecoration: "none" }}>
        Install free
      </a>
    </aside>
  );
}

export function DocsLink({ hash, children }: { hash: string; children: React.ReactNode }) {
  return <Link href={`/docs#${hash}`}>{children}</Link>;
}
