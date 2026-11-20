import Link from "next/link";
import { AiReadiness } from "@/components/blog/AiReadiness";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/ai-readiness-checklist";

export const metadata = pageMetadata({
  title: "AI Search Readiness Checklist for Online Stores",
  description: "Interactive checklist: can ChatGPT, Perplexity and Google AI find, fetch, understand and recommend your store? See where the chain breaks and what to fix first.",
  path: PATH,
});

const FAQS = [
  {
    q: "How do AI assistants decide which stores to recommend?",
    a: "An assistant has to find your page (it's indexed), fetch it (its crawler isn't blocked), understand it (facts are in text and structured data) and trust it (consistent details and visible reviews). A gap early in that chain blocks everything after it.",
  },
  {
    q: "Is this the same as the AI visibility report?",
    a: "No. This checklist is self-assessed and covers things a crawler can't see, like whether your details match across the web. The AI visibility report actually crawls your site and tests robots.txt, your firewall, AI files and schema.",
  },
  {
    q: "What should I fix first?",
    a: "Work left to right: indexing and crawler access first, because nothing else matters if assistants can't reach your pages. Then structured data and readable product text, then consistency and reviews.",
  },
];

export default function AiReadinessChecklist() {
  return (
    <ToolPage
      path={PATH}
      name="AI readiness checklist"
      title="AI search readiness checklist"
      lead="Tick what your store already does and see how far an AI assistant gets: found, fetched, understood, recommended. Takes a minute."
      faqs={FAQS}
      widget={<AiReadiness />}
      guide={
        <>
          <section>
            <h2>The four stages</h2>
            <ul>
              <li><strong>Found:</strong> your key pages are in Google and Bing, the indexes most assistants search.</li>
              <li><strong>Fetched:</strong> AI search crawlers aren&rsquo;t blocked by robots.txt or a firewall.</li>
              <li><strong>Understood:</strong> product facts are in page text and schema, not only in images or scripts.</li>
              <li><strong>Recommended:</strong> your name, prices and policies match everywhere, and reviews are visible.</li>
            </ul>
            <p>
              Go deeper in <Link href="/blog/how-ai-assistants-choose-stores">how AI assistants choose which stores to recommend</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
