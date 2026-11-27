import { attr } from "@/lib/ai-check/html";

// Shopify theme and app detector. Apps are recognised by the script, style
// and widget URLs they inject; anything served from a theme app extension
// is also listed by its folder name, so new apps still show up.

export type AppCategory =
  | "Reviews"
  | "Email & SMS"
  | "Loyalty & referrals"
  | "Subscriptions"
  | "Upsell & bundles"
  | "Search & filters"
  | "Page builder"
  | "Chat & support"
  | "Analytics"
  | "Ad pixel"
  | "Payments"
  | "Translation & currency"
  | "Wishlist"
  | "Shipping & returns"
  | "Pop-ups & forms"
  | "Accessibility overlay"
  | "Consent"
  | "Other";

type Signature = { name: string; category: AppCategory; match: RegExp; heavy?: true };

// `heavy` marks apps that commonly add a lot of JavaScript to every page.
const SIGNATURES: Signature[] = [
  { name: "Judge.me", category: "Reviews", match: /judge\.me|judgeme/i },
  { name: "Yotpo", category: "Reviews", match: /yotpo\.com/i, heavy: true },
  { name: "Okendo", category: "Reviews", match: /okendo\.io/i },
  { name: "Loox", category: "Reviews", match: /loox\.io/i },
  { name: "Stamped.io", category: "Reviews", match: /stamped\.io/i },
  { name: "Reviews.io", category: "Reviews", match: /reviews\.io|reviews\.co\.uk/i },
  { name: "Trustpilot", category: "Reviews", match: /widget\.trustpilot\.com/i },
  { name: "Fera", category: "Reviews", match: /fera\.ai/i },
  { name: "Junip", category: "Reviews", match: /juniphq\.com/i },
  { name: "Klaviyo", category: "Email & SMS", match: /klaviyo\.com/i },
  { name: "Omnisend", category: "Email & SMS", match: /omnisnippet|omnisend/i },
  { name: "Attentive", category: "Email & SMS", match: /attn\.tv|attentivemobile/i },
  { name: "Postscript", category: "Email & SMS", match: /postscript\.io/i },
  { name: "Mailchimp", category: "Email & SMS", match: /chimpstatic\.com|list-manage\.com/i },
  { name: "Privy", category: "Pop-ups & forms", match: /privy\.com/i },
  { name: "Justuno", category: "Pop-ups & forms", match: /justuno\.com/i },
  { name: "OptiMonk", category: "Pop-ups & forms", match: /optimonk\.com/i },
  { name: "Smile.io", category: "Loyalty & referrals", match: /smile\.io|sweettooth/i },
  { name: "LoyaltyLion", category: "Loyalty & referrals", match: /loyaltylion/i },
  { name: "Yotpo Loyalty", category: "Loyalty & referrals", match: /swellrewards|yotpo\.com\/loyalty/i },
  { name: "Rise.ai", category: "Loyalty & referrals", match: /rise-ai\.com/i },
  { name: "ReCharge", category: "Subscriptions", match: /rechargecdn|rechargepayments|rechargeapps/i },
  { name: "Skio", category: "Subscriptions", match: /skio\.com/i },
  { name: "Seal Subscriptions", category: "Subscriptions", match: /sealsubscriptions/i },
  { name: "Bold", category: "Subscriptions", match: /boldapps\.net|boldcommerce/i },
  { name: "Rebuy", category: "Upsell & bundles", match: /rebuyengine\.com/i, heavy: true },
  { name: "ReConvert", category: "Upsell & bundles", match: /reconvert/i },
  { name: "Zipify", category: "Upsell & bundles", match: /zipify/i },
  { name: "Frequently Bought Together", category: "Upsell & bundles", match: /codeblackbelt/i },
  { name: "Bundler", category: "Upsell & bundles", match: /bundler\.app/i },
  { name: "Vitals", category: "Upsell & bundles", match: /vitals\.co|appsolve\.io/i, heavy: true },
  { name: "Searchanise", category: "Search & filters", match: /searchanise/i },
  { name: "Boost Commerce", category: "Search & filters", match: /boostcommerce|bc-sf-filter/i, heavy: true },
  { name: "Algolia", category: "Search & filters", match: /algolia(net)?\.(com|net)|algoliasearch/i },
  { name: "Klevu", category: "Search & filters", match: /klevu\.com/i },
  { name: "Searchspring", category: "Search & filters", match: /searchspring/i },
  { name: "PageFly", category: "Page builder", match: /pagefly/i, heavy: true },
  { name: "GemPages", category: "Page builder", match: /gempages|gem-page/i, heavy: true },
  { name: "Shogun", category: "Page builder", match: /getshogun|shogun-?frontend|shogun_/i, heavy: true },
  { name: "Replo", category: "Page builder", match: /replo\.app/i },
  { name: "Gorgias", category: "Chat & support", match: /gorgias/i, heavy: true },
  { name: "Tidio", category: "Chat & support", match: /tidio(chat)?\.co/i, heavy: true },
  { name: "Zendesk", category: "Chat & support", match: /zdassets\.com|zopim/i, heavy: true },
  { name: "Intercom", category: "Chat & support", match: /intercom(cdn)?\.io|widget\.intercom/i, heavy: true },
  { name: "Re:amaze", category: "Chat & support", match: /reamaze/i },
  { name: "Shopify Inbox", category: "Chat & support", match: /shopify-chat|inbox-chat|shopify_chat/i },
  { name: "Richpanel", category: "Chat & support", match: /richpanel/i },
  { name: "Google Analytics 4", category: "Analytics", match: /gtag\/js\?id=G-|googletagmanager\.com\/gtag/i },
  { name: "Google Tag Manager", category: "Analytics", match: /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]{4,}/ },
  { name: "Hotjar", category: "Analytics", match: /hotjar\.com/i },
  { name: "Microsoft Clarity", category: "Analytics", match: /clarity\.ms/i },
  { name: "Lucky Orange", category: "Analytics", match: /luckyorange/i },
  { name: "Elevar", category: "Analytics", match: /getelevar\.com/i },
  { name: "Triple Whale", category: "Analytics", match: /triplewhale|triplepixel/i },
  { name: "Northbeam", category: "Analytics", match: /northbeam/i },
  { name: "Meta Pixel", category: "Ad pixel", match: /connect\.facebook\.net|fbq\(/i },
  { name: "TikTok Pixel", category: "Ad pixel", match: /analytics\.tiktok\.com/i },
  { name: "Pinterest Tag", category: "Ad pixel", match: /s\.pinimg\.com\/ct|pintrk/i },
  { name: "Snapchat Pixel", category: "Ad pixel", match: /sc-static\.net\/scevent/i },
  { name: "Google Ads", category: "Ad pixel", match: /gtag\/js\?id=AW-|googleadservices\.com/i },
  { name: "Microsoft Ads", category: "Ad pixel", match: /bat\.bing\.com/i },
  { name: "Reddit Pixel", category: "Ad pixel", match: /redditstatic\.com\/ads/i },
  { name: "Afterpay", category: "Payments", match: /afterpay/i },
  { name: "Klarna", category: "Payments", match: /klarna/i },
  { name: "Affirm", category: "Payments", match: /affirm\.com/i },
  { name: "Sezzle", category: "Payments", match: /sezzle/i },
  { name: "PayPal messaging", category: "Payments", match: /paypal\.com\/sdk|paypalobjects/i },
  { name: "Weglot", category: "Translation & currency", match: /weglot/i },
  { name: "Langify", category: "Translation & currency", match: /langify/i },
  { name: "Transcy", category: "Translation & currency", match: /transcy/i },
  { name: "Swym Wishlist Plus", category: "Wishlist", match: /swymrelay|swym-?/i },
  { name: "Growave", category: "Wishlist", match: /growave|socialshopwave/i, heavy: true },
  { name: "Route", category: "Shipping & returns", match: /routeapp|route\.com\/widget|cdn\.routeapp/i },
  { name: "AfterShip", category: "Shipping & returns", match: /aftership/i },
  { name: "Loop Returns", category: "Shipping & returns", match: /loopreturns/i },
  { name: "Extend", category: "Shipping & returns", match: /helloextend/i },
  { name: "accessiBe", category: "Accessibility overlay", match: /accessibe\.com|acsbapp/i, heavy: true },
  { name: "UserWay", category: "Accessibility overlay", match: /userway\.org/i, heavy: true },
  { name: "AudioEye", category: "Accessibility overlay", match: /audioeye/i },
  { name: "OneTrust", category: "Consent", match: /onetrust|cookielaw\.org/i },
  { name: "Cookiebot", category: "Consent", match: /cookiebot/i },
  { name: "Pandectes", category: "Consent", match: /pandectes/i },
  { name: "Instafeed", category: "Other", match: /instafeed/i },
  { name: "Nosto", category: "Other", match: /nosto/i, heavy: true },
  { name: "Hextom", category: "Other", match: /hextom/i },
];

const PLATFORMS: { name: string; match: (html: string, headers: Record<string, string>) => boolean }[] = [
  { name: "Shopify", match: (h, hd) => !!hd["x-shopid"] || /cdn\.shopify\.com|Shopify\.theme|myshopify\.com/i.test(h) },
  { name: "WooCommerce", match: (h) => /wp-content\/plugins\/woocommerce|woocommerce-/i.test(h) },
  { name: "BigCommerce", match: (h) => /cdn\d*\.bigcommerce\.com|bigcommerce/i.test(h) },
  { name: "Magento / Adobe Commerce", match: (h) => /Magento_|mage\/cookies|requirejs-config/i.test(h) },
  { name: "Wix", match: (h, hd) => /static\.wixstatic\.com|wix-code/i.test(h) || /wix/i.test(hd["x-powered-by"] ?? "") },
  { name: "Squarespace", match: (h) => /static1\.squarespace\.com|squarespace-cdn/i.test(h) },
  { name: "Webflow", match: (h) => /data-wf-site|webflow\.js|website-files\.com/i.test(h) },
  { name: "PrestaShop", match: (h) => /prestashop/i.test(h) },
  { name: "WordPress", match: (h) => /wp-content\/|wp-includes\//i.test(h) },
];

export type ThemeInfo = { name: string | null; schemaName: string | null; version: string | null; themeStoreId: number | null; role: string | null };

function shopifyTheme(html: string): ThemeInfo | null {
  const raw = html.match(/Shopify\.theme\s*=\s*(\{[\s\S]*?\})\s*;/)?.[1];
  if (!raw) return null;
  try {
    const t = JSON.parse(raw) as Record<string, unknown>;
    const str = (v: unknown) => (typeof v === "string" && v ? v : null);
    return {
      name: str(t.name),
      schemaName: str(t.schema_name),
      version: str(t.schema_version),
      themeStoreId: typeof t.theme_store_id === "number" ? t.theme_store_id : null,
      role: str(t.role),
    };
  } catch {
    return null;
  }
}

// Every external script, stylesheet and iframe URL on the page.
function assetUrls(html: string, base: string): string[] {
  const out = new Set<string>();
  for (const tag of html.match(/<(script|link|iframe)\b[^>]*>/gi) ?? []) {
    const u = attr(tag, "src") ?? (/<link/i.test(tag) && /stylesheet|preload|modulepreload/i.test(attr(tag, "rel") ?? "") ? attr(tag, "href") : null);
    if (!u) continue;
    try {
      out.add(new URL(u, base).toString());
    } catch {}
  }
  return [...out];
}

const pretty = (slug: string) =>
  slug
    .replace(/-?\d+(\.\d+)*$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

export type DetectedApp = { name: string; category: AppCategory; heavy: boolean; evidence: string };

export function detectStack(html: string, headers: Record<string, string>, base: string) {
  const platform = PLATFORMS.find((p) => p.match(html, headers))?.name ?? null;
  const theme = platform === "Shopify" ? shopifyTheme(html) : null;
  const assets = assetUrls(html, base);
  const host = new URL(base).hostname.replace(/^www\./, "");

  // Inline script bodies only, so a name in the page text (a payment icon's title) isn't counted.
  const inlineCode = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join("\n");

  const apps = new Map<string, DetectedApp>();
  for (const sig of SIGNATURES) {
    const hit = assets.find((a) => sig.match.test(a));
    // Fall back to inline code for apps whose snippet is inline (pixels, GTM).
    const inline = !hit && sig.match.test(inlineCode) ? "inline code" : null;
    if (hit || inline) apps.set(sig.name, { name: sig.name, category: sig.category, heavy: !!sig.heavy, evidence: hit ?? inline! });
  }

  // Theme app extensions: cdn.shopify.com/extensions/<id>/<app-folder>/assets/…
  for (const a of assets) {
    const folder = a.match(/cdn\.shopify\.com\/extensions\/[^/]+\/([^/]+)\/assets\//i)?.[1];
    // Skip build-hash or timestamp folders that carry no app name.
    if (!folder || /^[\d-]/.test(folder) || !/[a-z]{3}/i.test(folder)) continue;
    const name = pretty(folder);
    const known = [...apps.values()].some((app) => app.name.toLowerCase().replace(/[^a-z]/g, "").includes(name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 6)));
    if (name && !known && !apps.has(name)) apps.set(name, { name, category: "Other", heavy: false, evidence: a });
  }

  const scripts = assets.filter((a) => !/\.css(\?|$)/i.test(a));
  const thirdPartyHosts = new Set(
    scripts
      .map((a) => new URL(a).hostname.replace(/^www\./, ""))
      .filter((h) => h !== host && !/(^|\.)shopify\.com$|shopifycdn|shopifysvc/.test(h)),
  );

  return {
    platform,
    theme,
    apps: [...apps.values()].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)),
    externalScripts: scripts.length,
    thirdPartyHosts: [...thirdPartyHosts].sort(),
  };
}
