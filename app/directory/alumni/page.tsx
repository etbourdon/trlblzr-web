// Batch 7 — the Alumni-only directory. Access itself is restricted to candidates who are
// themselves alumni (1+ WE Participation stars) — not just a content filter like the all-members
// directory. Someone logged in but not alumni gets a distinct "this area is for alumni" teaser,
// not the same "please log in" one (they're already logged in).

import type { Metadata } from 'next';
import FlowHeader from '@/components/FlowHeader';
import DirectoryTeaser from '@/components/DirectoryTeaser';
import MemberCard from '@/components/MemberCard';
import { getSessionFromCookies } from '@/lib/auth';
import { getCandidateById, listValidatedCandidates } from '@/lib/notion-candidates';
import { dictionary, resolveLocaleParam } from '@/lib/i18n';
import { deriveCardMeta, isAlumni } from '@/lib/card-display';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AlumniDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = resolveLocaleParam(lang);
  const t = dictionary[locale];
  const homeHref = locale === 'en' ? '/?lang=en' : '/';

  const session = await getSessionFromCookies();

  let body: React.ReactNode;
  if (!session) {
    body = (
      <DirectoryTeaser
        t={t.directory}
        variant="loggedOut"
        loginHref={`/login?next=${encodeURIComponent('/directory/alumni')}`}
      />
    );
  } else {
    const viewer = await getCandidateById(session.candidateId);
    if (!viewer || viewer.cardStatus !== 'validated' || !isAlumni(viewer)) {
      body = <DirectoryTeaser t={t.directory} variant="alumniOnly" />;
    } else {
      body = <AlumniList title={t.directory.title} />;
    }
  }

  return (
    <div className="min-h-screen bg-trail-black text-paper-white">
      <FlowHeader homeHref={homeHref} backLabel={t.common.back} />
      {body}
    </div>
  );
}

async function AlumniList({ title }: { title: string }) {
  const candidates = await listValidatedCandidates({ alumniOnly: true });
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
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
