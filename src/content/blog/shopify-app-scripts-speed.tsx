import Link from "next/link";
import type { Post } from "./types";
import { AppCta, Code, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        Apps are the easiest way to add something to a Shopify store, and the easiest way to quietly slow down every
        page in it. Most apps work by injecting a script into your theme through an app embed, and a lot of them load
        that script on every page &mdash; including pages where the app does nothing at all.
      </p>

      <h2 id="why">Why one app can slow every page</h2>
      <p>
        A reviews app only needs to run where reviews are shown &mdash; mostly product pages. But the simplest way for
        an app to guarantee it works everywhere is to add its script to the theme&rsquo;s global layout, so it loads
        on your home page, your collections and your blog too, doing nothing but costing load time. Multiply that by
        however many apps are installed, and a storefront can end up loading a dozen scripts for features that are
        active on a handful of pages.
      </p>

      <h2 id="finding">Finding the culprits</h2>
      <ol>
        <li>
          Open your browser&rsquo;s DevTools <strong>Network</strong> tab on a slow page, sort by size or time, and
          look for domains that aren&rsquo;t yours or Shopify&rsquo;s CDN &mdash; each one is almost always a separate
          app.
        </li>
        <li>
          In a Lighthouse or PageSpeed Insights report, &ldquo;Reduce JavaScript execution time&rdquo; and any
          third-party section in the diagnostics will name the specific scripts and how much main-thread time each
          one costs. See <Link href="/blog/reading-pagespeed-report">reading a PageSpeed report</Link> if the rest of
          that report is unfamiliar.
        </li>
        <li>
          Cross-reference what you find against your actual app list in Shopify admin, and against which app embeds
          are switched on in the theme customizer &mdash; the two don&rsquo;t always match.
        </li>
      </ol>

      <h2 id="audit">A simple audit</h2>
      <p>For every installed app, ask one question: does this exact page need this app&rsquo;s script right now?</p>
      <ul>
        <li>A reviews widget needs to run on product pages. It has no reason to load on your home page.</li>
        <li>A currency converter or upsell popup might genuinely need every page &mdash; that&rsquo;s a reasonable cost.</li>
        <li>
          A chat widget is borderline: useful everywhere, but rarely needs to block the page&rsquo;s initial render to
          do it.
        </li>
      </ul>
      <Note>
        Uninstalling an app doesn&rsquo;t always remove its code from your theme. Some apps leave their embed block or
        a snippet behind even after the app itself is gone &mdash; check <Code>Online Store → Themes → Edit code</Code>{" "}
        for leftover blocks, not just your installed-apps list.
      </Note>

      <h2 id="fixes">What actually helps</h2>
      <ul>
        <li>
          <strong>Uninstall what you don&rsquo;t use</strong>, and confirm the leftover embed block is gone, not just
          switched off.
        </li>
        <li>
          <strong>Scope embeds by template where the app allows it.</strong> Many apps let you restrict their embed to
          specific templates in the theme customizer instead of loading it globally &mdash; a reviews app only needs
          product templates.
        </li>
        <li>
          <strong>Prefer apps that load asynchronously by default.</strong> Well-built apps add their script with{" "}
          <Code>async</Code> or <Code>defer</Code> so it doesn&rsquo;t block rendering; you can usually see this
          directly in the script tag if you view the page source.
        </li>
        <li>
          <strong>Audit the count, not just each app.</strong> A store running fifteen apps, each individually
          reasonable, adds up to a slow store no single app is clearly responsible for. Prune on a schedule, not just
          when something obviously breaks.
        </li>
      </ul>

      <h2 id="after">After you prune</h2>
      <p>
        Re-run the same PageSpeed test you started with, on the same page, and compare it directly against your
        baseline rather than trusting a one-off score. Removing scripts tends to help every Core Web Vital a little,
        but it helps LCP most directly when the removed script was blocking render before the main content could
        appear.
      </p>

      <AppCta
        title="See exactly what each app costs you"
        body="SEO Rating runs real PageSpeed Insights audits with Core Web Vitals, so you can test before and after pruning an app and see precisely what changed, not just guess."
      />
    </>
  );
}

export const post: Post = {
  slug: "shopify-app-scripts-speed",
  title: "Third-party app scripts slowing your Shopify store",
  description:
    "Most Shopify apps add a script to every page, including ones where they do nothing. How to find which apps are actually costing you load time, and what to do about each one.",
  category: "Speed",
  tags: ["Speed", "Shopify apps", "Core Web Vitals"],
  published: "2026-12-03",
  readMinutes: 6,
  cover: {
    file: "network.log",
    lines: ["reviews-app.js    412ms", "chat-widget.js    380ms", "currency-fx.js    290ms", "— 3 apps, every page"],
  },
  toc: [
    { id: "why", label: "Why one app slows every page" },
    { id: "finding", label: "Finding the culprits" },
    { id: "audit", label: "A simple audit" },
    { id: "fixes", label: "What actually helps" },
    { id: "after", label: "After you prune" },
  ],
  Body,
};
