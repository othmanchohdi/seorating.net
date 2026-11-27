import Link from "next/link";
import { ImageSizeChecker } from "@/components/tools/ImageSizeChecker";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/image-size-checker";

export const metadata = pageMetadata({
  title: "Image Size Checker: Find Heavy Images on Any Page (Free)",
  description: "Enter a page URL to measure every image's real file size, format and dimensions, and find the oversized, uncompressed or lazy-loaded images slowing it down. Free.",
  path: PATH,
});

const FAQS = [
  {
    q: "How big should images be on a Shopify store?",
    a: "Most product and collection images look sharp at 1,500–2,000px wide and should weigh under 200 KB. Hero banners can be a little larger, but a 2–3 MB banner is the most common cause of a slow Largest Contentful Paint.",
  },
  {
    q: "Shopify already converts images to WebP. Why do I see JPEG?",
    a: "Shopify's CDN serves WebP or AVIF when the browser asks for it, and we ask the same way a browser does. If you still see JPEG or PNG, the image is usually served from a third-party app or a hard-coded URL in the theme, or its URL forces a format.",
  },
  {
    q: "Why does it warn about lazy loading?",
    a: "Lazy loading is great for images further down the page, but if the first, biggest image is lazy-loaded the browser waits before downloading it, which delays Largest Contentful Paint. The top image should load immediately.",
  },
];

export default function ImageSizeCheckerPage() {
  return (
    <ToolPage
      path={PATH}
      name="image size checker"
      title="Image size checker"
      lead="Enter a page to measure every image's real file size, format and pixel dimensions, heaviest first, with the exact fix for each one."
      faqs={FAQS}
      widget={<ImageSizeChecker />}
      guide={
        <>
          <section>
            <h2>The fixes, in order of impact</h2>
            <ol>
              <li>
                <strong>Resize before uploading.</strong> A 5,000px photo from a camera is 4–10× more pixels than any screen shows.
              </li>
              <li>
                <strong>Compress.</strong> Export photos at 75–85% quality; the difference is invisible and the file is often half the size.
              </li>
              <li>
                <strong>Set width and height</strong> on every image so the page doesn&rsquo;t jump as it loads.
              </li>
              <li>
                <strong>Don&rsquo;t lazy-load the main image</strong> at the top of the page.
              </li>
            </ol>
            <p>
              Then check alt text with the <Link href="/ai-tools/alt-text-checker">alt text checker</Link> and the overall speed with the{" "}
              <Link href="/ai-tools/core-web-vitals-checker">Core Web Vitals checker</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
