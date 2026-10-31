import Link from "next/link";
import type { Post } from "./types";
import { LlmsTxtBuilder } from "@/components/blog/LlmsTxtBuilder";
import { AppCta, Code, DocsLink, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        When someone asks an AI assistant for &ldquo;a breathable linen shirt under $80&rdquo;, the assistant has to work out
        which stores sell that, quickly, from pages built for people rather than machines. <Code>llms.txt</Code> is a
        proposed way to make that easier.
      </p>

      <h2 id="what">What llms.txt is</h2>
      <p>
        It&rsquo;s a plain Markdown file that lives at the root of your site, at <Code>yourstore.com/llms.txt</Code>. Think of
        it as a short, structured brief: who you are, what you sell, and where the important pages are. The format was
        proposed in 2024 as a companion to <Code>robots.txt</Code> and <Code>sitemap.xml</Code>. Those files tell crawlers
        where they may go and what exists; <Code>llms.txt</Code> tells a language model what matters, in a form it can read
        without parsing navigation menus, scripts and theme markup.
      </p>
      <p>The convention is simple:</p>
      <ul>
        <li>
          An <strong>H1</strong> with the name of the site or business.
        </li>
        <li>
          A <strong>blockquote</strong> with a one or two sentence summary.
        </li>
        <li>
          <strong>H2 sections</strong> containing lists of links, each with a short description.
        </li>
      </ul>

      <h2 id="inside">What goes inside</h2>
      <p>A good llms.txt for a store usually includes:</p>
      <ul>
        <li>A one-line description of the business: what you sell, and to whom</li>
        <li>Your main collections, with links and a few words on each</li>
        <li>Shipping, returns and other policies</li>
        <li>Anything an assistant should know to describe you accurately, like where products are made or what makes them different</li>
      </ul>
      <p>Try it with your own store. The builder below writes the file as you type and flags the usual gaps:</p>
      <LlmsTxtBuilder />
      <p>
        Keep it factual and specific. &ldquo;Linen shirts, made in Portugal, free returns within 30 days&rdquo; gives an
        assistant something it can repeat. &ldquo;The best shirts on the internet&rdquo; gives it nothing.
      </p>
      <Note>
        llms.txt is still an emerging convention, and AI companies haven&rsquo;t all said whether or how they read it.
        Treat it as low-effort groundwork, not a guarantee of being cited.
      </Note>

      <h2 id="shopify-default">What Shopify serves by default</h2>
      <p>
        Open <Code>yourstore.com/llms.txt</Code> and you may find a file is already there. Shopify now serves default{" "}
        <Code>llms.txt</Code> and <Code>agents.md</Code> files on many storefronts. Their content is aimed at AI shopping
        agents: how to use Shopify&rsquo;s Shop integration and the Universal Commerce Protocol to search products, build a
        cart and check out on a shopper&rsquo;s behalf.
      </p>
      <p>
        That&rsquo;s useful groundwork for agentic checkout, but it&rsquo;s a different job from the summary described
        above. The default file doesn&rsquo;t say what your brand sells, which collections matter, or what your shipping and
        returns terms are. Those facts still have to come from you, through your page content, structured data and any
        store summary you publish.
      </p>

      <h2 id="need">Do you need one?</h2>
      <p>
        If you want AI assistants to describe your store accurately, it&rsquo;s one of the cheapest things you can do. It
        takes minutes to publish and doesn&rsquo;t change how your store looks to customers or how Google ranks it.
      </p>
      <p>
        It isn&rsquo;t a substitute for the basics. Assistants that browse the web still rely on being able to crawl your
        pages (see our <Link href="/blog/shopify-robots-txt-guide">guide to Shopify robots.txt</Link>), on clear product
        content, and on structured data like <Link href="/blog/shopify-product-schema">Product schema</Link>. Think of
        llms.txt as the summary on top of a store that&rsquo;s already easy to read.
      </p>
      <p>
        There&rsquo;s a sibling file worth knowing about too. <Code>agents.md</Code> describes your store for AI agents
        that act on a shopper&rsquo;s behalf, covering the key pages, policies and how things work.
      </p>

      <h2 id="current">Keeping it current</h2>
      <p>
        The hard part isn&rsquo;t writing it once. It&rsquo;s keeping it accurate as collections and policies change. An
        out-of-date file is worse than none, because it points assistants at the wrong information: a collection you
        removed, a returns window you changed, a product line you no longer carry.
      </p>
      <p>A few habits help:</p>
      <ul>
        <li>Regenerate it whenever you add or retire a collection.</li>
        <li>Re-check it after any policy change, especially shipping thresholds and return windows.</li>
        <li>Link only to pages that exist and are indexable.</li>
      </ul>

      <AppCta
        title="Generate llms.txt from your Shopify catalog"
        body="SEO Rating builds llms.txt and agents.md content from your real store data, with a review step before anything goes live."
      />
      <p style={{ fontSize: 15.5 }}>
        Want the details? See <DocsLink hash="ai-visibility">AI Visibility in the docs</DocsLink>. This site publishes its
        own, too: <a href="/llms.txt">seorating.net/llms.txt</a>.
      </p>
    </>
  );
}

export const post: Post = {
  slug: "what-is-llms-txt-shopify",
  title: "What is llms.txt, and does your Shopify store need one?",
  description:
    "A plain-language look at llms.txt, the file AI assistants can use to understand a website: what goes in it, whether your Shopify store needs one, and how to keep it current.",
  category: "AI search",
  tags: ["AI search", "llms.txt", "Shopify"],
  published: "2026-10-24",
  updated: "2026-10-31",
  readMinutes: 8,
  cover: { file: "llms.txt", lines: ["# Your Store", "> What you sell, in one line.", "", "## Collections", "- [Shirts](/collections/shirts)"] },
  toc: [
    { id: "what", label: "What llms.txt is" },
    { id: "inside", label: "What goes inside" },
    { id: "shopify-default", label: "Shopify’s default file" },
    { id: "need", label: "Do you need one?" },
    { id: "current", label: "Keeping it current" },
  ],
  Body,
};
