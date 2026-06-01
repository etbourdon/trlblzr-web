'use client';

import { useRef, useEffect, useState } from 'react';
import { pastEditions, featuredTestimonials, type Session } from '@/lib/content';

export default function PastEditionsSection() {
  return (
    <section className="px-6 md:px-10 py-24 md:py-32 border-t border-stone">
      <div className="max-w-7xl mx-auto mb-12">
        <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-4">
          02 / 03 — PAST EDITIONS
        </p>
        <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tight leading-none text-paper-white">
          Ce qu&apos;ils en disent
        </h2>
      </div>

      {/* Carrousel horizontal des éditions passées — scroll-snap natif */}
      <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide pl-6 md:pl-10 mb-20">
        <ul className="flex gap-5 pb-4">
          {pastEditions.map((edition) => (
            <li
              key={edition.slug}
              className="snap-start flex-shrink-0 w-[80vw] sm:w-[55vw] md:w-[40vw] lg:w-[28vw]"
            >
              <EditionCard edition={edition} />
            </li>
          ))}
          <li className="flex-shrink-0 w-6 md:w-10" aria-hidden="true" />
        </ul>
      </div>

      <div className="max-w-7xl mx-auto px-0 mb-16">
        <p className="font-mono text-[10px] tracking-[0.25em] text-ash">
          → SCROLL POUR PARCOURIR · {pastEditions.length} ÉDITIONS · ▶ HOVER SUR LES VIDÉOS
        </p>
      </div>

      {/* Témoignages — carrousel auto-scroll */}
      <TestimonialsCarousel />
    </section>
  );
}

function EditionCard({ edition }: { edition: Session }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(edition.videoSrc);
  const hasImage = Boolean(edition.imageSrc || edition.videoPoster);

  const handleEnter = () => {
    const v = videoRef.current;
    if (v && hasVideo) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    const v = videoRef.current;
    if (v && hasVideo) {
      v.pause();
    }
  };

  const visualBg = edition.videoPoster || edition.imageSrc;

  return (
    <article
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group relative bg-stone flex flex-col overflow-hidden h-full"
    >
      <div
        className="aspect-[4/5] relative overflow-hidden"
        style={
          visualBg
            ? {
                backgroundImage: `url(${visualBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
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
        {!hasImage && !hasVideo && (
          <div className="absolute inset-0 bg-gradient-to-br from-ember/10 via-transparent to-transparent" />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-stone via-transparent to-transparent"
        />
        {hasVideo && (
          <div className="absolute top-3 right-3 bg-trail-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 1L9 5L2 9V1Z" fill="#E8501C" />
            </svg>
            <span className="font-mono text-[9px] tracking-[0.2em] text-paper-white">
              FILM
            </span>
          </div>
        )}
      </div>

      <div className="p-6 md:p-7 flex-1 flex flex-col">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-ember mb-3">
          <span>{edition.dates}</span>
          <span className="text-ash">{edition.theme}</span>
        </div>
        <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-paper-white">
          {edition.location}
        </h3>
        <p className="mt-3 font-sans text-sm text-paper-white/70 leading-relaxed flex-1">
          {edition.intro}
        </p>
      </div>
    </article>
  );
}

function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = featuredTestimonials.length;

  // Auto-scroll toutes les 6 secondes
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused, total]);

  return (
    <div className="max-w-7xl mx-auto px-0">
      <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-8">
        TESTIMONIALS
      </p>

      <div
        className="relative min-h-[200px] md:min-h-[160px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {featuredTestimonials.map((t, i) => (
          <figure
            key={t.author}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={i !== index}
          >
            <div className="border-l-2 border-ember pl-6 max-w-3xl">
              <blockquote className="font-serif italic text-xl md:text-2xl text-paper-white leading-snug">
                « {t.quote} »
              </blockquote>
              <figcaption className="mt-5 font-mono text-[11px] tracking-[0.2em] text-ash">
                <span className="text-paper-white">{t.author.toUpperCase()}</span>
                <br />
                <span className="text-ash">{t.role}</span>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="mt-6 flex items-center gap-2" role="tablist" aria-label="Témoignages">
        {featuredTestimonials.map((t, i) => (
          <button
            key={t.author}
            type="button"
            onClick={() => setIndex(i)}
            aria-selected={i === index}
            aria-label={`Témoignage ${i + 1} sur ${total} — ${t.author}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'bg-ember w-8' : 'bg-ash/40 w-4 hover:bg-ash'
            }`}
          />
        ))}
        <span className="ml-3 font-mono text-[10px] tracking-[0.25em] text-ash">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
