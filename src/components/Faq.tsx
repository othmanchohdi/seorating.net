// Native <details> accordion: no client JavaScript, and the answers stay in
// the HTML for crawlers.
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((f, i) => (
        <details key={f.q} className="faq-item" open={i === 0}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
