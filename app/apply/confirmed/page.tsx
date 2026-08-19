// SBL-26 follow-up — landing page after a first-time email verification (from /apply). Distinct
// from /refuge (which returning logins keep going to): this is the one-time "here's what happens
// next" explanation, including the review-process steps that used to sit on the pre-verification
// screen next to a "book a discovery call" button that was clickable before any review ever
// happened — contradicted the very text next to it (the call link only comes later, if eligible).
// That CTA is dropped entirely from the automated flow here, not just moved.

import type { Metadata } from 'next';
import Link from 'next/link';
import FlowHeader from '@/components/FlowHeader';
import { getSessionFromCookies } from '@/lib/auth';
import { getCandidateById } from '@/lib/notion-candidates';
import { dictionary } from '@/lib/i18n';
import { resolveServerLocale } from '@/lib/locale-server';

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

  return (
    <div className="min-h-screen bg-trail-black text-paper-white">
      <FlowHeader homeHref={homeHref} backLabel={t.common.back} />
      <main className="pt-32 md:pt-40 px-6 md:px-10 pb-32">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-4">
            {t.confirmed.eyebrow.toUpperCase()}
          </p>
          <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-[0.95] text-paper-white uppercase">
            {t.confirmed.title} {t.confirmed.titleHighlight}
          </h1>
          <p className="mt-6 font-sans text-base md:text-lg text-ash leading-relaxed">
            {firstname ? `${firstname}, ` : ''}
            {t.confirmed.body}
          </p>

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

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/profile"
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
