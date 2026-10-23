import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--color-border)", background: "#fff" }}>
      <div
        className="container"
        style={{
          padding: "48px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 32,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: "var(--color-primary)" }} />
            <span style={{ fontSize: 15.5, fontWeight: 600 }}>SEO Rating</span>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--color-text-faint)" }}>
            seorating.net — listed on the Shopify App Store as &ldquo;TNS SEO &amp; AI Visibility&rdquo;. A
            product of TheNextSprout.
          </p>
        </div>
        <FooterColumn
          label="Product"
          links={[
            { href: "/#features", label: "Features" },
            { href: "/docs", label: "Documentation" },
            { href: "/#pricing", label: "Pricing" },
          ]}
        />
        <FooterColumn
          label="Company"
          links={[
            { href: "/about", label: "About us" },
            { href: "/contact", label: "Contact us" },
            { href: "mailto:apps@thenextsprout.com", label: "apps@thenextsprout.com" },
          ]}
        />
        <FooterColumn
          label="Legal"
          links={[
            { href: "/terms", label: "Terms of Service" },
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/support", label: "Support" },
            { href: "/data-deletion", label: "Data Deletion" },
          ]}
        />
      </div>
      <div className="container" style={{ padding: "0 24px 40px" }}>
        <span className="mono-label-muted">
          © 2026 TheNextSprout. No ranking or traffic outcomes are guaranteed.
        </span>
      </div>
    </footer>
  );
}

function FooterColumn({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 14 }}>
      <span className="mono-label-muted" style={{ marginBottom: 2 }}>
        {label}
      </span>
      {links.map((link) => (
        <Link key={link.href} href={link.href} style={{ color: "var(--color-ink-soft)" }}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}
