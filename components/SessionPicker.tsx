// Shared checkbox-list session multi-picker — used by /apply (Batch 3) and /profile (Batch 5.1)
// so a candidate/member can pick or later update which upcoming weekends interest them.

import { upcomingSessions } from '@/lib/content';

export default function SessionPicker({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  return (
    <div className="space-y-2 mt-2">
      {upcomingSessions
        .filter((s) => s.status === 'upcoming')
        .map((s) => (
          <label
            key={s.slug}
            className={`flex items-start gap-3 border p-3 rounded cursor-pointer transition-colors ${
              selected.includes(s.slug)
                ? 'border-ember bg-ember/5'
                : 'border-stone hover:border-paper-white/40'
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(s.slug)}
              onChange={() => onToggle(s.slug)}
              className="mt-1 accent-ember"
            />
            <span className="font-sans text-sm text-paper-white leading-snug">
              {s.location} — {s.dates} · {s.theme}
            </span>
          </label>
        ))}
    </div>
  );
}
