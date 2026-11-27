import Link from "next/link";
import { RedirectChecker } from "@/components/tools/RedirectChecker";
import { ToolPage } from "@/components/ai-tools/ToolPage";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/ai-tools/redirect-checker";

export const metadata = pageMetadata({
  title: "Redirect Checker: Trace 301/302 Chains & Status Codes",
  description: "Trace any URL hop by hop and see every redirect and HTTP status code. For a domain, also test the http, https, www and non-www versions. Free, no signup.",
  path: PATH,
});

const FAQS = [
  {
    q: "What's the difference between a 301 and a 302 redirect?",
    a: "A 301 (or 308) tells search engines the move is permanent, so they transfer the old URL's ranking to the new one. A 302 (or 307) says it's temporary, so they may keep the old URL indexed. For changed product URLs and domain moves, use 301.",
  },
  {
    q: "Are redirect chains bad for SEO?",
    a: "One redirect is fine. Each extra hop adds load time and, past a handful, Google may stop following. Point links and other redirects straight at the final URL.",
  },
  {
    q: "How do I add redirects in Shopify?",
    a: 'In the admin go to Content → Menus → URL Redirects (or Online Store → Navigation on older admins). When you change a product or page\'s URL handle, tick "Create a URL redirect" and Shopify adds a 301 for you.',
  },
];

export default function RedirectCheckerPage() {
  return (
    <ToolPage
      path={PATH}
      name="redirect checker"
      title="Redirect & status code checker"
      lead="Trace any URL hop by hop and see every redirect and status code on the way. Enter a bare domain to also test its http, https, www and non-www versions."
      faqs={FAQS}
      widget={<RedirectChecker />}
      guide={
        <>
          <section>
            <h2>Common redirect problems on stores</h2>
            <ul>
              <li>
                <strong>Two hops for every visitor:</strong> http → https → www. Redirect straight to the final address.
              </li>
              <li>
                <strong>Old product URLs returning 404</strong> after a handle change without a redirect.
              </li>
              <li>
                <strong>Temporary 302s</strong> left in place for permanent moves.
              </li>
              <li>
                <strong>Domain variants that don&rsquo;t agree</strong>, so search engines index two copies of the site.
              </li>
            </ul>
            <p>
              Find redirecting and broken links on a page with the <Link href="/ai-tools/broken-link-checker">broken link checker</Link>, and check canonical tags with the{" "}
              <Link href="/ai-tools/shopify-url-inspector">Shopify URL inspector</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}
