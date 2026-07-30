// Batch 5.2 — generates the two short-form text fields the Member Card needs (bio,
// looking-for) from the profile's raw, longer-form answers. Everything else on the card
// (name, role, company, city, sport level, links, photo) is a direct passthrough of
// already-structured profile fields — no generation needed there.
//
// Uses the Anthropic Messages API directly (no SDK dependency, consistent with the rest
// of this codebase's "plain fetch" integrations). Requires ANTHROPIC_API_KEY.

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';

export type CardGenerationInput = {
  firstname: string;
  isAthlete: boolean;
  role?: string | null;
  company?: string | null;
  selfDescription?: string | null;
  motivation?: string | null;
  lookingFor?: string | null;
  sportLevelLabel?: string | null;
  preferredLang: 'FR' | 'EN';
};

export type CardGenerationOutput = {
  bio: string;
  lookingFor: string;
};

const SYSTEM_PROMPT = `Tu écris pour TRLBLZR.run, un club qui réunit dirigeants/entrepreneurs et athlètes de trail autour de weekends de course en montagne. Ton éditorial : sobre, direct, concret — jamais de superlatifs marketing, jamais de traduction automatique mot-à-mot. Exemple du ton recherché : "Building supply-chain software after 8 years in ops. Long trails are where I actually think straight."

Tu écris le contenu court d'une "Member Card" — une carte de membre affichée publiquement dans la communauté. À partir des informations brutes fournies (souvent plus longues, parfois informelles), produis deux textes courts dans la langue demandée :

1. "bio" : 1 à 2 phrases (160 caractères max), qui résume qui est cette personne et ce qui la définit. Direct, pas de "je suis" ou "I am" — style factuel comme l'exemple ci-dessus.
2. "lookingFor" : 1 phrase courte (100 caractères max), ce que cette personne recherche concrètement dans la communauté.

Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni après, sans balises markdown : {"bio": "...", "lookingFor": "..."}`;

function buildUserPrompt(input: CardGenerationInput): string {
  const lines = [
    `Langue de sortie : ${input.preferredLang === 'EN' ? 'anglais' : 'français'}`,
    `Prénom : ${input.firstname}`,
    `Profil : ${input.isAthlete ? 'Athlète' : 'Dirigeant / entrepreneur'}`,
  ];
  if (input.role) lines.push(`Poste / titre : ${input.role}`);
  if (input.company) lines.push(`Société : ${input.company}`);
  if (input.sportLevelLabel) lines.push(`Niveau trail : ${input.sportLevelLabel}`);
  if (input.selfDescription) lines.push(`Description de soi (brute) : ${input.selfDescription}`);
  if (input.motivation) lines.push(`Motivation à rejoindre TRLBLZR (brute) : ${input.motivation}`);
  if (input.lookingFor) lines.push(`Ce qui est recherché (brut) : ${input.lookingFor}`);
  return lines.join('\n');
}

function parseJsonResponse(text: string): CardGenerationOutput {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  const parsed = JSON.parse(cleaned);
  if (typeof parsed.bio !== 'string' || typeof parsed.lookingFor !== 'string') {
    throw new Error('Malformed generation response');
  }
  return { bio: parsed.bio.trim(), lookingFor: parsed.lookingFor.trim() };
}

export async function generateMemberCardText(
  input: CardGenerationInput,
): Promise<CardGenerationOutput> {
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
      max_tokens: 300,
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
  if (typeof text !== 'string') throw new Error('Unexpected Anthropic response shape');

  return parseJsonResponse(text);
}
