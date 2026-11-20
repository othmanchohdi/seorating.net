import Link from "next/link";
import { CheckForm } from "@/components/ai-tools/CheckForm";
import { CodeBlock } from "@/components/ai-tools/CodeBlock";
import { Faq } from "@/components/Faq";
import { CRAWLERS, KIND_LABEL, RECOMMENDED_ROBOTS, VERIFIED, type CrawlerKind } from "@/content/ai-crawlers";
import { formatDate } from "@/content/blog";
import { JsonLd, ORG_ID, breadcrumbs, faqPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "AI Crawler Directory: Every AI Bot User Agent Explained",
  description: `What GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and ${CRAWLERS.length - 5} other AI crawlers do, their user agents and IP lists, and which to allow in robots.txt. Verified against official docs.`,
  path: "/ai-tools/ai-crawlers",
});

const ORDER: CrawlerKind[] = ["search", "user", "training", "control", "other"];

const ROBOTS_LABEL = { yes: "Follows robots.txt", "may-ignore": "May ignore robots.txt", "token-only": "robots.txt token only" } as const;

const FAQS = [
  {
    q: "What's the difference between GPTBot and OAI-SearchBot?",
    a: "GPTBot collects content that may be used to train OpenAI's models. OAI-SearchBot indexes pages so ChatGPT search can show and cite them. They're controlled separately, so you can block training (GPTBot) and still appear in ChatGPT answers (OAI-SearchBot).",
  },
  {
    q: "Does blocking AI crawlers hurt my SEO?",
    a: "Blocking training crawlers like GPTBot, ClaudeBot or Google-Extended doesn't affect Google or Bing rankings; Google states Google-Extended has no effect on Search. Blocking AI search crawlers like OAI-SearchBot, Claude-SearchBot or PerplexityBot removes you from those assistants' answers, and blocking Googlebot or Bingbot removes you from search entirely.",
  },
  {
    q: "How do I know a request really comes from an AI crawler?",
    a: "User agent strings are easy to fake. Most operators publish the IP ranges their crawlers use; check the request's IP address against that list. Each crawler's page in this directory links to its official list.",
  },
  {
    q: "Why do some AI fetchers ignore robots.txt?",
    a: "User-triggered fetchers like ChatGPT-User and Perplexity-User visit a page because a person asked the assistant to. Their operators treat that like a browser visit, so they say robots.txt may not apply. To stop them, you'd need a firewall rule.",
  },
];

export default function AiCrawlers() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "AI crawler directory",
            url: absoluteUrl("/ai-tools/ai-crawlers"),
            dateModified: VERIFIED,
            publisher: { "@id": ORG_ID },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: CRAWLERS.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.token, url: absoluteUrl(`/ai-tools/ai-crawlers/${c.slug}`) })),
            },
          },
          breadcrumbs([
            { name: "Free AI tools", path: "/ai-tools" },
            { name: "AI crawler directory", path: "/ai-tools/ai-crawlers" },
          ]),
          faqPage(FAQS),
        ]}
      />
      <div className="container container-narrow" style={{ padding: "40px 24px 96px" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13.5, color: "var(--color-text-faint)" }}>
          <Link href="/ai-tools">Free AI tools</Link> <span aria-hidden="true">/</span> AI crawler directory
        </nav>
        <span className="eyebrow" style={{ display: "block", width: "fit-content", marginTop: 28 }}>AI crawler directory</span>
        <h1 style={{ margin: "14px 0 0", maxWidth: 760, fontSize: "clamp(32px,5vw,46px)", lineHeight: 1.08, letterSpacing: "-0.03em", fontWeight: 600 }}>
          Every AI crawler, what it does, and whether to block it
        </h1>
        <p className="lead" style={{ maxWidth: 660, fontSize: 17.5 }}>
          {CRAWLERS.length} AI bots from OpenAI, Anthropic, Perplexity, Google, Microsoft, Apple, Amazon, Meta and Common
          Crawl, with their user agents, IP lists and what blocking each one actually changes.
        </p>
        <p style={{ margin: "10px 0 0", fontSize: 13.5, color: "var(--color-text-faint)" }}>
          Checked against each operator&rsquo;s own documentation on {formatDate(VERIFIED, "long")}.
        </p>

        <div className="report-card" style={{ padding: 22, marginTop: 32 }}>
          <p style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>Which of these can reach your site?</p>
          <CheckForm size="sm" buttonLabel="Check my site" />
        </div>

        <h2 className="h-section" style={{ margin: "64px 0 8px", fontSize: "clamp(24px,3.5vw,30px)" }}>
          Four kinds of AI bot
        </h2>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: "var(--color-text-softer)", maxWidth: 680 }}>
          The most common mistake is treating every AI bot the same. Blocking training crawlers is a reasonable choice;
          blocking search crawlers and fetchers is how sites vanish from AI answers.
        </p>

        {ORDER.map((kind) => {
          const list = CRAWLERS.filter((c) => c.kind === kind);
          if (!list.length) return null;
          return (
            <section key={kind} style={{ marginTop: 36 }} aria-labelledby={`kind-${kind}`}>
              <h3 id={`kind-${kind}`} style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                {KIND_LABEL[kind].label}
              </h3>
              <p style={{ margin: "6px 0 14px", fontSize: 15, lineHeight: 1.6, color: "var(--color-text-softer)" }}>{KIND_LABEL[kind].blurb}</p>
              <ul className="crawler-grid">
                {list.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/ai-tools/ai-crawlers/${c.slug}`} className="card crawler-card">
                      <span className="mono" style={{ fontSize: 14.5, fontWeight: 600, color: "var(--color-text)" }}>{c.token}</span>
                      <span style={{ fontSize: 12.5, color: "var(--color-text-faintest)" }}>
                        {c.operator} · {ROBOTS_LABEL[c.robots]}
                      </span>
                      <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--color-text-softer)" }}>{c.purpose}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <h2 className="h-section" style={{ margin: "72px 0 8px", fontSize: "clamp(24px,3.5vw,30px)" }}>
          A sensible robots.txt for online stores
        </h2>
        <p style={{ margin: "0 0 18px", fontSize: 16, lineHeight: 1.65, color: "var(--color-text-softer)", maxWidth: 680 }}>
          Let assistants find and cite you; decide separately about training. Test it in the{" "}
          <Link href="/ai-tools/robots-txt-tester">robots.txt tester</Link> before you publish.
        </p>
        <CodeBlock label="robots.txt" code={RECOMMENDED_ROBOTS} />

        <h2 className="h-section" style={{ margin: "72px 0 24px", fontSize: "clamp(24px,3.5vw,30px)" }}>
          AI crawler questions
        </h2>
        <Faq items={FAQS} />
      </div>
    </>
  );
}
