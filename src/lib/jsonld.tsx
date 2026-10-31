import { PLANS } from "./pricing";
import {
  APP_STORE_NAME,
  COMPANY_NAME,
  COMPANY_URL,
  INSTALL_URL,
  INVESTOR_NAME,
  INVESTOR_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SUPPORT_EMAIL,
  absoluteUrl,
} from "./site";

type Json = Record<string, unknown>;

export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const APP_ID = `${SITE_URL}/#app`;

export const organization: Json = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: COMPANY_NAME,
  url: COMPANY_URL,
  funder: { "@type": "Organization", name: INVESTOR_NAME, url: INVESTOR_URL },
  logo: absoluteUrl("/icon.svg"),
  email: SUPPORT_EMAIL,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: SUPPORT_EMAIL,
    availableLanguage: ["English"],
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  },
  location: [
    { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Chicago", addressRegion: "IL", addressCountry: "US" } },
    { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Monastir", addressCountry: "TN" } },
  ],
};

export const website: Json = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  publisher: { "@id": ORG_ID },
  inLanguage: "en",
};

export const softwareApp: Json = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": APP_ID,
  name: SITE_NAME,
  alternateName: APP_STORE_NAME,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "SEO",
  operatingSystem: "Web (Shopify admin)",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  ...(INSTALL_URL && { installUrl: INSTALL_URL }),
  image: absoluteUrl("/opengraph-image"),
  publisher: { "@id": ORG_ID },
  offers: PLANS.map((p) => ({
    "@type": "Offer",
    name: p.name,
    price: p.price.toFixed(2),
    priceCurrency: "USD",
    ...(p.price > 0 && {
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: p.price.toFixed(2),
        priceCurrency: "USD",
        billingDuration: "P30D",
      },
    }),
  })),
  featureList: [
    "Meta title and description generation",
    "AI image alt text",
    "On-page SEO audits and AI content optimizer",
    "JSON-LD structured data and Local Business schema",
    "Google Search Console integration",
    "robots.txt editor",
    "llms.txt and agents.md for AI assistants",
    "IndexNow submissions",
    "HTML sitemap and broken link fixing",
    "Keyword research and AI article generator",
    "Google PageSpeed Insights audits",
  ],
};

export function breadcrumbs(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPage(faqs: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
