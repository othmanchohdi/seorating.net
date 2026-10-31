import Link from "next/link";
import { CanonicalInspector } from "@/components/blog/CanonicalInspector";
import type { Post } from "./types";
import { AppCta, Code, CodeBlock, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        On a Shopify store, one product can be reached at several different addresses. That&rsquo;s by design, and Shopify
        handles most of it well. But when themes, apps or your own links lean on the wrong version, search engines spend
        their time on copies, and the signals that should build up on one page get split across several.
      </p>

      <h2 id="where">Where duplicates come from</h2>
      <p>The same linen shirt might be served at all of these:</p>
      <CodeBlock file="one product, many URLs">{`/products/linen-shirt
/collections/shirts/products/linen-shirt
/collections/sale/products/linen-shirt
/products/linen-shirt?variant=4211
/products/linen-shirt?utm_source=newsletter`}</CodeBlock>
      <p>Collections multiply in the same way:</p>
      <ul>
        <li>
          <strong>Sorting</strong>: <Code>?sort_by=price-ascending</Code> shows the same products in a different order.
        </li>
        <li>
          <strong>Filters</strong>: <Code>?filter.v.option.color=Beige</Code> and friends, which can combine endlessly.
        </li>
        <li>
          <strong>Tag pages</strong>: <Code>/collections/shirts/linen</Code>, and combinations like{" "}
          <Code>/collections/shirts/linen+summer</Code>.
        </li>
        <li>
          <strong>International versions</strong>: <Code>/en-ca/products/linen-shirt</Code> with Shopify Markets or extra
          languages.
        </li>
      </ul>

      <h2 id="canonical">What the canonical tag does</h2>
      <p>
        A canonical tag is a line in the page&rsquo;s head that names the preferred URL for that content. Shopify themes
        output it from the <Code>canonical_url</Code> Liquid object, which points collection-scoped product URLs at the
        plain <Code>/products/</Code> address.
      </p>
      <CodeBlock file="<head> of /collections/shirts/products/linen-shirt">{`<link rel="canonical" href="https://yourstore.com/products/linen-shirt">`}</CodeBlock>
      <p>
        Google treats the tag as a strong hint, not a command. It also weighs which URL your internal links point to, which
        one is in your sitemap, and which one other sites link to. When those signals agree, the canonical sticks. When
        they disagree, Google may pick a different URL from the one you declared.
      </p>
      <Note>
        Shopify&rsquo;s sitemap already lists only the plain <Code>/products/</Code> URLs, and its default robots.txt blocks
        sorted URLs, combined tags and stacked filters. Most of the cleanup is done for you; the remaining risk is in how
        your theme and apps link.
      </Note>

      <h2 id="inspect">Check a URL</h2>
      <p>
        Paste any path from your store to see its canonical version, whether Shopify&rsquo;s default robots.txt lets
        crawlers in, and why:
      </p>
      <CanonicalInspector />

      <h2 id="fixes">What actually needs fixing</h2>
      <ul>
        <li>
          <strong>Internal links to collection-scoped product URLs.</strong> Some themes, especially older ones, build
          product card links with Liquid&rsquo;s <Code>within</Code> filter, so every collection page links to{" "}
          <Code>/collections/…/products/…</Code>. The canonical tag cleans up after it, but your strongest internal signal
          now points at the duplicate. Linking to <Code>product.url</Code> without <Code>within</Code> fixes it.
        </li>
        <li>
          <strong>Thin tag pages.</strong> A single-tag page like <Code>/collections/shirts/linen</Code> is crawlable and
          usually canonical to itself. If it&rsquo;s just a filtered grid with no copy of its own, it competes with the main
          collection without adding anything. Either give it a reason to exist or stop linking to it.
        </li>
        <li>
          <strong>Campaign links pasted into your own site.</strong> UTM parameters belong on links from emails and ads,
          not in your navigation or blog posts.
        </li>
        <li>
          <strong>Changed handles without redirects.</strong> Renaming a product handle creates a new URL. Keep
          Shopify&rsquo;s &ldquo;Create a URL redirect&rdquo; option ticked so the old address and its links carry over.
        </li>
      </ul>

      <h2 id="verify">How to verify in Search Console</h2>
      <ol>
        <li>
          Run a product URL through <strong>URL Inspection</strong> and compare the &ldquo;User-declared canonical&rdquo;
          with the &ldquo;Google-selected canonical&rdquo;. They should match.
        </li>
        <li>
          In the <strong>Pages</strong> report, &ldquo;Alternate page with proper canonical tag&rdquo; is normal: Google
          found a duplicate and respected your canonical.
        </li>
        <li>
          &ldquo;Duplicate, Google chose different canonical than user&rdquo; is the one to investigate. It usually means
          your internal links or sitemap point somewhere other than your canonical tag.
        </li>
      </ol>
      <p>
        For the crawling side of the same problem, see{" "}
        <Link href="/blog/shopify-robots-txt-guide">A plain-English guide to Shopify robots.txt</Link>.
      </p>

      <AppCta
        title="Find broken links and redirect them in one place"
        body="TNS SEO & AI Visibility scans your products, collections, pages and articles for links that no longer resolve, and creates redirects automatically when a handle changes."
      />
    </>
  );
}

export const post: Post = {
  slug: "shopify-duplicate-urls-canonical",
  title: "Duplicate URLs on Shopify, and how canonical tags handle them",
  description:
    "Why one Shopify product can live at five URLs, what the canonical tag does about it, what Shopify already handles for you, and the few fixes that are still worth making.",
  category: "Technical SEO",
  tags: ["Technical SEO", "Canonical tags", "Duplicate content", "Shopify"],
  published: "2026-10-31",
  readMinutes: 7,
  cover: {
    file: "canonical.html",
    lines: ["/collections/shirts/products/", "  linen-shirt", "", '<link rel="canonical"', '  href="/products/linen-shirt">'],
  },
  toc: [
    { id: "where", label: "Where duplicates come from" },
    { id: "canonical", label: "What the canonical tag does" },
    { id: "inspect", label: "Check a URL" },
    { id: "fixes", label: "What needs fixing" },
    { id: "verify", label: "Verify in Search Console" },
  ],
  Body,
};
