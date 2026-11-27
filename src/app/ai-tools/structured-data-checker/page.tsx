import Link from "next/link";
import { StructuredDataChecker } from "@/components/blog/StructuredDataChecker";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/structured-data-checker";

export const metadata = pageMetadata({
  title: "Free Structured Data Checker (Live JSON-LD Validator)",
  description: "Enter any page URL to see its live JSON-LD: every schema type found, whether it parses, and what a Product block is missing for merchant listings. Free.",
  path: PATH,
});

const FAQS = [
  {
    q: "How is this different from Google's Rich Results Test?",
    a: "Google's tool tells you which rich results a page is eligible for. This tool shows the raw JSON-LD and flags common gaps (missing price, currency, availability, brand) so you can see what to add before running the official test.",
  },
  {
    q: "Why does it show different structured data than what I see in the browser?",
    a: "This reads the HTML a crawler receives with no JavaScript run, the same as Google and AI crawlers. If your structured data is injected by a script after the page loads, it may be invisible here and to crawlers that don't execute JavaScript.",
  },
  {
    q: "It says my JSON-LD doesn't parse. What does that mean?",
    a: "A script tag with type=\"application/ld+json\" contains invalid JSON, often a stray comma or an unescaped quote. Search engines ignore the entire block when this happens, even if most of it is correct.",
  },
];

export default function StructuredDataCheckerPage() {
  return (
    <ToolPage
      path={PATH}
      name="structured data checker"
      title="Structured data checker"
      lead="Paste a page URL to see its live JSON-LD: every schema type found, whether it parses, and what's missing for merchant listings."
      faqs={FAQS}
      widget={<StructuredDataChecker />}
      guide={
        <>
          <section>
            <h2>What to check on each page type</h2>
            <ul>
              <li><strong>Homepage:</strong> Organization or OnlineStore, with name, logo and social links.</li>
              <li><strong>Product pages:</strong> Product with name, image and an offer (price, currency, availability).</li>
              <li><strong>Any page:</strong> BreadcrumbList, so search results show the page&rsquo;s place in your store instead of a raw URL.</li>
            </ul>
            <p>
              Want to build a complete Product block instead of auditing one? Try the{" "}
              <Link href="/ai-tools/product-schema-generator">product schema generator</Link>, or read{" "}
              <Link href="/blog/shopify-product-schema">what Shopify themes leave out by default</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
