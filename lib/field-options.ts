// Shared Notion SELECT option definitions — used by /api/apply and /api/profile so both stay
// in sync with the Candidates DB schema.

export const SPORT_LEVEL_LABELS: Record<string, string> = {
  '1': '1 · Jog occasionnel',
  '2': '2 · Coureur régulier',
  '3': '3 · Traileur',
  '4': '4 · Long trail (ultra)',
  '5': '5 · Ultra élite (>100k)',
};

export const CITY_OPTIONS = ['Paris', 'Lyon', 'Bucharest', 'Autre'] as const;
export type CityOption = (typeof CITY_OPTIONS)[number];

// Auto-fills Country when a known city is picked — still editable afterward, this is just a
// sensible default. No entry for 'Autre' since that's a free-text country typed by the user.
export const CITY_TO_COUNTRY: Partial<Record<CityOption, string>> = {
  Paris: 'France',
  Lyon: 'France',
  Bucharest: 'Romania',
};
