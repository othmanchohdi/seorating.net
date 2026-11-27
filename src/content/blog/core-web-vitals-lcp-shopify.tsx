import Link from "next/link";
import type { Post } from "./types";
import { AppCta, Code, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        Of the three Core Web Vitals, <Link href="/blog/reading-pagespeed-report">LCP, INP and CLS</Link>, LCP is the one
        most Shopify stores fail first and the one worth fixing first. It&rsquo;s also the most direct: one element on the
        page is slow, and the fix is almost always about that one element, not a vague &ldquo;make the site faster.&rdquo;
      </p>

      <h2 id="what">What LCP actually measures</h2>
      <p>
        Largest Contentful Paint is the time until the biggest visible element on the page &mdash; usually a hero image,
        a product photo, or a block of heading text &mdash; finishes rendering. Not when the page starts loading, not when
        it&rsquo;s fully interactive: when that one specific thing appears. Good is <strong>2.5 seconds</strong> or less,
        measured at the 75th percentile of real visits.
      </p>
      <p>
        On a Shopify store, the LCP element is almost always one of: the home page&rsquo;s hero banner, the main product
        photo on a product page, or the first row of images on a collection page.
      </p>

      <h2 id="find">Finding your LCP element</h2>
      <ol>
        <li>
          Run the page through Google PageSpeed Insights or Chrome DevTools&rsquo; Lighthouse panel. Both name the LCP
          element directly in the report &mdash; don&rsquo;t guess.
        </li>
        <li>
          Lighthouse also breaks the time down into phases: <Code>TTFB</Code> (server response), load delay, load time and
          render delay. Which phase is largest tells you what kind of fix you need.
        </li>
        <li>
          If the element is an image, the load delay and load time phases usually dominate. If it&rsquo;s text, render
          delay &mdash; something blocking the browser from painting &mdash; is the more likely culprit.
        </li>
      </ol>

      <h2 id="images">When the LCP element is an image</h2>
      <ul>
        <li>
          <strong>Upload at display size.</strong> A 4000px-wide photo shown in an 800px-wide slot forces the browser to
          download and downscale it. Resize before upload; don&rsquo;t rely on CSS to shrink it.
        </li>
        <li>
          <strong>Let Shopify serve modern formats.</strong> Shopify&rsquo;s CDN already serves WebP automatically to
          browsers that support it when you use the theme&rsquo;s standard image tags &mdash; don&rsquo;t fight this with a
          custom app that forces JPEG.
        </li>
        <li>
          <strong>Preload it, don&rsquo;t lazy-load it.</strong> Lazy-loading exists to delay images below the fold.
          Applied to the LCP element itself &mdash; the hero banner or main product photo &mdash; it does the opposite of
          what you want: it tells the browser to wait before even starting the download. Most themes handle this
          correctly by default; a theme customization or app that adds <Code>loading=&quot;lazy&quot;</Code> to every image
          indiscriminately is a common regression.
        </li>
      </ul>

      <h2 id="text">When the LCP element is text</h2>
      <p>
        A heading block only paints once the browser has the fonts and CSS it needs. The usual causes are a web font that
        takes too long to arrive, or render-blocking CSS and JavaScript ahead of it in the page.
      </p>
      <ul>
        <li>Limit web fonts to one or two weights of one family; each additional weight is another file to wait for.</li>
        <li>
          Use <Code>font-display: swap</Code> (most Shopify themes already do) so text shows in a fallback font rather
          than staying invisible while the custom font loads.
        </li>
        <li>
          Scripts that aren&rsquo;t needed to render the visible page &mdash; chat widgets, review carousels, marketing
          pixels &mdash; should load after the LCP element, not block it. This is almost always a theme or app loading
          order problem, not something you fix with image settings.
        </li>
      </ul>
      <Note>
        Third-party apps are a frequent, hidden cause here: an app that injects a script tag into every page&rsquo;s{" "}
        <Code>&lt;head&gt;</Code> can delay rendering even on pages where it does nothing visible. If LCP is slow
        storewide rather than on one template, check what&rsquo;s loading before your content, not just the content
        itself.
      </Note>

      <h2 id="verify">Confirming the fix</h2>
      <p>
        Lab tests (a single simulated run) will show an improvement immediately, but they vary run to run. The number that
        matters is the field data &mdash; real visitors, over the past 28 days &mdash; which takes time to refresh. Re-run
        the test after a change, then check back in a week or two to confirm the field data agrees before calling it fixed.
      </p>

      <AppCta
        title="Catch LCP regressions before they cost you rankings"
        body="SEO Rating runs real PageSpeed Insights audits for your home page, a product, a collection and a blog post, with Core Web Vitals and field data when Google has enough of it, on mobile and desktop."
      />
    </>
  );
}

export const post: Post = {
  slug: "core-web-vitals-lcp-shopify",
  title: "Core Web Vitals on Shopify: fixing LCP first",
  description:
    "LCP is the Core Web Vital most Shopify stores fail first. How to find the exact element that's slow, why it's usually an image or a font, and the fixes that actually move the number.",
  category: "Speed",
  tags: ["Speed", "Core Web Vitals", "LCP", "Shopify"],
  published: "2026-12-07",
  readMinutes: 7,
  cover: {
    file: "lcp.json",
    lines: ['"element": "hero-img"', '"LCP": "4.1 s"   ✗ poor', '"loadDelay": "2.3 s"', '"fix": "remove lazy-load"'],
  },
  toc: [
    { id: "what", label: "What LCP measures" },
    { id: "find", label: "Finding your LCP element" },
    { id: "images", label: "When it's an image" },
    { id: "text", label: "When it's text" },
    { id: "verify", label: "Confirming the fix" },
  ],
  Body,
};
