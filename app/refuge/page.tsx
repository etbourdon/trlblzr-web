// Batch 8 — "Refuge", the member hub. Same word in both languages by design (a proper noun, not
// run through the translation dictionary) — the new default post-login landing page. Shows the
// member's own card (or its current state), a link to /profile (always — free service,
// independent of membership status), and links to /directory and /directory/alumni only if the
// viewer is actually eligible for them, so it never promises access it would then block.

import type { Metadata } from 'next';
import Link from 'next/link';
import FlowHeader from '@/components/FlowHeader';
import DirectoryTeaser from '@/components/DirectoryTeaser';
import MemberCard from '@/components/MemberCard';
import { getSessionFromCookies } from '@/lib/auth';
import { getCandidateById } from '@/lib/notion-candidates';
import { dictionary } from '@/lib/i18n';
import { resolveServerLocale } from '@/lib/locale-server';
import { deriveCardMeta, isActiveMembership, isAlumni } from '@/lib/card-display';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function RefugePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = await resolveServerLocale(lang);
  const t = dictionary[locale];
  const homeHref = locale === 'en' ? '/?lang=en' : '/';

  const session = await getSessionFromCookies();

  if (!session) {
    return (
      <div className="min-h-screen bg-trail-black text-paper-white">
        <FlowHeader homeHref={homeHref} backLabel={t.common.back} />
        <DirectoryTeaser
          t={t.directory}
          variant="loggedOut"
          loginHref={`/login?next=${encodeURIComponent('/refuge')}`}
          titleOverride="Refuge"
          bodyOverride={t.refuge.lead}
        />
      </div>
    );
  }

  const candidate = await getCandidateById(session.candidateId);
  const canSeeDirectory =
    !!candidate && candidate.cardStatus === 'validated' && isActiveMembership(candidate);
  const canSeeAlumniDirectory =
    !!candidate && candidate.cardStatus === 'validated' && isAlumni(candidate);

  return (
    <div className="min-h-screen bg-trail-black text-paper-white">
      <FlowHeader homeHref={homeHref} backLabel={t.common.back} />
      <main className="pt-32 md:pt-40 px-6 md:px-10 pb-32">
        <div className="max-w-2xl mx-auto space-y-10">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight text-paper-white">
              Refuge
            </h1>
            <p className="mt-4 font-sans text-base text-ash leading-relaxed">{t.refuge.lead}</p>
          </div>

          <div className="flex justify-center">
            {!candidate || (!candidate.cardBio && !candidate.cardLookingFor) ? (
              <p className="font-mono text-sm text-ash">{t.refuge.noCardYet}</p>
            ) : candidate.cardStatus === 'submitted' ? (
              <p className="font-mono text-sm text-ember">{t.card.submittedMessage}</p>
            ) : candidate.cardStatus === 'suspended' ? (
              <p className="font-mono text-sm text-ember">
                {t.card.suspendedMessage.replace('{date}', candidate.cardDeleteAfter || '—')}
              </p>
            ) : candidate.cardStatus === 'validated' ? (
              (() => {
                const { metaLine, sportLevelNumber } = deriveCardMeta(candidate);
                return (
                  <MemberCard
                    photoUrl={candidate.profilePictureUrl}
                    memberNo={candidate.memberNo}
                    name={candidate.name || '—'}
                    metaLine={metaLine}
                    bio={candidate.cardBio}
                    lookingFor={candidate.cardLookingFor}
                    sportLevel={sportLevelNumber}
                    itra={candidate.itra}
                    linkedin={candidate.linkedin}
                    stravaProfile={candidate.stravaProfile}
                    proWebsite={candidate.proWebsite}
                    whatsapp={candidate.whatsapp}
                    weParticipationCount={candidate.weParticipation.length}
                  />
                );
              })()
            ) : (
              <p className="font-mono text-sm text-ash">{t.refuge.noCardYet}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/profile"
              className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-7 py-4 rounded-full hover:bg-paper-white transition-colors"
            >
              {t.refuge.goToProfile.toUpperCase()}
            </Link>
            {canSeeDirectory && (
              <Link
                href="/directory"
                className="font-mono text-xs tracking-[0.2em] text-paper-white border border-paper-white/30 px-7 py-4 rounded-full hover:border-ember hover:text-ember transition-colors"
              >
                {t.refuge.goToDirectory.toUpperCase()}
              </Link>
            )}
            {canSeeAlumniDirectory && (
              <Link
                href="/directory/alumni"
                className="font-mono text-xs tracking-[0.2em] text-paper-white border border-paper-white/30 px-7 py-4 rounded-full hover:border-ember hover:text-ember transition-colors"
              >
                {t.refuge.goToAlumniDirectory.toUpperCase()}
              </Link>
            )}
          </div>

          {!canSeeDirectory && !canSeeAlumniDirectory && (
            <p className="text-center font-mono text-xs text-ash">
              {t.refuge.membershipRequiredNote}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
