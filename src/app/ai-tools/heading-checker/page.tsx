import Link from "next/link";
import { HeadingChecker } from "@/components/tools/HeadingChecker";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/heading-checker";

export const metadata = pageMetadata({
  title: "Heading Checker: See Any Page's H1–H6 Structure (Free)",
  description: "Enter a page URL to see its H1 to H6 heading outline as search engines read it, and catch missing or duplicate H1s, skipped levels and empty headings. Free.",
  path: PATH,
});

const FAQS = [
  {
    q: "Can a page have more than one H1?",
    a: "Google says multiple H1s don't cause problems, but one clear H1 makes the page's main topic unambiguous to every search engine, AI assistant and screen reader. Shopify themes often add extra H1s around the logo, which is worth fixing.",
  },
  {
    q: "What's a skipped heading level?",
    a: "Going from an H2 straight to an H4 with no H3 in between. It doesn't hurt rankings directly, but screen reader users navigate by heading level, and a broken outline makes the page harder to follow.",
  },
  {
    q: "Why are some headings in the menu or footer?",
    a: "Many themes use heading tags to style menu titles and footer columns. They add noise to the outline. Ideally headings are reserved for the content's structure, with styling done in CSS.",
  },
];

export default function HeadingCheckerPage() {
  return (
    <ToolPage
      path={PATH}
      name="heading tags checker"
      title="Heading tags checker (H1–H6)"
      lead="See a page's H1–H6 outline the way search engines and screen readers read it, and catch missing or multiple H1s, skipped levels and empty headings."
      faqs={FAQS}
      widget={<HeadingChecker />}
      guide={
        <>
          <section>
            <h2>A clean heading structure</h2>
            <ul>
              <li>
                <strong>One H1</strong> that says what the page is: the product name, collection name or article title.
              </li>
              <li>
                <strong>H2s for the main sections</strong>: description, reviews, shipping, related products.
              </li>
              <li>
                <strong>H3s under them</strong> only when a section has sub-parts.
              </li>
              <li>
                <strong>Headings for structure, not looks.</strong> If you only want bigger text, style it instead.
              </li>
            </ul>
            <p>
              Check how your title and description appear in search with the <Link href="/ai-tools/serp-snippet-preview">search snippet preview</Link>, and how often you mention your topic with the{" "}
              <Link href="/ai-tools/keyword-density-checker">keyword density checker</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
