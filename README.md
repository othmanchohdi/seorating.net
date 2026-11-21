# seorating.net

Marketing site for **SEO Rating**, a Shopify app by [The Next Sprout](https://www.thenextsprout.com).

Next.js 16 (App Router, Cache Components), deployed on Vercel from `main`. Production domain: https://seorating.net.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Configuration

Site-wide facts (URLs, emails, company, legal dates) live in `src/lib/site.ts`.

- `INSTALL_URL`: set it to the Shopify App Store listing once the app is approved. While it is `null`, every Install button is hidden.
- `LEGAL_UPDATED`: bump it whenever the Privacy Policy, Terms, Support or Data Deletion pages change.

Environment variables (Vercel, Production + Preview):

| Name | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Sends contact-form and waitlist emails from `hello@seorating.net` (verified in Resend). |
| `PERPLEXITY_API_KEY` | Turns on the AI citation check in reports (Perplexity Agent API). Hidden while unset. |
| `PERPLEXITY_EFFORT` | Optional. Agent API effort preset for citation checks; defaults to `fast`. |
| `CITATION_DAILY_CAP` | Optional. Max citation checks per day across the site; defaults to `100`. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Shared rate limits across instances, and storage for weekly monitoring (the Vercel Upstash integration's `KV_REST_API_URL` / `KV_REST_API_TOKEN` also work). Without it, rate limits fall back to per-instance memory and weekly alerts are hidden. |
| `CRON_SECRET` | Protects `/api/cron/monitor`, the weekly alert run scheduled in `vercel.json` (Mondays 08:00 UTC). Vercel sends it automatically; any random string. |

Vercel Web Analytics must be enabled in the project dashboard for page views; custom funnel events (`src/lib/analytics.ts`) need a Pro plan.
