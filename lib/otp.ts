// Batch 6 — 6-digit email login code, alongside the magic link (lib/auth.ts).
// The code itself is never stored in Notion — only its HMAC hash — because anyone with read
// access to the Candidates DB in Notion could otherwise read a live code and log in as that
// candidate. See app/api/auth/verify-otp/route.ts for the attempt-limiting/expiry that does
// the actual brute-force defense (the hash alone doesn't need to be secret to be useful here,
// it just avoids storing the code in a form a Notion viewer could directly reuse).

import crypto from 'crypto';
import { hmac } from '@/lib/auth';

export function generateOtpCode(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

// Hash against the normalized (trim+lowercase) email used for the Notion lookup — not
// candidate.email as read back from Notion — so the hash computed when the code is sent and
// the hash computed when it's verified always match regardless of stored casing.
export function hashOtpCode(normalizedEmail: string, code: string): string {
  return hmac(`otp:${normalizedEmail}:${code}`);
}
