'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale-provider';
import { upcomingSessions } from '@/lib/content';

export default function CircleSection() {
  const { t } = useLocale();

  // Mapping slug → clés i18n
  const labels: Record<string, { date: string; theme: string; place: string; body: string; number: string; isTbd?: boolean }> = {
    'annecy-2026-05': { date: t.sessions.annecyDate, theme: t.sessions.annecyTheme, place: t.sessions.annecyPlace, body: t.sessions.annecyBody, number: '0005' },
    'vercors-2026-07': { date: t.sessions.vercorsDate, theme: t.sessions.vercorsTheme, place: t.sessions.vercorsPlace, body: t.sessions.vercorsBody, number: '0006' },
    'tba-2026-s2': { date: t.sessions.tbdDate, theme: t.sessions.tbdTheme, place: t.sessions.tbdPlace, body: t.sessions.tbdBody, number: '0007', isTbd: true },
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
            const { date, theme, place, body, number, isTbd } = labelData;

            return (
              <article
                key={session.slug}
                className={`group relative border transition-colors p-8 md:p-10 flex flex-col ${
                  isTbd ? 'border-dashed border-ash/40 hover:border-ember' : 'border-stone hover:border-ember'
                }`}
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
                  {isTbd && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-mono text-[10px] tracking-[0.3em] text-ember">
                        {t.sessions.tbdTag.toUpperCase()}
                      </span>
                      <span className="mt-2 font-mono text-[9px] tracking-[0.2em] text-ash">
                        {t.sessions.tbdSub}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-trail-black/40 via-transparent to-transparent" />
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-ember mb-4">
                  <span>SESSION // {number}</span>
                  {isTbd && <span className="text-ash">{t.sessions.tbdLabel.toUpperCase()}</span>}
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
                    {isTbd ? `${t.sessions.tbdCta.toUpperCase()} →` : `${t.sessions.applyShort.toUpperCase()} ↗`}
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
