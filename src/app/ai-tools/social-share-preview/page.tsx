import Link from "next/link";
import { SocialPreview } from "@/components/tools/SocialPreview";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/social-share-preview";

export const metadata = pageMetadata({
  title: "Open Graph Checker & Social Share Preview (Free)",
  description: "See how any link looks when shared on Facebook, LinkedIn and X. Checks og:title, og:description, og:image size and Twitter card tags, and lets you draft new ones. Free.",
  path: PATH,
});

const FAQS = [
  {
    q: "What size should a share image be?",
    a: "1200×630 pixels (a 1.91:1 ratio) works on Facebook, LinkedIn and X. Keep important text away from the edges, since some apps crop to a square, and keep the file under 5 MB as JPEG or PNG.",
  },
  {
    q: "I changed my tags but the old preview still shows. Why?",
    a: "Platforms cache previews for days or weeks. Re-scrape the URL in Facebook's Sharing Debugger or LinkedIn's Post Inspector to refresh it. X refreshes on its own after a while.",
  },
  {
    q: "Where does Shopify set these tags?",
    a: "Most themes generate og:title, og:description and og:image from the page's SEO title, meta description and featured image, in a snippet usually called social-meta-tags.liquid. The homepage share image is set in Online Store → Preferences.",
  },
];

export default function SocialSharePreviewPage() {
  return (
    <ToolPage
      path={PATH}
      name="social share preview"
      title="Social share preview"
      lead="See how a link will look when shared on Facebook, LinkedIn and X, check the Open Graph tags and share image behind it, and draft better ones."
      faqs={FAQS}
      widget={<SocialPreview />}
      guide={
        <>
          <section>
            <h2>A good share preview</h2>
            <ul>
              <li>
                <strong>A title that reads well on its own</strong>, under about 60 characters, without your store name repeated twice.
              </li>
              <li>
                <strong>A description that gives a reason to click</strong>: the offer, the benefit, the price.
              </li>
              <li>
                <strong>A purpose-made image</strong> at 1200×630, not a square product shot that gets cropped.
              </li>
            </ul>
            <p>
              The title and description often match your search snippet too; preview that with the <Link href="/ai-tools/serp-snippet-preview">search snippet preview</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
