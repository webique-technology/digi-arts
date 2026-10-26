/** Renders product description lines as bullets (like "Material : Handmade Paper"). Single line -> paragraph. */
export default function DescriptionList({ text }) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean);
  if (!lines.length) return null;
  return lines.length > 1 ? (
    <ul className="p-0">
      {lines.map((l, i) => (
        <li key={i}>{l}</li>
      ))}
    </ul>
  ) : (
    <p>{lines[0]}</p>
  );
}
