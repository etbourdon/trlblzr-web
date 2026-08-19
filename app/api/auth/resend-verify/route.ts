/**
 * SBL-26 follow-up — POST /api/auth/resend-verify { pendingToken }
 *
 * Re-sends the "finalise ta candidature" verification email from the "Candidature en cours"
 * screen, using the short-lived pending token issued by /api/apply (purpose: 'pending'). No
 * Notion-side cooldown state — the 60s cooldown is enforced client-side only (see
 * VERIFY_RESEND_COOLDOWN_SECONDS in lib/auth.ts).
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, createToken, VERIFY_LINK_TTL_SECONDS } from '@/lib/auth';
import { getCandidateById } from '@/lib/notion-candidates';
import { sendEmail } from '@/lib/resend';
import { buildVerifyEmail } from '@/lib/verify-notification';

export async function POST(req: NextRequest) {
  let body: { pendingToken?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const payload = verifyToken(body.pendingToken);
  if (!payload || payload.purpose !== 'pending') {
    return NextResponse.json({ error: 'Expired or invalid session' }, { status: 400 });
  }

  try {
    const candidate = await getCandidateById(payload.candidateId);
    if (!candidate) {
      return NextResponse.json({ error: 'Expired or invalid session' }, { status: 400 });
    }

    const freshToken = createToken(
      { candidateId: payload.candidateId, email: payload.email, purpose: 'verify' },
      VERIFY_LINK_TTL_SECONDS,
    );
    const verifyUrl = `${req.nextUrl.origin}/api/auth/verify?token=${encodeURIComponent(freshToken)}`;
    const { subject, html } = buildVerifyEmail({
      firstname: candidate.name?.split(' ')[0] || '',
      verifyUrl,
      locale: candidate.preferredLanguage || 'FR',
    });
    await sendEmail({ to: payload.email, subject, html });
  } catch (err) {
    console.error('resend-verify failed', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
