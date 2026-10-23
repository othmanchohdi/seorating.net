"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/docs", label: "Docs" },
  { href: "/contact", label: "Contact" },
];

const INSTALL_URL = "https://apps.shopify.com/";

export function Header() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div
        className="container"
        style={{ height: 64, display: "flex", alignItems: "center", gap: 28 }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "var(--color-primary)" }} />
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.015em", color: "var(--color-text)" }}>
            SEO Rating
          </span>
        </Link>
        <nav style={{ display: "flex", gap: 22, fontSize: 14.5, fontWeight: 500 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ color: isActive ? "var(--color-text)" : "var(--color-text-softer)" }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ flex: 1 }} />
        <a href={INSTALL_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
          Install on Shopify
        </a>
      </div>
    </header>
  );
}
