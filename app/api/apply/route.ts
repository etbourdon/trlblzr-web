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

const NOTION_API_URL = 'https://api.notion.com/v1/pages';
const NOTION_VERSION = '2022-06-28';

// Mapping slug → libellé Notion (doit EXACTEMENT matcher les options Select de la colonne Session).
// On supporte les anciens slugs du site statique ET les nouveaux du Next.js.
const SESSION_LABELS: Record<string, string> = {
  // Slugs du site statique (compat backwards si liens externes pointent encore là)
  'annecy-mai-2026': 'Annecy — Mai 2026 · Performance',
  'vercors-juillet-2026': 'Vercors — Juillet 2026 · Longévité',
  // Slugs du Next.js (depuis lib/content.ts)
  'vercors-2026-07': 'Vercors — Juillet 2026 · Longévité',
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

  // Mapping form payload → Notion properties.
  // Les noms de propriété doivent EXACTEMENT correspondre à la base Notion "Candidatures".
  const properties: Record<string, unknown> = {
    Name: { title: txt(fullName) },
    Email: { email: data.email },
    WhatsApp: { phone_number: data.whatsapp || null },
    LinkedIn: { url: data.linkedin || null },
    Category: { select: { name: isAthlete ? 'Athlète' : 'Dirigeant' } },
    Session: { select: { name: sessionLabel } },
    Status: { select: { name: 'Nouveau' } },
    Company: { rich_text: txt(data.company) },
    ITRA: { rich_text: txt(data.itra) },
    UTMB: { rich_text: txt(data.utmb) },
    Source: { rich_text: txt(data.referer || 'apply') },
  };

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
