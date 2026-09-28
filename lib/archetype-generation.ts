// SBL-35 — generates the personalized Trailblazer Archetype analysis (the private "Output 1"
// readout from the System Guide — same format as the hand-written Sergio/Eric examples).
// The archetype itself (primary/secondary) is already decided deterministically by
// lib/archetype.ts before this runs — this call only writes the prose around it, so the badge
// shown everywhere else can never contradict the text a member reads in their Refuge.
//
// Same "plain Anthropic fetch, no SDK" pattern as lib/card-generation.ts.

import { ARCHETYPE_META, type ArchetypeKey, type ArchetypeAnswers, ALL_ARCHETYPE_QUESTIONS } from './archetype';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';

export type ArchetypeGenerationInput = {
  firstname: string;
  isAthlete: boolean;
  primary: ArchetypeKey;
  secondary: ArchetypeKey;
  answers: ArchetypeAnswers;
  selfDescription?: string | null;
  motivation?: string | null;
  preferredLang: 'FR' | 'EN';
};

const SYSTEM_PROMPT = `Tu écris pour TRLBLZR.run, un club qui réunit dirigeants/entrepreneurs et athlètes de trail autour de weekends de course en montagne. Tu rédiges la lecture personnalisée du "Trailblazer Archetype" d'un membre, à partir de ses réponses à un questionnaire de 11 questions (4 axes : Drive, Style, Énergie, Signal, + une question sur la gestion de la pression) et de son archétype primaire + secondaire déjà déterminés (ne les remets jamais en question, ne les redéfinis pas — construis le texte autour d'eux).

Ce texte est STRICTEMENT PRIVÉ — visible uniquement par la personne elle-même dans son espace membre. Il peut donc être direct, nuancé, inclure des zones d'ombre ("shadow"), pas juste des compliments.

Ton éditorial : sobre, direct, concret — jamais de superlatifs marketing. Même registre que les descriptions des 6 archétypes du système (Pioneer, Builder, Connector, Scout, Engine, Compass), que tu connais.

Structure exacte à produire (dans la langue demandée), avec des retours à la ligne entre chaque section :
1. Une ligne d'intro : "Hey {prénom} — voici la lecture de ton archétype TRLBLZR (à partir de tes 11 réponses)." (adapter en anglais si besoin)
2. "[emoji primaire] Archétype principal : **{nom}**" suivi de 2-3 phrases (superpouvoir + comment ça se manifeste, basé sur SES réponses précises, pas un texte générique).
3. "[emoji secondaire] Archétype secondaire : **{nom}**" suivi de 2-3 phrases.
4. "🏃 Coureurs/athlètes avec une énergie similaire" — 2-3 noms parmi les figures emblématiques fournies, avec une ligne chacun expliquant le lien.
5. "💼 Leaders avec une énergie similaire" — 2-3 noms parmi les figures emblématiques fournies (mélange des figures primaire + secondaire), avec une ligne chacun.
6. "Comment travailler avec toi" — 2-3 puces concrètes.
7. "Angle mort (à surveiller)" — 1-2 phrases honnêtes, jamais complaisantes.
8. Une ligne finale : "Si tu la partages en une phrase" suivi d'un one-liner du type "[emoji] {primaire} avec un cœur {secondaire} : {2-3 mots clés}."

Réponds UNIQUEMENT avec le texte final (pas de JSON, pas de balises markdown de code, pas de texte avant/après). Utilise des ** pour les mots-clés à mettre en avant, comme dans les exemples de référence.`;

function buildUserPrompt(input: ArchetypeGenerationInput): string {
  const primaryMeta = ARCHETYPE_META[input.primary];
  const secondaryMeta = ARCHETYPE_META[input.secondary];

  const answerLines = ALL_ARCHETYPE_QUESTIONS.map((q) => {
    const answer = input.answers[q.id];
    const option = q.options.find((o) => o.value === answer);
    return `- ${q.prompt.en} → ${option?.label.en ?? answer}`;
  });

  const lines = [
    `Langue de sortie : ${input.preferredLang === 'EN' ? 'anglais' : 'français'}`,
    `Prénom : ${input.firstname}`,
    `Profil : ${input.isAthlete ? 'Athlète' : 'Dirigeant / entrepreneur'}`,
    `Archétype principal : ${input.primary} (${primaryMeta.emoji}) — figures emblématiques : ${primaryMeta.figures.join(', ')}`,
    `Archétype secondaire : ${input.secondary} (${secondaryMeta.emoji}) — figures emblématiques : ${secondaryMeta.figures.join(', ')}`,
  ];
  if (input.selfDescription) lines.push(`Description de soi (brute) : ${input.selfDescription}`);
  if (input.motivation) lines.push(`Motivation à rejoindre TRLBLZR (brute) : ${input.motivation}`);
  lines.push('Réponses au questionnaire :', ...answerLines);

  return lines.join('\n');
}

export async function generateArchetypeAnalysis(
  input: ArchetypeGenerationInput,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY env var');

  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(input) }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${detail}`);
  }

  const body = await res.json();
  const text = body.content?.[0]?.text;
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Unexpected Anthropic response shape');
  }
  return text.trim();
}
