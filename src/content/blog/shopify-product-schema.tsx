import Link from "next/link";
import type { Post } from "./types";
import { AppCta, Code, CodeBlock, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        Structured data is a block of machine-readable code on a page that states facts plainly: this is a product, this is
        its price, it&rsquo;s in stock. It&rsquo;s what lets Google show prices, availability and star ratings directly in
        results, and it gives AI assistants facts they can quote rather than infer.
      </p>

      <h2 id="what">What Product schema is</h2>
      <p>
        On Shopify, structured data is usually written as JSON-LD: a <Code>script</Code> tag containing a JSON description of
        the page using the shared <Code>schema.org</Code> vocabulary. Customers never see it; search engines and AI tools do.
      </p>
      <CodeBlock file="product.json-ld">{`{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Relaxed Linen Shirt",
  "image": "https://northfield.com/…/shirt.jpg",
  "brand": { "@type": "Brand", "name": "Northfield" },
  "sku": "NF-LS-001",
  "offers": {
    "@type": "Offer",
    "price": "68.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}`}</CodeBlock>

      <h2 id="default">What your theme probably includes</h2>
      <p>
        Most modern Shopify themes output some Product structured data out of the box, typically name, image, description
        and a basic offer with price, currency and availability. That&rsquo;s a solid start, and it&rsquo;s more than many
        platforms give you.
      </p>
      <p>
        But &ldquo;most&rdquo; isn&rsquo;t &ldquo;all&rdquo;. Older and heavily customized themes vary a lot, and some apps add a
        second, conflicting block. The only way to know what your store outputs is to test a live product URL.
      </p>

      <h2 id="missing">What&rsquo;s commonly missing</h2>
      <ul>
        <li>
          <strong>Product identifiers</strong> such as <Code>gtin</Code> or <Code>mpn</Code>, which help search engines match
          your product with the same item elsewhere.
        </li>
        <li>
          <strong>Brand</strong>, sometimes left out or filled with the store name instead of the actual brand.
        </li>
        <li>
          <strong>Ratings and reviews</strong> (<Code>aggregateRating</Code>, <Code>review</Code>), which usually depend on a
          reviews app adding them.
        </li>
        <li>
          <strong>Shipping and returns</strong> (<Code>shippingDetails</Code>, <Code>hasMerchantReturnPolicy</Code>), which
          Google supports for merchant listings and almost no theme fills in.
        </li>
        <li>
          <strong>Breadcrumbs</strong> (<Code>BreadcrumbList</Code>), which show the page&rsquo;s place in your store
          instead of a raw URL.
        </li>
        <li>
          <strong>Organization</strong> on the home page, which ties your store name, logo and contact details together.
        </li>
      </ul>
      <Note label="Rule of thumb">
        Structured data must match what&rsquo;s visible on the page. Marking up a rating or price that shoppers can&rsquo;t
        see breaks Google&rsquo;s guidelines and can cost you rich results.
      </Note>

      <h2 id="test">How to test it</h2>
      <ol>
        <li>Copy the URL of one of your live product pages.</li>
        <li>
          Run it through Google&rsquo;s <strong>Rich Results Test</strong>, which shows which rich results the page is
          eligible for and any errors.
        </li>
        <li>
          Use the <strong>Schema Markup Validator</strong> at validator.schema.org to see every block on the page, including
          duplicates.
        </li>
        <li>
          In Search Console, check the <strong>Merchant listings</strong> and <strong>Product snippets</strong> reports for
          site-wide issues.
        </li>
      </ol>
      <p>
        Repeat for a collection page, a blog article and your home page. Each page type needs different markup. For the
        on-page side of the same pages, see{" "}
        <Link href="/blog/meta-descriptions-that-get-clicked">Writing meta descriptions that get clicked</Link>.
      </p>

      <AppCta
        title="Turn on complete structured data, no code"
        body="SEO Rating adds Product, Breadcrumb, Collection, Article, Blog, Site search and Organization schema, plus Local Business, through a theme app embed."
      />
    </>
  );
}

export const post: Post = {
  slug: "shopify-product-schema",
  title: "Product schema on Shopify: what’s missing by default",
  description:
    "What Product structured data your Shopify theme likely outputs, the fields most stores are missing (GTIN, brand, reviews, shipping, returns), and how to test your own pages.",
  category: "Technical SEO",
  tags: ["Technical SEO", "Structured data", "Schema", "Shopify"],
  published: "2026-08-27",
  readMinutes: 8,
  cover: { file: "product.json-ld", lines: ['"@type": "Product",', '"brand": { … },', '"offers": { "price": "68.00" },', '"gtin": ?   ← missing'] },
  toc: [
    { id: "what", label: "What Product schema is" },
    { id: "default", label: "What themes include" },
    { id: "missing", label: "What’s commonly missing" },
    { id: "test", label: "How to test it" },
  ],
  Body,
};
