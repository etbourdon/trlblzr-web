// Batch 5.1 — bilingual email templates for the two magic-link moments:
// "verify" (sent once, right after /apply submission) and "login" (sent on demand from /login).

import { escapeHtml } from '@/lib/html';

function button(url: string, label: string): string {
  return `<p><a href="${escapeHtml(url)}" style="display:inline-block;background:#e8590c;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-size:13px;">${escapeHtml(label)} →</a></p>`;
}

function wrap(body: string): string {
  return `<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;color:#111;max-width:480px;margin:0 auto;">${body}</div>`;
}

export function buildVerifyEmail({
  firstname,
  verifyUrl,
  locale,
}: {
  firstname: string;
  verifyUrl: string;
  locale: 'FR' | 'EN';
}): { subject: string; html: string } {
  if (locale === 'EN') {
    return {
      subject: 'Finish your application — TRLBLZR.run',
      html: wrap(`
        <h2>Hey ${escapeHtml(firstname)},</h2>
        <p>Thanks for applying to TRLBLZR.run. Final step — click below to verify your email and finish your application.</p>
        ${button(verifyUrl, 'Finish my application')}
        <p style="color:#888;font-size:12px;">This link expires in 20 minutes. Didn't apply on TRLBLZR.run? You can ignore this email.</p>
      `),
    };
  }
  return {
    subject: 'Finalise ta candidature — TRLBLZR.run',
    html: wrap(`
      <h2>Salut ${escapeHtml(firstname)},</h2>
      <p>Merci pour ta candidature sur TRLBLZR.run. Dernière étape — clique pour valider ton email et finaliser ta candidature.</p>
      ${button(verifyUrl, 'Finaliser ma candidature')}
      <p style="color:#888;font-size:12px;">Ce lien expire dans 20 minutes. Tu n'as pas postulé sur TRLBLZR.run ? Ignore cet email.</p>
    `),
  };
}

// Batch 6 — email OTP login code. No button() here — the code is meant to be typed on the page
// where it was requested, not clicked, so there's nothing to link to.
export function buildOtpEmail({
  firstname,
  code,
  locale,
}: {
  firstname: string;
  code: string;
  locale: 'FR' | 'EN';
}): { subject: string; html: string } {
  if (locale === 'EN') {
    return {
      subject: 'Your TRLBLZR.run login code',
      html: wrap(`
        <h2>Hey ${escapeHtml(firstname || '')},</h2>
        <p>Here's your one-time login code — enter it on the page where you requested it.</p>
        <p style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;margin:24px 0;">${escapeHtml(code)}</p>
        <p style="color:#888;font-size:12px;">This code expires in 10 minutes and works once. Didn't request this? You can ignore this email.</p>
      `),
    };
  }
  return {
    subject: 'Ton code de connexion TRLBLZR.run',
    html: wrap(`
      <h2>Salut ${escapeHtml(firstname || '')},</h2>
      <p>Voici ton code de connexion à usage unique — saisis-le sur la page où tu l'as demandé.</p>
      <p style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;margin:24px 0;">${escapeHtml(code)}</p>
      <p style="color:#888;font-size:12px;">Ce code expire dans 10 minutes et ne fonctionne qu'une fois. Tu n'as rien demandé ? Ignore cet email.</p>
    `),
  };
}

export function buildLoginEmail({
  firstname,
  loginUrl,
  locale,
}: {
  firstname: string;
  loginUrl: string;
  locale: 'FR' | 'EN';
}): { subject: string; html: string } {
  if (locale === 'EN') {
    return {
      subject: 'Your TRLBLZR.run login link',
      html: wrap(`
        <h2>Hey ${escapeHtml(firstname || '')},</h2>
        <p>Here's your link to log back in and edit your profile — no password needed.</p>
        ${button(loginUrl, 'Log in')}
        <p style="color:#888;font-size:12px;">This link expires in 20 minutes. Didn't request this? You can ignore this email.</p>
      `),
    };
  }
  return {
    subject: 'Ton lien de connexion TRLBLZR.run',
    html: wrap(`
      <h2>Salut ${escapeHtml(firstname || '')},</h2>
      <p>Voici ton lien pour te reconnecter et modifier ton profil — sans mot de passe.</p>
      ${button(loginUrl, 'Me connecter')}
      <p style="color:#888;font-size:12px;">Ce lien expire dans 20 minutes. Tu n'as rien demandé ? Ignore cet email.</p>
    `),
  };
}
