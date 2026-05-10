// Données de contenu pour la homepage V0.
// Sera migré vers /content/*.md + chargement dynamique en sprint 2.

export type Session = {
  slug: string;
  number: string;
  location: string;
  dates: string;
  theme: string;
  status: 'upcoming' | 'past';
  intro: string;
  athlete?: string;
  spotsTotal?: number;
  spotsLeft?: number;
};

export const upcomingSessions: Session[] = [
  {
    slug: 'annecy-2026-05',
    number: '0001',
    location: 'ANNECY',
    dates: '22 — 24 MAI 2026',
    theme: 'PERFORMANCE',
    status: 'upcoming',
    intro:
      "Trois jours dans la région d'Annecy autour d'un thème : la performance. Tu cours sur les sentiers du massif des Bauges, tu écoutes ce que les élites du trail ont appris du long, du dur, du lent. Tu repars avec un cadre, pas une recette.",
    athlete: 'À confirmer',
    spotsTotal: 10,
    spotsLeft: 6,
  },
  {
    slug: 'vercors-2026-07',
    number: '0002',
    location: 'VERCORS',
    dates: '03 — 05 JUILLET 2026',
    theme: 'LONGÉVITÉ',
    status: 'upcoming',
    intro:
      "Trois jours sur les hauts plateaux du Vercors, autour d'un thème qui change tout : la longévité. Comment durer, comment se réparer, comment construire un corps qui tient sur la durée. Le sentier devient laboratoire.",
    athlete: 'À confirmer',
    spotsTotal: 10,
    spotsLeft: 8,
  },
];

export const pastEditions: Session[] = [
  {
    slug: 'vercors-2025-08',
    number: '0000',
    location: 'VERCORS',
    dates: 'AOÛT 2025',
    theme: 'RÉSILIENCE',
    status: 'past',
    intro:
      "Une édition fondatrice. Plateaux du Vercors, dénivelé long, soirées sans téléphone, débats jusque tard. C'est de là que vient TRLBLZR.",
  },
  {
    slug: 'annecy-2025-04',
    number: '0000',
    location: 'ANNECY',
    dates: 'AVRIL 2025',
    theme: 'PERFORMANCE',
    status: 'past',
    intro:
      "Premier WE dans les Aravis. Une dizaine de fondateurs, une championne du monde de trail, et la confirmation qu'on tenait quelque chose.",
  },
];

export type Testimonial = {
  author: string;
  role: string;
  quote: string;
};

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
