import Link from "next/link";
import { VitalsMeter } from "@/components/blog/VitalsMeter";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/core-web-vitals-checker";

export const metadata = pageMetadata({
  title: "Core Web Vitals Checker: Test LCP, INP & CLS for Any Site",
  description: "Enter a domain to see its real LCP, INP and CLS from Google's Chrome UX Report, judged against the good/needs-improvement/poor thresholds at the 75th percentile Google actually uses.",
  path: PATH,
});

const FAQS = [
  {
    q: "What are LCP, INP and CLS?",
    a: "LCP (Largest Contentful Paint) is how long until the main content appears, good at 2.5s or less. INP (Interaction to Next Paint) is how quickly the page responds to a tap or click, good at 200ms or less. CLS (Cumulative Layout Shift) is how much the page jumps while loading, good at 0.1 or less.",
  },
  {
    q: "Where do the live numbers come from?",
    a: "From Google's PageSpeed Insights, which reports real visitor data (the Chrome User Experience Report) for the last 28 days on mobile. If the exact URL doesn't have enough traffic we show the whole site's data, and if the site has none we fall back to a single simulated lab load. The lab test is useful for debugging but isn't what Google ranks on, and it can't measure INP.",
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
      lead="Enter your domain to see its real LCP, INP and CLS from Google’s Chrome visitor data, or drag the sliders to see how the three combine into a pass or fail at the 75th percentile, like Google judges it."
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
