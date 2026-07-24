'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale-provider';
import { upcomingSessions } from '@/lib/content';

export default function CircleSection() {
  const { t } = useLocale();

  // Mapping slug → clés i18n. Saison automne 2026 (5 sessions chronologiques).
  const labels: Record<string, { date: string; theme: string; place: string; body: string; number: string; isTbd?: boolean }> = {
    'france-2026-09': { date: t.sessions.septDate, theme: t.sessions.septTheme, place: t.sessions.septPlace, body: t.sessions.septBody, number: '0007' },
    'france-2026-10': { date: t.sessions.octDate, theme: t.sessions.octTheme, place: t.sessions.octPlace, body: t.sessions.octBody, number: '0008' },
    'grand-canyon-2026-10': { date: t.sessions.grandCanyonDate, theme: t.sessions.grandCanyonTheme, place: t.sessions.grandCanyonPlace, body: t.sessions.grandCanyonBody, number: '0009' },
    'maroc-2026-11': { date: t.sessions.marocDate, theme: t.sessions.marocTheme, place: t.sessions.marocPlace, body: t.sessions.marocBody, number: '0010' },
    'france-2026-11': { date: t.sessions.novDate, theme: t.sessions.novTheme, place: t.sessions.novPlace, body: t.sessions.novBody, number: '0011' },
  };

  return (
    <section id="sessions" className="px-6 md:px-10 py-24 md:py-32 border-t border-stone">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-4">
              {t.sections.nextIndex}
            </p>
            <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tight leading-none text-paper-white">
              {t.sections.nextHeading}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingSessions.map((session) => {
            const labelData = labels[session.slug];
            if (!labelData) return null;
            const { date, theme, place, body, number } = labelData;

            return (
              <article
                key={session.slug}
                className="group relative border border-stone hover:border-ember transition-colors p-8 md:p-10 flex flex-col"
              >
                <div
                  className="aspect-[16/10] w-full bg-stone mb-8 relative overflow-hidden"
                  style={
                    session.imageSrc
                      ? { backgroundImage: `url(${session.imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : undefined
                  }
                >
                  {!session.imageSrc && (
                    <div className="absolute inset-0 bg-gradient-to-br from-ember/10 via-transparent to-transparent" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-trail-black/40 via-transparent to-transparent" />
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-ember mb-4">
                  <span>SESSION // {number}</span>
                </div>

                <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-paper-white">
                  {theme}
                </h3>
                <p className="mt-1 font-mono text-xs tracking-[0.15em] text-ash">{place}</p>

                <p className="mt-3 font-mono text-xs tracking-[0.15em] text-paper-white/80">{date}</p>

                <p className="mt-6 font-sans text-sm text-ash leading-relaxed flex-1">{body}</p>

                <div className="mt-8 flex items-center justify-end">
                  <Link
                    href="/apply"
                    className="font-mono text-[11px] tracking-[0.2em] text-paper-white group-hover:text-ember transition-colors"
                  >
                    {t.sessions.applyShort.toUpperCase()} ↗
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
