import Link from "next/link";
import { SchemaBuilder } from "@/components/blog/SchemaBuilder";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/product-schema-generator";

export const metadata = pageMetadata({
  title: "Free Product Schema Generator (JSON-LD) for Shopify",
  description: "Build valid Product structured data: name, price, GTIN, brand, reviews, shipping and returns. See exactly what a typical Shopify theme outputs versus a complete block. Free.",
  path: PATH,
});

const FAQS = [
  {
    q: "Does my Shopify theme already output Product schema?",
    a: "Most modern themes output the basics: name, image, description and an offer with price, currency and availability. Older or heavily customised themes vary, and some apps add a second, conflicting block. View source on a live product page to see what yours actually sends.",
  },
  {
    q: "What does Google need for rich results and merchant listings?",
    a: "name, image and offers (price, currency, availability) are required. Everything else here is recommended: it adds ratings, GTIN, brand, shipping and returns to what can show in search, but its absence doesn't disqualify the page.",
  },
  {
    q: "Can I mark up a rating or return policy my store doesn't really have?",
    a: "No. Structured data must match what's visible on the page. Marking up a rating with no visible reviews, or shipping terms that aren't real, breaks Google's guidelines and can get rich results suppressed sitewide.",
  },
];

export default function ProductSchemaGenerator() {
  return (
    <ToolPage
      path={PATH}
      name="product schema generator"
      title="Product schema generator"
      lead="Toggle fields to build valid Product JSON-LD, from what a typical Shopify theme outputs to a complete block. Copy the result straight into your theme."
      faqs={FAQS}
      widget={<SchemaBuilder />}
      guide={
        <>
          <section>
            <h2>What&rsquo;s commonly missing</h2>
            <ul>
              <li><strong>Product identifiers</strong> like <code className="inline-code">gtin</code>, usually missing because the variant&rsquo;s barcode field is empty.</li>
              <li><strong>Brand</strong>, sometimes left out or filled with the store name instead of the actual brand.</li>
              <li><strong>Ratings and reviews</strong> (<code className="inline-code">aggregateRating</code>), which depend on a reviews app adding them.</li>
              <li><strong>Shipping and returns</strong> (<code className="inline-code">shippingDetails</code>, <code className="inline-code">hasMerchantReturnPolicy</code>), which almost no theme fills in by default.</li>
            </ul>
          </section>
          <section>
            <h2>How to test a live page</h2>
            <ol>
              <li>Run the product URL through Google&rsquo;s Rich Results Test to see which rich results it&rsquo;s eligible for.</li>
              <li>Use the Schema Markup Validator at validator.schema.org to see every block on the page, including duplicates.</li>
              <li>Check the Merchant listings and Product snippets reports in Search Console for sitewide issues.</li>
            </ol>
            <p>
              For the full picture of what Shopify themes leave out and why it matters, read{" "}
              <Link href="/blog/shopify-product-schema">Product schema on Shopify: what&rsquo;s missing by default</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
