import Link from "next/link";
import { VitalsMeter } from "@/components/blog/VitalsMeter";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/core-web-vitals-checker";

export const metadata = pageMetadata({
  title: "Core Web Vitals Checker: LCP, INP & CLS Thresholds",
  description: "See Google's good/needs-improvement/poor thresholds for LCP, INP and CLS, and test your own numbers against them at the 75th percentile Google actually uses.",
  path: PATH,
});

const FAQS = [
  {
    q: "What are LCP, INP and CLS?",
    a: "LCP (Largest Contentful Paint) is how long until the main content appears, good at 2.5s or less. INP (Interaction to Next Paint) is how quickly the page responds to a tap or click, good at 200ms or less. CLS (Cumulative Layout Shift) is how much the page jumps while loading, good at 0.1 or less.",
  },
  {
    q: "Where do I get my site's real numbers?",
    a: "PageSpeed Insights and Search Console's Core Web Vitals report use real visitor data (the Chrome User Experience Report) for sites with enough traffic. Lighthouse and PageSpeed's lab test simulate a single load instead, which is useful for debugging but isn't what Google ranks on.",
  },
  {
    q: "Does a perfect PageSpeed score mean I pass Core Web Vitals?",
    a: "No. The 0-100 Performance score is a weighted lab-only summary and isn't a ranking factor itself. A page can score high in the lab test and still fail Core Web Vitals in the field if real visitors on slower connections have a worse experience.",
  },
];

export default function CoreWebVitalsChecker() {
  return (
    <ToolPage
      path={PATH}
      name="Core Web Vitals checker"
      title="Core Web Vitals checker"
      lead="Drag the sliders or pick a scenario to see how LCP, INP and CLS combine into a pass or fail, judged at the 75th percentile of real visits like Google does."
      faqs={FAQS}
      widget={<VitalsMeter />}
      guide={
        <>
          <section>
            <h2>Common Shopify culprits</h2>
            <ul>
              <li><strong>Oversized hero images.</strong> A 2-3 MB banner is the most common cause of slow LCP. Upload images at the size they&rsquo;re displayed.</li>
              <li><strong>Too many apps.</strong> Each app can add scripts to every page, even ones where it does nothing. Uninstalling doesn&rsquo;t always remove leftover theme code.</li>
              <li><strong>Sliders and pop-ups.</strong> Auto-playing carousels and late-loading pop-ups are common causes of poor INP and CLS.</li>
              <li><strong>Web fonts.</strong> Several font families and weights add up; two weights of one family usually suffice.</li>
            </ul>
          </section>
          <section>
            <h2>A simple routine</h2>
            <ol>
              <li>Test four page types: home, a product, a collection and a blog post.</li>
              <li>Save the results as your baseline.</li>
              <li>Re-test after every theme change or new app install.</li>
            </ol>
            <p>
              For the full walkthrough, read <Link href="/blog/reading-pagespeed-report">reading a PageSpeed report without the jargon</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
