import Link from "next/link";
import { Faq } from "@/components/Faq";
import { AI_TOOLS } from "@/content/ai-tools";
import { JsonLd, ORG_ID, breadcrumbs, faqPage } from "@/lib/jsonld";
import { absoluteUrl } from "@/lib/site";
import { CheckForm } from "./CheckForm";

// Shared frame for each standalone free tool: the widget up top, a short
// guide underneath, FAQ, and links to the rest of the toolkit.
export function ToolPage({
  path,
  name,
  title,
  lead,
  widget,
  guide,
  faqs,
}: {
  path: string;
  name: string;
  title: string;
  lead: React.ReactNode;
  widget: React.ReactNode;
  guide: React.ReactNode;
  faqs: { q: string; a: string }[];
}) {
  const group = AI_TOOLS.find((t) => t.href === path)?.group ?? "ai";
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name,
            url: absoluteUrl(path),
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            browserRequirements: "Requires JavaScript",
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            publisher: { "@id": ORG_ID },
          },
          breadcrumbs([
            { name: "Free AI tools", path: "/ai-tools" },
            { name, path },
          ]),
          faqPage(faqs),
        ]}
      />
      <div className="container container-narrow" style={{ padding: "40px 24px 96px", maxWidth: 860 }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13.5, color: "var(--color-text-faint)" }}>
          <Link href="/ai-tools">Free AI tools</Link> <span aria-hidden="true">/</span> {name}
        </nav>
        <span className="eyebrow" style={{ display: "block", width: "fit-content", marginTop: 28 }}>Free tool</span>
        <h1 style={{ margin: "14px 0 0", maxWidth: 760, fontSize: "clamp(32px,5vw,46px)", lineHeight: 1.08, letterSpacing: "-0.03em", fontWeight: 600 }}>
          {title}
        </h1>
        <p className="lead" style={{ maxWidth: 660, fontSize: 17.5 }}>
          {lead}
        </p>

        {widget}

        <div className="docs-prose" style={{ marginTop: 56 }}>
          {guide}
        </div>

        <div className="report-card" style={{ padding: 22, marginTop: 48 }}>
          <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600 }}>Check your whole site in one go</p>
          <p style={{ margin: "0 0 14px", fontSize: 14, color: "var(--color-text-faint)" }}>
            The free AI visibility report tests robots.txt, your firewall, llms.txt, schema and product pages, and writes the fixes.
          </p>
          <CheckForm size="sm" buttonLabel="Run free report" source={`tool:${path}`} />
        </div>

        <section style={{ marginTop: 56 }}>
          <h2 style={{ margin: "0 0 18px", fontSize: 22, fontWeight: 600 }}>Questions</h2>
          <Faq items={faqs} />
        </section>

        <section style={{ marginTop: 56 }} aria-labelledby="more-tools">
          <h2 id="more-tools" style={{ margin: "0 0 14px", fontSize: 20, fontWeight: 600 }}>
            {group === "seo" ? "More free SEO tools" : "More free AI tools"}
          </h2>
          <ul className="crawler-grid">
            {AI_TOOLS.filter((t) => t.href !== path && t.group === group).map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="card crawler-card">
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text)" }}>{t.label}</span>
                  <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--color-text-softer)" }}>{t.text}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p style={{ margin: "16px 0 0", fontSize: 14.5 }}>
            <Link href="/ai-tools#tools-title">See all {AI_TOOLS.length} free tools →</Link>
          </p>
        </section>
      </div>
    </>
  );
}
