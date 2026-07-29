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
      subject: 'Confirm your email — TRLBLZR.run',
      html: wrap(`
        <h2>Hey ${escapeHtml(firstname)},</h2>
        <p>Thanks for applying to TRLBLZR.run. Confirm your email address — it'll let you manage your profile later on.</p>
        ${button(verifyUrl, 'Confirm my email')}
        <p style="color:#888;font-size:12px;">This link expires in 20 minutes. Didn't apply on TRLBLZR.run? You can ignore this email.</p>
      `),
    };
  }
  return {
    subject: 'Confirme ton email — TRLBLZR.run',
    html: wrap(`
      <h2>Salut ${escapeHtml(firstname)},</h2>
      <p>Merci pour ta candidature sur TRLBLZR.run. Confirme ton adresse email — ça te permettra de gérer ton profil plus tard.</p>
      ${button(verifyUrl, 'Confirmer mon email')}
      <p style="color:#888;font-size:12px;">Ce lien expire dans 20 minutes. Tu n'as pas postulé sur TRLBLZR.run ? Ignore cet email.</p>
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
