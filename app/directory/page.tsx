// Batch 7 — the "All Members" directory. Any logged-in candidate can view it; it lists every
// candidate with Card status = validated. Server Component (no 'use client'): session is read
// via getSessionFromCookies (next/headers), data comes straight from Notion, no API round trip.

import type { Metadata } from 'next';
import FlowHeader from '@/components/FlowHeader';
import DirectoryTeaser from '@/components/DirectoryTeaser';
import MemberCard from '@/components/MemberCard';
import { getSessionFromCookies } from '@/lib/auth';
import { listValidatedCandidates } from '@/lib/notion-candidates';
import { dictionary, resolveLocaleParam } from '@/lib/i18n';
import { deriveCardMeta } from '@/lib/card-display';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = resolveLocaleParam(lang);
  const t = dictionary[locale];
  const homeHref = locale === 'en' ? '/?lang=en' : '/';

  const session = await getSessionFromCookies();

  return (
    <div className="min-h-screen bg-trail-black text-paper-white">
      <FlowHeader homeHref={homeHref} backLabel={t.common.back} />
      {!session ? (
        <DirectoryTeaser
          t={t.directory}
          variant="loggedOut"
          loginHref={`/login?next=${encodeURIComponent('/directory')}`}
        />
      ) : (
        <DirectoryList title={t.directory.title} />
      )}
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
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
