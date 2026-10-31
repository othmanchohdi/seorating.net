import Link from "next/link";
import { Logo } from "./Logo";
import { APP_STORE_NAME, COMPANY_NAME, COMPANY_URL, INVESTOR_NAME, INVESTOR_URL, SITE_NAME, SUPPORT_EMAIL } from "@/lib/site";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/docs", label: "Documentation" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact us" },
      { href: "/support", label: "Support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/data-deletion", label: "Data deletion" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Logo size={22} />
            <span style={{ fontSize: 15.5, fontWeight: 600 }}>{SITE_NAME}</span>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--color-text-faint)" }}>
            {SITE_NAME} (&ldquo;{APP_STORE_NAME}&rdquo; on Shopify) is a product of{" "}
            <a href={COMPANY_URL} rel="noopener">{COMPANY_NAME}</a>, with investment partner{" "}
            <a href={INVESTOR_URL} rel="noopener">{INVESTOR_NAME}</a>.
          </p>
          <p style={{ margin: "12px 0 0", fontSize: 14 }}>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} className="footer-col" aria-label={col.title}>
            <span className="mono-label-muted" style={{ marginBottom: 2 }}>
              {col.title}
            </span>
            {col.links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>
          © 2026 {COMPANY_NAME}. All rights reserved. No ranking or traffic outcomes are guaranteed.
        </span>
        <span>Product views shown are illustrative examples.</span>
      </div>
    </footer>
  );
}
