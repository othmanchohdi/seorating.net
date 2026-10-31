// A small robots.txt evaluator following RFC 9309: a crawler obeys only the
// group that names it (falling back to "*"), and within that group the
// longest matching rule wins, with Allow winning a tie.

type Rule = { allow: boolean; pattern: string; line: number };
type Group = { agents: string[]; rules: Rule[] };

export function parse(text: string): Group[] {
  const groups: Group[] = [];
  let current: Group | null = null;
  let lastWasAgent = false;
  text.split("\n").forEach((raw, i) => {
    const line = raw.replace(/#.*/, "").trim();
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) return;
    const key = m[1].toLowerCase();
    const value = m[2].trim();
    if (key === "user-agent") {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
    } else if ((key === "allow" || key === "disallow") && current) {
      // An empty Disallow means "allow everything" and matches nothing.
      if (value) current.rules.push({ allow: key === "allow", pattern: value, line: i + 1 });
      lastWasAgent = false;
    } else {
      lastWasAgent = false;
    }
  });
  return groups;
}

function toRegex(pattern: string) {
  const anchored = pattern.endsWith("$");
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split("*")
    .map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${body}${anchored ? "$" : ""}`);
}

export function evaluate(text: string, agent: string, path: string) {
  const groups = parse(text);
  const named = groups.filter((g) => g.agents.includes(agent.toLowerCase()));
  const used = named.length ? named : groups.filter((g) => g.agents.includes("*"));
  const rules = used.flatMap((g) => g.rules);
  let best: Rule | null = null;
  for (const r of rules) {
    if (!toRegex(r.pattern).test(path)) continue;
    if (!best || r.pattern.length > best.pattern.length || (r.pattern.length === best.pattern.length && r.allow && !best.allow)) {
      best = r;
    }
  }
  return {
    allowed: best ? best.allow : true,
    rule: best,
    group: named.length ? agent : used.length ? "*" : null,
  };
}
