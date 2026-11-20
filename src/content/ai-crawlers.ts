// The AI crawler directory: one entry per robots.txt user-agent token.
// Every fact here comes from the operator's own documentation (docsUrl),
// checked on VERIFIED. Kept free of React so src/proxy.ts can import it.
//
// The AI visibility report reads this list too, so the directory and the
// report can't disagree about what a bot does.

export const VERIFIED = "2026-11-21";

export type CrawlerKind = "search" | "user" | "training" | "control" | "other";

export type Crawler = {
  slug: string;
  token: string;
  operator: string;
  kind: CrawlerKind;
  // One line: what it is for, in the operator's terms.
  purpose: string;
  // What happens to the site if it's disallowed.
  ifBlocked: string;
  robots: "yes" | "may-ignore" | "token-only";
  userAgent: string | null;
  ipRanges: string | null;
  docsUrl: string;
  // Listed in the AI visibility report's crawler table.
  inReport: boolean;
};

export const KIND_LABEL: Record<CrawlerKind, { label: string; short: string; blurb: string }> = {
  search: {
    label: "AI search crawlers",
    short: "AI search",
    blurb: "Index pages so an assistant can find and cite them in answers. Blocking these is how sites disappear from AI search.",
  },
  user: {
    label: "User-triggered fetchers",
    short: "User fetch",
    blurb: "Fetch a page when a person asks an assistant about it. Because a human asked, operators say robots.txt may not apply.",
  },
  training: {
    label: "Training crawlers",
    short: "Training",
    blurb: "Collect content that may be used to train AI models. Blocking them doesn't remove you from AI search answers.",
  },
  control: {
    label: "Control tokens",
    short: "Control token",
    blurb: "Not crawlers at all: robots.txt names that control how content collected by another crawler may be used.",
  },
  other: {
    label: "Other AI agents",
    short: "Other",
    blurb: "Specialised agents that don't fit the groups above.",
  },
};

export const CRAWLERS: Crawler[] = [
  // ---------------------------------------------------------------- OpenAI
  {
    slug: "oai-searchbot",
    token: "OAI-SearchBot",
    operator: "OpenAI",
    kind: "search",
    purpose: "Surfaces websites in search results in ChatGPT's search features.",
    ifBlocked: "Your pages won't appear as sources or links in ChatGPT search answers.",
    robots: "yes",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36; compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot",
    ipRanges: "https://openai.com/searchbot.json",
    docsUrl: "https://developers.openai.com/api/docs/bots",
    inReport: true,
  },
  {
    slug: "chatgpt-user",
    token: "ChatGPT-User",
    operator: "OpenAI",
    kind: "user",
    purpose: "Visits a page when a ChatGPT user or a custom GPT asks for it.",
    ifBlocked: "ChatGPT may be unable to open your pages when someone asks about them, though OpenAI notes robots.txt rules may not apply to user-initiated requests.",
    robots: "may-ignore",
    userAgent: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
    ipRanges: "https://openai.com/chatgpt-user.json",
    docsUrl: "https://developers.openai.com/api/docs/bots",
    inReport: true,
  },
  {
    slug: "gptbot",
    token: "GPTBot",
    operator: "OpenAI",
    kind: "training",
    purpose: "Crawls content that may be used to train OpenAI's generative AI foundation models.",
    ifBlocked: "Your content isn't used to train future OpenAI models. It doesn't stop ChatGPT search from citing you; that's OAI-SearchBot.",
    robots: "yes",
    userAgent: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.4; +https://openai.com/gptbot",
    ipRanges: "https://openai.com/gptbot.json",
    docsUrl: "https://developers.openai.com/api/docs/bots",
    inReport: true,
  },
  {
    slug: "oai-adsbot",
    token: "OAI-AdsBot",
    operator: "OpenAI",
    kind: "other",
    purpose: "Checks the landing pages of ads submitted to ChatGPT for safety.",
    ifBlocked: "OpenAI says robots.txt doesn't control this agent. It only visits pages submitted as ads.",
    robots: "may-ignore",
    userAgent: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-AdsBot/1.0; +https://openai.com/adsbot",
    ipRanges: "https://openai.com/adsbot.json",
    docsUrl: "https://developers.openai.com/api/docs/bots",
    inReport: false,
  },
  // ------------------------------------------------------------- Anthropic
  {
    slug: "claude-searchbot",
    token: "Claude-SearchBot",
    operator: "Anthropic",
    kind: "search",
    purpose: "Navigates the web to improve the quality of Claude's search results.",
    ifBlocked: "Your content isn't indexed for Claude's search, which can reduce your visibility and accuracy in Claude's answers.",
    robots: "yes",
    userAgent: null,
    ipRanges: "https://claude.com/crawling/bots.json",
    docsUrl: "https://support.claude.com/en/articles/8896518",
    inReport: true,
  },
  {
    slug: "claude-user",
    token: "Claude-User",
    operator: "Anthropic",
    kind: "user",
    purpose: "Fetches a page when someone asks Claude a question that needs it.",
    ifBlocked: "Claude can't retrieve your pages in response to user questions, which reduces your visibility in those answers.",
    robots: "yes",
    userAgent: null,
    ipRanges: "https://claude.com/crawling/bots.json",
    docsUrl: "https://support.claude.com/en/articles/8896518",
    inReport: true,
  },
  {
    slug: "claudebot",
    token: "ClaudeBot",
    operator: "Anthropic",
    kind: "training",
    purpose: "Collects public web content that may be used to train and improve Anthropic's models.",
    ifBlocked: "Your future content is excluded from Anthropic's training datasets. It doesn't affect Claude-SearchBot or Claude-User.",
    robots: "yes",
    userAgent: null,
    ipRanges: "https://claude.com/crawling/bots.json",
    docsUrl: "https://support.claude.com/en/articles/8896518",
    inReport: true,
  },
  // ------------------------------------------------------------ Perplexity
  {
    slug: "perplexitybot",
    token: "PerplexityBot",
    operator: "Perplexity",
    kind: "search",
    purpose: "Surfaces and links websites in Perplexity search results. Perplexity says it isn't used to crawl content for training foundation models.",
    ifBlocked: "Your pages won't be indexed for Perplexity's answers and source links.",
    robots: "yes",
    userAgent: "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
    ipRanges: "https://www.perplexity.ai/perplexitybot.json",
    docsUrl: "https://docs.perplexity.ai/guides/bots",
    inReport: true,
  },
  {
    slug: "perplexity-user",
    token: "Perplexity-User",
    operator: "Perplexity",
    kind: "user",
    purpose: "Visits a page when a Perplexity user's question needs it. Not used for crawling or training.",
    ifBlocked: "Perplexity says this fetcher generally ignores robots.txt, because a user triggered the request.",
    robots: "may-ignore",
    userAgent: "Mozilla/5.0 (compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)",
    ipRanges: "https://www.perplexity.ai/perplexity-user.json",
    docsUrl: "https://docs.perplexity.ai/guides/bots",
    inReport: true,
  },
  // ---------------------------------------------------------------- Google
  {
    slug: "googlebot",
    token: "Googlebot",
    operator: "Google",
    kind: "search",
    purpose: "Crawls for Google Search, including all Search features (such as AI Overviews), Discover, Images and News.",
    ifBlocked: "Your pages drop out of Google Search, and with it Google's AI features built on Search.",
    robots: "yes",
    userAgent: "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    ipRanges: "https://developers.google.com/static/crawling/ipranges/common-crawlers.json",
    docsUrl: "https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers",
    inReport: true,
  },
  {
    slug: "google-extended",
    token: "Google-Extended",
    operator: "Google",
    kind: "control",
    purpose: "Controls whether content Google crawls may be used to train future Gemini models.",
    ifBlocked: "Your content isn't used for Gemini training. Google says it doesn't affect inclusion or ranking in Google Search.",
    robots: "token-only",
    userAgent: null,
    ipRanges: null,
    docsUrl: "https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers",
    inReport: true,
  },
  // ------------------------------------------------------------- Microsoft
  {
    slug: "bingbot",
    token: "Bingbot",
    operator: "Microsoft",
    kind: "search",
    purpose: "Crawls for Bing search, which also grounds Microsoft Copilot's web answers.",
    ifBlocked: "Your pages drop out of Bing, and with it the Copilot answers built on Bing results.",
    robots: "yes",
    userAgent: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/W.X.Y.Z Safari/537.36",
    ipRanges: "https://www.bing.com/toolbox/bingbot.json",
    docsUrl: "https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0",
    inReport: true,
  },
  // ----------------------------------------------------------------- Apple
  {
    slug: "applebot",
    token: "Applebot",
    operator: "Apple",
    kind: "search",
    purpose: "Crawls for search features in Spotlight, Siri and Safari.",
    ifBlocked: "Your pages may not appear in Siri, Spotlight and Safari suggestions.",
    robots: "yes",
    userAgent: "Mozilla/5.0 (Device; OS_version) AppleWebKit/WebKit_version (KHTML, like Gecko) Version/Safari_version Safari/WebKit_version (Applebot/Applebot_version; +http://www.apple.com/go/applebot)",
    ipRanges: "https://search.developer.apple.com/applebot.json",
    docsUrl: "https://support.apple.com/en-us/119829",
    inReport: false,
  },
  {
    slug: "applebot-extended",
    token: "Applebot-Extended",
    operator: "Apple",
    kind: "control",
    purpose: "Controls whether content Applebot collects may be used to train Apple's generative AI models. It doesn't crawl pages itself.",
    ifBlocked: "Your content isn't used for Apple's model training. Apple says pages can still appear in search results.",
    robots: "token-only",
    userAgent: null,
    ipRanges: null,
    docsUrl: "https://support.apple.com/en-us/119829",
    inReport: true,
  },
  // ---------------------------------------------------------------- Amazon
  {
    slug: "amzn-searchbot",
    token: "Amzn-SearchBot",
    operator: "Amazon",
    kind: "search",
    purpose: "Improves search experiences in Amazon products and services. Amazon says it doesn't train generative AI.",
    ifBlocked: "Your pages may not surface in Amazon's search experiences, such as Alexa answers.",
    robots: "yes",
    userAgent: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amzn-SearchBot/0.1) Chrome/W.X.Y.Z Safari/537.36",
    ipRanges: "https://developer.amazon.com/amazonbot/searchbot-ip-addresses/",
    docsUrl: "https://developer.amazon.com/amazonbot",
    inReport: false,
  },
  {
    slug: "amzn-user",
    token: "Amzn-User",
    operator: "Amazon",
    kind: "user",
    purpose: "Supports user actions, such as answering Alexa questions. Amazon says it doesn't train generative AI.",
    ifBlocked: "Amazon says this agent may not follow all robots.txt directives, because users trigger it.",
    robots: "may-ignore",
    userAgent: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amzn-User/0.1) Chrome/W.X.Y.Z Safari/537.36",
    ipRanges: "https://developer.amazon.com/amazonbot/live-ip-addresses/",
    docsUrl: "https://developer.amazon.com/amazonbot",
    inReport: false,
  },
  {
    slug: "amazonbot",
    token: "Amazonbot",
    operator: "Amazon",
    kind: "training",
    purpose: "Improves Amazon's products and services, and its data may be used to train Amazon's AI models.",
    ifBlocked: "Your content isn't collected by Amazonbot. Amzn-SearchBot is controlled separately.",
    robots: "yes",
    userAgent: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1) Chrome/W.X.Y.Z Safari/537.36",
    ipRanges: "https://developer.amazon.com/amazonbot/ip-addresses/",
    docsUrl: "https://developer.amazon.com/amazonbot",
    inReport: false,
  },
  // ------------------------------------------------------------------ Meta
  {
    slug: "meta-externalagent",
    token: "meta-externalagent",
    operator: "Meta",
    kind: "training",
    purpose: "Crawls for uses such as training foundation AI models or improving products by indexing content directly.",
    ifBlocked: "Meta's crawler stops collecting your content for those uses.",
    robots: "yes",
    userAgent: "meta-externalagent/1.1",
    ipRanges: null,
    docsUrl: "https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/",
    inReport: false,
  },
  {
    slug: "meta-externalfetcher",
    token: "meta-externalfetcher",
    operator: "Meta",
    kind: "user",
    purpose: "Fetches individual links at a user's request, including for Meta's AI agent features.",
    ifBlocked: "Meta says this fetcher may bypass robots.txt, because users request the fetch.",
    robots: "may-ignore",
    userAgent: "meta-externalfetcher/1.1",
    ipRanges: null,
    docsUrl: "https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/",
    inReport: false,
  },
  // ----------------------------------------------------------- Common Crawl
  {
    slug: "ccbot",
    token: "CCBot",
    operator: "Common Crawl",
    kind: "training",
    purpose: "Builds Common Crawl's open web archive, a free dataset that many AI models have been trained on.",
    ifBlocked: "New snapshots of your pages stop entering the Common Crawl dataset that model builders download.",
    robots: "yes",
    userAgent: "CCBot/2.0 (https://commoncrawl.org/faq/)",
    ipRanges: "https://index.commoncrawl.org/ccbot.json",
    docsUrl: "https://commoncrawl.org/ccbot",
    inReport: false,
  },
];

export const CRAWLER_SLUGS = CRAWLERS.map((c) => c.slug);

export const getCrawler = (slug: string) => CRAWLERS.find((c) => c.slug === slug);

// Bots whose access decides whether a site can be cited in AI answers.
export const affectsAnswers = (c: Crawler) => c.kind === "search" || c.kind === "user";

// A starting point for stores: allow AI search, choose about training.
export const RECOMMENDED_ROBOTS = `# AI search and assistants: allow, so you can be found and cited.
# Copy any Disallow lines from your User-agent: * group in here too
# (like /cart or /checkout): a bot with its own group ignores the * rules.
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
Allow: /

# AI training: your choice. Delete this group to allow training.
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: meta-externalagent
User-agent: Amazonbot
User-agent: CCBot
Disallow: /`;
