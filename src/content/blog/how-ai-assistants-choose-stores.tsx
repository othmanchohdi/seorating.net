import Link from "next/link";
import type { Post } from "./types";
import { AiReadiness } from "@/components/blog/AiReadiness";
import { AppCta, Code, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        Ask ChatGPT, Perplexity or Gemini for a product recommendation and you&rsquo;ll usually get a short list of
        stores, sometimes with links. Merchants reasonably want to know how that list gets made. Nobody outside these
        companies knows every detail, and it changes often. But the broad mechanics are well understood, and most of them
        are things a store can influence.
      </p>

      <h2 id="two-sources">Two places answers come from</h2>
      <p>An AI assistant draws on two very different sources when it answers a shopping question:</p>
      <ul>
        <li>
          <strong>What the model learned in training.</strong> Large, well-known brands show up here because they were
          written about widely. A small store rarely does, and that knowledge is frozen at a cutoff date.
        </li>
        <li>
          <strong>What it retrieves right now.</strong> For product questions, assistants increasingly search the web live,
          read a handful of pages, and summarize them. This is where an independent store can realistically appear.
        </li>
      </ul>
      <p>
        The second path is the one you can work on. It behaves a lot like search, because it usually <em>is</em> search:
        the assistant runs queries against a web index, picks promising results, fetches them and writes an answer from
        what it read.
      </p>

      <h2 id="what-they-read">What they look for on your pages</h2>
      <p>
        Once a page is fetched, the model has to understand it quickly. Pages that are easy to summarize accurately tend
        to be the ones that get summarized. In practice that means:
      </p>
      <ul>
        <li>
          <strong>Plain facts in the text.</strong> Material, sizes, price, who it&rsquo;s for, where it ships. If the key
          details only live in images or tabs loaded by scripts, a crawler may never see them.
        </li>
        <li>
          <strong>Structured data.</strong> <Link href="/blog/shopify-product-schema">Product schema</Link> states price,
          availability, brand and ratings as data rather than prose, which removes guesswork.
        </li>
        <li>
          <strong>Clear titles and descriptions.</strong> The same{" "}
          <Link href="/blog/meta-descriptions-that-get-clicked">meta titles and descriptions</Link> that help in Google
          help an assistant decide whether a page is relevant.
        </li>
        <li>
          <strong>A summary of the whole store.</strong> A file like <Code>llms.txt</Code> gives a model the overview
          without crawling every page. Here&rsquo;s{" "}
          <Link href="/blog/what-is-llms-txt-shopify">what goes in one</Link>.
        </li>
      </ul>

      <h2 id="access">Can they reach you at all?</h2>
      <p>
        AI companies run their own crawlers, with user agents such as <Code>GPTBot</Code>, <Code>OAI-SearchBot</Code>,{" "}
        <Code>PerplexityBot</Code>, <Code>ClaudeBot</Code> and <Code>Claude-SearchBot</Code>. Some are used for training and some for live search, and
        companies document them separately. If your <Code>robots.txt</Code> blocks the search-related ones, your pages
        can&rsquo;t be fetched for answers, however good they are.
      </p>
      <p>
        That&rsquo;s a business decision, and blocking training crawlers while allowing search crawlers is a reasonable
        middle ground for many stores. The mistake is making the decision by accident. Our{" "}
        <Link href="/blog/shopify-robots-txt-guide">Shopify robots.txt guide</Link> covers how to check.
      </p>

      <h2 id="trust">Signals from beyond your site</h2>
      <p>
        When an assistant weighs several candidate stores, it reads what others say too: reviews, comparison articles,
        directories, forums. A store that&rsquo;s consistently described the same way across the web is easier to recommend
        with confidence than one with conflicting or thin information.
      </p>
      <p>You can&rsquo;t control all of that, but you can:</p>
      <ul>
        <li>Keep your name, policies and key facts identical everywhere they appear.</li>
        <li>Get listed in the directories and data sources relevant to your niche.</li>
        <li>Make reviews easy to leave, and mark them up so they&rsquo;re machine-readable.</li>
      </ul>
      <Note label="Be wary of">
        Anyone promising guaranteed placement in AI answers. No one outside these companies can deliver that. What you can
        do is remove the reasons an assistant would skip you.
      </Note>

      <h2 id="checklist">A short checklist</h2>
      <p>
        Each item below unblocks one stage of the answer pipeline: being found in a search index, being fetched, being
        understood, and being trusted enough to recommend. Tick what your store already does to see where it stops.
      </p>
      <AiReadiness />

      <AppCta
        title="Check your store for AI search readiness"
        body="TNS SEO & AI Visibility covers every item on this list, from robots.txt rules and schema to llms.txt and IndexNow, inside your Shopify admin."
      />
    </>
  );
}

export const post: Post = {
  slug: "how-ai-assistants-choose-stores",
  title: "How AI assistants decide which stores to mention",
  description:
    "What ChatGPT, Perplexity and Gemini look at when they recommend products, and the practical steps a Shopify store can take to be read and described accurately.",
  category: "AI search",
  tags: ["AI search", "ChatGPT", "Shopify"],
  published: "2026-10-15",
  updated: "2026-10-31",
  readMinutes: 6,
  cover: { file: "assistant.log", lines: ["> best linen shirt under $80", "search: 6 results", "fetch: northfield.com/products/…", "read: Product schema ✓", "cite: northfield.com"] },
  toc: [
    { id: "two-sources", label: "Two places answers come from" },
    { id: "what-they-read", label: "What they look for" },
    { id: "access", label: "Can they reach you?" },
    { id: "trust", label: "Signals from beyond your site" },
    { id: "checklist", label: "A short checklist" },
  ],
  Body,
};
