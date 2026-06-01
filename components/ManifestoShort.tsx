'use client';

import { useLocale } from '@/lib/locale-provider';

export default function ManifestoShort() {
  const { t } = useLocale();

  return (
    <section className="px-6 md:px-10 py-32 md:py-48 border-t border-stone">
      <div className="max-w-5xl mx-auto text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-12">
          {t.manifesto.label.toUpperCase()}
        </p>
        <h2 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-paper-white">
          {t.manifesto.titleA} <span className="text-ember">&gt;</span>{' '}
          <span className="text-ash italic">{t.manifesto.titleB}</span>.
        </h2>
        <p className="mt-12 font-serif italic text-xl md:text-2xl text-paper-white/80 max-w-2xl mx-auto">
          {t.manifesto.body}
        </p>
      </div>
    </section>
  );
}
