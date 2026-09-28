// SBL-35 — renders the LLM-generated archetype analysis text. The generation prompt asks for
// `**word**` for emphasis and blank lines between sections, matching the hand-written Sergio/Eric
// reference examples — this just turns those two conventions into JSX, no markdown lib needed for
// content this constrained. Used on /refuge and /profile only — never passed into MemberCard,
// which is also rendered in the directory (SBL-35 requirement: analysis stays private).

function renderLine(line: string, key: number) {
  const parts = line.split(/\*\*(.+?)\*\*/g);
  return (
    <p key={key} className="text-sm leading-relaxed text-paper-white/90">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="text-paper-white font-semibold">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  );
}

export default function ArchetypeAnalysis({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);
  return <div className="space-y-3">{paragraphs.map((p, i) => renderLine(p, i))}</div>;
}
