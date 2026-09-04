// Données de contenu pour la homepage V0.
// Sera migré vers /content/*.md + chargement dynamique en sprint 2.

export type Session = {
  slug: string;
  number: string;
  location: string;
  dates: string;
  theme: string;
  status: 'upcoming' | 'past' | 'tba';   // tba = à venir, sans détails confirmés
  intro: string;
  athlete?: string;
  spotsTotal?: number;
  spotsLeft?: number;
  imageSrc?: string;      // photo statique (fallback ou alternative à la vidéo)
  videoSrc?: string;      // si défini : preview au hover sur la card
  videoPoster?: string;
};

// Saison automne 2026 — 5 sessions.
// Les strings ci-dessous sont des placeholders internes ; le vrai contenu affiché vient
// de lib/i18n.ts (bilingue FR/EN) via components/CircleSection.tsx qui mappe slug → clés i18n.
export const upcomingSessions: Session[] = [
  {
    slug: 'maroc-2026-11',
    number: '0010',
    location: 'FRANCE',
    dates: '06 — 08 NOVEMBRE 2026',
    theme: 'TRLBLZR WE',
    status: 'upcoming',
    intro: 'Clôture de saison — corps durable, sentiers d’automne.',
    imageSrc: '/sessions/france-2026-09.jpg',
  },
  {
    slug: 'france-2027-03-12',
    number: '0012',
    location: 'FRANCE',
    dates: '12 — 14 MARS 2027',
    theme: 'TRLBLZR WE',
    status: 'upcoming',
    intro: 'Premier rendez-vous de la nouvelle saison. Détails à venir.',
    imageSrc: '/sessions/france-2027-03-12.jpg',
  },
  {
    slug: 'france-2027-04-23',
    number: '0013',
    location: 'FRANCE',
    dates: '23 — 25 AVRIL 2027',
    theme: 'TRLBLZR WE',
    status: 'upcoming',
    intro: 'Le printemps sur les sentiers. Détails à venir.',
    imageSrc: '/sessions/france-2026-10.jpg',
  },
  {
    slug: 'france-2027-05-21',
    number: '0014',
    location: 'FRANCE',
    dates: '21 — 23 MAI 2027',
    theme: 'TRLBLZR WE',
    status: 'upcoming',
    intro: 'Un nouveau week-end pour progresser, ensemble. Détails à venir.',
    imageSrc: '/sessions/france-2027-05-21.jpg',
  },
  {
    slug: 'france-2027-06-04',
    number: '0015',
    location: 'FRANCE',
    dates: '04 — 06 JUIN 2027',
    theme: 'TRLBLZR WE',
    status: 'upcoming',
    intro: 'Premier rendez-vous de juin. Détails à venir.',
    imageSrc: '/sessions/france-2027-06-04.jpg',
  },
  {
    slug: 'france-2027-06-11',
    number: '0016',
    location: 'FRANCE',
    dates: '11 — 13 JUIN 2027',
    theme: 'TRLBLZR WE',
    status: 'upcoming',
    intro: 'Deuxième rendez-vous de juin. Détails à venir.',
    imageSrc: '/sessions/france-2027-06-11.jpg',
  },
];

// 5 éditions passées, ordre chronologique inverse (plus récente d'abord).
// Carrousel horizontal pour absorber les éditions à venir.
// Past editions — numérotation reprise du site statique (0001-0004) + 0005 pour Annecy mai 2026.
// L'ordre dans le carrousel = anti-chronologique (plus récent d'abord).
// Les textes (location/dates/theme/intro) ne sont plus utilisés directement ;
// les composants vont chercher les libellés bilingues dans le dictionnaire i18n via le slug.
export const pastEditions: Session[] = [
  {
    slug: 'annecy-2026-05',
    number: '0005',
    location: 'Annecy',
    dates: 'Mai 2026',
    theme: 'Performance',
    status: 'past',
    intro: 'Massif des Bauges',
    videoSrc: '/videos/Annecy26.mp4',
    videoPoster: '/videos/Annecy26-poster.jpg',
  },
  {
    slug: 'annecy-2026-04',
    number: '0004',
    location: 'Annecy',
    dates: 'Avril 2026',
    theme: 'Printemps',
    status: 'past',
    intro: '',
    videoSrc: '/videos/past/annecy_avril_2026.mp4',
  },
  {
    slug: 'vercors-2026-03',
    number: '0003',
    location: 'Vercors',
    dates: 'Mars 2026',
    theme: 'Hiver',
    status: 'past',
    intro: '',
    videoSrc: '/videos/past/vercors_mars_2026.mp4',
  },
  {
    slug: 'vercors-2025-08',
    number: '0002',
    location: 'Vercors',
    dates: 'Août 2025',
    theme: 'Hauts Plateaux',
    status: 'past',
    intro: '',
    videoSrc: '/videos/past/vercors_2025.mp4',
  },
  {
    slug: 'annecy-2025-04',
    number: '0001',
    location: 'Annecy',
    dates: 'Avril 2025',
    theme: 'Aravis',
    status: 'past',
    intro: '',
    videoSrc: '/videos/past/annecy_2025.mp4',
  },
];

export type Testimonial = {
  author: string;
  role: string;
  quote: string;
};

export type Athlete = {
  slug: string;
  name: string;
  utmb?: number;
  itra?: number;
  bio: string;
  highlight?: string;        // ligne supplémentaire mise en avant (achievement)
  links: {
    label: string;
    href: string;
  }[];
};

export const athletes: Athlete[] = [
  {
    slug: 'clementine-geoffray',
    name: 'Clémentine Geoffray',
    utmb: 796,
    itra: 812,
    bio: "Équipe de France de trail. Championne du monde trail court (2023) et championne d'Europe (2024). Athlète Kiprun, basée à Grenoble.",
    links: [
      { label: 'LinkedIn', href: 'https://linkedin.com/in/cl%C3%A9mentine-geoffray-b0495b89' },
    ],
  },
  {
    slug: 'antoine-clement',
    name: 'Antoine Clément',
    utmb: 725,
    itra: 800,
    bio: "Fondateur AC Ultra Performance, co-fondateur Trail Running Lab. Spécialité ultras + FKTs.",
    highlight: "FKT GR10 (Pyrénées) : 900 km / 52 000 D+ en 11 j 13 h self-supported (juillet 2025).",
    links: [
      { label: 'UTMB', href: 'https://utmb.world/runner/4009024.antoine.clement' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/antoine-clmt' },
    ],
  },
  {
    slug: 'noa-ohms',
    name: 'Noa Ohms',
    utmb: 725,
    itra: 818,
    bio: "Jeune athlète élite ultra-trail (ICN Business School).",
    highlight: "🥇 The Canyons by UTMB® 100M — 1er (avril 2026).",
    links: [
      { label: 'UTMB', href: 'https://utmb.world/runner/5513414.noa.ohms' },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/noa-ohms-74a531256' },
    ],
  },
  {
    slug: 'matthis-granet',
    name: 'Matthis Granet',
    utmb: 760,
    itra: 776,
    bio: "Basé à Annecy, club Annecy Athlétisme.",
    highlight: "🏆 Record du monde de D+ en 24 h. SwissPeaks Trail 660K — 4e (2024). 🥈 Alpi Trail de Pichauris (85 km, 2025), top 100 UTMB 2021 (76e).",
    links: [
      { label: 'UTMB', href: 'https://utmb.world/runner/1609827.matthis.granet' },
    ],
  },
  {
    slug: 'julie-lelong',
    name: 'Julie Lelong',
    utmb: 768,
    bio: "Équipe de France de trail. Ingénieure, mission Petzl.",
    links: [
      { label: 'UTMB', href: 'https://utmb.world/runner/1251411.julie.lelong' },
      { label: 'LinkedIn', href: 'https://fr.linkedin.com/in/lelongjulie' },
      { label: 'Instagram', href: 'https://www.instagram.com/juulie_lelong/' },
    ],
  },
  {
    slug: 'tibere-debizet',
    name: 'Tibère Debizet',
    utmb: 887,
    bio: "Team / sponsor ASICS. Développeur frontend.",
    links: [
      { label: 'UTMB', href: 'https://utmb.world/runner/4313114.tibere.debizet' },
      { label: 'LinkedIn', href: 'https://fr.linkedin.com/in/tibere-debizet' },
      { label: 'Portfolio', href: 'https://www.collective.work/profile/tibere-debizet' },
    ],
  },
];

export const featuredTestimonials: Testimonial[] = [
  {
    author: 'Aurore Malherbes',
    role: 'Co-founder Padok · CTO Fairly Made',
    quote:
      "On n'est pas là pour se comparer, mais pour définir son propre objectif et l'atteindre. Un très bon dosage de sport, de discussions informelles et de moments collectifs.",
  },
  {
    author: 'Florian Marin',
    role: 'Fondateur Le Cadre',
    quote:
      "Je suis revenu avec une énergie que je n'avais pas eue depuis des semaines. J'en suis sorti avec un plan clair : business, nutrition, perf. Motivation au max.",
  },
  {
    author: 'Antoine Clément',
    role: 'Co-founder Trail Running Lab · Ultra-Trailer',
    quote:
      "Un format aussi unique qu'intense : des kilomètres, du D+, des échanges profonds, une énergie collective dingue. C'est rare de pouvoir se livrer sans filtre.",
  },
  {
    author: 'Alice Potiron',
    role: 'Founder Move & Win',
    quote:
      "Dans ces moments-là, quelque chose se passe. On tombe les masques, on sort des titres, des fonctions. Et on revient à quelque chose de plus simple : le mouvement, l'effort, le collectif.",
  },
];

export const manifestoLong = `Les athlètes de trail ne courent pas plus vite — ils courent plus longtemps.

Ils ont construit, à force de discipline et d'inconfort, un système qui leur permet de continuer.

Ce système se transfère.

Passe trois jours près de quelqu'un qui a déjà franchi ses propres seuils, et ton esprit commence à fonctionner différemment. Tu observes comment il lit le terrain, comment il gère l'incertitude, comment il récupère après les jours brutaux.

Et quelque chose en toi se rappelle une vérité simple : tu es capable de bien plus que ce que tu te laisses croire.

La montagne devient l'endroit où tu commences à pratiquer ce dépassement.`;
