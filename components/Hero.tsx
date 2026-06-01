'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale-provider';

export default function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-10 pt-32 pb-10 overflow-hidden bg-trail-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/hero/hero_720p_poster.jpg"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/hero/hero_720p.mp4" type="video/mp4" />
      </video>

      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.4) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-gradient-to-b from-trail-black/30 via-transparent to-trail-black/80"
      />

      <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full relative z-10">
        <p className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] text-ember mb-6">
          {t.hero.tag} <span className="text-paper-white/70">{t.hero.label}</span>
        </p>

        <h1 className="font-display font-bold text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] tracking-tight text-paper-white">
          {t.hero.titleLine1}
          <br />
          {t.hero.titleLine2}
        </h1>

        <p className="mt-8 md:mt-10 max-w-2xl font-sans text-base md:text-lg text-ash leading-relaxed">
          {t.hero.lead}
        </p>

        <div className="mt-10 md:mt-12 flex flex-wrap items-center gap-4">
          <Link
            href="/apply"
            className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-6 py-3 rounded-full hover:bg-paper-white transition-colors"
          >
            {t.hero.ctaPrimary.toUpperCase()} ↗
          </Link>
          <Link
            href="#sessions"
            className="font-mono text-xs tracking-[0.2em] text-paper-white border border-paper-white/30 px-6 py-3 rounded-full hover:border-ember hover:text-ember transition-colors"
          >
            {t.hero.ctaSecondary.toUpperCase()}
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-end font-mono text-[10px] tracking-[0.2em] text-ash relative z-10">
        <span>{t.hero.session}</span>
        <span className="hidden md:inline">{t.hero.scroll}</span>
      </div>
    </section>
  );
}
