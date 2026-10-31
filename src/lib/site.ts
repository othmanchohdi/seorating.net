// Single source of truth for site-wide facts. Every page, the JSON-LD,
// llms.txt, the RSS feed and the sitemap read from here so they can't drift.

export const SITE_URL = "https://seorating.net";
export const SITE_NAME = "TNS SEO & AI Visibility";
export const SITE_SHORT_NAME = "TNS SEO";
export const COMPANY_NAME = "The Next Sprout";
export const COMPANY_LOCATION = "Monastir, Tunisia";
export const COMPANY_URL = "https://www.thenextsprout.com";
export const INVESTOR_NAME = "1o8 Agency";
export const INVESTOR_URL = "https://www.1o8.agency";
export const SUPPORT_EMAIL = "hello@seorating.net";
export const APP_URL = "https://app.seorating.net";

// Transactional email via Resend. seorating.net is the verified sending domain.
export const EMAIL_FROM = '"TNS SEO & AI Visibility" <hello@seorating.net>';
export const CONTACT_TO = "hello@seorating.net";

// Set to the App Store listing URL once the app is approved. While it is
// null, every "Install" button is hidden and the site points to /contact.
export const INSTALL_URL: string | null = null;

// Legal facts shared by the Terms, Privacy Policy and other policy pages.
export const LEGAL_UPDATED = "October 31, 2026";
export const GOVERNING_LAW = "Tunisia";

export const SITE_DESCRIPTION =
  "TNS SEO & AI Visibility is a Shopify app that audits your store and fixes what holds it back in Google and AI search: meta tags, image alt text, structured data, llms.txt, robots.txt, keyword research and PageSpeed audits.";

export const NAV = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
