import Link from "next/link";
import { RobotsTester } from "@/components/blog/RobotsTester";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/robots-txt-tester";

export const metadata = pageMetadata({
  title: "robots.txt Tester for AI Crawlers (GPTBot, ClaudeBot, PerplexityBot)",
  description: "Paste your robots.txt and test whether GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Googlebot or any crawler can reach a URL. Uses RFC 9309 matching. Free.",
  path: PATH,
});

const FAQS = [
  {
    q: "Why is a bot allowed on a path my * group disallows?",
    a: "A crawler obeys only the most specific group that names it. If robots.txt has a group for OAI-SearchBot, that bot ignores every rule under User-agent: *. Copy any Disallow lines you still need into its own group.",
  },
  {
    q: "Which rule wins when Allow and Disallow both match?",
    a: "The longest matching rule wins, because it's the most specific. If an Allow and a Disallow rule are the same length, Allow wins. This is how Google, Bing and the RFC 9309 standard handle it.",
  },
  {
    q: "Does robots.txt stop AI crawlers?",
    a: "Reputable crawlers like GPTBot, OAI-SearchBot, ClaudeBot and PerplexityBot follow it. User-triggered fetchers such as ChatGPT-User and Perplexity-User may not, because a person asked for the page. robots.txt is a request, not access control.",
  },
];

export default function RobotsTxtTester() {
  return (
    <ToolPage
      path={PATH}
      name="robots.txt tester"
      title="robots.txt tester for AI crawlers"
      lead="Paste your robots.txt, pick a crawler and a path, and see exactly which rule applies. Same matching rules Google and OpenAI follow; nothing leaves your browser."
      faqs={FAQS}
      widget={<RobotsTester />}
      guide={
        <>
          <section>
            <h2>How crawlers read robots.txt</h2>
            <ul>
              <li><strong>Pick a group.</strong> The crawler looks for a group naming it (case-insensitive). Only if there isn&rsquo;t one does it use <code className="inline-code">User-agent: *</code>.</li>
              <li><strong>Find matching rules.</strong> Each Allow or Disallow path is a prefix; <code className="inline-code">*</code> matches anything and <code className="inline-code">$</code> anchors the end.</li>
              <li><strong>Longest match wins.</strong> The most specific rule decides. On a tie, Allow beats Disallow.</li>
              <li><strong>No match means allowed.</strong> An empty <code className="inline-code">Disallow:</code> blocks nothing.</li>
            </ul>
          </section>
          <section>
            <h2>The mistakes that hide stores from AI search</h2>
            <ul>
              <li>Blocking <strong>OAI-SearchBot</strong> or <strong>PerplexityBot</strong> while meaning to block training crawlers like GPTBot.</li>
              <li>Adding a named group for a bot and forgetting it no longer inherits your <code className="inline-code">*</code> rules.</li>
              <li>A blanket <code className="inline-code">Disallow: /</code> left over from a staging site.</li>
            </ul>
            <p>
              Not sure what a bot is for? Look it up in the <Link href="/ai-tools/ai-crawlers">AI crawler directory</Link>, or read the{" "}
              <Link href="/blog/shopify-robots-txt-guide">Shopify robots.txt guide</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
