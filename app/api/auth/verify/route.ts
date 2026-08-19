/**
 * Batch 5.1 — GET /api/auth/verify?token=...
 *
 * Handles both magic-link purposes:
 *  - "verify" (from the email sent at /apply submission): marks Email verified in Notion,
 *    then logs the candidate in.
 *  - "login" (from /login → /api/auth/request-link): just logs the candidate in.
 *
 * Either way, sets the session cookie and redirects to /profile — or to the safe `next` path
 * (Batch 7, e.g. a gated /directory/{memberNo} page) if one was carried through the link.
 * Invalid/expired tokens redirect back to /login with an error flag, preserving `next` too.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, createToken, SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from '@/lib/auth';
import { markEmailVerified } from '@/lib/notion-candidates';
import { isSafeNextPath } from '@/lib/safe-redirect';

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const token = req.nextUrl.searchParams.get('token');
  const payload = verifyToken(token);
  const rawNext = req.nextUrl.searchParams.get('next');
  const next = isSafeNextPath(rawNext) ? rawNext : null;

  if (!payload || (payload.purpose !== 'verify' && payload.purpose !== 'login')) {
    const expiredUrl = next
      ? `${origin}/login?error=expired&next=${encodeURIComponent(next)}`
      : `${origin}/login?error=expired`;
    return NextResponse.redirect(expiredUrl);
  }

  if (payload.purpose === 'verify') {
    try {
      await markEmailVerified(payload.candidateId);
    } catch (err) {
      // Ne bloque pas la connexion pour un souci Notion transitoire — l'email reste non
      // marqué "verified" mais le candidat peut quand même accéder à son profil.
      console.error('markEmailVerified failed', err);
    }
  }

  const sessionToken = createToken(
    { candidateId: payload.candidateId, email: payload.email, purpose: 'session' },
    SESSION_TTL_SECONDS,
  );

  // SBL-26 follow-up — a first-time verify (from /apply) lands on a dedicated confirmation
  // screen (review-process explanation, no premature discovery-call CTA); a returning login
  // keeps going straight to /refuge as before. `next` still wins in either case.
  const defaultDestination = payload.purpose === 'verify' ? '/apply/confirmed' : '/refuge';
  const res = NextResponse.redirect(`${origin}${next || defaultDestination}`);
  res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
  });
  return res;
}
