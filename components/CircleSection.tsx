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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingSessions.map((session) => (
            <article
              key={session.slug}
              className="group relative border border-stone hover:border-ember transition-colors p-8 md:p-10 flex flex-col"
            >
              {/* Visual placeholder — to be replaced by hero loop */}
              <div className="aspect-[16/10] w-full bg-stone mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-ember/10 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.25em] text-paper-white/60">
                  VIDEO PLACEHOLDER
                </div>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-ember mb-4">
                <span>SESSION // {session.number}</span>
                <span>{session.spotsLeft}/{session.spotsTotal} PLACES</span>
              </div>

              <h3 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-paper-white">
                {session.location}
              </h3>

              <div className="mt-3 flex items-center gap-3 font-mono text-xs tracking-[0.15em] text-paper-white/80">
                <span>{session.dates}</span>
                <span className="text-ash">·</span>
                <span className="text-ember">{session.theme}</span>
              </div>

              <p className="mt-6 font-sans text-sm md:text-base text-ash leading-relaxed flex-1">
                {session.intro}
              </p>

              <div className="mt-8 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.25em] text-ash">
                  w/ {session.athlete}
                </span>
                <Link
                  href="#apply"
                  className="font-mono text-[11px] tracking-[0.2em] text-paper-white group-hover:text-ember transition-colors"
                >
                  POSTULER ↗
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
