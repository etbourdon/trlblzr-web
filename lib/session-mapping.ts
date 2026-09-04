// Slug → libellé lisible, utilisé uniquement pour le texte de l'email de notification admin
// (lib/apply-notification.ts) — depuis SBL-19, l'écriture Notion se fait via la relation
// "Sessions" (voir SESSION_PAGE_IDS ci-dessous), plus via ce multi-select de libellés texte, donc
// ces valeurs n'ont plus besoin de matcher une option Notion exacte. Maintenu à la main en même
// temps que lib/content.ts et SESSION_PAGE_IDS à chaque sync manuelle depuis la base Sessions.
// Legacy slugs conservés pour compat backwards (liens externes historiques ou sessions annulées).
export const SESSION_LABELS: Record<string, string> = {
  // Saison 2027 (actives)
  'maroc-2026-11': 'France — 6-8 novembre 2026', // slug conservé tel quel malgré le contenu changé (opaque, cf. SBL-19)
  'france-2027-03-12': 'France — 12-14 mars 2027',
  'france-2027-04-23': 'France — 23-25 avril 2027',
  'france-2027-05-21': 'France — 21-23 mai 2027',
  'france-2027-06-04': 'France — 4-6 juin 2027',
  'france-2027-06-11': 'France — 11-13 juin 2027',
  // Legacy — mappent tous vers "Sans session ciblée" (sessions non-existantes, dépubliées ou annulées)
  'france-2026-10': '— Sans session ciblée —',
  'grand-canyon-2026-10': '— Sans session ciblée —',
  'france-2026-11': '— Sans session ciblée —',
  'france-2026-09': '— Sans session ciblée —',
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
  'maroc-2026-11': 'bb32c309-0676-4bce-9338-68561a697a82',
  'france-2027-03-12': '7d9d4432-917d-47fb-a79b-f867885c00e5',
  'france-2027-04-23': '78cdab46-f309-4351-91de-4a2eeb9cf07b',
  'france-2027-05-21': '78037e79-fd5b-4eb6-8cec-9d257c0716ff',
  'france-2027-06-04': '651d2db2-4c91-40ab-a283-c497f8385bda',
  'france-2027-06-11': '2122ad68-ec47-476f-8065-787ce140671a',
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
