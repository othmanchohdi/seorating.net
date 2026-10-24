import Link from "next/link";
import type { Post } from "./types";
import { AppCta, Code, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        Your meta description is the short paragraph under your page title in search results. It won&rsquo;t move your
        ranking on its own; Google has said for years that it doesn&rsquo;t use it as a ranking signal. But it&rsquo;s often
        the deciding factor in whether someone clicks your result or the one below it, and that&rsquo;s traffic either way.
      </p>

      <h2 id="what-google-does">What Google actually shows</h2>
      <p>
        Google treats your meta description as a suggestion. If it decides another passage from the page better answers
        the specific query, it shows that instead. You&rsquo;ll see your own description more often when it&rsquo;s
        specific, accurate and clearly about the page.
      </p>
      <p>
        Length isn&rsquo;t a hard rule, because snippets are cut by pixel width rather than a character count. As a working
        guide, aim for roughly <strong>140 to 160 characters</strong> so the important part isn&rsquo;t cut off on desktop,
        and put the most useful words first so mobile results still make sense.
      </p>

      <h2 id="structure">A structure that works</h2>
      <p>For product pages, a reliable pattern is:</p>
      <ol>
        <li>
          <strong>What it is</strong>, in the words a shopper would search.
        </li>
        <li>
          <strong>The detail that sets it apart</strong>: material, fit, origin, a key spec.
        </li>
        <li>
          <strong>A reason to choose you</strong>: free shipping threshold, returns window, warranty.
        </li>
      </ol>
      <p>Collections need a different angle. Describe the range, not one product:</p>
      <ul>
        <li>What&rsquo;s in the collection, and roughly how many options.</li>
        <li>Who it&rsquo;s for, or what it&rsquo;s for.</li>
        <li>The same store-wide reason to buy.</li>
      </ul>

      <h2 id="examples">Examples</h2>
      <p>
        <strong>Product, before:</strong> <Code>Linen Shirt – My Store</Code> as the title, and no description, so Google
        picks a random line from the page.
      </p>
      <p>
        <strong>Product, after:</strong> &ldquo;Lightweight 100% linen shirt with a relaxed fit. Pre-washed for softness,
        available in six colours. Free returns within 30 days.&rdquo;
      </p>
      <p>
        <strong>Collection:</strong> &ldquo;Shop 42 linen shirts for men and women, from relaxed summer button-downs to
        tailored long sleeves. Made in Portugal. Free shipping over $100.&rdquo;
      </p>
      <p>
        Each one is specific and true, and tells the shopper something they&rsquo;d want to know before they click.
      </p>

      <h2 id="titles">Don&rsquo;t forget the title tag</h2>
      <p>
        The meta title, or SEO title, is the blue link itself, and unlike the description it <em>does</em> matter for
        ranking. Lead with the product name and its most searched descriptor, keep it to roughly 50 to 60 characters, and
        add your brand at the end if there&rsquo;s room.
      </p>

      <h2 id="at-scale">Doing it at catalog scale</h2>
      <p>
        Writing hundreds of these by hand is where most stores give up. Two approaches cover nearly every catalog:
      </p>
      <ul>
        <li>
          <strong>Templates</strong> for consistent product lines, using variables like the product title, type and
          vendor. Fast and predictable.
        </li>
        <li>
          <strong>Per-page writing</strong>, by hand or with AI, for your best sellers, key collections and anything a
          template would make read awkwardly.
        </li>
      </ul>
      <Note label="Avoid">
        Duplicates. Ten products sharing one description tells search engines nothing about how they differ. A
        template should always include something unique to each item.
      </Note>
      <p>
        Descriptions also feed AI assistants deciding whether a page is relevant. More on that in{" "}
        <Link href="/blog/how-ai-assistants-choose-stores">How AI assistants decide which stores to mention</Link>.
      </p>

      <AppCta
        title="Fix missing and duplicate meta tags in bulk"
        body="SEO Rating flags every missing, duplicate or overlong tag, then fills them with templates, AI or a CSV import, with a search preview before anything publishes."
      />
    </>
  );
}

export const post: Post = {
  slug: "meta-descriptions-that-get-clicked",
  title: "Writing meta descriptions that get clicked",
  description:
    "Length, structure and real examples for Shopify product and collection meta descriptions, plus how to handle title tags and write them at catalog scale.",
  category: "On-page",
  tags: ["On-page", "Meta tags", "Shopify"],
  published: "2026-09-22",
  readMinutes: 4,
  cover: { file: "search-preview", lines: ["northfield.com › products", "Men’s Relaxed Linen Shirt | Northfield", "Lightweight 100% linen shirt with", "a relaxed fit. Free returns…"] },
  toc: [
    { id: "what-google-does", label: "What Google shows" },
    { id: "structure", label: "A structure that works" },
    { id: "examples", label: "Examples" },
    { id: "titles", label: "The title tag" },
    { id: "at-scale", label: "At catalog scale" },
  ],
  Body,
};
