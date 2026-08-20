// SBL-26 follow-up — landing page after a first-time email verification (from /apply). Distinct
// from /refuge (which returning logins keep going to): this is the one-time "here's what happens
// next" explanation, including the review-process steps that used to sit on the pre-verification
// screen next to a "book a discovery call" button that was clickable before any review ever
// happened — contradicted the very text next to it (the call link only comes later, if eligible).
// That CTA is dropped entirely from the automated flow here, not just moved.

import type { Metadata } from 'next';
import Link from 'next/link';
import FlowHeader from '@/components/FlowHeader';
import OnboardingProgress from '@/components/OnboardingProgress';
import MemberCard from '@/components/MemberCard';
import { getSessionFromCookies } from '@/lib/auth';
import { getCandidateById } from '@/lib/notion-candidates';
import { dictionary, ARCHETYPE_QUESTIONNAIRE_URL } from '@/lib/i18n';
import { resolveServerLocale } from '@/lib/locale-server';
import { deriveCardMeta } from '@/lib/card-display';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ApplyConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = await resolveServerLocale(lang);
  const t = dictionary[locale];
  const homeHref = locale === 'en' ? '/?lang=en' : '/';

  const session = await getSessionFromCookies();
  const candidate = session ? await getCandidateById(session.candidateId) : null;
  const firstname = candidate?.name?.split(' ')[0] || '';
  const { metaLine, sportLevelNumber } = candidate
    ? deriveCardMeta(candidate)
    : { metaLine: '', sportLevelNumber: null };
  const cardEditHref = '/profile#member-card-edit';

  return (
    <div className="min-h-screen bg-trail-black text-paper-white">
      <FlowHeader homeHref={homeHref} backLabel={t.common.back} />
      <main className="pt-32 md:pt-40 px-6 md:px-10 pb-32">
        <div className="max-w-2xl mx-auto">
          <OnboardingProgress
            step={3}
            eyebrow={t.progress.eyebrow}
            stepWord={t.progress.stepWord}
            label={t.progress.step3Label}
          />
          <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-[0.95] text-paper-white uppercase">
            {t.confirmed.title} {t.confirmed.titleHighlight}
          </h1>
          <p className="mt-6 font-sans text-base md:text-lg text-ash leading-relaxed">
            {firstname ? `${firstname}, ` : ''}
            {t.confirmed.body}
          </p>

          {candidate && (
            // No social-link props here on purpose — this is a motivational teaser, not the
            // real card, and MemberCard renders those as <a> tags, which can't nest inside the
            // <Link> below. The full, functional card lives at /profile.
            <Link href={cardEditHref} className="mt-10 flex justify-center">
              <MemberCard
                photoUrl={candidate.profilePictureUrl}
                memberNo={candidate.memberNo}
                name={candidate.name || '—'}
                metaLine={metaLine}
                bio={candidate.cardBio}
                lookingFor={candidate.cardLookingFor}
                sportLevel={sportLevelNumber}
                itra={candidate.itra}
                responsive
              />
            </Link>
          )}

          <div className="mt-12 max-w-3xl space-y-6">
            <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-paper-white">
              {t.confirmed.suite}
            </h2>
            <ul className="space-y-4 font-sans text-base text-ash leading-relaxed">
              <li className="border-l-2 border-ember pl-4">{t.confirmed.step1}</li>
              <li className="border-l-2 border-ember pl-4">{t.confirmed.step2}</li>
              <li className="border-l-2 border-ember pl-4">{t.confirmed.step3}</li>
            </ul>
          </div>

          {/* Optional secondary CTA — reaches ~everyone who verifies their email (unlike a
              post-card-submission placement, which only the subset who finish their profile
              ever see). Deliberately not a button/primary style: this must never compete with
              or slow down "compléter ma card", the one required next action on this screen. */}
          <a
            href={ARCHETYPE_QUESTIONNAIRE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center gap-2 font-sans text-sm text-ash hover:text-ember transition-colors w-fit"
          >
            {t.confirmed.archetypeTeaser}
            <span className="text-ember">{t.confirmed.archetypeCta}</span>
          </a>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={cardEditHref}
              className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-7 py-4 rounded-full hover:bg-paper-white transition-colors"
            >
              {t.confirmed.ctaProfile.toUpperCase()}
            </Link>
            <Link
              href={homeHref}
              className="font-mono text-xs tracking-[0.2em] text-paper-white border border-paper-white/30 px-7 py-4 rounded-full hover:border-ember hover:text-ember transition-colors"
            >
              {t.confirmed.ctaHome.toUpperCase()}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
