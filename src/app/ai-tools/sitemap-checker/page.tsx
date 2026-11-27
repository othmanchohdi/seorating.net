import Link from "next/link";
import { SitemapChecker } from "@/components/tools/SitemapChecker";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/sitemap-checker";

export const metadata = pageMetadata({
  title: "Free XML Sitemap Checker & Validator",
  description: "Enter a domain to find and validate its XML sitemap: count URLs by type, check lastmod dates and robots.txt, and test a sample of URLs for redirects and 404s. Free.",
  path: PATH,
});

const FAQS = [
  {
    q: "Does Shopify create a sitemap automatically?",
    a: "Yes. Every Shopify store has one at /sitemap.xml, split into products, collections, pages, blogs and articles, and Shopify keeps it up to date. You can't edit it directly, but you can control what's in it by hiding pages from search with the seo.hidden metafield.",
  },
  {
    q: "Why should a sitemap only list working pages?",
    a: "Search engines treat the sitemap as your list of pages worth indexing. Redirects and 404s in it waste crawl time and make the whole file less trustworthy, so they may crawl it less often.",
  },
  {
    q: "Do I need to submit my sitemap to Google?",
    a: "It helps. Listing it in robots.txt lets every crawler find it; submitting it in Google Search Console and Bing Webmaster Tools also gets you reports on which URLs were indexed and why others weren't.",
  },
];

export default function SitemapCheckerPage() {
  return (
    <ToolPage
      path={PATH}
      name="sitemap checker"
      title="Sitemap checker"
      lead="Enter a domain to find its XML sitemap, count every URL by type, and test a sample of the listed pages for redirects and errors."
      faqs={FAQS}
      widget={<SitemapChecker />}
      guide={
        <>
          <section>
            <h2>What a healthy sitemap looks like</h2>
            <ul>
              <li>
                <strong>Listed in robots.txt</strong> with a <code>Sitemap:</code> line.
              </li>
              <li>
                <strong>Only live, canonical URLs:</strong> no redirects, 404s, or filtered and paginated duplicates.
              </li>
              <li>
                <strong>Accurate lastmod dates</strong> that change only when the page really changes.
              </li>
              <li>
                <strong>Under 50,000 URLs and 50 MB per file</strong>, split with a sitemap index beyond that.
              </li>
            </ul>
            <p>
              Test which crawlers your robots.txt lets in with the <Link href="/ai-tools/robots-txt-tester">robots.txt tester</Link>, and give AI assistants a curated map of your site with the{" "}
              <Link href="/ai-tools/llms-txt-generator">llms.txt generator</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
