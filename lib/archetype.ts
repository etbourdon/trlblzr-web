// Trailblazer Archetype questionnaire — native (in-app) version of the Notion form in
// production, locked to that exact wording (incl. Q11, the mental-prep question added after
// the original design docs were written). Scoring is deterministic, done entirely in code — no
// LLM involved in computing WHICH archetype someone gets, only in writing up the analysis text
// (see lib/archetype-generation.ts) once the archetype is already known.
//
// Per-question letter->archetype mapping is derived from the "AI Prompt — Archetype Assignment"
// doc's axis table: B and C always map to Builder/Connector regardless of axis; A and D shift
// depending on the axis (Drive/Energy vs Style vs Signal). Q11 is new (not in that doc) — each
// of its 6 options names an archetype directly, and by agreement (SBL-35) it counts as a full
// vote alongside Q1-Q10, not just a tiebreaker.

import type { Locale } from './i18n';

// trlblzr-web's i18n.ts keeps per-locale content directly in the dictionary (no shared
// LocalizedString helper type, unlike pim-web) — this quiz's question/option text lives in code
// instead (mirroring the Notion form it replaces), so it needs its own small local type.
export type LocalizedString = { fr: string; en: string };

export type ArchetypeKey = 'Pioneer' | 'Builder' | 'Connector' | 'Scout' | 'Engine' | 'Compass';

export const ARCHETYPE_KEYS: ArchetypeKey[] = [
  'Pioneer',
  'Builder',
  'Connector',
  'Scout',
  'Engine',
  'Compass',
];

export const ARCHETYPE_META: Record<
  ArchetypeKey,
  { emoji: string; label: LocalizedString; figures: string[] }
> = {
  Pioneer: {
    emoji: '🏔️',
    label: { fr: 'Le Pioneer', en: 'The Pioneer' },
    figures: ['Kilian Jornet', 'Eliud Kipchoge', 'Elon Musk', 'Richard Branson'],
  },
  Builder: {
    emoji: '🧱',
    label: { fr: 'Le Builder', en: 'The Builder' },
    figures: ['Scott Jurek', 'Jeff Bezos', 'Bernard Arnault'],
  },
  Connector: {
    emoji: '🌉',
    label: { fr: 'Le Connector', en: 'The Connector' },
    figures: ['Courtney Dauwalter', 'Reid Hoffman', 'Sara Blakely'],
  },
  Scout: {
    emoji: '🔭',
    label: { fr: 'Le Scout', en: 'The Scout' },
    figures: ['Anton Krupicka', 'Steve Jobs', 'Naval Ravikant'],
  },
  Engine: {
    emoji: '⚡',
    label: { fr: 'Le Engine', en: 'The Engine' },
    figures: ['Jim Walmsley', 'Michael Jordan', 'Brian Chesky'],
  },
  Compass: {
    emoji: '🧭',
    label: { fr: 'Le Compass', en: 'The Compass' },
    figures: ['Yvon Chouinard', 'Dean Karnazes', 'Satya Nadella'],
  },
};

export type ArchetypeOption = {
  value: string;
  archetype: ArchetypeKey;
  label: LocalizedString;
};

export type ArchetypeQuestion = {
  id: string;
  axis: 'drive' | 'style' | 'energy' | 'signal' | 'pressure';
  axisLabel: LocalizedString;
  prompt: LocalizedString;
  options: ArchetypeOption[];
};

function abcd(
  id: string,
  axis: ArchetypeQuestion['axis'],
  axisLabel: LocalizedString,
  prompt: LocalizedString,
  archetypes: [ArchetypeKey, ArchetypeKey, ArchetypeKey, ArchetypeKey],
  labels: [LocalizedString, LocalizedString, LocalizedString, LocalizedString],
): ArchetypeQuestion {
  return {
    id,
    axis,
    axisLabel,
    prompt,
    options: (['A', 'B', 'C', 'D'] as const).map((value, i) => ({
      value,
      archetype: archetypes[i],
      label: labels[i],
    })),
  };
}

const DRIVE: LocalizedString = { fr: 'Axe 1 — Drive', en: 'Axis 1 — Drive' };
const STYLE: LocalizedString = { fr: 'Axe 2 — Style', en: 'Axis 2 — Style' };
const ENERGY: LocalizedString = { fr: 'Axe 3 — Énergie', en: 'Axis 3 — Energy' };
const SIGNAL: LocalizedString = { fr: 'Axe 4 — Signal', en: 'Axis 4 — Signal' };
const PRESSURE: LocalizedString = { fr: 'Sous pression', en: 'Under pressure' };

export const ARCHETYPE_QUESTIONS: ArchetypeQuestion[] = [
  abcd(
    'q1',
    'drive',
    DRIVE,
    {
      fr: "Face à une montée raide sur un sentier, ta première réaction :",
      en: 'When you face a steep climb on a trail, your first reaction is:',
    },
    ['Pioneer', 'Builder', 'Connector', 'Scout'],
    [
      { fr: '« Allons-y, la vue vaut le coup »', en: '"Let\'s go — the view is worth it"' },
      { fr: '« On gère l\'allure, c\'est long »', en: '"Pace yourself — it\'s a long game"' },
      { fr: '« Il y a une autre route ? »', en: '"Is there another route?"' },
      {
        fr: '« Pourquoi je suis là… bon, allons voir »',
        en: '"Why am I here? ...okay let\'s find out"',
      },
    ],
  ),
  abcd(
    'q2',
    'drive',
    DRIVE,
    {
      fr: "Ce qui t'a poussé à lancer ta boîte / prendre ton poste actuel :",
      en: 'What made you start your company / take your current role?',
    },
    ['Pioneer', 'Builder', 'Connector', 'Scout'],
    [
      { fr: "J'ai vu un sommet que personne n'avait atteint", en: 'I saw a summit nobody had reached' },
      { fr: 'Je voulais construire quelque chose qui dure', en: 'I wanted to build something that lasts' },
      { fr: "J'ai vu un vide que personne d'autre ne comblait", en: 'I saw a gap nobody else was filling' },
      { fr: "Je ne pouvais pas ne pas le faire — ça m'a happé", en: "I couldn't not do it — it pulled me" },
    ],
  ),
  abcd(
    'q3',
    'drive',
    DRIVE,
    {
      fr: 'Quand tu es complètement absorbé, tu es en train de :',
      en: "When you're completely absorbed and lose track of time, you're:",
    },
    ['Pioneer', 'Builder', 'Connector', 'Scout'],
    [
      { fr: 'Chasser un objectif', en: 'Chasing a target' },
      { fr: 'Construire quelque chose, à la main ou en équipe', en: 'Building something with your hands / team' },
      { fr: "Relier des points que personne d'autre ne voit", en: 'Connecting dots nobody else sees' },
      { fr: 'Explorer un nouveau terrain, sans plan', en: 'Exploring something new with no plan' },
    ],
  ),
  abcd(
    'q4',
    'style',
    STYLE,
    {
      fr: 'Face à une décision business risquée, tu :',
      en: 'When a business decision feels risky, you:',
    },
    ['Engine', 'Builder', 'Connector', 'Scout'],
    [
      { fr: 'Fais confiance à ton instinct et avances vite', en: 'Trust your gut and move fast' },
      { fr: 'Construis un plan, le stress-testes, puis t\'engages', en: 'Build a plan — stress-test it — then commit' },
      { fr: 'Demandes à 3 personnes de confiance avant de décider', en: 'Ask 3 people you trust then decide' },
      { fr: 'Laisses reposer. Si c\'est toujours là demain, c\'est réel', en: "Sleep on it. If it's still there tomorrow it's real" },
    ],
  ),
  abcd(
    'q5',
    'style',
    STYLE,
    {
      fr: 'En équipe, tu es plutôt :',
      en: "In a team, you're usually:",
    },
    ['Engine', 'Builder', 'Connector', 'Scout'],
    [
      { fr: "Le moteur — celui qui impose l'allure", en: 'The engine — setting the pace' },
      { fr: "L'architecte — celui qui construit le système", en: 'The architect — building the system' },
      { fr: 'Le connecteur — celui qui fait les liens', en: 'The connector — making the links' },
      { fr: "L'éclaireur — celui qui trouve la suite", en: "The scout — finding what's next" },
    ],
  ),
  abcd(
    'q6',
    'style',
    STYLE,
    {
      fr: 'Ta course idéale :',
      en: 'Your ideal run is:',
    },
    ['Engine', 'Builder', 'Connector', 'Scout'],
    [
      { fr: 'Une course avec un chrono cible', en: 'A race with a target time' },
      { fr: 'Un long effort solo où tu trouves ton rythme', en: 'A long solo effort where you find your rhythm' },
      { fr: 'Une sortie en groupe où on parle et on résout des problèmes', en: 'A group run where you talk and solve problems' },
      { fr: "Un nouveau sentier jamais fait — pas de montre, pas de plan", en: "A new trail you've never done — no watch no plan" },
    ],
  ),
  abcd(
    'q7',
    'energy',
    ENERGY,
    {
      fr: "Ce qui te fait le plus peur :",
      en: 'What scares you more?',
    },
    ['Pioneer', 'Builder', 'Connector', 'Scout'],
    [
      { fr: 'Ne pas essayer', en: 'Not trying' },
      { fr: 'Construire quelque chose qui ne dure pas', en: "Building something that doesn't last" },
      { fr: 'Être déconnecté des gens qui comptent', en: 'Being disconnected from people who matter' },
      { fr: 'Perdre sa liberté d\'explorer', en: 'Losing the freedom to explore' },
    ],
  ),
  abcd(
    'q8',
    'energy',
    ENERGY,
    {
      fr: "Après une grande victoire, tu veux :",
      en: 'After a big win, what do you want next?',
    },
    ['Pioneer', 'Builder', 'Connector', 'Scout'],
    [
      { fr: 'Un défi plus grand', en: 'A bigger challenge' },
      { fr: 'Consolider et construire dessus', en: 'To consolidate and build on it' },
      { fr: 'Célébrer avec ceux qui ont fait le chemin avec toi', en: 'To celebrate with the people who made it happen' },
      { fr: 'Disparaître un moment pour te reposer', en: 'To disappear for a while and reset' },
    ],
  ),
  abcd(
    'q9',
    'energy',
    ENERGY,
    {
      fr: "L'écart entre qui tu es et ce que tu montres :",
      en: "What's the gap between who you are and who you show?",
    },
    ['Pioneer', 'Builder', 'Connector', 'Scout'],
    [
      { fr: 'Je montre moins d\'ambition que je n\'en ai', en: 'I show less ambition than I have' },
      { fr: 'Je montre plus de certitude que ce que je ressens', en: 'I show more certainty than I feel' },
      { fr: 'Je montre moins d\'émotion que ce que je porte', en: 'I show less emotion than I carry' },
      { fr: 'Je montre moins de doute que je n\'en ai', en: 'I show less doubt than I have' },
    ],
  ),
  abcd(
    'q10',
    'signal',
    SIGNAL,
    {
      fr: 'Si tes chaussures de trail pouvaient parler, elles diraient :',
      en: "If your running shoes could talk, they'd say:",
    },
    ['Engine', 'Builder', 'Connector', 'Compass'],
    [
      { fr: '« Celle-là ne s\'arrête jamais »', en: '"This one doesn\'t stop"' },
      { fr: '« Celle-là revient toujours »', en: '"This one always comes back"' },
      { fr: '« Celle-là court avec tout le monde »', en: '"This one runs with everyone"' },
      {
        fr: '« Celle-là ne sait pas où elle va — et c\'est très bien »',
        en: '"This one doesn\'t know where it\'s going — and that\'s fine"',
      },
    ],
  ),
];

// Q11 — mental prep / internal dialogue under pressure. Each option names an archetype
// directly (not A/B/C/D across an axis), and gets a full vote in the tally like every other
// question — added to the production Notion form after the original design docs were written.
export const ARCHETYPE_PRESSURE_QUESTION: ArchetypeQuestion = {
  id: 'q11',
  axis: 'pressure',
  axisLabel: PRESSURE,
  prompt: {
    fr: 'Dans un moment de doute, la phrase qui te remet en mouvement :',
    en: 'In a moment of doubt, the sentence that gets you moving again is:',
  },
  options: [
    {
      value: 'Pioneer',
      archetype: 'Pioneer',
      label: { fr: 'Avance. Le chemin s\'éclaircit en marchant.', en: 'Move forward. The path gets clearer as you go.' },
    },
    {
      value: 'Builder',
      archetype: 'Builder',
      label: { fr: 'Reviens au plan. La structure stabilise.', en: 'Go back to the plan. Structure creates stability.' },
    },
    {
      value: 'Connector',
      archetype: 'Connector',
      label: {
        fr: "Trouve la conversation. Tu n'as pas à porter ça seul.",
        en: "Find the conversation. You don't have to carry this alone.",
      },
    },
    {
      value: 'Scout',
      archetype: 'Scout',
      label: { fr: "Change d'angle. Le bon signal est peut-être ailleurs.", en: 'Change the angle. The right signal may be elsewhere.' },
    },
    {
      value: 'Engine',
      archetype: 'Engine',
      label: { fr: 'Tiens bon. Tu as plus de réserves que tu ne le crois.', en: 'Hold on. You have more in reserve than you think.' },
    },
    {
      value: 'Compass',
      archetype: 'Compass',
      label: { fr: 'Reviens au pourquoi. Le reste suivra.', en: 'Return to the why. The rest will follow.' },
    },
  ],
};

export const ALL_ARCHETYPE_QUESTIONS: ArchetypeQuestion[] = [
  ...ARCHETYPE_QUESTIONS,
  ARCHETYPE_PRESSURE_QUESTION,
];

// Small helper for pages/components rendering a Notion-stored archetype string (e.g.
// candidate.archetype) as a badge — used by MemberCard callers (directory, refuge, profile).
export function archetypeBadge(
  key: string | null | undefined,
  locale: Locale,
): { emoji: string; label: string } | null {
  if (!key || !(key in ARCHETYPE_META)) return null;
  const meta = ARCHETYPE_META[key as ArchetypeKey];
  return { emoji: meta.emoji, label: meta.label[locale] };
}

export type ArchetypeAnswers = Record<string, string>;

export type ArchetypeScoreResult = {
  primary: ArchetypeKey;
  secondary: ArchetypeKey;
  scores: Record<ArchetypeKey, number>;
};

// Stable fallback order when scores are tied and Q11 doesn't resolve it either.
const TIEBREAK_ORDER: ArchetypeKey[] = ARCHETYPE_KEYS;

export function isComplete(answers: ArchetypeAnswers): boolean {
  return ALL_ARCHETYPE_QUESTIONS.every((q) => Boolean(answers[q.id]));
}

export function scoreArchetype(answers: ArchetypeAnswers): ArchetypeScoreResult {
  const scores: Record<ArchetypeKey, number> = {
    Pioneer: 0,
    Builder: 0,
    Connector: 0,
    Scout: 0,
    Engine: 0,
    Compass: 0,
  };

  for (const q of ALL_ARCHETYPE_QUESTIONS) {
    const answer = answers[q.id];
    const option = q.options.find((o) => o.value === answer);
    if (option) scores[option.archetype] += 1;
  }

  const pressureAnswer = answers[ARCHETYPE_PRESSURE_QUESTION.id] as ArchetypeKey | undefined;

  function pickFrom(pool: ArchetypeKey[]): ArchetypeKey {
    const max = Math.max(...pool.map((k) => scores[k]));
    const tied = pool.filter((k) => scores[k] === max);
    if (tied.length === 1) return tied[0];
    if (pressureAnswer && tied.includes(pressureAnswer)) return pressureAnswer;
    return TIEBREAK_ORDER.find((k) => tied.includes(k))!;
  }

  const primary = pickFrom(ARCHETYPE_KEYS);
  const secondary = pickFrom(ARCHETYPE_KEYS.filter((k) => k !== primary));

  return { primary, secondary, scores };
}
