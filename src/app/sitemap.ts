import type { MetadataRoute } from "next";

const ROUTES = [
  "",
  "/about",
  "/docs",
  "/contact",
  "/privacy",
  "/terms",
  "/support",
  "/data-deletion",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `https://seorating.net${path}`,
    lastModified: new Date(),
  }));
}
