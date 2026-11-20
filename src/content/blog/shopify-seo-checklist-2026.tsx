import Link from "next/link";
import type { Post } from "./types";
import { AppCta, Code, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        Most Shopify SEO advice arrives one tactic at a time — fix your alt text, write better meta
        descriptions, add schema. Each piece is correct in isolation, but reading them in sequence
        over months leaves no sense of the whole shape of the problem, or which piece actually
        mattered this quarter.
      </p>
      <p>
        This is the opposite: one page, five pillars, in the order they&rsquo;re worth fixing. Treat
        it as a map, not a list to clear in one sitting — a store with broken canonical tags and no
        structured data should fix the first before spending a week on the second.
      </p>

      <h2 id="technical">Technical foundations</h2>
      <p>
        This is the pillar where mistakes are most expensive, because a technical problem can hide an
        otherwise-good store from search entirely. Before anything else, confirm:
      </p>
      <ul>
        <li>
          <strong>Canonical URLs are correct.</strong> Shopify products can be reached through
          multiple collection paths; without the right canonical tag, search engines can split
          ranking signal across duplicate URLs instead of crediting one — see our{" "}
          <Link href="/blog/shopify-duplicate-urls-canonical">guide to canonical tags</Link>.
        </li>
        <li>
          <strong>Robots.txt isn&rsquo;t blocking anything it shouldn&rsquo;t.</strong> Shopify ships
          a sensible default, but custom edits are the easiest way to accidentally de-index a section
          of your store. Our <Link href="/blog/shopify-robots-txt-guide">robots.txt guide</Link> walks
          through the defaults and what&rsquo;s safe to change.
        </li>
        <li>Your sitemap reflects what&rsquo;s actually live — nothing hidden, nothing missing.</li>
        <li>Broken links are found and fixed, inside your store and in old inbound links.</li>
        <li>
          Core Web Vitals are in a reasonable range — see{" "}
          <Link href="/blog/reading-pagespeed-report">reading a PageSpeed report</Link> if the
          terminology is new.
        </li>
      </ul>

      <h2 id="on-page">On-page basics</h2>
      <p>
        Once the technical layer is sound, on-page work is where most of the week-to-week effort
        goes, because it scales with your catalogue:
      </p>
      <ul>
        <li>
          Unique, unstuffed <strong>meta titles and descriptions</strong> on every product,
          collection and page — see{" "}
          <Link href="/blog/meta-descriptions-that-get-clicked">writing meta descriptions that get clicked</Link>.
        </li>
        <li>A real heading structure: one H1, logically nested H2s and H3s.</li>
        <li>
          Content depth where it matters — a near-empty collection page gives both search engines and
          shoppers nothing to go on.
        </li>
        <li>Internal links between related products and content.</li>
        <li>
          Alt text that describes the image, not just the product name repeated — our{" "}
          <Link href="/blog/product-image-alt-text-checklist">alt text checklist</Link> covers it.
        </li>
      </ul>

      <h2 id="structured-data">Structured data</h2>
      <p>
        Structured data (JSON-LD) tells search engines and AI systems facts about your store
        directly, instead of hoping they infer them correctly from your theme&rsquo;s HTML. At
        minimum, check for Product schema with price, availability and identifiers — see{" "}
        <Link href="/blog/shopify-product-schema">what&rsquo;s missing by default</Link> — plus
        breadcrumb schema, and Local Business schema if you have a physical location.
      </p>
      <Note>
        Structured data doesn&rsquo;t make a weak page rank — it makes a good page easier to
        understand correctly. Fix content and technical issues first; schema is the layer on top.
      </Note>

      <h2 id="search-console">Search Console: closing the loop</h2>
      <p>
        Everything above is a guess about what Google will do until you check Google Search Console.
        It&rsquo;s the one source that tells you, directly, which queries bring people to your store,
        which pages are indexed, and which are excluded and why. A store that fixes meta tags and
        schema but never opens Search Console is working from assumptions indefinitely.
      </p>

      <h2 id="ai-visibility">AI visibility: the newest pillar</h2>
      <p>
        Shoppers increasingly ask ChatGPT, Perplexity or Gemini what to buy before opening a search
        engine at all. None of the four pillars above disappear because of that — a store with broken
        technical SEO is just as hard for an AI assistant to read correctly as it is for Google. What
        changes is what gets added on top: a <Code>llms.txt</Code> file (
        <Link href="/blog/what-is-llms-txt-shopify">what it is</Link>), robots.txt rules that
        deliberately address AI crawlers, IndexNow for faster propagation, and content that states
        facts plainly — price, materials, sizing, policies — since AI systems tend to repeat
        what&rsquo;s written clearly and avoid what&rsquo;s ambiguous.
      </p>

      <h2 id="order">How to actually use this</h2>
      <p>Don&rsquo;t try to clear all five pillars in one pass. A sane order for most stores:</p>
      <ol>
        <li>Fix anything technical that&rsquo;s actively hiding pages.</li>
        <li>Close the obvious on-page gaps: missing meta tags, missing alt text, thin top pages.</li>
        <li>Add or correct structured data for products and, if relevant, your location.</li>
        <li>Connect Search Console and actually read it, monthly.</li>
        <li>Layer on AI visibility work once the foundation underneath it is solid.</li>
      </ol>

      <AppCta
        title="Run a full audit of all five pillars"
        body="SEO Rating scans your store against every item on this checklist and shows you exactly what's missing."
      />
    </>
  );
}

export const post: Post = {
  slug: "shopify-seo-checklist-2026",
  title: "The Shopify SEO checklist for 2026: every pillar that actually matters",
  description:
    "Technical foundations, on-page basics, structured data, Search Console and AI visibility — the whole picture of Shopify SEO in one place, with a sane order to tackle it in.",
  category: "Strategy",
  tags: ["Strategy", "Shopify SEO", "Checklist"],
  published: "2026-11-18",
  readMinutes: 9,
  cover: { file: "seo-checklist.md", lines: ["# 2026 checklist", "> Five pillars, in order.", "", "## Technical", "- [ ] Canonical URLs", "- [ ] Robots.txt"] },
  toc: [
    { id: "technical", label: "Technical foundations" },
    { id: "on-page", label: "On-page basics" },
    { id: "structured-data", label: "Structured data" },
    { id: "search-console", label: "Search Console" },
    { id: "ai-visibility", label: "AI visibility" },
    { id: "order", label: "How to actually use this" },
  ],
  Body,
};
