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
import { buildVerifyEmail } from '@/lib/verify-notification';
import { sendEmail } from '@/lib/resend';
import { createCandidatePage, txt } from '@/lib/notion-candidates';
import { createToken, VERIFY_LINK_TTL_SECONDS } from '@/lib/auth';
import { SPORT_LEVEL_LABELS, CITY_OPTIONS } from '@/lib/field-options';
import { mapSlugsToSessionLabels, mapSlugsToSessionRelations } from '@/lib/session-mapping';

// Batch 4 — best-effort: la candidature est déjà sauvegardée dans Notion à ce stade,
// donc un échec d'envoi d'email ne doit jamais faire échouer la réponse au candidat.
async function sendApplyNotification(subject: string, html: string) {
  const { NOTIFICATION_EMAIL } = process.env;
  // NOTIFICATION_EMAIL peut contenir plusieurs adresses séparées par des virgules
  // (ex. "etienne@bourdon.com, autre@domaine.com") pour notifier plusieurs personnes.
  const recipients = (NOTIFICATION_EMAIL || 'etienne@bourdon.com')
    .split(',')
    .map((addr) => addr.trim())
    .filter(Boolean);
  await sendEmail({ to: recipients, subject, html });
}

// Batch 5.1 — email de vérification envoyé au candidat lui-même (distinct de la notification
// Batch 4 ci-dessus qui va à Etienne). Best-effort : ne doit jamais faire échouer la candidature.
async function sendVerificationEmail(params: {
  candidateId: string;
  email: string;
  firstname: string;
  preferredLang: 'FR' | 'EN';
  origin: string;
}) {
  const { candidateId, email, firstname, preferredLang, origin } = params;
  const token = createToken({ candidateId, email, purpose: 'verify' }, VERIFY_LINK_TTL_SECONDS);
  const verifyUrl = `${origin}/api/auth/verify?token=${encodeURIComponent(token)}`;
  const { subject, html } = buildVerifyEmail({ firstname, verifyUrl, locale: preferredLang });
  await sendEmail({ to: email, subject, html });
}

type ApplyPayload = {
  firstname?: string;
  lastname?: string;
  email?: string;
  whatsapp?: string;
  linkedin?: string;
  category?: 'dirigeant' | 'athlete';
  sessions?: string[];
  company?: string;
  role?: string;
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
  otherCity?: string;
  country?: string;
  proWebsite?: string;
  stravaProfile?: string;
  otherLink?: string;
};

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

  const sessionLabels = mapSlugsToSessionLabels(data.sessions);
  const isAthlete = data.category === 'athlete';

  // Preferred language (Batch 2) — FR par défaut si non fournie ou valeur invalide
  const preferredLang: 'FR' | 'EN' = data.locale === 'en' ? 'EN' : 'FR';

  // Sport level (Batch 3) — numeric value → Notion SELECT label
  const sportLevelLabel = data.sportLevel ? SPORT_LEVEL_LABELS[data.sportLevel] : null;

  // City (Batch 3) — value must match a Notion SELECT option
  const cityLabel =
    data.city && (CITY_OPTIONS as readonly string[]).includes(data.city) ? data.city : null;

  // Mapping form payload → Notion properties.
  // Les noms de propriété doivent EXACTEMENT correspondre à la base Notion "Candidates".
  const properties: Record<string, unknown> = {
    Name: { title: txt(fullName) },
    Email: { email: data.email },
    WhatsApp: { phone_number: data.whatsapp || null },
    LinkedIn: { url: data.linkedin || null },
    Category: { select: { name: isAthlete ? 'Athlète' : 'Dirigeant' } },
    Sessions: { relation: mapSlugsToSessionRelations(data.sessions) },
    Status: { select: { name: 'Nouveau' } },
    'Preferred language': { select: { name: preferredLang } },
    Company: { rich_text: txt(data.company) },
    'Role / Title': { rich_text: txt(data.role) },
    ITRA: { rich_text: txt(data.itra) },
    UTMB: { rich_text: txt(data.utmb) },
    // SBL-18 : priorité au ?source= explicite, puis referer, puis 'direct'
    Source: { rich_text: txt(data.source || data.referer || 'direct') },
    // Batch 3 — Form v2 fields
    'Self-description': { rich_text: txt(data.selfDescription) },
    Motivation: { rich_text: txt(data.motivation) },
    'Looking for': { rich_text: txt(data.lookingFor) },
    Country: { rich_text: txt(data.country) },
    'Other city': { rich_text: txt(data.otherCity) },
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
    const created = await createCandidatePage(properties);
    if ('error' in created) {
      console.error('Notion API error', created.error);
      return NextResponse.json({ error: `Notion: ${created.error}` }, { status: 502 });
    }
    const notionBody = created;

    // Batch 5.1 — email de vérification au candidat (best-effort, distinct de la notification Etienne)
    try {
      await sendVerificationEmail({
        candidateId: notionBody.id,
        email: data.email!,
        firstname: data.firstname!,
        preferredLang,
        origin: req.nextUrl.origin,
      });
    } catch (err) {
      console.error('Échec envoi email de vérification (candidature déjà enregistrée)', err);
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
        role: data.role,
        itra: data.itra,
        utmb: data.utmb,
        sessionLabels,
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
