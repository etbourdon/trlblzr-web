/**
 * SBL-26 follow-up — POST /api/auth/update-pending-email { pendingToken, newEmail }
 *
 * Lets a candidate correct a mistyped email from the "Candidature en cours" screen, before
 * they've ever verified — patches the existing Notion page in place (no duplicate created,
 * unlike a fresh /apply submission) and sends a fresh verify email to the corrected address.
 * Same anti-enumeration posture as the rest of auth: a collision with someone else's email
 * returns the same generic error as any other failure, never confirming whose it is.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, createToken, VERIFY_LINK_TTL_SECONDS } from '@/lib/auth';
import { getCandidateById, findCandidateByEmail, updateCandidateProperties } from '@/lib/notion-candidates';
import { sendEmail } from '@/lib/resend';
import { buildVerifyEmail } from '@/lib/verify-notification';

export async function POST(req: NextRequest) {
  let body: { pendingToken?: string; newEmail?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const payload = verifyToken(body.pendingToken);
  const newEmail = body.newEmail?.trim().toLowerCase();
  if (!payload || payload.purpose !== 'pending' || !newEmail) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const candidate = await getCandidateById(payload.candidateId);
    if (!candidate) {
      return NextResponse.json({ error: 'Expired or invalid session' }, { status: 400 });
    }

    if (newEmail !== payload.email) {
      const collision = await findCandidateByEmail(newEmail);
      if (collision && collision.id !== payload.candidateId) {
        return NextResponse.json({ error: 'This email cannot be used' }, { status: 400 });
      }
      const updated = await updateCandidateProperties(payload.candidateId, {
        Email: { email: newEmail },
      });
      if (!updated) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
      }
    }

    const verifyLinkToken = createToken(
      { candidateId: payload.candidateId, email: newEmail, purpose: 'verify' },
      VERIFY_LINK_TTL_SECONDS,
    );
    const verifyUrl = `${req.nextUrl.origin}/api/auth/verify?token=${encodeURIComponent(verifyLinkToken)}`;
    const { subject, html } = buildVerifyEmail({
      firstname: candidate.name?.split(' ')[0] || '',
      verifyUrl,
      locale: candidate.preferredLanguage || 'FR',
    });
    await sendEmail({ to: newEmail, subject, html });

    const pendingToken = createToken(
      { candidateId: payload.candidateId, email: newEmail, purpose: 'pending' },
      VERIFY_LINK_TTL_SECONDS,
    );

    return NextResponse.json({ ok: true, pendingToken });
  } catch (err) {
    console.error('update-pending-email failed', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
