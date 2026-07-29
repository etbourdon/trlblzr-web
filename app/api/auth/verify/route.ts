/**
 * Batch 5.1 — GET /api/auth/verify?token=...
 *
 * Handles both magic-link purposes:
 *  - "verify" (from the email sent at /apply submission): marks Email verified in Notion,
 *    then logs the candidate in.
 *  - "login" (from /login → /api/auth/request-link): just logs the candidate in.
 *
 * Either way, sets the session cookie and redirects to /profile. Invalid/expired tokens
 * redirect back to /login with an error flag.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, createToken, SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from '@/lib/auth';
import { markEmailVerified } from '@/lib/notion-candidates';

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const token = req.nextUrl.searchParams.get('token');
  const payload = verifyToken(token);

  if (!payload || (payload.purpose !== 'verify' && payload.purpose !== 'login')) {
    return NextResponse.redirect(`${origin}/login?error=expired`);
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

  const res = NextResponse.redirect(`${origin}/profile`);
  res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
  });
  return res;
}
