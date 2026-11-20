# Free AI Tools — Roadmap

Goal: turn `/ai-tools` from a one-off checker into a free tool people come back to,
share and recommend, which brings organic traffic and Shopify leads to SEO Rating.

The best tools in this space (Lighthouse, PageSpeed Insights, Ahrefs' free tools) all:

1. tell you **what to do next**, not just what's wrong,
2. produce **an artifact you keep and share**,
3. measure **the real outcome**, not just the inputs.

## Where v1 stands (live since 2026-11-20)

- Live checker on `/ai-tools`: robots.txt rules for 10 AI crawlers, llms.txt, agents.md,
  sitemap, and homepage signals (title, description, JSON-LD, Open Graph, canonical,
  noindex, readable text, lang).
- Existing widgets: llms.txt builder, robots.txt tester, AI readiness checklist.
- "Get my free review" lead form → email to hello@seorating.net.
- FAQPage + WebApplication schema; in sitemap and llms.txt.

### Gaps

| Gap | Why it matters |
|---|---|
| Results vanish on refresh, no shareable link | Every check could be free distribution |
| Only the homepage is checked | For stores, product pages are what assistants recommend |
| Checks inputs (robots, schema), not outcomes | People want to know "does ChatGPT mention me?" |
| Findings are advice, not fixes | Visitor still has to work out what to write |
| 2–8 s of "Checking…" | Feels slow; staged progress builds trust |
| All tools on one URL | One page can only rank for one search term |
| Leads only arrive in the inbox, no funnel data | Can't tell whether the page works |

## Phase 1 — make it great (no paid APIs)

### Engineering
- [x] **Shareable report pages** at `/ai-tools/report/<domain>`, cached, streamed section
      by section, noindex by default, with a per-report Open Graph image showing the score.
- [x] **Firewall / bot access test**: fetch the homepage as GPTBot, OAI-SearchBot,
      ClaudeBot and PerplexityBot and compare with a browser. Catches CDN/WAF blocks that
      robots.txt doesn't show (the most common hidden cause of AI invisibility in 2026).
- [x] **Product page check**: detect Shopify, find a product page, check Product schema
      (price, currency, availability, brand, image, reviews) and readable text.
- [x] **Copy-paste fixes** generated from the site itself: robots.txt rules, an llms.txt
      draft, Organization JSON-LD, Product JSON-LD, sitemap line, canonical, lang.
- [x] Per-IP throttle on report generation (in proxy); cached reports cost nothing.
- [x] Redirect notice when a domain redirects to a different host (e.g. gymshark.com →
      us.checkout.gymshark.com), with a link to check the www host instead.
- [ ] Shared rate limiter (Upstash Redis) instead of per-instance memory.
- [ ] Analytics events: check run → report viewed → review requested → install.

### Design
- [x] Results ranked by priority: big score, category scores (Access, AI files, Homepage,
      Products), then **Top fixes** tagged by impact.
- [x] Staged progress: each section shows its own loading state and fills in as it finishes.
- [x] Mobile-first results: crawler table becomes stacked cards on small screens.
- [x] Share bar: copy link, share on LinkedIn, check another site.
- [ ] "Re-check now" button that bypasses the one-hour report cache.
- [ ] **"How AI sees you"** panel: raw HTML text next to what a visitor sees (needs a
      headless browser, e.g. Browserless; consider in Phase 2).

### SEO
- [x] One URL per tool: `/ai-tools/llms-txt-generator`, `/ai-tools/robots-txt-tester`,
      `/ai-tools/ai-readiness-checklist`, each with a guide, FAQ schema and cross-links; the
      hub links to each.
- [x] **AI crawler directory**: `/ai-tools/ai-crawlers` and a page for each of 20 bots
      (user agent, operator, robots.txt behaviour, IP list, allow/block rules, FAQ), all
      checked against operator docs on 2026-11-21. The report's crawler table reads the same
      data (`src/content/ai-crawlers.ts`). Re-verify quarterly.
- [x] Recognise Shopify's default llms.txt / agents.md (written for shopping agents via the
      Shop skill and UCP) and explain that it isn't a brand summary.

## Phase 2 — measure the outcome

- [ ] **AI citation check** (email-gated lead magnet): visitor enters their category; we
      ask ChatGPT, Perplexity and Claude (web search on) 3–5 buyer questions and show
      whether they're mentioned, which competitors are, and which sources were cited.
      ~$0.05–0.20 per check. Needs a provider decision and API keys.
- [ ] Competitor comparison: your site vs two others, side by side.
- [ ] Emailed PDF report, designed to be forwarded to a boss or agency.
- [ ] "How AI sees you" rendered-vs-raw view.

## Phase 3 — keep people coming back

- [ ] Weekly monitoring: free email alert when the score drops or a bot gets blocked.
- [ ] Public benchmark: "AI visibility of the top 1,000 Shopify stores", quarterly.
      Press- and backlink-worthy.
- [ ] Chrome extension / public API, if demand shows up.

## Success metrics

- Checks per week, and share arriving from Google
- Check → review request / signup conversion (target 3–5%)
- Report links shared, and visits arriving from them
- App installs attributed to the tools
