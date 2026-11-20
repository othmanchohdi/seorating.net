"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { Logo } from "./Logo";
import { INSTALL_URL, NAV, SITE_NAME } from "@/lib/site";

function isCurrent(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

// The current-page highlight needs the URL, which isn't known while
// prerendering dynamic routes (like AI reports). Plain links are the fallback.
function NavLinks({ menuRef }: { menuRef?: React.RefObject<HTMLDetailsElement | null> }) {
  const pathname = usePathname();

  // Close the mobile menu after client-side navigation.
  useEffect(() => {
    if (menuRef?.current) menuRef.current.open = false;
  }, [pathname, menuRef]);

  return <Links pathname={pathname} />;
}

function Links({ pathname }: { pathname: string | null }) {
  return NAV.map((item) => (
    <Link key={item.href} href={item.href} aria-current={pathname && isCurrent(pathname, item.href) ? "page" : undefined}>
      {item.label}
    </Link>
  ));
}

export function Header() {
  const menuRef = useRef<HTMLDetailsElement>(null);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand" aria-label={`${SITE_NAME} home`}>
          <Logo size={26} />
          <span className="brand-name">{SITE_NAME}</span>
        </Link>
        <nav className="site-nav" aria-label="Main">
          <Suspense fallback={<Links pathname={null} />}>
            <NavLinks />
          </Suspense>
        </nav>
        <div className="header-spacer" />
        {INSTALL_URL && (
          <a href={INSTALL_URL} className="btn btn-primary btn-sm header-cta" rel="noopener">
            Install on Shopify
          </a>
        )}
        <details className="mobile-menu" ref={menuRef}>
          <summary aria-label="Open menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <nav className="mobile-menu-panel" aria-label="Mobile">
            <Suspense fallback={<Links pathname={null} />}>
              <NavLinks menuRef={menuRef} />
            </Suspense>
            {INSTALL_URL && (
              <a href={INSTALL_URL} className="btn btn-primary btn-sm" rel="noopener">
                Install on Shopify
              </a>
            )}
          </nav>
        </details>
      </div>
    </header>
  );
}
