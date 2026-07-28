/**
 * TRLBLZR.RUN — Apply submission endpoint (Next.js App Router)
 *
 * Reçoit le POST du formulaire /apply et crée une page Notion.
 * Port de api/apply.js (Vercel Function CommonJS) vers Next.js App Router (route handler).
 *
 * Variables d'environnement requises (Vercel → Settings → Environment Variables) :
 *   - NOTION_TOKEN       : token d'intégration Notion (commence par `ntn_…` ou `secret_…`)
 *   - NOTION_DATABASE_ID : ID 32 caractères hex de la base Candidatures
 *
 * Voir APPLY_BACKEND.md à la racine du repo pour le setup Notion complet.
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildNotificationEmail } from '@/lib/apply-notification';

const NOTION_API_URL = 'https://api.notion.com/v1/pages';
const NOTION_VERSION = '2022-06-28';
const RESEND_API_URL = 'https://api.resend.com/emails';

// Batch 4 — best-effort: la candidature est déjà sauvegardée dans Notion à ce stade,
// donc un échec d'envoi d'email ne doit jamais faire échouer la réponse au candidat.
async function sendApplyNotification(subject: string, html: string) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL, NOTIFICATION_EMAIL } = process.env;
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY absent — notification email ignorée');
    return;
  }
  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL || 'TRLBLZR.run <onboarding@resend.dev>',
      to: [NOTIFICATION_EMAIL || 'etienne@bourdon.com'],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
  }
}

// Mapping slug → libellé Notion (doit EXACTEMENT matcher les options Select de la colonne Session).
// Slugs actifs : saison automne 2026 (5 sessions chronologiques depuis lib/content.ts).
// Legacy slugs conservés pour compat backwards (liens externes historiques).
const SESSION_LABELS: Record<string, string> = {
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

type ApplyPayload = {
  firstname?: string;
  lastname?: string;
  email?: string;
  whatsapp?: string;
  linkedin?: string;
  category?: 'dirigeant' | 'athlete';
  session?: string;
  company?: string;
  itra?: string;
  utmb?: string;
  rgpd?: boolean;
  referer?: string;
  locale?: 'fr' | 'en'; // ← Preferred language (Batch 2)
  source?: string; // ← SBL-18 : tracking URL param ?source=…
  // Batch 3 — Form v2
  selfDescription?: string;
  sportLevel?: '' | '1' | '2' | '3' | '4' | '5';
  motivation?: string;
  lookingFor?: string;
  city?: '' | 'Paris' | 'Lyon' | 'Bucharest' | 'Autre';
  country?: string;
  proWebsite?: string;
  stravaProfile?: string;
  otherLink?: string;
};

// Map numeric sport level → Notion SELECT label (matches Candidates DB "Sport level" options)
const SPORT_LEVEL_LABELS: Record<string, string> = {
  '1': '1 · Jog occasionnel',
  '2': '2 · Coureur régulier',
  '3': '3 · Traileur',
  '4': '4 · Long trail (ultra)',
  '5': '5 · Ultra élite (>100k)',
};

function txt(content: string | undefined | null) {
  if (!content) return [];
  return [{ type: 'text', text: { content: String(content).slice(0, 2000) } }];
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: NextRequest) {
  const { NOTION_TOKEN, NOTION_DATABASE_ID } = process.env;
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
    console.error('Missing NOTION_TOKEN or NOTION_DATABASE_ID env vars');
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  let data: ApplyPayload;
  try {
    data = (await req.json()) as ApplyPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!data || !data.firstname || !data.lastname || !data.email || !data.rgpd) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const fullName = `${data.firstname} ${data.lastname}`.trim();
  const sessionLabel =
    SESSION_LABELS[data.session || ''] || data.session || '— Sans session ciblée —';
  const isAthlete = data.category === 'athlete';

  // Preferred language (Batch 2) — FR par défaut si non fournie ou valeur invalide
  const preferredLang: 'FR' | 'EN' = data.locale === 'en' ? 'EN' : 'FR';

  // Sport level (Batch 3) — numeric value → Notion SELECT label
  const sportLevelLabel = data.sportLevel ? SPORT_LEVEL_LABELS[data.sportLevel] : null;

  // City (Batch 3) — value must match a Notion SELECT option
  const cityLabel =
    data.city && ['Paris', 'Lyon', 'Bucharest', 'Autre'].includes(data.city)
      ? data.city
      : null;

  // Mapping form payload → Notion properties.
  // Les noms de propriété doivent EXACTEMENT correspondre à la base Notion "Candidates".
  const properties: Record<string, unknown> = {
    Name: { title: txt(fullName) },
    Email: { email: data.email },
    WhatsApp: { phone_number: data.whatsapp || null },
    LinkedIn: { url: data.linkedin || null },
    Category: { select: { name: isAthlete ? 'Athlète' : 'Dirigeant' } },
    Session: { select: { name: sessionLabel } },
    Status: { select: { name: 'Nouveau' } },
    'Preferred language': { select: { name: preferredLang } },
    Company: { rich_text: txt(data.company) },
    ITRA: { rich_text: txt(data.itra) },
    UTMB: { rich_text: txt(data.utmb) },
    // SBL-18 : priorité au ?source= explicite, puis referer, puis 'direct'
    Source: { rich_text: txt(data.source || data.referer || 'direct') },
    // Batch 3 — Form v2 fields
    'Self-description': { rich_text: txt(data.selfDescription) },
    Motivation: { rich_text: txt(data.motivation) },
    'Looking for': { rich_text: txt(data.lookingFor) },
    Country: { rich_text: txt(data.country) },
    'Pro website': { url: data.proWebsite || null },
    'Strava profile': { url: data.stravaProfile || null },
    'Other link': { url: data.otherLink || null },
  };

  // SELECT fields — only set if value is valid
  if (sportLevelLabel) properties['Sport level'] = { select: { name: sportLevelLabel } };
  if (cityLabel) properties['City'] = { select: { name: cityLabel } };

  // Retire les rich_text vides (Notion accepte null pour email/url/phone, pas pour rich_text)
  Object.keys(properties).forEach((key) => {
    const p = properties[key] as { rich_text?: unknown[] };
    if (p.rich_text && p.rich_text.length === 0) delete properties[key];
  });

  try {
    const notionRes = await fetch(NOTION_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties,
      }),
    });

    const notionBody = await notionRes.json();
    if (!notionRes.ok) {
      console.error('Notion API error', notionRes.status, notionBody);
      // On expose le message + le code Notion pour aider au debug
      const detail =
        notionBody.message ||
        (notionBody.code ? `code: ${notionBody.code}` : null) ||
        `HTTP ${notionRes.status}`;
      return NextResponse.json(
        { error: `Notion: ${detail}` },
        { status: 502 },
      );
    }

    // Batch 4 — email récap à Etienne (résumé candidat + templates FR/EN welcome + WhatsApp)
    try {
      const { subject, html } = buildNotificationEmail({
        fullName,
        firstname: data.firstname!,
        email: data.email!,
        whatsapp: data.whatsapp,
        linkedin: data.linkedin,
        isAthlete,
        company: data.company,
        itra: data.itra,
        utmb: data.utmb,
        sessionLabel,
        preferredLang,
        sportLevelLabel,
        cityLabel,
        country: data.country,
        selfDescription: data.selfDescription,
        motivation: data.motivation,
        lookingFor: data.lookingFor,
        proWebsite: data.proWebsite,
        stravaProfile: data.stravaProfile,
        otherLink: data.otherLink,
        source: data.source || data.referer,
        notionUrl: notionBody.url,
      });
      await sendApplyNotification(subject, html);
    } catch (err) {
      console.error('Échec envoi email notification (candidature déjà enregistrée)', err);
    }

    return NextResponse.json({
      ok: true,
      reference: `TRLBLZR-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 9000) + 1000,
      )}`,
      notion_id: notionBody.id,
    });
  } catch (err) {
    console.error('Server exception', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
