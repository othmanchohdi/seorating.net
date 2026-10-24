import Link from "next/link";
import type { Post } from "./types";
import { AppCta, Code, CodeBlock, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        Every Shopify store has a <Code>robots.txt</Code> file at <Code>yourstore.com/robots.txt</Code>. Most merchants never
        look at it, which is usually fine, because Shopify&rsquo;s defaults are sensible. But it&rsquo;s worth understanding
        what it does, because it&rsquo;s now also where you decide which AI crawlers can read your store.
      </p>

      <h2 id="what-it-does">What robots.txt actually does</h2>
      <p>
        robots.txt is a set of instructions for well-behaved crawlers: which paths they may request and which they
        shouldn&rsquo;t. Each group of rules starts with a <Code>User-agent</Code> line naming the crawler (or <Code>*</Code>{" "}
        for all of them), followed by <Code>Disallow</Code> and <Code>Allow</Code> lines.
      </p>
      <p>Two things it does <strong>not</strong> do:</p>
      <ul>
        <li>
          <strong>It isn&rsquo;t security.</strong> It&rsquo;s a request, not a lock. Anything private needs real access
          control.
        </li>
        <li>
          <strong>It doesn&rsquo;t remove pages from Google.</strong> A disallowed URL can still be indexed if other sites
          link to it, just without its content. To keep a page out of results, use a <Code>noindex</Code> tag and leave it
          crawlable so Google can see that tag.
        </li>
      </ul>

      <h2 id="defaults">What Shopify blocks by default</h2>
      <p>
        Shopify&rsquo;s default file keeps crawlers away from pages that have no business in search results and would waste
        crawl budget. That includes checkout, cart and account pages, the admin, internal search results, and the
        near-duplicate URLs created by filtering and sorting collections. A trimmed example:
      </p>
      <CodeBlock file="robots.txt — excerpt of Shopify defaults">{`User-agent: *
Disallow: /admin
Disallow: /cart
Disallow: /checkout
Disallow: /account
Disallow: /search
Disallow: /collections/*sort_by*
Disallow: /collections/*+*
Sitemap: https://yourstore.com/sitemap.xml`}</CodeBlock>
      <p>
        Note the last line. The file also points crawlers at your sitemap, which is how they discover your products,
        collections, pages and articles.
      </p>

      <h2 id="when-to-change">When it&rsquo;s worth changing</h2>
      <p>For most stores, the honest answer is rarely. Good reasons include:</p>
      <ul>
        <li>An app or theme feature creating large numbers of thin or duplicate URLs that crawlers keep hitting.</li>
        <li>Internal pages, like a wholesale price list, that shouldn&rsquo;t be crawled.</li>
        <li>A deliberate policy on AI crawlers (more below).</li>
      </ul>
      <p>
        Shopify lets you customize the file with a <Code>robots.txt.liquid</Code> theme template, which edits theme code.
        An app with a robots.txt editor lets you add and remove rules without touching the theme.
      </p>
      <Note label="Careful">
        One stray <Code>Disallow: /</Code> under <Code>User-agent: *</Code> asks every crawler to skip your whole store. Read
        the final file before you save, and keep a note of what you changed and why.
      </Note>

      <h2 id="ai-crawlers">AI crawlers</h2>
      <p>
        AI companies now run their own crawlers, and most document a user agent you can address in robots.txt. They
        generally fall into two groups:
      </p>
      <ul>
        <li>
          <strong>Search and answer crawlers</strong> fetch pages to answer a user&rsquo;s question right now, often with a
          link back. Examples include <Code>OAI-SearchBot</Code> and <Code>PerplexityBot</Code>.
        </li>
        <li>
          <strong>Training crawlers</strong> collect content to train future models. Examples include <Code>GPTBot</Code>,{" "}
          <Code>ClaudeBot</Code> and <Code>CCBot</Code>. Google uses a separate token, <Code>Google-Extended</Code>, to let you
          opt out of Gemini training without affecting Google Search.
        </li>
      </ul>
      <p>
        If you want your store to appear in AI answers, don&rsquo;t block the search crawlers. Whether to allow training
        crawlers is a separate business decision. Many stores allow both, and some block training only:
      </p>
      <CodeBlock file="robots.txt — blocking training, allowing AI search">{`User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: OAI-SearchBot
Allow: /`}</CodeBlock>
      <p>
        User agent names and their purposes change, so check each company&rsquo;s current documentation before relying on
        a rule. There&rsquo;s more on how assistants pick stores in{" "}
        <Link href="/blog/how-ai-assistants-choose-stores">How AI assistants decide which stores to mention</Link>.
      </p>

      <h2 id="check">How to check yours</h2>
      <ol>
        <li>
          Open <Code>yourstore.com/robots.txt</Code> in a browser and read it top to bottom.
        </li>
        <li>Look for any rule that disallows <Code>/products</Code>, <Code>/collections</Code> or <Code>/</Code>.</li>
        <li>Check which AI crawlers are named, and whether that matches what you intend.</li>
        <li>In Google Search Console, look for pages reported as &ldquo;Blocked by robots.txt&rdquo; that you expected to rank.</li>
      </ol>

      <AppCta
        title="Edit robots.txt without touching theme code"
        body="SEO Rating shows your live rules, lets you add rules per crawler, including AI crawlers, and has a raw editor for full control."
      />
    </>
  );
}

export const post: Post = {
  slug: "shopify-robots-txt-guide",
  title: "A plain-English guide to Shopify robots.txt",
  description:
    "What Shopify’s default robots.txt rules do, when it’s worth changing them, and how to handle AI crawlers like GPTBot and OAI-SearchBot without hurting your search visibility.",
  category: "Technical SEO",
  tags: ["Technical SEO", "robots.txt", "AI crawlers", "Shopify"],
  published: "2026-10-06",
  readMinutes: 5,
  cover: { file: "robots.txt", lines: ["User-agent: *", "Disallow: /cart", "Disallow: /checkout", "", "Sitemap: /sitemap.xml"] },
  toc: [
    { id: "what-it-does", label: "What robots.txt does" },
    { id: "defaults", label: "Shopify’s defaults" },
    { id: "when-to-change", label: "When to change it" },
    { id: "ai-crawlers", label: "AI crawlers" },
    { id: "check", label: "How to check yours" },
  ],
  Body,
};
