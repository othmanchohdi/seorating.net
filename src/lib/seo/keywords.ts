// Keyword density maths for the keyword density checker. Pure functions
// with no server imports, so they run in the browser on pasted text too.

const STOP = new Set(
  `a about above after again against all am an and any are aren't as at be because been before being below between both but by can can't cannot could couldn't did didn't do does doesn't doing don't down during each few for from further had hadn't has hasn't have haven't having he he'd he'll he's her here here's hers herself him himself his how how's i i'd i'll i'm i've if in into is isn't it it's its itself let's me more most mustn't my myself no nor not of off on once only or other ought our ours ourselves out over own same shan't she she'd she'll she's should shouldn't so some such than that that's the their theirs them themselves then there there's these they they'd they'll they're they've this those through to too under until up very was wasn't we we'd we'll we're we've were weren't what what's when when's where where's which while who who's whom why why's will with won't would wouldn't you you'd you'll you're you've your yours yourself yourselves also just get got may might must one two us via within without yet per etc`.split(/\s+/),
);

export function tokenize(text: string): string[] {
  return (text.toLowerCase().normalize("NFKC").match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)*/gu) ?? []).map((w) => w.replace(/’/g, "'"));
}

export type Phrase = { phrase: string; count: number; density: number };

// The most frequent 1-, 2- or 3-word phrases. Phrases that start or end
// with a stop word ("of the", "and") are skipped; they say nothing about topic.
export function topPhrases(words: string[], n: 1 | 2 | 3, limit = 20): Phrase[] {
  const counts = new Map<string, number>();
  for (let i = 0; i + n <= words.length; i++) {
    const gram = words.slice(i, i + n);
    if (STOP.has(gram[0]) || STOP.has(gram[n - 1])) continue;
    if (gram.some((w) => w.length < 2 && !/\d/.test(w)) || gram.every((w) => /^\d+$/.test(w))) continue;
    const key = gram.join(" ");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts]
    .filter(([, c]) => n === 1 || c >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([phrase, count]) => ({ phrase, count, density: words.length ? (count / words.length) * 100 : 0 }));
}

// How many times a phrase appears as whole words.
export function countPhrase(words: string[], phrase: string): number {
  const target = tokenize(phrase);
  if (!target.length) return 0;
  let count = 0;
  for (let i = 0; i + target.length <= words.length; i++) {
    if (target.every((w, j) => words[i + j] === w)) count++;
  }
  return count;
}

export const containsPhrase = (text: string, phrase: string) => countPhrase(tokenize(text), phrase) > 0;
