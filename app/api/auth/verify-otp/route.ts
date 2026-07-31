/**
 * Batch 6 — POST /api/auth/verify-otp { email, code }
 *
 * Checks the 6-digit code sent by /api/auth/request-otp: expiry, attempt count, then a
 * timing-safe hash comparison. On success, mints the exact same session cookie as
 * /api/auth/verify (the magic-link verify route) — both flows converge on one session shape.
 *
 * Every failure — unknown email, no active code, expired code, wrong code, attempts
 * exhausted — returns the SAME generic error. Distinguishing them in the response (e.g.
 * showing "too many attempts" only for real accounts) would reopen the exact email-enumeration
 * hole request-otp is designed to close. The attempt limit is still enforced server-side either
 * way; only the message text is unified.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  createToken,
  OTP_MAX_ATTEMPTS,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
} from '@/lib/auth';
import {
  clearOtpCode,
  findCandidateByEmail,
  getOtpState,
  incrementOtpAttempts,
  markEmailVerified,
} from '@/lib/notion-candidates';
import { hashOtpCode } from '@/lib/otp';

function timingSafeEqualStrings(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function POST(req: NextRequest) {
  let body: { email?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const fail = () =>
    NextResponse.json({ ok: false, error: 'invalid_or_expired' }, { status: 400 });

  const email = body.email?.trim().toLowerCase();
  const code = body.code?.trim();
  if (!email || !code || !/^\d{6}$/.test(code)) return fail();

  try {
    const candidate = await findCandidateByEmail(email);
    if (!candidate) return fail();

    const otp = await getOtpState(candidate.id);
    if (!otp?.hash || !otp.expiresAt) return fail();

    if (Date.now() > Date.parse(otp.expiresAt)) {
      await clearOtpCode(candidate.id);
      return fail();
    }
    if (otp.attempts >= OTP_MAX_ATTEMPTS) return fail();

    const hash = hashOtpCode(email, code);
    if (!timingSafeEqualStrings(hash, otp.hash)) {
      const nextAttempts = otp.attempts + 1;
      if (nextAttempts >= OTP_MAX_ATTEMPTS) {
        await clearOtpCode(candidate.id);
      } else {
        await incrementOtpAttempts(candidate.id, nextAttempts);
      }
      return fail();
    }

    await clearOtpCode(candidate.id);
    try {
      await markEmailVerified(candidate.id);
    } catch (err) {
      console.error('markEmailVerified failed', err);
    }

    const sessionToken = createToken(
      { candidateId: candidate.id, email, purpose: 'session' },
      SESSION_TTL_SECONDS,
    );
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: SESSION_TTL_SECONDS,
      path: '/',
    });
    return res;
  } catch (err) {
    console.error('verify-otp failed', err);
    return fail();
  }
}
