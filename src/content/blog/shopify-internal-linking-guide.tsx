import Link from "next/link";
import type { Post } from "./types";
import { AppCta, CodeBlock, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        Most Shopify SEO advice is about things outside your control: what Google&rsquo;s algorithm weighs this year, what
        a competitor is doing, whether an AI assistant decides to cite you. Internal linking isn&rsquo;t one of those. Every
        link between your own pages is entirely yours to add, remove or rewrite &mdash; and most stores do it by accident,
        through whatever their theme happens to generate, rather than on purpose.
      </p>

      <h2 id="why">Why internal links carry weight</h2>
      <p>
        Authority doesn&rsquo;t spread evenly across a store. Your home page usually holds the most of it, because it
        collects the most external links and the most direct traffic. From there, authority only reaches a product or
        collection page through a link &mdash; your own navigation, a blog post, another product page. A product buried
        three clicks deep with nothing else linking to it is mostly invisible to that flow, no matter how good the page is.
      </p>
      <p>
        Links also help search engines understand what a page is about. A link reading &ldquo;our linen shirts&rdquo;
        pointing at a collection tells Google more about that collection than the collection&rsquo;s own title tag does on
        its own. &ldquo;Click here&rdquo; tells it nothing.
      </p>

      <h2 id="shopify-defaults">What your theme already does for you</h2>
      <p>Shopify and most themes give you a baseline of internal links without any effort:</p>
      <ul>
        <li>Your main navigation and footer menus.</li>
        <li>
          Breadcrumbs on product and collection pages, which can carry{" "}
          <Link href="/blog/shopify-product-schema">BreadcrumbList structured data</Link> as well as a visible trail.
        </li>
        <li>App-generated &ldquo;related products&rdquo; or &ldquo;you may also like&rdquo; blocks.</li>
        <li>Your XML sitemap, which lists every page but doesn&rsquo;t link between them.</li>
      </ul>
      <Note>
        These are necessary, but structural. A related-products block picks items by tags or collection membership, not by
        genuine relevance, and it carries less signal than a real sentence linking to a real page for a real reason. The
        defaults get you discoverable; they don&rsquo;t get you deliberate.
      </Note>

      <h2 id="model">Think hub and spoke, not a flat list</h2>
      <p>
        A Shopify store&rsquo;s natural shape is a pyramid: the home page at the top, collections as hubs underneath, and
        products as the spokes off each hub. Blog posts are a second entrance &mdash; people land on them from search
        without ever touching your nav &mdash; and they&rsquo;re only useful if they feed back into that pyramid instead of
        dead-ending.
      </p>
      <CodeBlock file="store structure">{`/                              (home)
  /collections/shirts         (hub)
    /products/linen-shirt     (spoke)
    /products/cotton-shirt    (spoke)
  /blog/how-to-style-linen    (entrance)
    → links into /collections/shirts and specific products`}</CodeBlock>

      <h2 id="products-collections">Linking products and collections on purpose</h2>
      <ul>
        <li>
          <strong>Link out from product descriptions.</strong> Name the collection it belongs to and link it, instead of
          relying only on breadcrumbs. Add two or three genuine cross-sells in the copy &mdash; &ldquo;pairs well with our
          linen trousers&rdquo; &mdash; rather than leaving that entirely to an automated carousel.
        </li>
        <li>
          <strong>Give collection pages real content, not just a grid.</strong> A short paragraph above or below the
          product grid is a natural place to link to sibling collections and a couple of standout products, and it&rsquo;s
          the only place on that page for a link with chosen anchor text.
        </li>
        <li>
          <strong>Don&rsquo;t let filtered or tag pages become dead ends.</strong> If a page like a single-tag collection
          view exists and is crawlable, either link to it from somewhere relevant or stop linking to it at all &mdash; an
          unlinked page with no content of its own is the worst of both.
        </li>
      </ul>

      <h2 id="blog">Using blog posts as entry points</h2>
      <p>
        A blog post that ranks for an informational search is only half the job. The other half is where it sends that
        visitor next. Link from the specific sentence discussing a product or collection, using the kind of phrase a
        shopper would recognise &mdash; &ldquo;our linen shirts come in four colours&rdquo; &mdash; rather than a generic
        &ldquo;shop now&rdquo; banner dropped at the end.
      </p>
      <p>
        Link between blog posts too, where one genuinely extends another, to keep both readers and crawlers moving through
        your content instead of bouncing back to search. But the links that lead to a product or collection are the ones
        doing the revenue work, so don&rsquo;t bury them under a pile of &ldquo;related reading.&rdquo;
      </p>

      <h2 id="how-many">Anchor text, and how many links is too many</h2>
      <ul>
        <li>
          <strong>Vary the anchor text.</strong> Linking the exact same phrase to the same page every time looks mechanical
          and wastes the chance to describe the destination a different way for a different reader.
        </li>
        <li>
          <strong>Fewer, better links beat many.</strong> A paragraph with three or four links competing for attention
          dilutes all of them. Link the two or three things in a page that genuinely deserve it.
        </li>
        <li>
          <strong>Save nofollow for outbound links you don&rsquo;t vouch for.</strong> Links between your own pages should
          almost never carry it.
        </li>
      </ul>

      <h2 id="routine">A simple routine</h2>
      <ol>
        <li>List the 10 collections you most want to rank and sell. For each, find at least three other pages &mdash; a
          blog post, a related collection, a product description &mdash; that could reasonably link to it, and add the
          link.</li>
        <li>Open your 10 highest-traffic blog posts and confirm each one links to at least one relevant product or
          collection.</li>
        <li>
          When you rename or remove a page, make sure anything that linked to it gets redirected or updated &mdash; see our
          guide to <Link href="/blog/shopify-duplicate-urls-canonical">duplicate URLs and canonical tags</Link> for what
          happens when it doesn&rsquo;t.
        </li>
        <li>Repeat quarterly as your catalogue changes, rather than once and forgetting it.</li>
      </ol>

      <AppCta
        title="Find pages that aren't getting enough internal links"
        body="SEO Rating's SEO Health checklist audits every product, collection, page and article, including how many internal links point in and out, so you know exactly where to link next."
      />
    </>
  );
}

export const post: Post = {
  slug: "shopify-internal-linking-guide",
  title: "Internal linking for Shopify: connecting collections, products and blog posts",
  description:
    "Why internal links are the one SEO lever entirely in your control, what your theme already does for you, and a practical model for linking collections, products and blog posts on purpose.",
  category: "Internal linking",
  tags: ["Internal linking", "Site structure", "Shopify SEO"],
  published: "2026-11-23",
  readMinutes: 7,
  cover: {
    file: "linking.txt",
    lines: ["/ (home)", "  /collections/shirts", "    /products/linen-shirt", "  /blog/how-to-style-linen", "    → links to collection"],
  },
  toc: [
    { id: "why", label: "Why internal links matter" },
    { id: "shopify-defaults", label: "What your theme already does" },
    { id: "model", label: "Hub and spoke, not a flat list" },
    { id: "products-collections", label: "Products and collections" },
    { id: "blog", label: "Blog posts as entry points" },
    { id: "how-many", label: "Anchor text and how many" },
    { id: "routine", label: "A simple routine" },
  ],
  Body,
};
