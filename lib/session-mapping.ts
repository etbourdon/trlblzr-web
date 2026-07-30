// Shared slug <-> Notion label mapping for the Session multi-select — used by /api/apply
// (write) and /api/profile (read + write), so a candidate's session interest can be edited
// later from /profile using the same slugs the /apply checkboxes use.
//
// Mapping slug → libellé Notion (doit EXACTEMENT matcher les options Multi-select de la colonne
// Session). Slugs actifs : saison automne 2026 (5 sessions chronologiques depuis lib/content.ts).
// Legacy slugs conservés pour compat backwards (liens externes historiques).
export const SESSION_LABELS: Record<string, string> = {
  // Saison automne 2026 (actives)
  'france-2026-09': 'France — 11-13 septembre 2026',
  'france-2026-10': 'France — 2-4 octobre 2026',
  'grand-canyon-2026-10': 'Grand Canyon — 8-11 octobre 2026 · RIM to RIM to RIM',
  'maroc-2026-11': 'Maroc — 12-15 novembre 2026 · Trail & Business',
  'france-2026-11': 'France — 20-22 novembre 2026',
  // Legacy — mappent tous vers "Sans session ciblée" (sessions non-existantes ou annulées)
  'annecy-mai-2026': '— Sans session ciblée —',
  'vercors-juillet-2026': '— Sans session ciblée —',
  'vercors-2026-07': '— Sans session ciblée —',
  'tba-2026-s2': '— Sans session ciblée —',
  '': '— Sans session ciblée —',
};

// Reverse lookup (label → slug), used to pre-check /profile's session checkboxes from what's
// already stored in Notion. Several slugs share the "Sans session ciblée" label — '' is the
// canonical slug for it (there's no checkbox for "no session", it's just the empty state).
export const SESSION_SLUG_BY_LABEL: Record<string, string> = {};
for (const [slug, label] of Object.entries(SESSION_LABELS)) {
  if (!(label in SESSION_SLUG_BY_LABEL)) SESSION_SLUG_BY_LABEL[label] = slug;
}
SESSION_SLUG_BY_LABEL['— Sans session ciblée —'] = '';

export function mapSlugsToSessionLabels(slugs: string[] | undefined): string[] {
  return Array.from(
    new Set(
      (slugs && slugs.length > 0 ? slugs : [''])
        .map((slug) => SESSION_LABELS[slug] || slug || '— Sans session ciblée —')
        .filter(Boolean),
    ),
  );
}

export function mapLabelsToSlugs(labels: string[] | undefined): string[] {
  return (labels || [])
    .map((label) => SESSION_SLUG_BY_LABEL[label])
    .filter((slug): slug is string => !!slug);
}
