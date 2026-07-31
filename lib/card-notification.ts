// Batch 5.3 follow-up — admin email notification when a member submits their card for review.
// Mirrors the Batch 4 apply-notification pattern (lib/apply-notification.ts): sent best-effort
// from /api/profile/card/validate, never blocks the member-facing response if it fails. Without
// this, nothing prompts Etienne to check the "Cards — Pending review" Notion view.

function esc(s: string | null | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type CardSubmittedInput = {
  fullName: string;
  memberNo: number | null;
  bio: string;
  lookingFor: string;
  cardImageUrl?: string | null;
  notionUrl: string;
};

export function buildCardSubmittedEmail(input: CardSubmittedInput): { subject: string; html: string } {
  const { fullName, memberNo, bio, lookingFor, cardImageUrl, notionUrl } = input;
  const memberLabel = memberNo != null ? `#${String(memberNo).padStart(4, '0')}` : '(nouveau)';

  const html = `
<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;color:#111;max-width:640px;margin:0 auto;">
  <h2 style="margin-bottom:4px;">Card à valider — ${esc(fullName)} ${esc(memberLabel)}</h2>
  <p style="color:#888;margin-top:0;"><a href="${esc(notionUrl)}">Ouvrir la fiche dans Notion →</a></p>

  <p style="margin:12px 0;"><strong>Bio</strong><br/>${esc(bio)}</p>
  <p style="margin:12px 0;"><strong>Looking for</strong><br/>${esc(lookingFor)}</p>

  ${
    cardImageUrl
      ? `<p style="margin:20px 0;"><a href="${esc(cardImageUrl)}" style="display:inline-block;background:#e8590c;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-size:13px;">Voir / télécharger l'image de la card →</a></p>`
      : "<p style=\"color:#888;font-size:13px;\">Pas d'image de card générée.</p>"
  }

  <hr style="margin:28px 0;border:none;border-top:1px solid #ddd;" />
  <p style="color:#888;font-size:13px;">Pour approuver : ouvre la fiche dans Notion et passe "Card status" à <strong>validated</strong>, puis poste l'image ci-dessus sur WhatsApp.</p>
</div>`.trim();

  return {
    subject: `Card à valider — ${fullName}${memberNo != null ? ` (${memberLabel})` : ''}`,
    html,
  };
}
