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

export function mapSlugsToSessionLabels(slugs: string[] | undefined): string[] {
  return Array.from(
    new Set(
      (slugs && slugs.length > 0 ? slugs : [''])
        .map((slug) => SESSION_LABELS[slug] || slug || '— Sans session ciblée —')
        .filter(Boolean),
    ),
  );
}

// SBL-19 — slug → ID de page Notion de la session, dans la base "TRLBLZR Sessions". Utilisé pour
// écrire la relation "Sessions" sur Candidates (remplace le multi-select de libellés texte comme
// mécanisme d'écriture ; SESSION_LABELS reste utilisé tel quel pour les libellés lisibles de
// l'email de notification). Maintenu à la main, dans le même esprit que SESSION_LABELS : la base
// Sessions n'est pas fetchée dynamiquement par le site, ces IDs sont mis à jour ici quand une
// session est ajoutée/retirée côté Notion.
export const SESSION_PAGE_IDS: Record<string, string> = {
  'france-2026-09': '469e8127-ce05-4049-bd41-ba670c0dd892',
  'france-2026-10': '742ee5c5-53d7-440e-855b-6e98dbb55cbd',
  'grand-canyon-2026-10': '80b72385-9d05-47c3-8d9b-a425e52a3ab3',
  'maroc-2026-11': 'bb32c309-0676-4bce-9338-68561a697a82',
  'france-2026-11': '0144a83f-5e16-4cde-af2d-1b68903bfb14',
};

// Reverse lookup (page ID → slug), used to pre-check /profile's session checkboxes from the
// "Sessions" relation read back from Notion.
export const SESSION_SLUG_BY_PAGE_ID: Record<string, string> = {};
for (const [slug, pageId] of Object.entries(SESSION_PAGE_IDS)) {
  SESSION_SLUG_BY_PAGE_ID[pageId] = slug;
}

// slug[] → relation write payload for the Notion "Sessions" property. Unknown/legacy/empty slugs
// are dropped — unlike the old multi-select, a relation has no "— Sans session ciblée —" page to
// point at, so "no session targeted" is just an empty relation array.
export function mapSlugsToSessionRelations(slugs: string[] | undefined): { id: string }[] {
  return Array.from(new Set((slugs || []).map((slug) => SESSION_PAGE_IDS[slug]).filter(Boolean))).map(
    (id) => ({ id }),
  );
}

// Notion relation IDs (read from Candidates.Sessions) → slugs, for pre-checking /profile's
// SessionPicker. Unknown IDs (e.g. a session later deleted from the Sessions DB) are dropped.
export function mapRelationIdsToSlugs(ids: string[] | undefined): string[] {
  return (ids || [])
    .map((id) => SESSION_SLUG_BY_PAGE_ID[id])
    .filter((slug): slug is string => !!slug);
}
