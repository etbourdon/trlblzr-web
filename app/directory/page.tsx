// Batch 7/8 — the "All Members" directory. Requires the viewer to have their own card validated
// AND an active membership (Batch 8) — it lists every candidate meeting the same bar. Server
// Component (no 'use client'): session is read via getSessionFromCookies (next/headers), data
// comes straight from Notion, no API round trip.

import type { Metadata } from 'next';
import FlowHeader from '@/components/FlowHeader';
import DirectoryTeaser from '@/components/DirectoryTeaser';
import MemberCard from '@/components/MemberCard';
import { getSessionFromCookies } from '@/lib/auth';
import { getCandidateById, listValidatedCandidates } from '@/lib/notion-candidates';
import { dictionary } from '@/lib/i18n';
import { resolveServerLocale } from '@/lib/locale-server';
import { deriveCardMeta, isActiveMembership } from '@/lib/card-display';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = await resolveServerLocale(lang);
  const t = dictionary[locale];
  const homeHref = locale === 'en' ? '/?lang=en' : '/';
  const refugeHref = locale === 'en' ? '/refuge?lang=en' : '/refuge';

  const session = await getSessionFromCookies();

  let body: React.ReactNode;
  if (!session) {
    body = (
      <DirectoryTeaser
        t={t.directory}
        variant="loggedOut"
        loginHref={`/login?next=${encodeURIComponent('/directory')}`}
      />
    );
  } else {
    const viewer = await getCandidateById(session.candidateId);
    if (!viewer || viewer.cardStatus !== 'validated' || !isActiveMembership(viewer)) {
      body = <DirectoryTeaser t={t.directory} variant="membershipRequired" />;
    } else {
      body = <DirectoryList title={t.directory.title} />;
    }
  }

  return (
    <div className="min-h-screen bg-trail-black text-paper-white">
      <FlowHeader homeHref={homeHref} backLabel={t.common.back} backHref={refugeHref} />
      {body}
    </div>
  );
}

async function DirectoryList({ title }: { title: string }) {
  const candidates = await listValidatedCandidates({});
  return (
    <main className="pt-32 md:pt-40 px-6 md:px-10 pb-32">
      <div className="max-w-2xl mx-auto space-y-10">
        <h1 className="font-display font-bold text-3xl uppercase tracking-tight text-paper-white">
          {title}
        </h1>
        <div className="flex flex-col gap-10 items-center">
          {candidates.map((c) => {
            const { metaLine, sportLevelNumber } = deriveCardMeta(c);
            return (
              <MemberCard
                key={c.id}
                photoUrl={c.profilePictureUrl}
                memberNo={c.memberNo}
                name={c.name || '—'}
                metaLine={metaLine}
                bio={c.cardBio}
                lookingFor={c.cardLookingFor}
                sportLevel={sportLevelNumber}
                itra={c.itra}
                linkedin={c.linkedin}
                stravaProfile={c.stravaProfile}
                proWebsite={c.proWebsite}
                whatsapp={c.whatsapp}
                weParticipationCount={c.weParticipation.length}
                responsive
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
