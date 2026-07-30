/**
 * Batch 5.2 — POST /api/profile/card/validate
 *
 * Session-gated. Saves the (possibly hand-edited) generated bio/lookingFor, requires
 * explicit consent, and sets Card status -> "submitted" (awaiting admin review — Batch 5.3
 * isn't built yet, so nothing further happens automatically after this). Assigns the
 * member's permanent "Member No" the first time they submit; never reassigned afterward.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import {
  getCandidateById,
  updateCandidateProperties,
  getNextMemberNumber,
  txt,
} from '@/lib/notion-candidates';

type ValidateBody = {
  bio?: string;
  lookingFor?: string;
  consent?: boolean;
};

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  let data: ValidateBody;
  try {
    data = (await req.json()) as ValidateBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!data.bio || !data.lookingFor) {
    return NextResponse.json({ error: 'Generate a card before submitting' }, { status: 400 });
  }
  if (!data.consent) {
    return NextResponse.json({ error: 'Consent is required' }, { status: 400 });
  }

  try {
    const candidate = await getCandidateById(session.candidateId);
    if (!candidate) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const properties: Record<string, unknown> = {
      'Card bio': { rich_text: txt(data.bio) },
      'Card looking for': { rich_text: txt(data.lookingFor) },
      'Card status': { select: { name: 'submitted' } },
      'Card consent': { checkbox: true },
    };

    let memberNo = candidate.memberNo;
    if (memberNo == null) {
      memberNo = await getNextMemberNumber();
      properties['Member No'] = { number: memberNo };
    }

    const ok = await updateCandidateProperties(session.candidateId, properties);
    if (!ok) return NextResponse.json({ error: 'Failed to submit card' }, { status: 502 });
    return NextResponse.json({ ok: true, memberNo });
  } catch (err) {
    console.error('Card validate failed', err);
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }
}
