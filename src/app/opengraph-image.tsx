import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "TNS SEO & AI Visibility: SEO and AI search for Shopify stores";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    eyebrow: "Shopify app · SEO + AI search",
    title: "Find your store’s SEO issues. Fix them in a few clicks.",
    footer: "seorating.net · Free plan available",
  });
}
