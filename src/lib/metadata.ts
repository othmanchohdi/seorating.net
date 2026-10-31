import type { Metadata } from "next";
import { COMPANY_NAME, SITE_NAME } from "./site";

// Next merges metadata shallowly, so a page that sets `openGraph` or
// `alternates` replaces the root's object wholesale. Build the full set here
// so every page gets a canonical URL, Open Graph and RSS discovery.
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}): Metadata {
  const ogTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
      types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: `${SITE_NAME} blog` }] },
    },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: ogTitle,
      description,
      // Articles get their own generated image from blog/[slug]/opengraph-image.
      ...(type === "article"
        ? { publishedTime, modifiedTime, tags, authors: [`${COMPANY_NAME} team`] }
        : { images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE_NAME}: SEO and AI visibility for Shopify` }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      ...(type !== "article" && { images: ["/opengraph-image"] }),
    },
  };
}
