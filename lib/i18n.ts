// TRLBLZR i18n — même pattern que PIM (URL ?lang= + localStorage).
// Détection automatique de ?lang=fr ou ?lang=en au mount → préserve la langue
// si le visiteur arrive depuis pitchinmotion.com avec une locale choisie.

export type Locale = 'fr' | 'en';

export const LOCALES: Locale[] = ['fr', 'en'];
export const DEFAULT_LOCALE: Locale = 'fr';
export const LOCALE_STORAGE_KEY = 'trlblzr-locale';

export type Dict = {
  header: {
    sublogo: string;
    navExperiences: string;
    navClub: string;
    navPhilosophy: string;
    ctaApply: string;
  };
  hero: {
    eyebrow: string;
    h1Line1: string;
    h1Line2Pre: string;
    h1Line2Highlight: string;
    h1Line2Post: string;
    descriptionStart: string;
    descriptionHighlight: string;
    descriptionEnd: string;
    bodyStart: string;
    bodyHighlight: string;
    bodyEnd: string;
    ctaPrimary: string;
    ctaSecondary: string;
    bottomLabel: string;
    scrollHint: string;
  };
};

export const dictionary: Record<Locale, Dict> = {
  fr: {
    header: {
      sublogo: 'TRACE TON SENTIER',
      navExperiences: 'EXPERIENCES',
      navClub: 'THE CLUB',
      navPhilosophy: 'PHILOSOPHY',
      ctaApply: 'APPLY ↗',
    },
    hero: {
      eyebrow: 'TRLBLZR // 0001 — TRACE TON SENTIER',
      h1Line1: 'Entre dans',
      h1Line2Pre: "l'",
      h1Line2Highlight: 'extra',
      h1Line2Post: 'ordinaire.',
      descriptionStart: 'Week-ends de trail ',
      descriptionHighlight: 'pour dirigeants pionniers',
      descriptionEnd: '. Tous niveaux de course bienvenus.',
      bodyStart:
        'Immersions conduites par des athlètes de trail professionnels. ',
      bodyHighlight: "On ne pitche pas — on s'aligne.",
      bodyEnd: ' Le mouvement fait le reste.',
      ctaPrimary: 'POSTULER ↗',
      ctaSecondary: 'VOIR LES SESSIONS',
      bottomLabel: 'SESSION // 0001 — ANNECY · 22-24 MAI 2026',
      scrollHint: '↓ SCROLL',
    },
  },
  en: {
    header: {
      sublogo: 'BLAZE YOUR TRAIL',
      navExperiences: 'EXPERIENCES',
      navClub: 'THE CLUB',
      navPhilosophy: 'PHILOSOPHY',
      ctaApply: 'APPLY ↗',
    },
    hero: {
      eyebrow: 'TRLBLZR // 0001 — BLAZE YOUR TRAIL',
      h1Line1: 'Enter the',
      h1Line2Pre: '',
      h1Line2Highlight: 'extra',
      h1Line2Post: 'ordinary.',
      descriptionStart: 'Trail weekends ',
      descriptionHighlight: 'for pioneer leaders',
      descriptionEnd: '. All running levels welcome.',
      bodyStart: 'Immersions led by professional trail athletes. ',
      bodyHighlight: 'No pitching — alignment.',
      bodyEnd: ' Movement does the rest.',
      ctaPrimary: 'APPLY ↗',
      ctaSecondary: 'SEE SESSIONS',
      bottomLabel: 'SESSION // 0001 — ANNECY · MAY 22-24, 2026',
      scrollHint: '↓ SCROLL',
    },
  },
};

// Construit une URL pitchinmotion.com avec la locale propagée
// (pour quand TRLBLZR voudra renvoyer vers PIM)
export function pimUrl(
  path: string,
  locale: Locale,
  utm: { source: string; medium: string; campaign: string },
): string {
  const url = new URL(
    `https://pitchinmotion.com${path.startsWith('#') ? '/' : ''}${path}`,
  );
  url.searchParams.set('utm_source', utm.source);
  url.searchParams.set('utm_medium', utm.medium);
  url.searchParams.set('utm_campaign', utm.campaign);
  url.searchParams.set('lang', locale);
  return url.toString();
}
