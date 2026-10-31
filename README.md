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
