import Link from "next/link";
import { LlmsChecker } from "@/components/blog/LlmsChecker";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/llms-txt-checker";

export const metadata = pageMetadata({
  title: "Free llms.txt Checker: Test Any Site's Live File",
  description: "Enter a domain to fetch its live llms.txt and check it against the llmstxt.org format: a title, a summary and links. Also flags Shopify's default file. Free.",
  path: PATH,
});

const FAQS = [
  {
    q: "What's the difference between this and the llms.txt generator?",
    a: "The generator builds a new llms.txt from your inputs. This checker fetches a site's existing live file and grades it, which is useful for auditing your own store or seeing what a competitor publishes.",
  },
  {
    q: "Why does it flag Shopify's default llms.txt as a warning?",
    a: "Shopify now serves a default llms.txt and agents.md on many storefronts. They're written for AI shopping agents (how to search and check out, through the Universal Commerce Protocol), not as a summary of your brand, collections and policies, so this checker calls that out separately from a missing file.",
  },
  {
    q: "Does a high score mean AI assistants will cite my site?",
    a: "No. This only checks the file's format. No major assistant has committed to reading llms.txt as a ranking or citation signal, so treat a good score as low-risk hygiene, not a guarantee.",
  },
];

export default function LlmsTxtChecker() {
  return (
    <ToolPage
      path={PATH}
      name="llms.txt checker"
      title="llms.txt checker"
      lead="Enter a domain to pull its live llms.txt and see whether it has a title, a summary and links, the parts AI assistants can actually use."
      faqs={FAQS}
      widget={<LlmsChecker />}
      guide={
        <>
          <section>
            <h2>What a valid llms.txt needs</h2>
            <ul>
              <li><strong># Title:</strong> one H1 line, usually your site or store name.</li>
              <li><strong>&gt; Summary:</strong> one or two plain sentences on what you sell and who it&rsquo;s for.</li>
              <li><strong>## Sections of links:</strong> your main collections, key pages and policies.</li>
            </ul>
            <p>
              Found a gap? Build a fresh one with the{" "}
              <Link href="/ai-tools/llms-txt-generator">llms.txt generator</Link>, or read{" "}
              <Link href="/blog/what-is-llms-txt-shopify">what llms.txt is and whether your store needs one</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
