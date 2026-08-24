'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale-provider';

// "Go further" — bloc final aligné sur le site statique : email + cal.com + apply
export default function Newsletter() {
  const { t } = useLocale();

  return (
    <section
      id="apply"
      className="px-6 md:px-10 py-24 md:py-32 border-t border-stone bg-trail-black"
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-8">
          {t.final.eyebrow.toUpperCase()}
        </p>
        <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-tight text-paper-white">
          {t.final.titleLine1}
          <br />
          {t.final.titleLine2Pre}
          <span className="text-ember">{t.final.titleLine2Highlight}</span>
        </h2>
        <p className="mt-6 font-sans text-base md:text-lg text-ash max-w-2xl mx-auto leading-relaxed">
          {t.final.body1}
          <br />
          {t.final.body2}
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:contact@trlblzr.run"
            className="font-mono text-xs tracking-[0.2em] text-paper-white border border-paper-white/30 px-6 py-3 rounded-full hover:border-ember hover:text-ember transition-colors"
          >
            CONTACT@TRLBLZR.RUN
          </a>
          <a
            href="https://cal.com/bourdon/discovery"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs tracking-[0.2em] text-paper-white border border-paper-white/30 px-6 py-3 rounded-full hover:border-ember hover:text-ember transition-colors"
          >
            CAL.COM/BOURDON/DISCOVERY ↗
          </a>
          <Link
            href="/apply"
            className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-6 py-3 rounded-full hover:bg-paper-white transition-colors"
          >
            {t.final.cta.toUpperCase()} ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
