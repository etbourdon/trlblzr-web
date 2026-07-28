// Batch 4 — Reception email + welcome manuel.
//
// Quand une candidature arrive dans /api/apply, on envoie un email récap à Etienne
// (via Resend) qui contient : le résumé du candidat + des templates FR/EN prêts à
// copier-coller (email de bienvenue + message WhatsApp) pré-remplis avec le nom, la
// société et la session ciblée. Etienne envoie ensuite manuellement (2 min/candidat) —
// rien n'est auto-envoyé au candidat ici, cf. APPLY_BACKEND.md.

function esc(s: string | null | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function waLink(phone: string | null | undefined, message: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildWelcomeTemplates(input: {
  firstname: string;
  company?: string | null;
  sessionLabel: string;
}) {
  const { firstname, company, sessionLabel } = input;
  const companyPart = company ? ` (${company})` : '';

  const fr = {
    subject: `TRLBLZR.run — Bienvenue ${firstname} 🏔️`,
    body: `Salut ${firstname},

Merci pour ta candidature${companyPart} pour la session ${sessionLabel} sur TRLBLZR.run. On a bien reçu ton dossier et on revient vers toi très vite avec les prochaines étapes.

En attendant, n'hésite pas si tu as des questions.

À très vite,
Etienne — TRLBLZR.run`,
  };

  const en = {
    subject: `TRLBLZR.run — Welcome ${firstname} 🏔️`,
    body: `Hey ${firstname},

Thanks for applying${companyPart} to the ${sessionLabel} session on TRLBLZR.run. We've received your application and will get back to you very soon with next steps.

Feel free to reach out in the meantime if you have any questions.

Talk soon,
Etienne — TRLBLZR.run`,
  };

  const waFr = `Salut ${firstname} 👋 Merci pour ta candidature à la session ${sessionLabel} sur TRLBLZR.run ! On revient vers toi très vite avec les prochaines étapes. À très vite 🏔️`;
  const waEn = `Hey ${firstname} 👋 Thanks for applying to the ${sessionLabel} session on TRLBLZR.run! We'll get back to you very soon with next steps. Talk soon 🏔️`;

  return { fr, en, waFr, waEn };
}

export type NotificationInput = {
  fullName: string;
  firstname: string;
  email: string;
  whatsapp?: string | null;
  linkedin?: string | null;
  isAthlete: boolean;
  company?: string | null;
  itra?: string | null;
  utmb?: string | null;
  sessionLabel: string;
  preferredLang: 'FR' | 'EN';
  sportLevelLabel?: string | null;
  cityLabel?: string | null;
  country?: string | null;
  selfDescription?: string | null;
  motivation?: string | null;
  lookingFor?: string | null;
  proWebsite?: string | null;
  stravaProfile?: string | null;
  otherLink?: string | null;
  source?: string | null;
  notionUrl?: string | null;
};

export function buildNotificationEmail(input: NotificationInput): { subject: string; html: string } {
  const {
    fullName, firstname, email, whatsapp, linkedin, isAthlete, company, itra, utmb,
    sessionLabel, preferredLang, sportLevelLabel, cityLabel, country,
    selfDescription, motivation, lookingFor, proWebsite, stravaProfile, otherLink,
    source, notionUrl,
  } = input;

  const templates = buildWelcomeTemplates({ firstname, company, sessionLabel });
  const waMessage = preferredLang === 'EN' ? templates.waEn : templates.waFr;
  const waHref = waLink(whatsapp, waMessage);

  const rows: [string, string | null | undefined][] = [
    ['Catégorie', isAthlete ? 'Athlète' : 'Dirigeant'],
    ['Session ciblée', sessionLabel],
    ['Email', email],
    ['WhatsApp', whatsapp],
    ['LinkedIn', linkedin],
    ['Langue préférée', preferredLang],
    ['Société', company],
    ['ITRA', itra],
    ['UTMB', utmb],
    ['Niveau trail', sportLevelLabel],
    ['Ville', cityLabel],
    ['Pays', country],
    ['Site pro', proWebsite],
    ['Strava', stravaProfile],
    ['Autre lien', otherLink],
    ['Source', source],
  ];

  const summaryHtml = rows
    .filter(([, v]) => !!v)
    .map(
      ([label, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#888;white-space:nowrap;">${esc(label)}</td><td style="padding:4px 0;">${esc(v)}</td></tr>`,
    )
    .join('');

  const longFields = ([
    ['À propos', selfDescription],
    ['Motivation', motivation],
    ['Recherche', lookingFor],
  ] as [string, string | null | undefined][])
    .filter(([, v]) => !!v)
    .map(
      ([label, v]) => `<p style="margin:12px 0;"><strong>${esc(label)}</strong><br/>${esc(v)}</p>`,
    )
    .join('');

  const html = `
<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;color:#111;max-width:640px;margin:0 auto;">
  <h2 style="margin-bottom:4px;">Nouvelle candidature — ${esc(fullName)}</h2>
  ${notionUrl ? `<p style="color:#888;margin-top:0;"><a href="${esc(notionUrl)}">Voir dans Notion →</a></p>` : ''}

  <table style="border-collapse:collapse;font-size:14px;">${summaryHtml}</table>
  ${longFields}

  <hr style="margin:28px 0;border:none;border-top:1px solid #ddd;" />

  <h3>✉️ Email de bienvenue — copier-coller</h3>
  <p style="color:#888;font-size:13px;">Langue préférée du candidat : <strong>${preferredLang}</strong> — utilise ce template en priorité.</p>

  <div style="background:${preferredLang === 'FR' ? '#fff7ed' : '#f5f5f5'};border:1px solid #eee;padding:12px 16px;margin:12px 0;">
    <p style="margin:0 0 6px;font-size:12px;color:#888;">FR — Objet : ${esc(templates.fr.subject)}</p>
    <pre style="white-space:pre-wrap;font-family:inherit;margin:0;">${esc(templates.fr.body)}</pre>
  </div>

  <div style="background:${preferredLang === 'EN' ? '#fff7ed' : '#f5f5f5'};border:1px solid #eee;padding:12px 16px;margin:12px 0;">
    <p style="margin:0 0 6px;font-size:12px;color:#888;">EN — Subject: ${esc(templates.en.subject)}</p>
    <pre style="white-space:pre-wrap;font-family:inherit;margin:0;">${esc(templates.en.body)}</pre>
  </div>

  <h3>💬 Message WhatsApp — copier-coller</h3>
  <div style="background:#f5f5f5;border:1px solid #eee;padding:12px 16px;margin:12px 0;">
    <pre style="white-space:pre-wrap;font-family:inherit;margin:0;">${esc(waMessage)}</pre>
  </div>
  ${
    waHref
      ? `<p><a href="${esc(waHref)}" style="display:inline-block;background:#e8590c;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-size:13px;">Ouvrir WhatsApp avec ce message →</a></p>`
      : '<p style="color:#888;font-size:13px;">Pas de numéro WhatsApp exploitable — envoie le message manuellement.</p>'
  }
</div>`.trim();

  return {
    subject: `Nouvelle candidature TRLBLZR — ${fullName} · ${sessionLabel}`,
    html,
  };
}
