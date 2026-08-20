// Batch 7/8 — individual gated card page. Any *active member* can view any single validated
// card, alumni or not (only the aggregate Alumni *list* is alumni-restricted). This is what the
// admin notification email links to per member, so a WhatsApp post's icons become actually
// clickable once someone follows the link and logs in — the flattened PNG image alone can't do
// that. First dynamic route in this app: Next 15 requires `params`/`searchParams` to be awaited.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FlowHeader from '@/components/FlowHeader';
import DirectoryTeaser from '@/components/DirectoryTeaser';
import MemberCard from '@/components/MemberCard';
import { getSessionFromCookies } from '@/lib/auth';
import { findCandidateByMemberNo, getCandidateById } from '@/lib/notion-candidates';
import { dictionary } from '@/lib/i18n';
import { resolveServerLocale } from '@/lib/locale-server';
import { deriveCardMeta, isActiveMembership } from '@/lib/card-display';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function MemberCardPage({
  params,
  searchParams,
}: {
  params: Promise<{ memberNo: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { memberNo: memberNoStr } = await params;
  const { lang } = await searchParams;
  const locale = await resolveServerLocale(lang);
  const t = dictionary[locale];
  const homeHref = locale === 'en' ? '/?lang=en' : '/';
  const refugeHref = locale === 'en' ? '/refuge?lang=en' : '/refuge';

  const session = await getSessionFromCookies();

  if (!session) {
    return (
      <div className="min-h-screen bg-trail-black text-paper-white">
        <FlowHeader homeHref={homeHref} backLabel={t.common.back} backHref={refugeHref} />
        <DirectoryTeaser
          t={t.directory}
          variant="loggedOut"
          loginHref={`/login?next=${encodeURIComponent(`/directory/${memberNoStr}`)}`}
        />
      </div>
    );
  }

  const viewer = await getCandidateById(session.candidateId);
  if (!viewer || viewer.cardStatus !== 'validated' || !isActiveMembership(viewer)) {
    return (
      <div className="min-h-screen bg-trail-black text-paper-white">
        <FlowHeader homeHref={homeHref} backLabel={t.common.back} backHref={refugeHref} />
        <DirectoryTeaser t={t.directory} variant="membershipRequired" />
      </div>
    );
  }

  const memberNo = Number(memberNoStr);
  if (!Number.isInteger(memberNo) || memberNo <= 0) notFound();

  const candidate = await findCandidateByMemberNo(memberNo);
  if (!candidate) notFound();

  const { metaLine, sportLevelNumber } = deriveCardMeta(candidate);

  return (
    <div className="min-h-screen bg-trail-black text-paper-white">
      <FlowHeader homeHref={homeHref} backLabel={t.common.back} backHref={refugeHref} />
      <main className="pt-32 md:pt-40 px-6 md:px-10 pb-32">
        <div className="max-w-2xl mx-auto flex justify-center">
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
            responsive
          />
        </div>
      </main>
    </div>
  );
}
