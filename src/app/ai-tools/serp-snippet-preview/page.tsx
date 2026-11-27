import Link from "next/link";
import { SerpPreview } from "@/components/blog/SerpPreview";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/serp-snippet-preview";

export const metadata = pageMetadata({
  title: "Free Google Snippet Preview Tool (SERP Preview)",
  description: "Preview how your title tag and meta description will look in Google search results, and see exactly where desktop truncates them. Free, no signup.",
  path: PATH,
});

const FAQS = [
  {
    q: "How many characters can a title or description be?",
    a: "There's no fixed character limit. Google truncates by rendered pixel width, so a title full of wide capital letters gets cut sooner than one in lowercase. As a rough guide, keep titles under ~60 characters and descriptions under ~155 to avoid truncation on most desktop results.",
  },
  {
    q: "What happens if I leave the meta description empty?",
    a: "Google generates its own snippet from page content, often picking text that doesn't sell the page or match the search query. Writing your own gives you control over the first thing a searcher reads.",
  },
  {
    q: "Will Google always show exactly what I write?",
    a: "No. Google rewrites titles and descriptions for a meaningful share of results when it judges something else better matches the query. Writing a good one makes that less likely, but this preview shows your input, not a guarantee.",
  },
];

export default function SerpSnippetPreview() {
  return (
    <ToolPage
      path={PATH}
      name="search snippet preview"
      title="Google search snippet preview"
      lead="Type your title and meta description and see exactly how they'd render in Google, with the point where desktop results get cut off."
      faqs={FAQS}
      widget={<SerpPreview />}
      guide={
        <>
          <section>
            <h2>A structure that works</h2>
            <p>For product pages, a reliable pattern is: what it is, in the words a shopper would search; the detail that sets it apart (material, fit, origin); then a reason to choose you (free shipping, returns window, warranty).</p>
            <p>Collections need a different angle: what&rsquo;s in the range and roughly how many options, who it&rsquo;s for, and the same store-wide reason to buy.</p>
          </section>
          <section>
            <h2>Don&rsquo;t forget the title tag</h2>
            <p>
              The title is the blue link itself and the strongest on-page relevance signal you control. It should still say what the page is about before any
              style points.
            </p>
            <p>
              See worked before/after examples in <Link href="/blog/meta-descriptions-that-get-clicked">writing meta descriptions that get clicked</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
