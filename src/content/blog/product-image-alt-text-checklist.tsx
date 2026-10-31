import type { Post } from "./types";
import { AltTextChecker } from "@/components/blog/AltTextChecker";
import { AppCta, Code, CodeBlock, Note } from "./ui";

function Body() {
  return (
    <>
      <p>
        Alt text is the written description attached to an image. Screen readers read it aloud to people who can&rsquo;t see
        the picture, and search engines use it to understand what the image shows. On most Shopify stores, a large share
        of product images have none at all, or just repeat the product title.
      </p>

      <h2 id="why">Why it matters</h2>
      <ul>
        <li>
          <strong>Accessibility.</strong> For a shopper using a screen reader, an image without alt text is a gap in the
          page. For product photos, that gap is often the colour, the fit or the detail they needed.
        </li>
        <li>
          <strong>Image search.</strong> Google relies on alt text, along with the surrounding page, to understand images
          and rank them in image results.
        </li>
        <li>
          <strong>AI assistants.</strong> Models that read your pages get one more accurate, plain-language fact about the
          product.
        </li>
      </ul>

      <h2 id="checklist">The checklist</h2>
      <ol>
        <li>
          <strong>Describe what&rsquo;s actually in the image.</strong> &ldquo;Model wearing light blue linen trousers with
          rolled cuffs, side view&rdquo; beats &ldquo;Linen trousers&rdquo;.
        </li>
        <li>
          <strong>Include the details a shopper would want.</strong> Colour, material, angle, what&rsquo;s being shown
          (front, back, close-up of the fabric).
        </li>
        <li>
          <strong>Keep it concise.</strong> One clear sentence. There&rsquo;s no hard limit, but long descriptions are
          tiring to listen to, and around 125 characters is a common guideline.
        </li>
        <li>
          <strong>Make each image different.</strong> Five photos of the same product should have five descriptions that
          say what&rsquo;s different about each shot.
        </li>
        <li>
          <strong>Skip &ldquo;image of&rdquo; and &ldquo;picture of&rdquo;.</strong> Screen readers already announce that it&rsquo;s
          an image.
        </li>
        <li>
          <strong>Don&rsquo;t stuff keywords.</strong> Describe the image, not what you want to rank for. If the product name
          fits naturally, use it.
        </li>
        <li>
          <strong>Leave decorative images empty.</strong> Background textures and divider graphics should have empty alt
          text (<Code>alt=&quot;&quot;</Code>) so screen readers skip them.
        </li>
      </ol>
      <CodeBlock file="example.html">{`<!-- Weak -->
<img src="shirt-2.jpg" alt="linen shirt linen shirts mens linen">

<!-- Better -->
<img src="shirt-2.jpg" alt="Beige relaxed-fit linen shirt with mother-of-pearl buttons, laid flat">`}</CodeBlock>
      <p>Test a few of your own against the checklist:</p>
      <AltTextChecker />

      <h2 id="where">Where images hide on Shopify</h2>
      <p>Product photos are the obvious ones, but they&rsquo;re not the only images on your store:</p>
      <ul>
        <li>Collection images</li>
        <li>Blog article images</li>
        <li>Files you&rsquo;ve uploaded to the Files library</li>
        <li>Theme images like banners, slideshows and section images set in the theme editor</li>
      </ul>
      <p>
        Product image alt text is set from the product&rsquo;s media in Shopify admin. Theme images are set in the theme
        editor, image by image, which is why they&rsquo;re the ones most often left blank.
      </p>
      <Note label="Review">
        Anything that describes people, makes claims (&ldquo;organic&rdquo;, &ldquo;waterproof&rdquo;) or depends on
        context should be checked by a person, whoever or whatever wrote it. Screen readers say exactly what you save.
      </Note>

      <AppCta
        title="Write alt text for every image, from what’s in it"
        body="SEO Rating looks at each image and drafts a specific description across products, collections, articles, Files and theme images. You review before saving."
      />
    </>
  );
}

export const post: Post = {
  slug: "product-image-alt-text-checklist",
  title: "Alt text for product images: a working checklist",
  description:
    "A practical checklist for writing Shopify product image alt text that helps accessibility, image search and AI assistants: describe what’s in the image, not what you want to rank for.",
  category: "On-page",
  tags: ["On-page", "Alt text", "Accessibility", "Shopify"],
  published: "2026-09-10",
  updated: "2026-10-31",
  readMinutes: 4,
  cover: { file: "product-image.html", lines: ['<img src="shirt.jpg"', '  alt="Beige relaxed-fit linen', '  shirt, laid flat">'] },
  toc: [
    { id: "why", label: "Why it matters" },
    { id: "checklist", label: "The checklist" },
    { id: "where", label: "Where images hide" },
  ],
  Body,
};
