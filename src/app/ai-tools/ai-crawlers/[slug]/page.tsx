import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckForm } from "@/components/ai-tools/CheckForm";
import { CodeBlock } from "@/components/ai-tools/CodeBlock";
import { Faq } from "@/components/Faq";
import { CRAWLERS, KIND_LABEL, VERIFIED, getCrawler, type Crawler } from "@/content/ai-crawlers";
import { formatDate } from "@/content/blog";
import { JsonLd, ORG_ID, breadcrumbs, faqPage } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return CRAWLERS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/ai-tools/ai-crawlers/[slug]">) {
  const c = getCrawler((await params).slug);
  if (!c) return {};
  return pageMetadata({
    title: `${c.token}: What It Is and How to Allow or Block It`,
    description: `${c.token} is ${c.operator}'s ${KIND_LABEL[c.kind].short.toLowerCase()} ${c.kind === "control" ? "robots.txt token" : "bot"}. ${c.purpose} User agent, IP list and robots.txt rules.`,
    path: `/ai-tools/ai-crawlers/${c.slug}`,
  });
}

const ROBOTS_TEXT: Record<Crawler["robots"], string> = {
  yes: "Yes",
  "may-ignore": "Not always: it fetches on a user's request",
  "token-only": "It's a robots.txt token, not a crawler",
};

function recommendation(c: Crawler) {
  switch (c.kind) {
    case "search":
      return `Allow it. ${c.token} is how ${c.operator} finds pages to show and cite. For an online store there's rarely a good reason to block it.`;
    case "user":
      return `Allow it. ${c.token} only visits when a person asks about your page; blocking it means the assistant answers without your content.`;
    case "training":
      return `Your call. Blocking ${c.token} keeps your content out of future training data and doesn't remove you from AI search answers. Many stores allow it for brand familiarity; many publishers block it.`;
    case "control":
      return `Your call. ${c.token} only governs whether content may be used for model training; it has no effect on search.`;
    default:
      return "Usually no action is needed.";
  }
}

function faqs(c: Crawler) {
  return [
    { q: `What is ${c.token}?`, a: `${c.token} is ${c.operator}'s ${KIND_LABEL[c.kind].short.toLowerCase()} ${c.kind === "control" ? "robots.txt token" : "bot"}. ${c.purpose}` },
    { q: `Should I block ${c.token}?`, a: recommendation(c) },
    { q: `What happens if I block ${c.token}?`, a: c.ifBlocked },
  ];
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="fact-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default async function CrawlerPage({ params }: PageProps<"/ai-tools/ai-crawlers/[slug]">) {
  const c = getCrawler((await params).slug);
  if (!c) notFound();
  const siblings = CRAWLERS.filter((x) => x.operator === c.operator && x.slug !== c.slug);
  const url = absoluteUrl(`/ai-tools/ai-crawlers/${c.slug}`);
  const q = faqs(c);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: `${c.token}: what it is and how to allow or block it`,
            url,
            dateModified: VERIFIED,
            author: { "@id": ORG_ID },
            publisher: { "@id": ORG_ID },
            about: { "@type": "SoftwareApplication", name: c.token, creator: { "@type": "Organization", name: c.operator } },
            citation: c.docsUrl,
          },
          breadcrumbs([
            { name: "Free AI tools", path: "/ai-tools" },
            { name: "AI crawler directory", path: "/ai-tools/ai-crawlers" },
            { name: c.token, path: `/ai-tools/ai-crawlers/${c.slug}` },
          ]),
          faqPage(q),
        ]}
      />
      <div className="container container-narrow" style={{ padding: "40px 24px 96px", maxWidth: 820 }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13.5, color: "var(--color-text-faint)" }}>
          <Link href="/ai-tools">Free AI tools</Link> <span aria-hidden="true">/</span>{" "}
          <Link href="/ai-tools/ai-crawlers">AI crawler directory</Link> <span aria-hidden="true">/</span> {c.token}
        </nav>
        <span className="eyebrow" style={{ display: "block", width: "fit-content", marginTop: 28 }}>
          {c.operator} · {KIND_LABEL[c.kind].short}
        </span>
        <h1 className="mono" style={{ margin: "14px 0 0", fontSize: "clamp(32px,5vw,46px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 600, overflowWrap: "anywhere" }}>
          {c.token}
        </h1>
        <p className="lead" style={{ maxWidth: 680, fontSize: 18 }}>
          {c.purpose}
        </p>

        <dl className="report-card fact-list">
          <Fact label="Operator">{c.operator}</Fact>
          <Fact label="Type">
            {KIND_LABEL[c.kind].short} <span style={{ color: "var(--color-text-faint)" }}>· {KIND_LABEL[c.kind].blurb}</span>
          </Fact>
          <Fact label="robots.txt token">
            <code className="inline-code">{c.token}</code> <span style={{ color: "var(--color-text-faint)" }}>(case-insensitive)</span>
          </Fact>
          <Fact label="Follows robots.txt">{ROBOTS_TEXT[c.robots]}</Fact>
          <Fact label="User agent">
            {c.userAgent ? (
              <code className="inline-code" style={{ overflowWrap: "anywhere", whiteSpace: "normal" }}>{c.userAgent}</code>
            ) : c.kind === "control" ? (
              "None. It never makes requests; it only appears in robots.txt."
            ) : (
              `${c.operator} publishes the robots.txt token, not a full user agent string. Requests contain "${c.token}".`
            )}
          </Fact>
          <Fact label="IP ranges">
            {c.ipRanges ? (
              <a href={c.ipRanges} rel="noopener nofollow" target="_blank" style={{ overflowWrap: "anywhere" }}>
                {c.ipRanges.replace(/^https?:\/\//, "")}
              </a>
            ) : c.kind === "control" ? (
              "Not applicable"
            ) : (
              "Not published on the operator's crawler page"
            )}
          </Fact>
          <Fact label="Official docs">
            <a href={c.docsUrl} rel="noopener" target="_blank" style={{ overflowWrap: "anywhere" }}>
              {c.docsUrl.replace(/^https?:\/\//, "")}
            </a>
          </Fact>
        </dl>
        <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--color-text-faint)" }}>Verified against {c.operator}&rsquo;s documentation on {formatDate(VERIFIED, "long")}.</p>

        <div className="docs-prose" style={{ marginTop: 48 }}>
          <section>
            <h2>Should you block {c.token}?</h2>
            <p>{recommendation(c)}</p>
            <p>
              <strong>If you block it:</strong> {c.ifBlocked}
            </p>
          </section>

          <section>
            <h2>robots.txt rules for {c.token}</h2>
            <p>
              A bot with its own group ignores your <code className="inline-code">User-agent: *</code> rules, so copy any
              Disallow lines you still need (like <code className="inline-code">/cart</code>) into its group.
            </p>
            <CodeBlock label={`Allow ${c.token}`} code={`User-agent: ${c.token}\nAllow: /`} />
            <CodeBlock label={`Block ${c.token}`} code={`User-agent: ${c.token}\nDisallow: /`} />
            {c.robots === "may-ignore" && (
              <p>
                {c.operator} says {c.token} may not follow robots.txt, because a person triggered the request. To stop it
                reliably you&rsquo;d need a firewall rule matching its IP ranges.
              </p>
            )}
          </section>

          {c.kind !== "control" && (
            <section>
              <h2>How to verify a request is really {c.token}</h2>
              <p>
                Anyone can send a request that claims to be {c.token}.{" "}
                {c.ipRanges
                  ? `${c.operator} publishes the IP ranges it uses: match the request's IP address against that list before trusting it, and before allowing it through a firewall.`
                  : `${c.operator} doesn't publish an IP list on its crawler page, so treat the user agent alone as unverified.`}
              </p>
            </section>
          )}
        </div>

        <div className="report-card" style={{ padding: 22, marginTop: 40 }}>
          <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 600 }}>Does your site let {c.token} in?</p>
          <p style={{ margin: "0 0 14px", fontSize: 14, color: "var(--color-text-faint)" }}>
            The free report checks your robots.txt against the major AI crawlers and tests whether your firewall lets them through.
          </p>
          <CheckForm size="sm" buttonLabel="Check my site" />
        </div>

        {siblings.length > 0 && (
          <section style={{ marginTop: 48 }} aria-labelledby="siblings">
            <h2 id="siblings" style={{ margin: "0 0 14px", fontSize: 20, fontWeight: 600 }}>
              Other {c.operator} bots
            </h2>
            <ul className="crawler-grid">
              {siblings.map((s) => (
                <li key={s.slug}>
                  <Link href={`/ai-tools/ai-crawlers/${s.slug}`} className="card crawler-card">
                    <span className="mono" style={{ fontSize: 14.5, fontWeight: 600, color: "var(--color-text)" }}>{s.token}</span>
                    <span style={{ fontSize: 12.5, color: "var(--color-text-faintest)" }}>{KIND_LABEL[s.kind].short}</span>
                    <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--color-text-softer)" }}>{s.purpose}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section style={{ marginTop: 48 }}>
          <h2 style={{ margin: "0 0 18px", fontSize: 20, fontWeight: 600 }}>Questions about {c.token}</h2>
          <Faq items={q} />
        </section>

        <p style={{ marginTop: 40, fontSize: 15 }}>
          <Link href="/ai-tools/ai-crawlers">← All {CRAWLERS.length} AI crawlers</Link>
        </p>
      </div>
    </>
  );
}
