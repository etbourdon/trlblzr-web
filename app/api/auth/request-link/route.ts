/**
 * Batch 5.1 — POST /api/auth/request-link { email }
 *
 * Looks up the candidate by email and, if found, emails a fresh short-lived login link.
 * Always returns a generic { ok: true } regardless of whether the email matched anything —
 * never reveal whether an address exists in Candidates (avoids email enumeration).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createToken, LOGIN_LINK_TTL_SECONDS } from '@/lib/auth';
import { findCandidateByEmail } from '@/lib/notion-candidates';
import { sendEmail } from '@/lib/resend';
import { buildLoginEmail } from '@/lib/verify-notification';
import { isSafeNextPath } from '@/lib/safe-redirect';

export async function POST(req: NextRequest) {
  let body: { email?: string; locale?: 'fr' | 'en'; next?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const next = isSafeNextPath(body.next) ? body.next : null;
  const generic = () => NextResponse.json({ ok: true });

  if (!email) return generic();

  try {
    const candidate = await findCandidateByEmail(email);
    if (candidate) {
      const token = createToken(
        { candidateId: candidate.id, email, purpose: 'login' },
        LOGIN_LINK_TTL_SECONDS,
      );
      let loginUrl = `${req.nextUrl.origin}/api/auth/verify?token=${encodeURIComponent(token)}`;
      if (next) loginUrl += `&next=${encodeURIComponent(next)}`;
      const locale = candidate.preferredLanguage || (body.locale === 'en' ? 'EN' : 'FR');
      const { subject, html } = buildLoginEmail({
        firstname: candidate.name?.split(' ')[0] || '',
        loginUrl,
        locale,
      });
      await sendEmail({ to: email, subject, html });
    }
  } catch (err) {
    console.error('request-link failed', err);
  }

  return generic();
}
