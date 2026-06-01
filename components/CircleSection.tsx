import Link from 'next/link';
import { upcomingSessions } from '@/lib/content';

export default function CircleSection() {
  return (
    <section id="circle" className="px-6 md:px-10 py-24 md:py-32 border-t border-stone">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-4">
              01 / 03 — THE CIRCLE
            </p>
            <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tight leading-none text-paper-white">
              Prochaines sessions
            </h2>
          </div>
          <Link
            href="#"
            className="font-mono text-[11px] tracking-[0.2em] text-ash hover:text-ember transition-colors"
          >
            TOUTES LES EXPÉRIENCES →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingSessions.map((session) => {
            const isTba = session.status === 'tba';

            return (
              <article
                key={session.slug}
                className={`group relative border transition-colors p-8 md:p-10 flex flex-col ${
                  isTba
                    ? 'border-dashed border-ash/40 hover:border-ember'
                    : 'border-stone hover:border-ember'
                }`}
              >
                {/* Visuel : photo si imageSrc, gradient si TBA, sinon ember discret */}
                <div
                  className="aspect-[16/10] w-full bg-stone mb-8 relative overflow-hidden"
                  style={
                    session.imageSrc
                      ? {
                          backgroundImage: `url(${session.imageSrc})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : undefined
                  }
                >
                  {!session.imageSrc && (
                    <div className="absolute inset-0 bg-gradient-to-br from-ember/10 via-transparent to-transparent" />
                  )}
                  {isTba && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-mono text-[10px] tracking-[0.3em] text-ash">
                        COMING UP
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-trail-black/40 via-transparent to-transparent" />
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-ember mb-4">
                  <span>SESSION // {session.number}</span>
                  {isTba ? (
                    <span className="text-ash">SOON</span>
                  ) : (
                    <span>
                      {session.spotsLeft}/{session.spotsTotal} PLACES
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-paper-white">
                  {session.location}
                </h3>

                <div className="mt-3 flex items-center gap-3 font-mono text-xs tracking-[0.15em] text-paper-white/80 flex-wrap">
                  <span>{session.dates}</span>
                  <span className="text-ash">·</span>
                  <span className={isTba ? 'text-ash italic' : 'text-ember'}>
                    {session.theme}
                  </span>
                </div>

                <p className="mt-6 font-sans text-sm text-ash leading-relaxed flex-1">
                  {session.intro}
                </p>

                <div className="mt-8 flex items-center justify-between">
                  {!isTba && session.athlete && (
                    <span className="font-mono text-[10px] tracking-[0.25em] text-ash">
                      w/ {session.athlete}
                    </span>
                  )}
                  {isTba && (
                    <span className="font-mono text-[10px] tracking-[0.25em] text-ash">
                      STAY INFORMED
                    </span>
                  )}
                  <Link
                    href="#apply"
                    className="font-mono text-[11px] tracking-[0.2em] text-paper-white group-hover:text-ember transition-colors"
                  >
                    {isTba ? 'M’ALERTER ↗' : 'POSTULER ↗'}
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
