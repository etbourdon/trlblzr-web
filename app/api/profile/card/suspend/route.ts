/**
 * Batch 5.3 — POST /api/profile/card/suspend
 *
 * Session-gated. Self-service "remove my card" — right to erasure (GDPR), but not an
 * immediate hard delete: sets Card status -> "suspended", stamps today as the suspension
 * date, and computes a 90-day grace period during which the member can self-reactivate
 * (see /api/profile/card/reactivate). After that window, Etienne clears it out manually via
 * the "Cards — Suspended" Notion view — no automated purge job for V1.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { getCandidateById, updateCandidateProperties } from '@/lib/notion-candidates';

const GRACE_PERIOD_DAYS = 90;

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  try {
    const candidate = await getCandidateById(session.candidateId);
    if (!candidate) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    if (candidate.cardStatus !== 'submitted' && candidate.cardStatus !== 'validated') {
      return NextResponse.json({ error: 'No active card to suspend' }, { status: 400 });
    }

    const now = new Date();
    const deleteAfter = new Date(now);
    deleteAfter.setDate(deleteAfter.getDate() + GRACE_PERIOD_DAYS);

    const ok = await updateCandidateProperties(session.candidateId, {
      'Card status': { select: { name: 'suspended' } },
      'Card suspended at': { date: { start: now.toISOString().slice(0, 10) } },
      'Card delete after': { date: { start: deleteAfter.toISOString().slice(0, 10) } },
    });
    if (!ok) return NextResponse.json({ error: 'Failed to suspend card' }, { status: 502 });
    return NextResponse.json({ ok: true, deleteAfter: deleteAfter.toISOString().slice(0, 10) });
  } catch (err) {
    console.error('Card suspend failed', err);
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }
}
