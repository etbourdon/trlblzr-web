'use client';

import { useRef, useEffect, useState } from 'react';
import { useLocale } from '@/lib/locale-provider';
import { pastEditions, type Session } from '@/lib/content';
import type { Dict } from '@/lib/i18n';

// Mapping slug → clés i18n pour les past editions
const PAST_KEYS: Record<string, keyof Dict['past'] | undefined> = {};

export default function PastEditionsSection() {
  const { t } = useLocale();

  // Helper : récupère meta/title/body depuis le dict en fonction du number
  function getPastTexts(number: string) {
    type K = '0001' | '0002' | '0003' | '0004' | '0005';
    const num = number as K;
    const map: Record<K, { meta: string; titleLine1: string; titleLine2: string; body: string }> = {
      '0001': { meta: t.past.e0001Meta, titleLine1: t.past.e0001TitleLine1, titleLine2: t.past.e0001TitleLine2, body: t.past.e0001Body },
      '0002': { meta: t.past.e0002Meta, titleLine1: t.past.e0002TitleLine1, titleLine2: t.past.e0002TitleLine2, body: t.past.e0002Body },
      '0003': { meta: t.past.e0003Meta, titleLine1: t.past.e0003TitleLine1, titleLine2: t.past.e0003TitleLine2, body: t.past.e0003Body },
      '0004': { meta: t.past.e0004Meta, titleLine1: t.past.e0004TitleLine1, titleLine2: t.past.e0004TitleLine2, body: t.past.e0004Body },
      // 0005 = Annecy mai 2026 — pas encore traduit dans i18n.js du statique, on hard-code ici
      '0005': { meta: 'Mai 2026', titleLine1: 'Annecy', titleLine2: '— Bauges', body: '' },
    };
    return map[num] || { meta: '', titleLine1: '', titleLine2: '', body: '' };
  }

  return (
    <section className="px-6 md:px-10 py-24 md:py-32 border-t border-stone">
      <div className="max-w-7xl mx-auto mb-12">
        <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-4">
          {t.sections.pastIndex}
        </p>
        <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tight leading-none text-paper-white">
          {t.sections.pastHeading}
        </h2>
      </div>

      <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide pl-6 md:pl-10 mb-20">
        <ul className="flex gap-5 pb-4">
          {pastEditions.map((edition) => (
            <li
              key={edition.slug}
              className="snap-start flex-shrink-0 w-[80vw] sm:w-[55vw] md:w-[40vw] lg:w-[28vw]"
            >
              <EditionCard edition={edition} texts={getPastTexts(edition.number)} playHint={t.past.playHint} />
            </li>
          ))}
          <li className="flex-shrink-0 w-6 md:w-10" aria-hidden="true" />
        </ul>
      </div>

      <TestimonialsCarousel testimonialsLabel={t.past.testimonialsLabel} />
    </section>
  );
}

function EditionCard({
  edition,
  texts,
  playHint,
}: {
  edition: Session;
  texts: { meta: string; titleLine1: string; titleLine2: string; body: string };
  playHint: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(edition.videoSrc);

  const handleEnter = () => {
    const v = videoRef.current;
    if (v && hasVideo) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };
  const handleLeave = () => {
    const v = videoRef.current;
    if (v && hasVideo) v.pause();
  };

  const visualBg = edition.videoPoster;

  return (
    <article
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group relative bg-stone flex flex-col overflow-hidden h-full"
    >
      <div
        className="aspect-[4/5] relative overflow-hidden"
        style={visualBg ? { backgroundImage: `url(${visualBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        {hasVideo && (
          <video
            ref={videoRef}
            src={edition.videoSrc}
            poster={edition.videoPoster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
        {!visualBg && !hasVideo && (
          <div className="absolute inset-0 bg-gradient-to-br from-ember/10 via-transparent to-transparent" />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-stone via-transparent to-transparent" />
        {hasVideo && (
          <div className="absolute top-3 right-3 bg-trail-black/70 backdrop-blur-sm rounded-full px-3 py-1.5">
            <span className="font-mono text-[9px] tracking-[0.2em] text-paper-white">{playHint}</span>
          </div>
        )}
      </div>

      <div className="p-6 md:p-7 flex-1 flex flex-col">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-ember mb-3">
          <span>// {edition.number}</span>
          <span className="text-ash">{texts.meta}</span>
        </div>
        <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-paper-white leading-tight">
          {texts.titleLine1}
          <br />
          {texts.titleLine2}
        </h3>
        {texts.body && (
          <p className="mt-3 font-sans text-sm text-paper-white/70 leading-relaxed flex-1">{texts.body}</p>
        )}
      </div>
    </article>
  );
}

function TestimonialsCarousel({ testimonialsLabel }: { testimonialsLabel: string }) {
  const { t } = useLocale();
  const items = [
    { quote: t.testimonials.aurore, author: 'Aurore Malherbes', role: 'Co-founder Padok · CTO Fairly Made' },
    { quote: t.testimonials.jonathan, author: 'Jonathan Cohen', role: 'Founder Acasi' },
    { quote: t.testimonials.florian, author: 'Florian Marin', role: 'CTO Teads · Pitch in Motion' },
    { quote: t.testimonials.antoine, author: 'Antoine Clément', role: 'Co-founder Trail Running Lab · Ultra-Trailer' },
    { quote: t.testimonials.louis, author: 'Louis Frack', role: 'Co-founder & CEO Bioburger' },
    { quote: t.testimonials.alexandre, author: 'Alexandre Sagakian', role: 'Serial Tech Entrepreneur' },
    { quote: t.testimonials.alice, author: 'Alice Potiron', role: 'Founder Move & Win' },
    { quote: t.testimonials.jeremie, author: 'Jérémie Charlet', role: 'Founder Conscious Paths' },
    { quote: t.testimonials.sergio, author: 'Sergio Benavent', role: 'Senior Consumer Insights Lead, Logitech' },
    { quote: t.testimonials.fabrice, author: 'Fabrice Bernhard', role: 'Co-founder Théodo' },
  ];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 7000);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-4">
        {testimonialsLabel.toUpperCase()}
      </p>

      {/* Caution business — paragraphe court qui contextualise les témoignages */}
      <p className="font-sans text-base md:text-lg text-paper-white/85 leading-relaxed max-w-3xl mb-12">
        {t.testimonials.intro}
      </p>

      <div
        className="relative min-h-[280px] md:min-h-[220px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {items.map((it, i) => (
          <figure
            key={it.author}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-hidden={i !== index}
          >
            <div className="border-l-2 border-ember pl-6 max-w-3xl">
              <blockquote className="font-serif italic text-xl md:text-2xl text-paper-white leading-snug">
                « {it.quote} »
              </blockquote>
              <figcaption className="mt-5 font-mono text-[11px] tracking-[0.2em] text-ash">
                <span className="text-paper-white">{it.author.toUpperCase()}</span>
                <br />
                <span className="text-ash">{it.role}</span>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2">
        {items.map((it, i) => (
          <button
            key={it.author}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Témoignage ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'bg-ember w-8' : 'bg-ash/40 w-4 hover:bg-ash'}`}
          />
        ))}
        <span className="ml-3 font-mono text-[10px] tracking-[0.25em] text-ash">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
