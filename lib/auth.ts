// Batch 5.1 — Auth email magic link (hand-rolled, no Clerk/Auth.js, no extra database).
//
// Tokens are HMAC-SHA256 signed JSON payloads: base64url(payload) + "." + base64url(signature).
// Verified by recomputing the signature (timing-safe compare) and checking `exp`.
//
// Known simplification: links are time-limited but not strictly single-use (no server-side
// token store to mark "already used" — that would need a database, which this design deliberately
// avoids). Short expiry on verify/login links is the mitigation. Fine for a low-volume community
// tool; revisit if that ever stops being true.

import crypto from 'crypto';
import type { NextRequest } from 'next/server';

export type TokenPurpose = 'verify' | 'login' | 'session';

export type TokenPayload = {
  candidateId: string;
  email: string;
  purpose: TokenPurpose;
  exp: number; // unix seconds
};

export const SESSION_COOKIE_NAME = 'trlblzr_session';
export const VERIFY_LINK_TTL_SECONDS = 20 * 60; // 20 min
export const LOGIN_LINK_TTL_SECONDS = 20 * 60; // 20 min
export const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('Missing AUTH_SECRET env var');
  return secret;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

function sign(payloadB64: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
}

export function createToken(payload: Omit<TokenPayload, 'exp'>, ttlSeconds: number): string {
  const secret = getSecret();
  const full: TokenPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const payloadB64 = base64url(JSON.stringify(full));
  const sig = sign(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

export function verifyToken(token: string | undefined | null): TokenPayload | null {
  if (!token) return null;
  const secret = getSecret();
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;

  const expectedSig = sign(payloadB64, secret);
  const sigBuf = Buffer.from(sig, 'base64url');
  const expectedBuf = Buffer.from(expectedSig, 'base64url');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString()) as TokenPayload;
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // expired
    }
    return payload;
  } catch {
    return null;
  }
}

// Shared by every session-gated route (/api/profile, /api/profile/upload, ...).
export function getSessionFromRequest(req: NextRequest): TokenPayload | null {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const payload = verifyToken(token);
  return payload && payload.purpose === 'session' ? payload : null;
}
