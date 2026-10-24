// Single source of truth for site-wide facts. Every page, the JSON-LD,
// llms.txt, the RSS feed and the sitemap read from here so they can't drift.

export const SITE_URL = "https://seorating.net";
export const SITE_NAME = "SEO Rating";
export const APP_STORE_NAME = "TNS SEO & AI Visibility";
export const COMPANY_NAME = "TheNextSprout";
export const SUPPORT_EMAIL = "apps@thenextsprout.com";
export const APP_URL = "https://app.seorating.net";

// TODO: replace with the app's exact App Store listing URL once it is live.
export const INSTALL_URL = "https://apps.shopify.com/";

export const SITE_DESCRIPTION =
  "SEO Rating is a Shopify app that audits your store and fixes what holds it back in Google and AI search: meta tags, image alt text, structured data, llms.txt, robots.txt, keyword research and PageSpeed audits.";

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
