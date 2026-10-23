import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation",
  description: "A walkthrough of every module in SEO Rating as it works today.",
};

const TOC = [
  { href: "#getting-started", n: "01", label: "Getting started" },
  { href: "#seo-tags", n: "02", label: "SEO Tags" },
  { href: "#page-optimization", n: "03", label: "Page Optimization" },
  { href: "#search-appearance", n: "04", label: "Search Appearance" },
  { href: "#url-management", n: "05", label: "URL Management" },
  { href: "#ai-visibility", n: "06", label: "AI Visibility" },
  { href: "#keyword-research", n: "07", label: "Keyword Research" },
  { href: "#store-performance", n: "08", label: "Store Performance" },
  { href: "#ai-credits", n: "09", label: "AI Credits", highlight: true },
];

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ margin: "0 0 14px", fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>{children}</h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 600 }}>{children}</h3>;
}

function P({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <p style={{ margin: last ? 0 : "0 0 18px", fontSize: 16, lineHeight: 1.68, color: "var(--color-ink-soft)" }}>
      {children}
    </p>
  );
}

export default function Documentation() {
  return (
    <main className="container" style={{ padding: "64px 24px 96px" }}>
      <span className="mono-label">Documentation</span>
      <h1 style={{ margin: "14px 0 0", maxWidth: 720, fontSize: 44, lineHeight: 1.06, letterSpacing: "-0.03em", fontWeight: 600 }}>
        How to use SEO Rating
      </h1>
      <p style={{ margin: "20px 0 0", maxWidth: 640, fontSize: 17.5, lineHeight: 1.6, color: "var(--color-text-soft)" }}>
        A walkthrough of every module in the app as it works today — what each one does, when to use
        it, and what it changes in your store. Nothing here is a roadmap item.
      </p>

      <div style={{ marginTop: 52, display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 48 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {TOC.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                border: `1px solid ${item.highlight ? "var(--color-primary-soft-border)" : "var(--color-border)"}`,
                borderRadius: 12,
                padding: "16px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                background: item.highlight ? "var(--color-primary-soft)" : undefined,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: item.highlight ? "#8d84d8" : "var(--color-text-faintest)",
                }}
              >
                {item.n}
              </span>
              <span style={{ fontSize: 15, fontWeight: 600, color: item.highlight ? "#2c2470" : "var(--color-text)" }}>
                {item.label}
              </span>
            </a>
          ))}
        </div>

        <div style={{ maxWidth: 760, display: "flex", flexDirection: "column", gap: 56 }}>
          <div id="getting-started">
            <H2>Getting started</H2>
            <H3>Installing the app</H3>
            <P>
              Install SEO Rating from the Shopify App Store listing (&ldquo;TNS SEO &amp; AI
              Visibility&rdquo;). Shopify shows you the permissions the app needs before you approve
              — it reads and writes the SEO-related parts of your store: products, pages, blog
              articles, uploaded files, your theme (read-only, to find images missing alt text), and
              URL redirects. Approving the install opens the app inside your Shopify admin; there is
              no separate account or password to create.
            </P>
            <H3>Connecting your store</H3>
            <P>
              On first open, the app scans your store to build a picture of what exists: how many
              products and pages you have, which of them are missing meta titles or descriptions,
              which images have no alt text, and what your current robots.txt and structured data
              look like. The scan is read-only — nothing is changed until you approve a change
              yourself.
            </P>
            <P>
              One optional connection unlocks extra data: connecting{" "}
              <strong style={{ fontWeight: 600 }}>Google Search Console</strong> (see Search
              Appearance) brings your real search performance and indexing status into the app.
            </P>
            <div style={{ border: "1px solid var(--color-border)", borderRadius: 12, padding: "18px 20px", background: "var(--color-surface)" }}>
              <p style={{ margin: "0 0 8px", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-faint)" }}>
                Suggested first session
              </p>
              <ol style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 7, fontSize: 15, lineHeight: 1.62, color: "var(--color-ink-soft)" }}>
                <li>Let the initial scan finish, then read the dashboard summary.</li>
                <li>Run a Store Performance audit so you have a baseline.</li>
                <li>Fix missing meta tags and alt text — the highest-volume, lowest-risk wins.</li>
                <li>Generate your llms.txt and agents.md files.</li>
                <li>Connect Search Console, then work through Page Optimization page by page.</li>
              </ol>
            </div>
          </div>

          <div id="seo-tags">
            <H2>SEO Tags</H2>
            <P>
              Two related tools for the tags that decide how your pages are described in search
              results and to AI systems: meta tags and image alt tags.
            </P>
            <H3>Meta titles and descriptions</H3>
            <P>
              The app lists every product, collection, page and article with its current meta title
              and description, flagging what&rsquo;s missing, duplicated, too long or too short. You
              can write tags in two ways:
            </P>
            <ul style={{ margin: "0 0 18px", padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 9, fontSize: 16, lineHeight: 1.68, color: "var(--color-ink-soft)" }}>
              <li>
                <strong style={{ fontWeight: 600 }}>Templates.</strong> Build a pattern once using
                store variables — for example a product-title-plus-brand pattern — and apply it
                across a whole resource type. Fast, predictable, and free of AI credit cost.
              </li>
              <li>
                <strong style={{ fontWeight: 600 }}>AI-assisted.</strong> Have the app draft tags
                from the actual page content when a template would read poorly, or for your
                important pages. Drafts appear next to the current value so you can compare before
                saving.
              </li>
            </ul>
            <H3>Image alt tags</H3>
            <P>
              The app finds images with missing or empty alt text and generates descriptions of what
              is actually in each image, rather than repeating the product title. You can generate
              for a single image, a product, or in bulk across the catalogue, review the results in a
              list, edit any of them, and then save. Alt text is written back to the image record in
              Shopify.
            </P>
            <P last>
              Alt text helps accessibility first and search second — screen readers read exactly what
              you save, so review anything that describes people, claims or context.
            </P>
          </div>

          <div id="page-optimization">
            <H2>Page Optimization</H2>
            <P>
              A real on-page audit, one page at a time. Pick a product, collection, page or article
              and the app checks the things that actually affect how it is understood: title and meta
              description, heading structure, content length and depth, keyword usage and placement,
              internal links, image alt coverage, and whether the page has the structured data it
              should.
            </P>
            <P>
              Each finding says what is wrong and why it matters. Where the fix is editorial rather
              than technical, the <strong style={{ fontWeight: 600 }}>AI content optimizer</strong>{" "}
              can draft improved copy for that specific section — informed by the keyword you are
              targeting if you have one from Keyword Research.
            </P>
            <div style={{ borderLeft: "3px solid var(--color-primary)", background: "#f7f6fe", padding: "16px 18px", borderRadius: "0 10px 10px 0" }}>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.68, color: "#2c2470" }}>
                <strong style={{ fontWeight: 600 }}>Review before publish.</strong> Nothing the
                optimizer writes goes live on its own. You see the proposed change beside the current
                content, edit it freely, and then choose to publish or discard. This applies to every
                AI-assisted write in the app.
              </p>
            </div>
          </div>

          <div id="search-appearance">
            <H2>Search Appearance</H2>
            <P>
              Everything that controls how your store is represented to search engines at a technical
              level.
            </P>
            <H3>Structured data (JSON-LD schema)</H3>
            <P>
              The app generates and injects JSON-LD describing your products, breadcrumbs and pages,
              so search engines and AI assistants can read price, availability and other attributes
              as data instead of guessing from your HTML. You choose which schema types are active,
              and the app keeps the output aligned with your store data as it changes.
            </P>
            <H3>Local Business schema</H3>
            <P>
              If you have a physical location, enter your business name, address, phone, opening
              hours and service area, and the app publishes Local Business structured data for it.
              Useful for stores where local intent matters and for making the business details
              unambiguous to AI assistants.
            </P>
            <H3>Google Search Console</H3>
            <P>
              Connect your Google account and select your store&rsquo;s property. The app then shows
              your real Search Console data — queries, impressions, clicks and indexing status — next
              to the pages they belong to, so you can see which pages are actually earning search
              visibility. You can disconnect the account at any time from inside the app, which
              permanently deletes the stored connection and tokens. Submitting a URL for faster
              re-crawling is handled separately via IndexNow (see AI Visibility below), not through a
              Google-specific indexing request.
            </P>
            <H3>Robots.txt management</H3>
            <P last>
              View and edit your store&rsquo;s crawler rules in the app, including rules for AI
              crawlers. This is the one area where a mistake can hide your store from search, so the
              app shows you the effective file before you save — read it carefully, and keep a note
              of what you changed.
            </P>
          </div>

          <div id="url-management">
            <H2>URL Management</H2>
            <H3>Sitemap</H3>
            <P>
              See what is in your store&rsquo;s sitemap — which products, collections, pages and
              articles are listed for crawlers, and which of your URLs are absent. Use it as the
              checklist for what search engines and AI crawlers can find, and pair it with Search
              Console data to spot pages that are listed but not indexed.
            </P>
            <H3>Broken links</H3>
            <P last>
              The app scans your store for links that no longer resolve — deleted products, renamed
              pages, dead outbound links — and lists where each broken link appears so you can fix or
              redirect it. Broken links waste crawl budget and lose customers mid-journey, so this is
              worth re-running after any big catalogue change.
            </P>
          </div>

          <div id="ai-visibility">
            <H2>AI Visibility</H2>
            <P>
              The part of the app that exists because people now ask assistants like ChatGPT,
              Perplexity and Gemini what to buy. These tools make your store readable and
              referenceable to those systems. No tool can guarantee an AI assistant will cite you —
              what you can control is whether your store is easy to read correctly.
            </P>
            <H3>llms.txt and agents.md</H3>
            <P>
              The app generates these two files from your real store data and keeps them hosted on
              your domain. <code className="inline-code">llms.txt</code> is a clean, structured
              summary of what your store is and what it sells, in a form language models can ingest
              without wading through theme markup.{" "}
              <code className="inline-code">agents.md</code> describes your store for AI agents,
              including the key pages and policies. You review the generated content and can edit it
              before publishing.
            </P>
            <H3>IndexNow</H3>
            <P>
              IndexNow lets you notify participating search engines the moment a URL changes, rather
              than waiting for a crawl. Enable it in the app and new and updated URLs are submitted
              for you, which shortens the gap between publishing a change and having it reflected in
              search. Google does not currently participate in the IndexNow protocol, so this applies
              to the engines that do.
            </P>
            <H3>LLM Outreach</H3>
            <P last>
              A view of how your store reads to a language model: the app queries assistants about
              your store and brand and shows you what comes back, so you can see what they currently
              believe about you and where the picture is thin or wrong. Use it to decide what content
              to strengthen — outdated details, missing product context, unclear policies — then fix
              it with Page Optimization and re-check.
            </P>
          </div>

          <div id="keyword-research">
            <H2>Keyword Research</H2>
            <P>
              Search a term and get real keyword data — search volume, related terms and variations —
              for the location and language you sell in. It is not a separate silo: any keyword you
              find can be sent straight into Page Optimization as the target for a specific page, so
              the content optimizer drafts with that term in mind.
            </P>
            <P last>
              The <strong style={{ fontWeight: 600 }}>AI article idea generator</strong> turns the
              keywords you have chosen into concrete article angles for your store&rsquo;s blog —
              what to write, and which search intent it answers. Ideas are drafts to choose from, not
              a publishing queue.
            </P>
          </div>

          <div id="store-performance">
            <H2>Store Performance</H2>
            <P>
              Run a real Google PageSpeed Insights audit against your live store URLs, for mobile and
              desktop, from inside the app. You get the same Core Web Vitals and opportunity findings
              Google reports, explained in plain language and grouped by what is actually worth acting
              on.
            </P>
            <P last>
              Performance fixes usually live in your theme or apps rather than in your SEO settings,
              so treat this as a diagnostic: run a baseline early, re-run after theme or app changes,
              and use the findings as the brief for whoever maintains your theme.
            </P>
          </div>

          <div
            id="ai-credits"
            style={{ border: "1px solid var(--color-primary-soft-border)", background: "#f7f6fe", borderRadius: 16, padding: 32 }}
          >
            <h2 style={{ margin: "0 0 14px", fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: "#2c2470" }}>
              AI Credits
            </h2>
            <p style={{ margin: "0 0 18px", fontSize: 16, lineHeight: 1.68, color: "#3a3470" }}>
              AI work costs real money to run, so instead of hiding that behind a vague &ldquo;fair
              use&rdquo; policy, the app meters it. Anything that calls a model — drafting meta tags,
              generating alt text, optimizing content, generating article ideas — consumes credits.
              Everything else, including audits, templates, structured data, robots.txt, sitemap and
              broken-link checks, does not.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
              <div style={{ background: "#fff", border: "1px solid #e2dffa", borderRadius: 12, padding: "18px 20px" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 16.5, fontWeight: 600, color: "#2c2470" }}>
                  You see the cost before you run it
                </h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#4a4470" }}>
                  Each AI action shows its credit cost up front, and bulk actions show the total for
                  the batch before you confirm. Nothing runs without you agreeing to the cost.
                </p>
              </div>
              <div style={{ background: "#fff", border: "1px solid #e2dffa", borderRadius: 12, padding: "18px 20px" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 16.5, fontWeight: 600, color: "#2c2470" }}>
                  Your balance and history are visible
                </h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#4a4470" }}>
                  The app shows your remaining balance and a log of what consumed credits, so usage is
                  auditable rather than a surprise at the end of the month.
                </p>
              </div>
              <div style={{ background: "#fff", border: "1px solid #e2dffa", borderRadius: 12, padding: "18px 20px" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 16.5, fontWeight: 600, color: "#2c2470" }}>
                  Included with your plan
                </h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#4a4470" }}>
                  Free includes 40 AI credits a month. Growth, Pro and Scale include progressively
                  higher monthly allowances — see{" "}
                  <Link href="/#pricing" style={{ color: "#4b3ecb" }}>pricing</Link> for exact
                  numbers.
                </p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.68, color: "#3a3470" }}>
              A practical habit: use templates for the routine, high-volume work where a pattern reads
              well, and spend credits where judgement actually helps — your top products, collection
              pages and content you want AI assistants to understand properly.
            </p>
          </div>

          <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: 32, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ margin: 0, maxWidth: 440, fontSize: 16, lineHeight: 1.65, color: "var(--color-text-soft)" }}>
              Something here unclear, or a step not matching what you see in the app? Tell us and
              we&rsquo;ll fix the docs.
            </p>
            <Link href="/contact" className="btn btn-secondary">
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
