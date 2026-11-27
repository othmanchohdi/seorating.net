import Link from "next/link";
import { CanonicalInspector } from "@/components/blog/CanonicalInspector";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/shopify-url-inspector";

export const metadata = pageMetadata({
  title: "Shopify URL & Canonical Inspector",
  description: "Fetch a live URL to see its real canonical tag and real robots.txt rules, or explore a path against Shopify's default behaviour. Free, no signup.",
  path: PATH,
});

const FAQS = [
  {
    q: "What does \"Fetch from a live site\" actually check?",
    a: "It reads the canonical tag your page currently sends and fetches your store's actual robots.txt, the same way a search crawler sees them, no JavaScript run. That's ground truth for your store, not a simulation of Shopify's defaults.",
  },
  {
    q: "Where do Shopify's duplicate URLs come from?",
    a: "Collection-scoped product URLs (/collections/x/products/y), sort and filter parameters, tag pages, and tracking or campaign parameters all produce multiple addresses for the same content. Shopify's canonical_url Liquid object and default robots.txt handle most of it automatically.",
  },
  {
    q: "Is a canonical tag enough, or do internal links matter too?",
    a: "Google treats the canonical tag as a strong hint, not a command. It also weighs which URL your internal links point to and which one is in your sitemap. When those signals disagree with the tag, Google can pick a different URL than the one you declared.",
  },
  {
    q: "The example paths show Shopify's default behaviour. What if I've customised my theme or robots.txt?",
    a: "Customised themes and apps can change canonical tags and crawl rules, so the example paths (with no live fetch) show what Shopify ships out of the box, not a guarantee for your store. Fetch your real URL above to see what your store actually does, or confirm in Search Console's URL Inspection.",
  },
];

export default function ShopifyUrlInspector() {
  return (
    <ToolPage
      path={PATH}
      name="Shopify URL inspector"
      title="Shopify URL &amp; canonical inspector"
      lead="Fetch a real URL to see its actual canonical tag and actual robots.txt rules, or paste a path to see how Shopify behaves by default."
      faqs={FAQS}
      widget={<CanonicalInspector />}
      guide={
        <>
          <section>
            <h2>What actually needs fixing</h2>
            <ul>
              <li><strong>Internal links to collection-scoped product URLs.</strong> Some themes build product card links with Liquid&rsquo;s <code className="inline-code">within</code> filter, so every collection page links to the duplicate. Link to <code className="inline-code">product.url</code> without <code className="inline-code">within</code> instead.</li>
              <li><strong>Thin tag pages.</strong> A single-tag page is crawlable and usually canonical to itself. If it&rsquo;s just a filtered grid with no copy of its own, it competes with the main collection.</li>
              <li><strong>Campaign links pasted into your own site.</strong> UTM parameters belong on links from emails and ads, not your navigation or blog posts.</li>
              <li><strong>Changed handles without redirects.</strong> Renaming a product handle creates a new URL; keep Shopify&rsquo;s &ldquo;Create a URL redirect&rdquo; option ticked.</li>
            </ul>
          </section>
          <section>
            <h2>How to verify in Search Console</h2>
            <p>
              Run a product URL through URL Inspection and compare the &ldquo;User-declared canonical&rdquo; with the &ldquo;Google-selected canonical&rdquo;: they should match.
              &ldquo;Duplicate, Google chose different canonical than user&rdquo; in the Pages report usually means your internal links or sitemap point somewhere other than your canonical tag.
            </p>
            <p>
              For the full picture, read{" "}
              <Link href="/blog/shopify-duplicate-urls-canonical">duplicate URLs on Shopify, and how canonical tags handle them</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
