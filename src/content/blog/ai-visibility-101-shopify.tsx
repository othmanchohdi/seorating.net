import Link from "next/link";
import type { Post } from "./types";
import { AppCta, Code, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        AEO (answer engine optimization) and GEO (generative engine optimization) are the two terms
        people have landed on for the same underlying question: when someone asks ChatGPT, Perplexity
        or Gemini for a product recommendation, why does it mention some stores and not others — and
        can you influence which pile you&rsquo;re in?
      </p>
      <p>
        Strip away the acronyms and it&rsquo;s a reasonable thing to ask. A growing share of product
        research now starts with a conversation instead of a search box, and &ldquo;be visible to that
        conversation&rdquo; is a legitimate, separate goal from traditional rankings.
      </p>

      <h2 id="different">How this differs from classic SEO</h2>
      <p>
        Traditional SEO is built around crawling and ranking a list of links. AI assistants do
        something closer to retrieval and summarization — they pull from a smaller set of sources
        they trust and condense an answer, often without showing a ranked list at all. A few practical
        consequences follow:
      </p>
      <ul>
        <li>
          <strong>Backlinks matter less as a currency.</strong> They still signal credibility, but
          there&rsquo;s no equivalent of a backlink profile driving AI citation the way it drives
          search rank.
        </li>
        <li>
          <strong>Structured clarity beats keyword density.</strong> An assistant extracting facts
          about your product cares whether price, material and availability are stated plainly — not
          how many times a target phrase appears.
        </li>
        <li>
          <strong>There&rsquo;s no stable rank to track.</strong> The same question can get a
          different answer minutes apart, across models, or depending on prior conversation context.
          &ldquo;Am I #1&rdquo; isn&rsquo;t a question with a steady answer here yet.
        </li>
      </ul>

      <h2 id="levers">The four levers that actually move it</h2>
      <p>Of everything written about this topic, four things are actually within your control:</p>
      <ol>
        <li>
          <strong>Clean structured data.</strong> Product schema with price, availability, brand and
          identifiers — see{" "}
          <Link href="/blog/shopify-product-schema">what&rsquo;s missing from Shopify&rsquo;s default output</Link>.
        </li>
        <li>
          <strong>A machine-readable summary of your store.</strong> A <Code>llms.txt</Code> file
          describing what you sell (see{" "}
          <Link href="/blog/what-is-llms-txt-shopify">what is llms.txt</Link>), and an{" "}
          <Code>agents.md</Code> covering policies and key pages.
        </li>
        <li>
          <strong>Plainly stated facts in your actual content.</strong> Specs, sizing, shipping and
          returns, written as clear sentences rather than buried in an accordion or an image.
        </li>
        <li>
          <strong>Crawlability for AI user-agents specifically.</strong> Your{" "}
          <Link href="/blog/shopify-robots-txt-guide">robots.txt</Link> rules should be a deliberate
          decision about AI crawlers, not an accident inherited from a template.
        </li>
      </ol>

      <h2 id="limits">What nobody can promise you</h2>
      <p>
        Be skeptical of anyone — including a tool like ours — who claims to guarantee an AI citation.
        A few honest limits:
      </p>
      <ul>
        <li>Which assistant a given shopper happens to use is entirely outside your influence.</li>
        <li>
          Large models are trained on snapshots of the web and update on their own schedule — a change
          you make today may not show up in a model&rsquo;s background knowledge for a while, even if
          live retrieval picks it up sooner.
        </li>
        <li>
          There is no mature, reliable &ldquo;AI rank tracker&rdquo; yet. Tools that query assistants
          and show you what comes back are useful for spotting outdated or wrong information about
          your store — treat them as a mirror, not a leaderboard.
        </li>
      </ul>

      <h2 id="checklist">A realistic starting checklist</h2>
      <p>If you do nothing else this month, do these four things:</p>
      <ol>
        <li>Generate and publish a llms.txt file that accurately describes your store.</li>
        <li>Check that your highest-traffic products have complete, correct structured data.</li>
        <li>Rewrite any vague policy or spec copy into plain, factual statements.</li>
        <li>Review your robots.txt with AI crawlers specifically in mind, rather than assuming the default is right.</li>
      </ol>
      <Note>
        None of this replaces traditional SEO — it sits on top of it. A store that&rsquo;s hard for
        Google to crawl correctly will be just as hard for an AI assistant to read correctly.
      </Note>

      <AppCta
        title="See how your store reads to an AI assistant"
        body="SEO Rating's LLM Outreach tool queries assistants about your store and shows you what comes back."
      />
    </>
  );
}

export const post: Post = {
  slug: "ai-visibility-101-shopify",
  title: "AI visibility 101: what AEO and GEO actually mean for a Shopify store",
  description:
    "A plain-English primer on getting recommended by ChatGPT, Perplexity and Gemini — how it differs from classic SEO, the levers that actually move it, and what nobody can promise you.",
  category: "AI search",
  tags: ["AI search", "AEO", "GEO", "Shopify"],
  published: "2026-11-11",
  readMinutes: 7,
  cover: { file: "ai-visibility.md", lines: ["# AI visibility 101", "> AEO and GEO, explained.", "", "## Levers", "- Structured data", "- llms.txt"] },
  toc: [
    { id: "different", label: "How this differs from classic SEO" },
    { id: "levers", label: "The four levers that move it" },
    { id: "limits", label: "What nobody can promise you" },
    { id: "checklist", label: "A realistic starting checklist" },
  ],
  Body,
};
