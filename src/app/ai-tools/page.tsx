import Link from "next/link";
import { CheckForm } from "@/components/ai-tools/CheckForm";
import { Faq } from "@/components/Faq";
import { AI_TOOLS } from "@/content/ai-tools";
import { JsonLd, ORG_ID, breadcrumbs, faqPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { INSTALL_URL, SITE_NAME, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Free AI Visibility Checker & AI SEO Tools",
  description:
    "Free tools to check if ChatGPT, Claude, Perplexity and Google AI can read your website: test AI crawler access in robots.txt, validate llms.txt and agents.md, and check structured data.",
  path: "/ai-tools",
});

const FAQS = [
  {
    q: "What is AI visibility?",
    a: "AI visibility is how easily AI assistants like ChatGPT, Claude, Perplexity, Gemini and Google AI Overviews can find, read and cite your website. It depends on whether their crawlers are allowed in, whether your content is readable without JavaScript, and whether facts about your business are stated clearly in text and structured data.",
  },
  {
    q: "How does the AI visibility checker work?",
    a: "It fetches your homepage, a product page, robots.txt, llms.txt, agents.md and XML sitemap the way an AI crawler would. It checks which of 10 AI bots your robots.txt allows, requests your homepage as GPTBot, OAI-SearchBot, ClaudeBot and PerplexityBot to catch firewalls that block them, and checks your structured data, meta tags and how much text is readable without JavaScript. You get a score, your top fixes and copy-paste code. Nothing about your site is stored.",
  },
  {
    q: "Should I block GPTBot or ClaudeBot?",
    a: "It depends on what you want. GPTBot and ClaudeBot collect data for model training. OAI-SearchBot, ChatGPT-User, Claude-SearchBot and PerplexityBot fetch pages to answer questions and cite sources. Many sites block training crawlers while allowing search crawlers, so they can still be recommended in AI answers.",
  },
  {
    q: "Do I need an llms.txt file?",
    a: "No search engine requires it, and it won't replace good page content. But an llms.txt is a cheap, low-risk way to give AI assistants a short, curated map of your site and its key pages, and more tools read it every month.",
  },
  {
    q: "Does a high score guarantee my site will be cited by ChatGPT?",
    a: "No. The score measures whether AI assistants can access and understand your site. Whether they cite it also depends on your content, reputation and how well you answer the question being asked. A low score, though, usually means you're invisible no matter how good the content is.",
  },
  {
    q: "Are these tools really free?",
    a: `Yes. There's no signup and no limit beyond a short throttle to prevent abuse. ${SITE_NAME} builds them because the same checks run inside our Shopify app, which also fixes what it finds.`,
  },
];

export default function AiTools() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "AI Visibility Checker",
            url: absoluteUrl("/ai-tools"),
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            browserRequirements: "Requires JavaScript",
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: "Free tool that checks whether AI assistants like ChatGPT, Claude and Perplexity can crawl and understand a website.",
            publisher: { "@id": ORG_ID },
          },
          breadcrumbs([{ name: "Free AI tools", path: "/ai-tools" }]),
          faqPage(FAQS),
        ]}
      />
      <div className="container container-narrow" style={{ padding: "64px 24px 40px" }}>
        <span className="eyebrow">Free AI tools</span>
        <h1 style={{ margin: "14px 0 0", maxWidth: 760, fontSize: "clamp(34px,5vw,48px)", lineHeight: 1.06, letterSpacing: "-0.03em", fontWeight: 600 }}>
          Can ChatGPT, Claude and Perplexity see your website?
        </h1>
        <p className="lead" style={{ maxWidth: 640, fontSize: 17.5 }}>
          Free AI visibility checker and AI SEO tools. Enter any website to see which AI crawlers can reach it, whether
          it has llms.txt and agents.md, and what assistants read on its homepage. No signup.
        </p>

        <div id="checker" className="widget" style={{ scrollMarginTop: 90 }}>
          <div className="widget-card" style={{ padding: "clamp(18px,3vw,28px)" }}>
            <p style={{ margin: "0 0 14px", fontSize: 17, fontWeight: 600 }}>Get your free AI visibility report</p>
            <CheckForm />
            <ul className="hero-ticks" style={{ marginTop: 18 }}>
              <li>10 AI crawlers vs. your robots.txt</li>
              <li>Live firewall test as GPTBot, ClaudeBot and PerplexityBot</li>
              <li>llms.txt, agents.md and sitemap</li>
              <li>Homepage and product page schema</li>
              <li>Copy-paste fixes built from your site</li>
            </ul>
          </div>
          <p className="widget-caption">
            Takes 5–15 seconds. You get a shareable report with a score, your top fixes and the code to fix them. Nothing
            about your site is stored.
          </p>
        </div>

        <section style={{ marginTop: 64 }} aria-labelledby="tools-title">
          <span className="eyebrow">The toolkit</span>
          <h2 id="tools-title" className="h-section" style={{ margin: "12px 0 24px", scrollMarginTop: 90 }}>
            Everything you need to get found by AI
          </h2>
          <ToolGrid tools={AI_TOOLS.filter((t) => t.group === "ai" && !t.href.startsWith("/ai-tools#"))} />
        </section>

        <section style={{ marginTop: 64 }} aria-labelledby="seo-tools-title">
          <span className="eyebrow">SEO tools</span>
          <h2 id="seo-tools-title" className="h-section" style={{ margin: "12px 0 24px" }}>
            Free SEO tools for your store
          </h2>
          <ToolGrid tools={AI_TOOLS.filter((t) => t.group === "seo")} />
        </section>

        <div style={{ marginTop: 80 }}>
          <span className="eyebrow">FAQ</span>
          <h2 className="h-section" style={{ margin: "12px 0 24px" }}>
            AI visibility questions
          </h2>
          <Faq items={FAQS} />
        </div>
      </div>

      <section style={{ padding: "40px 16px 88px" }}>
        <div className="container" style={{ borderRadius: 24, background: "var(--color-primary)", padding: "64px clamp(20px,4vw,40px)", textAlign: "center" }}>
          <h2 className="h-section" style={{ margin: "0 auto", maxWidth: 640, color: "#fff" }}>
            Run on Shopify? Fix all of this automatically.
          </h2>
          <p style={{ margin: "16px auto 0", maxWidth: 540, fontSize: 17, lineHeight: 1.6, color: "var(--color-primary-chip)" }}>
            {SITE_NAME} runs these checks on every page of your store, then writes your llms.txt, agents.md, schema and
            meta tags for you to approve.
          </p>
          {INSTALL_URL ? (
            <a href={INSTALL_URL} rel="noopener" className="btn btn-white" style={{ marginTop: 30, height: 50, fontSize: 16 }}>
              Install on Shopify
            </a>
          ) : (
            <Link href="/contact" className="btn btn-white" style={{ marginTop: 30, height: 50, fontSize: 16 }}>
              Talk to the team
            </Link>
          )}
        </div>
      </section>
    </>
  );
}

function ToolGrid({ tools }: { tools: typeof AI_TOOLS }) {
  return (
    <ul className="crawler-grid">
      {tools.map((t) => (
        <li key={t.href}>
          <Link href={t.href} className="card crawler-card" style={{ padding: "20px 22px" }}>
            <span style={{ fontSize: 16.5, fontWeight: 600, color: "var(--color-text)" }}>{t.label} →</span>
            <span style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--color-text-softer)" }}>{t.text}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
