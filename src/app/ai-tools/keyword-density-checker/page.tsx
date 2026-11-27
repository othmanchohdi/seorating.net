import Link from "next/link";
import { KeywordDensity } from "@/components/tools/KeywordDensity";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/keyword-density-checker";

export const metadata = pageMetadata({
  title: "Free Keyword Density Checker for Any Page or Text",
  description: "Analyse any page or pasted text: top 1-, 2- and 3-word phrases with counts and density, plus whether your target keyword is in the title, H1, URL and meta description.",
  path: PATH,
});

const FAQS = [
  {
    q: "What's the ideal keyword density?",
    a: "There isn't one. Google has said for years that it doesn't use a target density. As a sanity check, a main keyword at around 0.5–2% usually reads naturally; above 3% it often reads as stuffing.",
  },
  {
    q: "Why does it only read part of my page?",
    a: "When a page has a <main> element we analyse just that, so the menu, footer and cookie banner don't skew the counts. That's the content search engines weigh most.",
  },
  {
    q: "Which words are left out?",
    a: "Common filler words (the, and, with, for, etc.) are skipped at the start and end of phrases, so the table shows the words that describe your topic.",
  },
];

export default function KeywordDensityCheckerPage() {
  return (
    <ToolPage
      path={PATH}
      name="keyword density checker"
      title="Keyword density checker"
      lead="Analyse any page or pasted text for its most-used phrases, and check whether your target keyword appears where it counts: title, H1, URL, meta description and opening."
      faqs={FAQS}
      widget={<KeywordDensity />}
      guide={
        <>
          <section>
            <h2>Use it to check focus, not to hit a number</h2>
            <ul>
              <li>
                <strong>Your topic should be in the top phrases.</strong> If the top words are &ldquo;shipping&rdquo; and &ldquo;returns&rdquo;, boilerplate is drowning out your product copy.
              </li>
              <li>
                <strong>Put the main keyword where it counts:</strong> the title tag, H1, URL and first paragraph.
              </li>
              <li>
                <strong>Vary the wording.</strong> &ldquo;Linen shirt&rdquo;, &ldquo;linen button-up&rdquo; and &ldquo;shirt in European linen&rdquo; cover more searches than repeating one phrase.
              </li>
            </ul>
            <p>
              Write descriptions that rank and convert with <Link href="/blog/product-descriptions-that-rank-and-convert">this guide</Link>, and check structure with the{" "}
              <Link href="/ai-tools/heading-checker">heading tags checker</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
