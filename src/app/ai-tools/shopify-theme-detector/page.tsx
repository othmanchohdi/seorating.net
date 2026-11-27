import Link from "next/link";
import { StackDetector } from "@/components/tools/StackDetector";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/shopify-theme-detector";

export const metadata = pageMetadata({
  title: "Shopify Theme Detector & App Detector (Free)",
  description: "Enter any Shopify store to see which theme it uses (and its version) and which apps it runs: reviews, email, upsells, page builders, pixels and more. Free, no signup.",
  path: PATH,
});

const FAQS = [
  {
    q: "How do you detect the theme?",
    a: "Every Shopify storefront includes a small piece of code naming its theme, the theme's original name and its version. We read that from the page's HTML. If a store uses a headless front end (like Hydrogen), there's no theme to detect.",
  },
  {
    q: "Why don't I see every app the store uses?",
    a: "We detect apps from the scripts and widgets they load on the page you enter. Apps that only work in the admin, in checkout, or on other page types won't show up. Try a product page as well as the homepage.",
  },
  {
    q: 'What does "heavy" mean?',
    a: "Apps marked heavy commonly add a lot of JavaScript to every page, like page builders, chat widgets and accessibility overlays. They're not bad apps, but each one costs load time, so keep the ones that earn their place.",
  },
];

export default function ShopifyThemeDetectorPage() {
  return (
    <ToolPage
      path={PATH}
      name="Shopify theme & app detector"
      title="Shopify theme & app detector"
      lead="Enter any store to see its Shopify theme and version, plus the apps and tracking scripts it loads, with the heavy ones that slow pages down flagged."
      faqs={FAQS}
      widget={<StackDetector />}
      guide={
        <>
          <section>
            <h2>What to do with the results</h2>
            <ul>
              <li>
                <strong>On your own store:</strong> compare the list with the apps you pay for. Anything you don&rsquo;t recognise is often leftover code from an app you uninstalled, still slowing
                every page.
              </li>
              <li>
                <strong>On a competitor:</strong> see which review, loyalty and upsell tools stores in your niche rely on before you choose your own.
              </li>
              <li>
                <strong>Before a redesign:</strong> note the theme version. Themes from the Theme Store get free updates with speed and accessibility fixes, but only if you haven&rsquo;t edited the
                code heavily.
              </li>
            </ul>
            <p>
              For how apps affect speed and what to remove first, read <Link href="/blog/shopify-app-scripts-speed">how app scripts slow your store</Link>, then check the result with the{" "}
              <Link href="/ai-tools/core-web-vitals-checker">Core Web Vitals checker</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
