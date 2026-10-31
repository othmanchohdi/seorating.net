import { POSTS } from "@/content/blog";
import { PLANS } from "@/lib/pricing";
import { COMPANY_NAME, INSTALL_URL, SITE_NAME, SUPPORT_EMAIL, absoluteUrl } from "@/lib/site";

// We practise what the app preaches: a structured brief for language models.
// https://llmstxt.org
export function GET() {
  const body = `# ${SITE_NAME}

> ${SITE_NAME} is a Shopify app by ${COMPANY_NAME} that audits a store and fixes what holds it back in Google and AI search: meta tags, image alt text, on-page content, JSON-LD structured data, robots.txt, llms.txt and agents.md, IndexNow, broken links, keyword research and Google PageSpeed audits. Every tool is on every plan, including a free plan. AI-written changes are always reviewed by the merchant before they publish.

## Product
- [Features and pricing](${absoluteUrl("/")}): Overview of every module, plans and FAQ
- [Documentation](${absoluteUrl("/docs")}): How each module works today, including AI credit costs
${INSTALL_URL ? `- [Install on Shopify](${INSTALL_URL}): Shopify App Store listing` : "- Shopify App Store listing: coming soon, not yet live"}

## Pricing
${PLANS.map((p) => `- ${p.name}: $${p.price}/month, ${p.credits.toLocaleString("en-US")} AI credits per month`).join("\n")}
- Billing runs through Shopify every 30 days. Unused credits do not roll over.

## Blog
${POSTS.map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.description}`).join("\n")}

## Company
- [About](${absoluteUrl("/about")}): Who builds ${SITE_NAME} and why
- [Contact](${absoluteUrl("/contact")}): Support within 1 business day, ${SUPPORT_EMAIL}
- [Support](${absoluteUrl("/support")}): Response times and common questions

## Optional
- [Privacy Policy](${absoluteUrl("/privacy")})
- [Terms of Service](${absoluteUrl("/terms")})
- [Data deletion](${absoluteUrl("/data-deletion")})
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
