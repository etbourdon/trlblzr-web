'use client';

import { useEffect, useRef } from 'react';
import { athletes } from '@/lib/content';

// Carrousel athletes — défilement auto + scroll-snap manuel, pause au hover.
// Inspiré du pattern PIM PastRunsCarousel.

export default function AthletesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  // Auto-scroll horizontal lent (~30px/seconde) avec reset à la fin
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let raf = 0;
    let lastTime = performance.now();
    const speed = 30; // pixels par seconde

    const step = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!pausedRef.current && container) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll > 0) {
          let next = container.scrollLeft + speed * dt;
          if (next >= maxScroll - 2) {
            // Reboucle après une courte pause
            next = 0;
          }
          container.scrollLeft = next;
        }
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="athletes"
      className="px-0 py-24 md:py-32 border-t border-stone"
    >
      <div className="px-6 md:px-10 max-w-7xl mx-auto mb-12">
        <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-4">
          03 / 04 — ATHLETES
        </p>
        <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tight leading-none text-paper-white">
          Les pros qui nous accompagnent
        </h2>
        <p className="mt-6 font-sans text-base md:text-lg text-ash max-w-2xl leading-relaxed">
          Des athlètes de trail running professionnels qui partagent leur expérience,
          leur méthode, et leur cadre mental sur les sentiers.
        </p>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
        className="overflow-x-auto snap-x scrollbar-hide pl-6 md:pl-10"
      >
        <ul className="flex gap-5 pb-4">
          {athletes.map((athlete, i) => (
            <li
              key={athlete.slug}
              className="snap-start flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[30vw] xl:w-[24vw]"
            >
              <article className="bg-stone border border-stone hover:border-ember transition-colors p-7 md:p-8 h-full flex flex-col">
                <p className="font-mono text-[10px] tracking-[0.3em] text-ember mb-4">
                  // {String(i + 1).padStart(2, '0')}
                </p>

                <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-paper-white leading-tight">
                  {athlete.name}
                </h3>

                {/* Index UTMB/ITRA */}
                {(athlete.utmb || athlete.itra) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {athlete.utmb && (
                      <span className="font-mono text-[10px] tracking-[0.2em] text-paper-white/80 bg-trail-black px-2.5 py-1 rounded">
                        UTMB <span className="text-ember font-bold ml-1">{athlete.utmb}</span>
                      </span>
                    )}
                    {athlete.itra && (
                      <span className="font-mono text-[10px] tracking-[0.2em] text-paper-white/80 bg-trail-black px-2.5 py-1 rounded">
                        ITRA <span className="text-ember font-bold ml-1">{athlete.itra}</span>
                      </span>
                    )}
                  </div>
                )}

                <p className="mt-5 font-sans text-sm text-ash leading-relaxed flex-1">
                  {athlete.bio}
                </p>

                {athlete.highlight && (
                  <p className="mt-3 font-sans text-sm text-paper-white/90 leading-relaxed italic">
                    {athlete.highlight}
                  </p>
                )}

                {athlete.links.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-ash/20 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] tracking-[0.2em]">
                    {athlete.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-paper-white/70 hover:text-ember transition-colors"
                      >
                        {link.label.toUpperCase()} ↗
                      </a>
                    ))}
                  </div>
                )}
              </article>
            </li>
          ))}
          <li className="flex-shrink-0 w-6 md:w-10" aria-hidden="true" />
        </ul>
      </div>

      <div className="px-6 md:px-10 max-w-7xl mx-auto mt-8">
        <p className="font-mono text-[10px] tracking-[0.25em] text-ash">
          → DÉFILEMENT AUTO · HOVER POUR PAUSER · SCROLL POUR PARCOURIR · {athletes.length} ATHLÈTES
        </p>
      </div>
    </section>
  );
}
