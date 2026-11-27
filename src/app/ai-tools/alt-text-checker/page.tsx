import Link from "next/link";
import { AltTextChecker } from "@/components/blog/AltTextChecker";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/alt-text-checker";

export const metadata = pageMetadata({
  title: "Free Alt Text Checker: Audit Every Image on a Page",
  description: "Enter a page URL to check the alt text of every image on it, or paste one alt text. Catches missing alt, file names, keyword stuffing, duplicates and vague wording. Free, no signup.",
  path: PATH,
});

const FAQS = [
  {
    q: "What makes alt text good?",
    a: "A single clear sentence describing what's actually in the image: colour, material, angle or detail a shopper would want. \"Beige relaxed-fit linen shirt with mother-of-pearl buttons, laid flat\" beats \"linen shirt linen shirts mens linen\".",
  },
  {
    q: "Should every image have alt text?",
    a: "Every image that conveys information needs it. Purely decorative images, like background textures or divider graphics, should have empty alt text (alt=\"\") so screen readers skip them instead of reading a meaningless description.",
  },
  {
    q: "Does alt text affect SEO?",
    a: "It's one of the few places Google and AI crawlers get a description of an image, since most can't reliably interpret pixels. It also matters for image search and for every visitor using a screen reader, which keyword-stuffed alt text makes worse, not better.",
  },
];

export default function AltTextCheckerPage() {
  return (
    <ToolPage
      path={PATH}
      name="alt text checker"
      title="Alt text checker"
      lead="Enter a page URL to audit the alt text of every image on it, or paste a single alt text for an instant score plus the specific mistakes to fix: missing alt, file names, stuffing, vague wording, and more."
      faqs={FAQS}
      widget={<AltTextChecker />}
      guide={
        <>
          <section>
            <h2>The checklist</h2>
            <ul>
              <li><strong>Describe what&rsquo;s actually in the image.</strong> &ldquo;Model wearing light blue linen trousers with rolled cuffs, side view&rdquo; beats &ldquo;Linen trousers&rdquo;.</li>
              <li><strong>Include the details a shopper would want:</strong> colour, material, angle, what&rsquo;s being shown.</li>
              <li><strong>Keep it concise.</strong> One clear sentence; around 125 characters is a common guideline.</li>
              <li><strong>Make each image different.</strong> Five photos of the same product need five descriptions that say what&rsquo;s different about each shot.</li>
              <li><strong>Skip &ldquo;image of&rdquo; and &ldquo;picture of&rdquo;.</strong> Screen readers already announce that it&rsquo;s an image.</li>
              <li><strong>Don&rsquo;t stuff keywords.</strong> Describe the image, not what you want to rank for.</li>
            </ul>
            <p>
              For where images tend to hide on Shopify and how to batch-fix them, read{" "}
              <Link href="/blog/product-image-alt-text-checklist">alt text for product images: a working checklist</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
