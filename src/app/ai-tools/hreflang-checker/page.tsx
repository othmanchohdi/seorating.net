import Link from "next/link";
import { HreflangChecker } from "@/components/tools/HreflangChecker";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/hreflang-checker";

export const metadata = pageMetadata({
  title: "Free Hreflang Checker & Validator",
  description: "Enter a page URL to validate its hreflang tags: language and country codes, self-reference, x-default and return links on every alternate. Built for multi-market stores. Free.",
  path: PATH,
});

const FAQS = [
  {
    q: "Do I need hreflang on my Shopify store?",
    a: "Only if you sell in more than one language or country with separate URLs. Shopify Markets adds hreflang tags automatically for its subfolders (like /en-gb) and country domains, but custom setups, translation apps and separate stores often get them wrong.",
  },
  {
    q: "What is a return link?",
    a: "If page A lists page B as an alternate, page B must list page A too. Google ignores hreflang pairs that aren't confirmed from both sides. Missing return links are the most common hreflang error.",
  },
  {
    q: "Why is en-UK invalid?",
    a: "Country codes follow ISO 3166-1, where the United Kingdom is GB. Use en-GB. Similarly, the language always comes first (en-US, not US-en), and a region alone isn't valid.",
  },
];

export default function HreflangCheckerPage() {
  return (
    <ToolPage
      path={PATH}
      name="hreflang checker"
      title="Hreflang checker"
      lead="Validate a page's hreflang tags: every language and country code, the self-reference and x-default, and whether each alternate page loads and links back."
      faqs={FAQS}
      widget={<HreflangChecker />}
      guide={
        <>
          <section>
            <h2>The hreflang rules that matter</h2>
            <ul>
              <li>
                <strong>Every page lists every version</strong>, including itself.
              </li>
              <li>
                <strong>Every alternate links back</strong> with the same set of tags.
              </li>
              <li>
                <strong>Codes are language first, then optional country</strong>: fr, fr-CA, en-GB. Countries only, not regions like EU.
              </li>
              <li>
                <strong>Add x-default</strong> for visitors who match none of them.
              </li>
              <li>
                <strong>Alternates must load with HTTP 200</strong> and not canonicalise to a different URL.
              </li>
            </ul>
            <p>
              Check that each market&rsquo;s domain redirects cleanly with the <Link href="/ai-tools/redirect-checker">redirect checker</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
