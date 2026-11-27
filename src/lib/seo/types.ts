// Shared result shapes for the free SEO tools, so the analysers can later
// feed one combined audit.
export type Tone = "ok" | "warn" | "bad";
export type Finding = { tone: Tone; text: string };
