// Plain list of published slugs, kept free of React so src/proxy.ts can
// import it cheaply. index.ts fails the build if this drifts from POSTS.
export const POST_SLUGS = [
  "what-is-llms-txt-shopify",
  "how-ai-assistants-choose-stores",
  "shopify-robots-txt-guide",
  "meta-descriptions-that-get-clicked",
  "product-image-alt-text-checklist",
  "shopify-product-schema",
  "reading-pagespeed-report",
] as const;
