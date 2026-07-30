/**
 * Batch 5.2 — POST /api/profile/card/generate
 *
 * Session-gated. Takes the CURRENT form state from the client (including any unsaved
 * edits — generation should reflect what the user is looking at, not just what's already
 * saved in Notion) and asks Claude for a short bio + looking-for pair. Doesn't touch
 * Notion at all — this is a preview step; /api/profile/card/validate is what persists it.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { generateMemberCardText } from '@/lib/card-generation';
import { SPORT_LEVEL_LABELS } from '@/lib/field-options';

type GenerateBody = {
  firstname?: string;
  isAthlete?: boolean;
  role?: string;
  company?: string;
  selfDescription?: string;
  motivation?: string;
  lookingFor?: string;
  sportLevel?: '' | '1' | '2' | '3' | '4' | '5';
  preferredLang?: 'FR' | 'EN';
};

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let data: GenerateBody;
  try {
    data = (await req.json()) as GenerateBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const result = await generateMemberCardText({
      firstname: data.firstname || '',
      isAthlete: Boolean(data.isAthlete),
      role: data.role,
      company: data.company,
      selfDescription: data.selfDescription,
      motivation: data.motivation,
      lookingFor: data.lookingFor,
      sportLevelLabel: data.sportLevel ? SPORT_LEVEL_LABELS[data.sportLevel] : null,
      preferredLang: data.preferredLang === 'EN' ? 'EN' : 'FR',
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error('Card generation failed', err);
    return NextResponse.json(
      { error: 'Generation failed — is ANTHROPIC_API_KEY configured?' },
      { status: 500 },
    );
  }
}
