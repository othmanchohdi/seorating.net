import Link from "next/link";
import type { Post } from "./types";
import { AppCta, CodeBlock, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        Most Shopify product descriptions are written for one audience and forgotten by the other: either written for
        a shopper and stuffed with nothing a search engine can use, or written for a keyword and useless to anyone
        deciding whether to buy. The two aren&rsquo;t actually in tension &mdash; what helps a shopper decide is
        usually exactly what a search engine, and increasingly an AI assistant, needs to describe the product
        correctly.
      </p>

      <h2 id="shopper">Start with what the shopper needs to know</h2>
      <p>
        Material, sizing, what&rsquo;s included, how it&rsquo;s used, care instructions, and what makes it different
        from the near-identical item two tabs over. State these plainly rather than implying them &mdash; an AI
        assistant summarizing your product tends to repeat what&rsquo;s written clearly and skip what&rsquo;s vague,
        which is the same point our{" "}
        <Link href="/blog/ai-visibility-101-shopify">guide to AI visibility</Link> makes about a store&rsquo;s content
        generally.
      </p>

      <h2 id="seo">Where SEO fits without reading like SEO copy</h2>
      <p>
        Use the specific term a shopper would actually search &mdash; &ldquo;linen shirt,&rdquo; not just
        &ldquo;shirt&rdquo; &mdash; once, naturally, in the opening sentence. Repeating it every other line reads as
        stuffing to a person and is weighted no higher by Google for the repetition. Where the description names the
        collection it belongs to, that&rsquo;s also the single best place for an internal link with real anchor text
        &mdash; see our <Link href="/blog/shopify-internal-linking-guide">guide to internal linking</Link>.
      </p>

      <h2 id="structure">A structure that helps both</h2>
      <p>The same shape tends to work for shoppers and machines alike:</p>
      <ol>
        <li>One short lead sentence: what it is, and the single biggest reason to want it.</li>
        <li>A bullet list of concrete specs: material, dimensions, what&rsquo;s included, care.</li>
        <li>One closing sentence that answers the most common pre-purchase doubt &mdash; sizing, fit, returns.</li>
      </ol>
      <CodeBlock file="before → after">{`Before: "Beautiful shirt made from quality materials.
Perfect for any occasion. Buy now!"

After: "A linen shirt cut for warm weather, with a
slightly relaxed fit through the chest.
- 100% European linen, pre-washed for softness
- Mother-of-pearl buttons
- Runs true to size; see size guide for in-between sizes
Pairs well with our linen trousers."`}</CodeBlock>
      <p>
        The bullets aren&rsquo;t just scannable for a shopper in a hurry &mdash; they&rsquo;re also the easiest part
        of the page for Google&rsquo;s rich results and an AI assistant to extract facts from.
      </p>

      <h2 id="mistakes">Common mistakes</h2>
      <ul>
        <li>
          <strong>The same description across every color or size variant</strong> of one product, or worse, across
          genuinely different products. Thin, duplicated copy gives search engines nothing to differentiate the page
          by.
        </li>
        <li>
          <strong>Manufacturer boilerplate copied verbatim.</strong> If the exact same paragraph appears on fifty
          other stores selling the same item, it can&rsquo;t help you rank above any of them.
        </li>
        <li>
          <strong>Features without benefits.</strong> &ldquo;100% cotton&rdquo; is a fact; &ldquo;100% cotton,
          breathable enough to wear all day&rdquo; is a reason to buy.
        </li>
        <li>
          <strong>Burying the one fact everyone asks about.</strong> If support tickets are full of sizing questions,
          that answer belongs in the description, not just the size guide.
        </li>
      </ul>
      <Note>
        Structured data doesn&rsquo;t fix any of this. Product schema tells search engines the price and availability
        you&rsquo;ve already stated &mdash; it makes a good description easier to parse, it doesn&rsquo;t make a thin
        one rank. See <Link href="/blog/shopify-product-schema">what&rsquo;s missing by default</Link> for the schema side
        once the copy itself is solid.
      </Note>

      <AppCta
        title="Audit product copy, not just meta tags"
        body="SEO Rating's SEO Health checklist checks every product for keyword presence, content length, paragraph length and internal links — the same things this post covers — so you know which descriptions to rewrite first."
      />
    </>
  );
}

export const post: Post = {
  slug: "product-descriptions-that-rank-and-convert",
  title: "Writing product descriptions that rank and convert",
  description:
    "What helps a shopper decide to buy is usually what a search engine and an AI assistant need to describe the product correctly. A structure, the common mistakes, and where SEO actually fits.",
  category: "Conversion",
  tags: ["Conversion", "On-page", "Product pages"],
  published: "2026-12-09",
  readMinutes: 7,
  cover: {
    file: "description.txt",
    lines: ["Linen shirt, relaxed fit", "- 100% European linen", "- Mother-of-pearl buttons", "- Runs true to size"],
  },
  toc: [
    { id: "shopper", label: "What the shopper needs" },
    { id: "seo", label: "Where SEO fits" },
    { id: "structure", label: "A structure that helps both" },
    { id: "mistakes", label: "Common mistakes" },
  ],
  Body,
};
