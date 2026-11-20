import Link from "next/link";
import { AiVisibilityChecker } from "@/components/AiVisibilityChecker";
import { AiReadiness } from "@/components/blog/AiReadiness";
import { LlmsTxtBuilder } from "@/components/blog/LlmsTxtBuilder";
import { RobotsTester } from "@/components/blog/RobotsTester";
import { Faq } from "@/components/Faq";
import { JsonLd, ORG_ID, breadcrumbs, faqPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { INSTALL_URL, SITE_NAME, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Free AI Visibility Checker & AI SEO Tools",
  description:
    "Free tools to check if ChatGPT, Claude, Perplexity and Google AI can read your website: test AI crawler access in robots.txt, validate llms.txt and agents.md, and check structured data.",
  path: "/ai-tools",
});

const TOOLS = [
  { id: "checker", label: "AI visibility checker", text: "Scan any site for AI crawler access, AI files and homepage signals." },
  { id: "llms-txt", label: "llms.txt generator", text: "Build a valid llms.txt that summarises your store for AI assistants." },
  { id: "robots", label: "robots.txt tester", text: "See exactly which AI and search bots your rules allow or block." },
  { id: "readiness", label: "AI readiness score", text: "A checklist of what it takes to get recommended in AI answers." },
];

const FAQS = [
  {
    q: "What is AI visibility?",
    a: "AI visibility is how easily AI assistants like ChatGPT, Claude, Perplexity, Gemini and Google AI Overviews can find, read and cite your website. It depends on whether their crawlers are allowed in, whether your content is readable without JavaScript, and whether facts about your business are stated clearly in text and structured data.",
  },
  {
    q: "How does the AI visibility checker work?",
    a: "It fetches your homepage, robots.txt, llms.txt, agents.md and XML sitemap the way an AI crawler would, then checks which AI bots your robots.txt allows, whether your AI files exist and follow the expected format, and whether the homepage has a title, meta description, JSON-LD schema, canonical URL and readable text. Nothing about your site is stored.",
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

function SectionHead({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} style={{ scrollMarginTop: 90, marginTop: 80 }}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="h-section" style={{ margin: "12px 0 0", maxWidth: 680 }}>
        {title}
      </h2>
      <p className="lead" style={{ maxWidth: 640, fontSize: 16.5 }}>
        {children}
      </p>
    </div>
  );
}

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

        <div id="checker" style={{ scrollMarginTop: 90 }}>
          <AiVisibilityChecker />
        </div>

        <nav aria-label="Free AI tools" style={{ marginTop: 48 }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,200px),1fr))", gap: 12 }}>
            {TOOLS.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="card" style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 4, borderRadius: 12, height: "100%" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text)" }}>{t.label}</span>
                  <span style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--color-text-softer)" }}>{t.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <SectionHead id="llms-txt" eyebrow="Generator" title="llms.txt generator">
          Fill in your store&rsquo;s basics and get a valid llms.txt to upload. Read{" "}
          <Link href="/blog/what-is-llms-txt-shopify">what llms.txt is and how to use it</Link>.
        </SectionHead>
        <LlmsTxtBuilder />

        <SectionHead id="robots" eyebrow="Tester" title="robots.txt tester for AI crawlers">
          Paste your robots.txt and test any crawler against any path, using the same matching rules Google and OpenAI
          follow. See the <Link href="/blog/shopify-robots-txt-guide">robots.txt guide</Link> for what to allow.
        </SectionHead>
        <RobotsTester />

        <SectionHead id="readiness" eyebrow="Checklist" title="AI search readiness score">
          An assistant has to find, fetch and understand a page before it can recommend it. Tick what your site already
          does to see where the chain breaks. More in{" "}
          <Link href="/blog/how-ai-assistants-choose-stores">how AI assistants choose stores</Link>.
        </SectionHead>
        <AiReadiness />

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
