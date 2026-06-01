'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale-provider';

export default function ClubSection() {
  const { t } = useLocale();

  return (
    <section id="club" className="px-6 md:px-10 py-24 md:py-32 border-t border-stone">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-4">
            {t.sections.clubIndex}
          </p>
          <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tight leading-none text-paper-white">
            {t.sections.clubHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5">
            <div
              className="aspect-square relative overflow-hidden flex items-end p-6"
              style={{
                backgroundImage: 'url(/videos/Annecy26-poster.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-trail-black/85 via-trail-black/40 to-transparent"
              />
              <div className="relative z-10">
                <span className="font-display font-bold text-7xl md:text-9xl text-paper-white leading-none">
                  250 +
                </span>
                <div className="mt-2 font-mono text-[10px] tracking-[0.25em] text-paper-white/85">
                  {t.club.statLabel.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 md:pl-8">
            <p className="font-serif italic text-2xl md:text-3xl text-paper-white leading-snug mb-8">
              {t.club.tagline}
            </p>

            <ul className="space-y-4 font-sans text-base text-ash">
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-ember">→</span>
                <span>{t.club.item1}</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-ember">→</span>
                <span>{t.club.item2}</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-ember">→</span>
                <span>{t.club.item3}</span>
              </li>
            </ul>

            <Link
              href="/apply"
              className="mt-10 inline-block font-mono text-[11px] tracking-[0.2em] text-paper-white border border-paper-white/30 px-6 py-3 rounded-full hover:border-ember hover:text-ember transition-colors"
            >
              {t.club.cta.toUpperCase()} ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
