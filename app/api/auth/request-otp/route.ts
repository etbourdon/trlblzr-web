/**
 * Batch 6 — POST /api/auth/request-otp { email }
 *
 * Alongside the magic link (/api/auth/request-link, untouched). Looks up the candidate by
 * email and, if found and not within the resend cooldown, emails a fresh 6-digit login code.
 * Always returns a generic { ok: true } regardless of whether the email matched anything, or
 * whether a resend was actually sent — same anti-enumeration rationale as request-link.
 */

import { NextRequest, NextResponse } from 'next/server';
import { OTP_CODE_TTL_SECONDS, OTP_RESEND_COOLDOWN_SECONDS } from '@/lib/auth';
import { findCandidateByEmail, getOtpState, setOtpCode } from '@/lib/notion-candidates';
import { generateOtpCode, hashOtpCode } from '@/lib/otp';
import { sendEmail } from '@/lib/resend';
import { buildOtpEmail } from '@/lib/verify-notification';

export async function POST(req: NextRequest) {
  let body: { email?: string; locale?: 'fr' | 'en' };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const generic = () => NextResponse.json({ ok: true });

  if (!email) return generic();

  try {
    const candidate = await findCandidateByEmail(email);
    if (candidate) {
      const otp = await getOtpState(candidate.id);
      const withinCooldown =
        otp?.sentAt && Date.now() - Date.parse(otp.sentAt) < OTP_RESEND_COOLDOWN_SECONDS * 1000;

      if (!withinCooldown) {
        const code = generateOtpCode();
        const hash = hashOtpCode(email, code);
        const now = new Date();
        const expiresAt = new Date(now.getTime() + OTP_CODE_TTL_SECONDS * 1000).toISOString();
        await setOtpCode(candidate.id, hash, expiresAt, now.toISOString());

        const locale = candidate.preferredLanguage || (body.locale === 'en' ? 'EN' : 'FR');
        const { subject, html } = buildOtpEmail({
          firstname: candidate.name?.split(' ')[0] || '',
          code,
          locale,
        });
        await sendEmail({ to: email, subject, html });
      }
    }
  } catch (err) {
    console.error('request-otp failed', err);
  }

  return generic();
}
