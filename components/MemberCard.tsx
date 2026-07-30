// Batch 5.2 — the Member Card visual template, approved 2026-07-30. Every member's card uses
// this exact layout; only the data varies. Claude only generates `bio` and `lookingFor` — every
// other field here is a direct passthrough of already-structured profile data.

function waLink(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, '');
  return digits ? `https://wa.me/${digits}` : null;
}

// Small inline icons — no icon-library dependency for just four glyphs.
function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M6.94 5a2 2 0 11-4-.002 2 2 0 014 .002zM7 8.48H3V21h4V8.48zM13.32 8.48H9.34V21h3.94v-6.57c0-1.45.28-2.86 2.08-2.86 1.78 0 1.8 1.66 1.8 2.95V21H21v-7.93c0-3.45-.74-6.1-4.77-6.1-1.94 0-3.24 1.06-3.77 2.07h-.05V8.48z" />
    </svg>
  );
}
function IconTrail() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 18l5-8 4 5 2-3 7 6H3z" />
    </svg>
  );
}
function IconWorld() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6-4-9s1.5-6.3 4-9z" />
    </svg>
  );
}
function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 00-8.6 15.06L2 22l5.06-1.36A10 10 0 1012 2zm5.62 14.06c-.24.68-1.18 1.24-1.94 1.4-.52.11-1.2.2-3.48-.74-2.92-1.2-4.8-4.16-4.94-4.36-.14-.2-1.18-1.56-1.18-2.98s.74-2.12 1-2.4c.26-.28.56-.36.76-.36h.54c.18 0 .42-.02.64.5.24.56.8 1.94.86 2.08.06.14.1.3.02.48-.08.18-.12.3-.24.46-.12.16-.26.36-.38.48-.12.12-.26.26-.12.5.14.24.62 1.02 1.34 1.66.92.82 1.7 1.08 1.94 1.2.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.18 1.26z" />
    </svg>
  );
}

export default function MemberCard({
  photoUrl,
  memberNo,
  name,
  metaLine,
  bio,
  lookingFor,
  sportLevel,
  itra,
  linkedin,
  stravaProfile,
  proWebsite,
  whatsapp,
}: {
  photoUrl?: string | null;
  memberNo?: number | null;
  name: string;
  metaLine?: string | null;
  bio?: string | null;
  lookingFor?: string | null;
  sportLevel?: number | null;
  itra?: string | null;
  linkedin?: string | null;
  stravaProfile?: string | null;
  proWebsite?: string | null;
  whatsapp?: string | null;
}) {
  const wa = waLink(whatsapp);
  const hasLinks = linkedin || stravaProfile || proWebsite || wa;

  return (
    <div className="w-full max-w-[380px] bg-trail-black border border-stone rounded-2xl overflow-hidden">
      <div className="relative w-full aspect-[4/5] bg-stone flex items-center justify-center">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.05]"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-stone" />
        )}
        <div className="absolute top-[18px] left-5 font-display font-extrabold text-[15px] tracking-tight text-paper-white">
          TRLBLZR<span className="text-ember">.run</span>
        </div>
        {memberNo != null && (
          <div className="absolute bottom-4 right-5 font-mono text-[10px] tracking-[0.15em] text-paper-white">
            MEMBER // {String(memberNo).padStart(4, '0')}
          </div>
        )}
      </div>

      <div className="px-7 pt-8 pb-7">
        <div className="font-display font-extrabold text-[28px] leading-[1.1] text-paper-white">
          {name}
        </div>
        {metaLine && (
          <div className="font-mono text-xs tracking-[0.08em] text-dust mt-2 uppercase">
            {metaLine}
          </div>
        )}

        <div className="h-px bg-stone my-6" />

        {bio && <p className="text-sm leading-[1.75] text-paper-white mb-5">{bio}</p>}

        {lookingFor && (
          <div className="mb-5">
            <div className="font-mono text-[10px] tracking-[0.15em] text-ember mb-2">
              LOOKING FOR
            </div>
            <div className="text-sm leading-[1.6] text-paper-white">{lookingFor}</div>
          </div>
        )}

        {sportLevel != null && sportLevel > 0 && (
          <div className="mb-3.5">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-mono text-[10px] tracking-[0.15em] text-ember">
                TRAIL LEVEL
              </span>
              <span className="font-mono text-[11px] text-dust">{sportLevel}/5</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={`flex-1 h-[5px] rounded-sm ${n <= sportLevel ? 'bg-ember' : 'bg-stone'}`}
                />
              ))}
            </div>
          </div>
        )}

        {itra && (
          <div className="flex justify-between text-sm mb-6">
            <span className="font-mono text-[10px] tracking-[0.15em] text-ember">ITRA INDEX</span>
            <span className="text-paper-white">{itra}</span>
          </div>
        )}

        {hasLinks && (
          <>
            <div className="h-px bg-stone mb-5" />
            <div className="flex justify-between items-center">
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-ember"
                >
                  <IconLinkedIn />
                </a>
              )}
              {stravaProfile && (
                <a
                  href={stravaProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Strava"
                  className="text-ember"
                >
                  <IconTrail />
                </a>
              )}
              {proWebsite && (
                <a
                  href={proWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Website"
                  className="text-ember"
                >
                  <IconWorld />
                </a>
              )}
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="text-ember"
                >
                  <IconWhatsApp />
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
