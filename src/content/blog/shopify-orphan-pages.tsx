import Link from "next/link";
import type { Post } from "./types";
import { AppCta, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        An orphan page is one with no internal links pointing to it &mdash; reachable only by typing the exact URL, or
        by Google already having found it some other way. It&rsquo;s the quiet failure mode of{" "}
        <Link href="/blog/shopify-internal-linking-guide">internal linking</Link>: not a broken link, just a page
        nobody, including you, ever links to.
      </p>

      <h2 id="what">What counts as an orphan page</h2>
      <p>
        Shopify&rsquo;s sitemap lists every live product, collection, page and article whether or not anything links
        to it, so an orphan page is often still indexed &mdash; Google found it through the sitemap, crawled it, and
        has nothing else to go on. It gets none of the relevance signal a real internal link would carry, and almost
        none of the authority that flows from your home page and top collections. It isn&rsquo;t missing; it&rsquo;s
        just invisible to everything except a direct URL.
      </p>

      <h2 id="causes">Common Shopify causes</h2>
      <ul>
        <li>
          <strong>A product removed from every collection but still published.</strong> It still has a working URL and
          still sells, but nothing on the storefront leads to it.
        </li>
        <li>
          <strong>A collection dropped from the nav and footer</strong> after a redesign, left live because nobody
          thought to unpublish it too.
        </li>
        <li>
          <strong>Campaign landing pages</strong> built for a sale or launch, linked only from an email or an ad that
          expired months ago.
        </li>
        <li>
          <strong>Blog posts left behind after a recategorization</strong> &mdash; the old tag or category page that
          used to link to them no longer does.
        </li>
        <li>
          <strong>Pages created by an app</strong> &mdash; a landing-page builder or quiz app &mdash; that live outside
          your normal content and are never linked from anywhere a person would actually browse.
        </li>
      </ul>

      <h2 id="finding">Finding them</h2>
      <ol>
        <li>
          In Google Search Console, open <strong>Links</strong> and sort internal links ascending. A page with zero or
          one incoming internal link is a candidate &mdash; Search Console counts links Google has actually crawled,
          so this is a direct read on what it sees, not a guess.
        </li>
        <li>
          Cross-check against what you&rsquo;d expect: open your nav, footer and top collections and mentally walk the
          paths a shopper would actually take. A page that doesn&rsquo;t appear on any of those paths, but does appear
          in your sitemap, is orphaned even if Search Console hasn&rsquo;t caught up yet.
        </li>
        <li>
          For a full crawl-based check, a site crawler that only follows links (rather than reading your sitemap)
          will simply never reach an orphan page &mdash; comparing its output against your sitemap.xml is the
          fastest way to get the complete list at once.
        </li>
      </ol>
      <Note>
        A page with incoming links only from <em>outside</em> your store &mdash; a backlink, an old email campaign
        &mdash; isn&rsquo;t rescued by that. It&rsquo;s still orphaned from your own site&rsquo;s structure, which is
        the part you control.
      </Note>

      <h2 id="fixing">Fixing them</h2>
      <p>Once you&rsquo;ve found one, there are really only three honest outcomes:</p>
      <ul>
        <li>
          <strong>It should exist and sell or rank &mdash; link it in.</strong> Add it to the collection it belongs to,
          reference it from a relevant blog post, or both. See our{" "}
          <Link href="/blog/shopify-internal-linking-guide">guide to internal linking</Link> for where those links
          actually belong.
        </li>
        <li>
          <strong>It&rsquo;s redundant or outdated &mdash; redirect it.</strong> If a near-identical page already
          covers the same ground, point the old URL at it with a permanent redirect instead of leaving both live. See{" "}
          <Link href="/blog/shopify-duplicate-urls-canonical">duplicate URLs and canonical tags</Link> for the
          mechanics.
        </li>
        <li>
          <strong>It shouldn&rsquo;t be public at all &mdash; remove it properly.</strong> A leftover test or draft
          page should be unpublished, not just unlinked; unlinking alone leaves it live and crawlable, just harder to
          find.
        </li>
      </ul>

      <h2 id="routine">A simple routine</h2>
      <ol>
        <li>Pull the Search Console internal-links report quarterly, sorted ascending.</li>
        <li>For anything near zero, decide: link it, redirect it, or unpublish it &mdash; don&rsquo;t leave it undecided.</li>
        <li>Re-check after any nav redesign or bulk recategorization, since that&rsquo;s when orphans are usually created.</li>
      </ol>

      <AppCta
        title="Catch orphan pages before they pile up"
        body="SEO Rating's SEO Health checklist flags every product, collection, page and article with too few internal links in, so a page doesn't go unnoticed just because nothing links to it."
      />
    </>
  );
}

export const post: Post = {
  slug: "shopify-orphan-pages",
  title: "Finding and fixing orphan pages on Shopify",
  description:
    "An orphan page has no internal links pointing to it, so it gets little authority and no relevance signal even when it's indexed. How they happen on Shopify, how to find them, and the three honest fixes.",
  category: "Technical SEO",
  tags: ["Technical SEO", "Internal linking", "Shopify SEO"],
  published: "2026-11-27",
  readMinutes: 6,
  cover: {
    file: "links-in.csv",
    lines: ["page,internal_links_in", "/products/old-tee,0", "/pages/2024-sale,0", "/collections/shirts,42"],
  },
  toc: [
    { id: "what", label: "What counts as an orphan page" },
    { id: "causes", label: "Common Shopify causes" },
    { id: "finding", label: "Finding them" },
    { id: "fixing", label: "Fixing them" },
    { id: "routine", label: "A simple routine" },
  ],
  Body,
};
