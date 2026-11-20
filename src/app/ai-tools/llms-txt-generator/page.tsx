import Link from "next/link";
import { LlmsTxtBuilder } from "@/components/blog/LlmsTxtBuilder";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/llms-txt-generator";

export const metadata = pageMetadata({
  title: "Free llms.txt Generator for Online Stores",
  description: "Generate a valid llms.txt file for your website or Shopify store in seconds. Follows the llmstxt.org format: title, summary, key pages and policies. Free, no signup.",
  path: PATH,
});

const FAQS = [
  {
    q: "What is llms.txt?",
    a: "llms.txt is a plain-text Markdown file at the root of your site (yoursite.com/llms.txt) that gives AI assistants a short, curated summary of who you are and links to your most important pages. The format is proposed at llmstxt.org.",
  },
  {
    q: "Do ChatGPT, Claude or Google use llms.txt?",
    a: "No major assistant has committed to reading it as a ranking or citation signal, and it doesn't replace good page content or structured data. It's a cheap, low-risk file that some AI tools and agents do read, which is why many sites now publish one.",
  },
  {
    q: "Does my Shopify store already have an llms.txt?",
    a: "Possibly. Shopify now serves a default llms.txt and agents.md on many storefronts. They're written for AI shopping agents (how to search and check out), not as a summary of your brand, collections and policies. Open yourstore.com/llms.txt to see yours; SEO Rating can publish and maintain a store summary for you.",
  },
];

export default function LlmsTxtGenerator() {
  return (
    <ToolPage
      path={PATH}
      name="llms.txt generator"
      title="Free llms.txt generator"
      lead="Fill in your basics and copy a valid llms.txt: a short summary of your site that AI assistants can read in one go. Built for online stores, works for any site."
      faqs={FAQS}
      widget={<LlmsTxtBuilder />}
      guide={
        <>
          <section>
            <h2>What goes in an llms.txt</h2>
            <p>The format is deliberately small. In order:</p>
            <ul>
              <li><strong># Your name</strong>: one H1 line, the only required part.</li>
              <li><strong>&gt; A summary</strong>: one or two plain sentences on what you sell and who it&rsquo;s for. Skip the marketing superlatives; assistants quote facts.</li>
              <li><strong>## Sections of links</strong>: your main collections or categories, key pages and policies, each as <code className="inline-code">- [Title](url): short note</code>.</li>
              <li><strong>## Optional</strong>: links an assistant can skip when it&rsquo;s short on space.</li>
            </ul>
          </section>
          <section>
            <h2>How to publish it</h2>
            <p>
              Save the file as plain text, publish it at <code className="inline-code">/llms.txt</code> on your main domain, and open
              it in a browser to check it loads as text rather than an HTML page. Update it when your main collections or
              policies change; a stale llms.txt is worse than none.
            </p>
            <p>
              Want the background? Read <Link href="/blog/what-is-llms-txt-shopify">what llms.txt is and whether your store needs one</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
