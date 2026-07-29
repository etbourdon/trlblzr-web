// Thin shared wrapper around the Resend API — used by apply notifications (Batch 4) and
// the auth magic-link emails (Batch 5.1). Best-effort: logs and returns silently if
// RESEND_API_KEY isn't configured, callers should never let this fail the user-facing response.

const RESEND_API_URL = 'https://api.resend.com/emails';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<void> {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY absent — email ignoré:', subject);
    return;
  }

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL || 'TRLBLZR.run <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
  }
}
