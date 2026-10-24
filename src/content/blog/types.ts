import type { ComponentType } from "react";

export type Category = "AI search" | "On-page" | "Technical SEO" | "Speed";

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  published: string; // ISO date
  updated?: string; // ISO date
  readMinutes: number;
  // Short lines shown in the code-panel cover art.
  cover: { file: string; lines: string[] };
  toc: { id: string; label: string }[];
  Body: ComponentType;
};
