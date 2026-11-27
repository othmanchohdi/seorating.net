import Link from "next/link";
import { BrokenLinkChecker } from "@/components/tools/BrokenLinkChecker";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/broken-link-checker";

export const metadata = pageMetadata({
  title: "Free Broken Link Checker for Any Page",
  description: "Enter a page URL to check every internal and external link on it for 404s, server errors and redirects, with the anchor text so you can find and fix each one. Free.",
  path: PATH,
});

const FAQS = [
  {
    q: "Do broken links hurt SEO?",
    a: "A few won't sink a site, but they waste crawl budget, stop link value flowing to the pages that need it, and send visitors to dead ends, which hurts conversions more than rankings.",
  },
  {
    q: 'Why does it say "couldn\'t verify"?',
    a: "Some sites, especially social networks and marketplaces, refuse automated requests with a 403, 429 or 999 status even when the page exists. Open those links in a browser to confirm them.",
  },
  {
    q: "How do I check my whole site?",
    a: "This tool checks one page at a time. Start with the pages that link out the most: blog posts, your footer (via the homepage) and policy pages. A full-site crawl is part of the SEO Rating app.",
  },
];

export default function BrokenLinkCheckerPage() {
  return (
    <ToolPage
      path={PATH}
      name="broken link checker"
      title="Broken link checker"
      lead="Enter a page to check every link on it, internal and external, for 404s, server errors and redirects, with the anchor text so you can find each one."
      faqs={FAQS}
      widget={<BrokenLinkChecker />}
      guide={
        <>
          <section>
            <h2>Where broken links hide on Shopify stores</h2>
            <ul>
              <li>
                <strong>Old blog posts</strong> linking to products you&rsquo;ve since deleted or renamed.
              </li>
              <li>
                <strong>Menus and footers</strong> pointing at collections that were removed.
              </li>
              <li>
                <strong>Hard-coded links in product descriptions</strong> copied from a supplier or an old domain.
              </li>
            </ul>
            <p>
              When you fix one, add a 301 redirect from the old URL so links elsewhere keep working, then confirm it with the <Link href="/ai-tools/redirect-checker">redirect checker</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
