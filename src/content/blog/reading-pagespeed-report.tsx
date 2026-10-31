import type { Post } from "./types";
import { VitalsMeter } from "@/components/blog/VitalsMeter";
import { AppCta, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        Run your store through Google PageSpeed Insights and you get a big number, four coloured circles and a long list
        of &ldquo;opportunities&rdquo; written for developers. Here&rsquo;s how to read it as a store owner: what matters,
        what doesn&rsquo;t, and what to hand to whoever maintains your theme.
      </p>

      <h2 id="two-reports">Two reports in one</h2>
      <p>PageSpeed Insights actually shows two different things, and mixing them up causes most of the confusion:</p>
      <ul>
        <li>
          <strong>Field data</strong>, at the top, comes from real Chrome users who visited your page over the past 28 days.
          It only appears when Google has enough visits. This is what Google uses when it assesses page experience.
        </li>
        <li>
          <strong>Lab data</strong>, below, is a single simulated test run on the spot. On mobile it emulates a mid-range
          phone on a slow connection. It&rsquo;s great for diagnosing problems, but it&rsquo;s one run, and it varies.
        </li>
      </ul>
      <p>If the two disagree, trust the field data for &ldquo;how are we doing&rdquo; and the lab data for &ldquo;why&rdquo;.</p>

      <h2 id="vitals">The three numbers that matter</h2>
      <p>Core Web Vitals are Google&rsquo;s chosen measures of real user experience:</p>
      <ul>
        <li>
          <strong>LCP (Largest Contentful Paint)</strong>: how long until the main content, often your hero image or product
          photo, appears. Good is <strong>2.5 seconds</strong> or less.
        </li>
        <li>
          <strong>INP (Interaction to Next Paint)</strong>: how quickly the page responds when someone taps or clicks, like
          choosing a size. Good is <strong>200 milliseconds</strong> or less. It only comes from field data.
        </li>
        <li>
          <strong>CLS (Cumulative Layout Shift)</strong>: how much the page jumps around while loading. Good is{" "}
          <strong>0.1</strong> or less.
        </li>
      </ul>
      <p>
        Each is judged at the 75th percentile of visits, so most of your visitors, not just the ones on fast Wi-Fi, need a
        good experience. Move the sliders to see how the thresholds work together:
      </p>
      <VitalsMeter />

      <h2 id="score">What the big score means</h2>
      <p>
        The 0 to 100 Performance score is a weighted summary of the lab test only. It&rsquo;s useful for tracking changes
        over time on the same page, but it isn&rsquo;t a ranking factor in itself, and it&rsquo;ll bounce a few points between
        runs. Don&rsquo;t chase 100; chase green Core Web Vitals.
      </p>
      <p>
        The other three circles (Accessibility, Best practices and SEO) are automated checklists. They&rsquo;re worth
        fixing, but a perfect SEO score there only means the basics are in place.
      </p>

      <h2 id="fixes">Common Shopify culprits</h2>
      <ul>
        <li>
          <strong>Oversized hero images.</strong> A 2 to 3 MB banner is the most common cause of slow LCP. Upload images at
          the size they&rsquo;re displayed, and let Shopify serve modern formats.
        </li>
        <li>
          <strong>Too many apps.</strong> Each app can add scripts to every page, even pages where it does nothing. Remove
          apps you don&rsquo;t use; uninstalling doesn&rsquo;t always remove leftover theme code, so check.
        </li>
        <li>
          <strong>Sliders and pop-ups.</strong> Auto-playing carousels and pop-ups that load late are common causes of poor
          INP and CLS.
        </li>
        <li>
          <strong>Web fonts.</strong> Several font families and weights add up. Two weights of one family usually suffice.
        </li>
      </ul>
      <Note label="What you can ignore">
        &ldquo;Reduce unused JavaScript&rdquo; warnings pointing at Shopify&rsquo;s own checkout or analytics scripts. You
        can&rsquo;t remove those, and they&rsquo;re loaded efficiently.
      </Note>

      <h2 id="routine">A simple routine</h2>
      <ol>
        <li>Test four page types: home, a product, a collection and a blog post.</li>
        <li>Save the results as your baseline.</li>
        <li>Re-test after every theme change or new app install.</li>
        <li>Hand the specific findings, not the score, to whoever maintains your theme.</li>
      </ol>

      <AppCta
        title="Run PageSpeed audits from inside Shopify"
        body="SEO Rating tests your home page, a product, a collection and a blog post for mobile and desktop, with Core Web Vitals explained in plain language."
      />
    </>
  );
}

export const post: Post = {
  slug: "reading-pagespeed-report",
  title: "Reading a PageSpeed report without the jargon",
  description:
    "How to read Google PageSpeed Insights for a Shopify store: field vs lab data, the Core Web Vitals thresholds that matter (LCP, INP, CLS), and the fixes worth making first.",
  category: "Speed",
  tags: ["Speed", "Core Web Vitals", "PageSpeed Insights", "Shopify"],
  published: "2026-08-13",
  updated: "2026-10-31",
  readMinutes: 6,
  cover: { file: "pagespeed.json", lines: ['"LCP": "2.1 s"   ✓ good', '"INP": "160 ms"  ✓ good', '"CLS": "0.04"    ✓ good', '"score": 92'] },
  toc: [
    { id: "two-reports", label: "Two reports in one" },
    { id: "vitals", label: "The three numbers" },
    { id: "score", label: "The big score" },
    { id: "fixes", label: "Common culprits" },
    { id: "routine", label: "A simple routine" },
  ],
  Body,
};
