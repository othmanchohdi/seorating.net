import type { Post } from "./types";
import { AppCta, Code, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        Google Search Console (GSC) is Google&rsquo;s own reporting tool for how your site behaves in
        its search results — not a third-party estimate, the actual data. It&rsquo;s free, and it
        answers questions no SEO tool can guess at from the outside: which exact queries bring people
        to your store, which pages are indexed, and why a given page isn&rsquo;t showing up at all.
      </p>
      <Note>
        GSC doesn&rsquo;t rank your site and it isn&rsquo;t a ranking tracker. It&rsquo;s closer to a
        diagnostics panel — it tells you what&rsquo;s true, and leaves the fixing to you.
      </Note>

      <h2 id="connecting">Connecting it to your store</h2>
      <p>
        Verification is the only fiddly part, and Shopify makes the easiest method — a DNS TXT record
        or an HTML meta tag — straightforward to add. A few things worth getting right from the start:
      </p>
      <ul>
        <li>
          <strong>Verify the domain property, not just the URL-prefix property.</strong> A domain
          property covers http, https, www and non-www together, which matches how Shopify stores are
          actually served and avoids data getting split across variants.
        </li>
        <li>
          <strong>Add every user who should see the data</strong> as a user on the property directly
          in GSC, rather than sharing one login — ownership transfers cleanly if you later change who
          manages SEO.
        </li>
        <li>
          <strong>Submit your sitemap</strong> once verification is done — Shopify generates one
          automatically at <Code>/sitemap.xml</Code>.
        </li>
      </ul>

      <h2 id="reports">The reports worth your time</h2>
      <p>GSC has a lot of surface area. Four reports do most of the useful work:</p>
      <h3>Performance</h3>
      <p>
        Queries, clicks, impressions and average position, filterable by page, query, country and
        device. This is where you find out what people actually typed to find you — often different
        from what you assumed you were targeting.
      </p>
      <h3>Coverage / Pages (Indexing)</h3>
      <p>
        Which URLs are indexed, which are excluded, and the reason for each exclusion — crawled but
        not indexed, blocked by robots.txt, marked noindex, duplicate without a user-selected
        canonical, and more. This is the fastest way to find out a page you care about simply
        isn&rsquo;t in the index.
      </p>
      <h3>Sitemaps</h3>
      <p>
        Confirms Google can actually read your sitemap and shows how many of the submitted URLs were
        indexed versus discovered-but-not-indexed.
      </p>
      <h3>Core Web Vitals</h3>
      <p>
        Field data — real visitor measurements, not a lab test — grouped by URL group, flagging pages
        with poor loading, interactivity or layout stability at a scale PageSpeed Insights can&rsquo;t
        show you page by page.
      </p>

      <h2 id="reading">Reading Performance data correctly</h2>
      <p>A few habits prevent the most common misreadings:</p>
      <ul>
        <li>
          <strong>High impressions, low clicks</strong> usually points at the title and meta
          description, not the content — you&rsquo;re showing up, but the listing isn&rsquo;t earning
          the click.
        </li>
        <li>
          <strong>Average position is an average, not a guarantee.</strong> A page averaging position
          8 might sit at position 2 for one valuable query and position 20 for ten irrelevant ones —
          filter by query before drawing conclusions.
        </li>
        <li>
          <strong>Compare like periods.</strong> Shopify traffic is seasonal; compare the last 28 days
          to the same 28 days a year earlier, not to last month, before calling a dip a problem.
        </li>
      </ul>

      <h2 id="shopify-issues">Issues it&rsquo;s especially good at catching</h2>
      <p>A handful of problems show up in GSC before they show up anywhere else:</p>
      <ul>
        <li>
          <strong>Duplicate product URLs via collections.</strong> The same product reachable through
          several collection paths can appear as near-duplicate URLs competing with each other instead
          of one URL getting full credit.
        </li>
        <li>
          <strong>Soft 404s.</strong> Pages that return a 200 status but show essentially no content —
          a common result of a sold-out product left live with an empty page.
        </li>
        <li>
          <strong>Pages excluded by noindex you didn&rsquo;t mean to set</strong>, often left over from
          a theme change or an app that touched page settings.
        </li>
      </ul>

      <h2 id="routine">A simple monthly routine</h2>
      <ol>
        <li>Check the Coverage report for new exclusions since last month.</li>
        <li>Scan Performance for queries with high impressions and low click-through rate, and rewrite those titles and descriptions.</li>
        <li>Spot-check Core Web Vitals for any URL group that newly dropped into &ldquo;poor.&rdquo;</li>
        <li>Re-submit the sitemap after any large catalogue change.</li>
      </ol>
      <p>
        None of this takes long once it&rsquo;s a habit — the value comes from catching a problem in
        month one instead of noticing a slow traffic decline in month six.
      </p>

      <AppCta
        title="See your real Search Console data next to every page"
        body="SEO Rating connects to Google Search Console and shows queries, impressions and indexing status alongside the pages they belong to."
      />
    </>
  );
}

export const post: Post = {
  slug: "google-search-console-shopify-guide",
  title: "Google Search Console for Shopify merchants: the complete guide",
  description:
    "What Search Console actually tells you, how to connect it to a Shopify store, the reports worth your time, and the indexing issues it's especially good at catching.",
  category: "Technical SEO",
  tags: ["Technical SEO", "Google Search Console", "Shopify"],
  published: "2026-11-04",
  readMinutes: 8,
  cover: { file: "search-console.md", lines: ["# Search Console", "> Ground truth from Google.", "", "## Reports", "- Performance", "- Coverage"] },
  toc: [
    { id: "connecting", label: "Connecting it to your store" },
    { id: "reports", label: "The reports worth your time" },
    { id: "reading", label: "Reading Performance data" },
    { id: "shopify-issues", label: "Issues it's good at catching" },
    { id: "routine", label: "A simple monthly routine" },
  ],
  Body,
};
