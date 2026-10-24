import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "SEO Rating: SEO and AI visibility for Shopify stores";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    eyebrow: "Shopify app · SEO + AI search",
    title: "Find your store’s SEO issues. Fix them in a few clicks.",
    footer: "seorating.net · Free plan available",
  });
}
