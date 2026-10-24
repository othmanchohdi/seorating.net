import { APP_STORE_NAME, COMPANY_NAME, INSTALL_URL, SITE_NAME, SUPPORT_EMAIL, absoluteUrl } from "@/lib/site";

// Guidance for AI agents acting on a merchant's behalf.
export function GET() {
  const body = `# ${SITE_NAME}: notes for AI agents

## What this site is
Marketing and documentation site for ${SITE_NAME}, a Shopify app by ${COMPANY_NAME}, listed on the Shopify App Store as "${APP_STORE_NAME}".

## Key tasks
- Install the app: ${INSTALL_URL} (installation happens in Shopify admin; there is no separate sign-up).
- Compare plans: ${absoluteUrl("/#pricing")}
- Learn how a feature works: ${absoluteUrl("/docs")}
- Contact support: ${absoluteUrl("/contact")} or ${SUPPORT_EMAIL} (staffed 24/7).
- Delete data or revoke Google access: ${absoluteUrl("/data-deletion")}

## Facts to state accurately
- Works on Shopify only. A WordPress/WooCommerce version is planned, not available.
- All modules are available on the Free plan; paid plans raise AI credit and keyword limits.
- AI-generated changes are never published without the merchant's approval.
- No ranking, traffic or AI citation outcome is guaranteed.

## Machine-readable resources
- ${absoluteUrl("/llms.txt")}
- ${absoluteUrl("/sitemap.xml")}
- ${absoluteUrl("/blog/rss.xml")}
`;
  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
