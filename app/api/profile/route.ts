/**
 * Batch 5.1 — GET/PATCH /api/profile
 *
 * Session-gated (httpOnly cookie set by /api/auth/verify). GET returns the logged-in
 * candidate's current editable fields; PATCH saves the full form back to Notion.
 *
 * Unlike /api/apply (a one-time creation where omitted properties just mean "unset"),
 * this is an edit endpoint — an emptied field must actually clear the Notion property,
 * so we always send explicit "empty" values (rich_text: [], select: null, url: null)
 * rather than omitting the key.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, SESSION_COOKIE_NAME, type TokenPayload } from '@/lib/auth';
import { getCandidateById, updateCandidateProperties, txt } from '@/lib/notion-candidates';
import { SPORT_LEVEL_LABELS, CITY_OPTIONS } from '@/lib/field-options';

function getSession(req: NextRequest): TokenPayload | null {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const payload = verifyToken(token);
  return payload && payload.purpose === 'session' ? payload : null;
}

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const candidate = await getCandidateById(session.candidateId);
    if (!candidate) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    return NextResponse.json({ ok: true, candidate });
  } catch (err) {
    console.error('GET /api/profile failed', err);
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }
}

type ProfilePayload = {
  selfDescription?: string;
  role?: string;
  company?: string;
  linkedin?: string;
  stravaProfile?: string;
  proWebsite?: string;
  otherLink?: string;
  city?: string;
  country?: string;
  sportLevel?: '' | '1' | '2' | '3' | '4' | '5';
  lookingFor?: string;
  motivation?: string;
  profilePictureUrl?: string;
};

export async function PATCH(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let data: ProfilePayload;
  try {
    data = (await req.json()) as ProfilePayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const properties: Record<string, unknown> = {
    'Self-description': { rich_text: txt(data.selfDescription) },
    'Role / Title': { rich_text: txt(data.role) },
    Company: { rich_text: txt(data.company) },
    Country: { rich_text: txt(data.country) },
    Motivation: { rich_text: txt(data.motivation) },
    'Looking for': { rich_text: txt(data.lookingFor) },
    LinkedIn: { url: data.linkedin || null },
    'Strava profile': { url: data.stravaProfile || null },
    'Pro website': { url: data.proWebsite || null },
    'Other link': { url: data.otherLink || null },
    'Profile picture URL': { url: data.profilePictureUrl || null },
    City:
      data.city && (CITY_OPTIONS as readonly string[]).includes(data.city)
        ? { select: { name: data.city } }
        : { select: null },
    'Sport level':
      data.sportLevel && SPORT_LEVEL_LABELS[data.sportLevel]
        ? { select: { name: SPORT_LEVEL_LABELS[data.sportLevel] } }
        : { select: null },
  };

  try {
    const ok = await updateCandidateProperties(session.candidateId, properties);
    if (!ok) return NextResponse.json({ error: 'Failed to update profile' }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('PATCH /api/profile failed', err);
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }
}
