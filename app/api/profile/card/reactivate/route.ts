/**
 * Batch 5.3 — POST /api/profile/card/reactivate
 *
 * Session-gated. Self-service undo for a suspended card, only within its grace period
 * (Card delete after not yet passed). Restores straight to "validated" — the content
 * didn't change, it was already approved before suspension, so no re-review needed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { getCandidateById, updateCandidateProperties } from '@/lib/notion-candidates';

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const candidate = await getCandidateById(session.candidateId);
    if (!candidate) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    if (candidate.cardStatus !== 'suspended') {
      return NextResponse.json({ error: 'Card is not suspended' }, { status: 400 });
    }
    if (candidate.cardDeleteAfter && candidate.cardDeleteAfter < new Date().toISOString().slice(0, 10)) {
      return NextResponse.json({ error: 'Grace period has passed' }, { status: 400 });
    }

    const ok = await updateCandidateProperties(session.candidateId, {
      'Card status': { select: { name: 'validated' } },
      'Card suspended at': { date: null },
      'Card delete after': { date: null },
    });
    if (!ok) return NextResponse.json({ error: 'Failed to reactivate card' }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Card reactivate failed', err);
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }
}
