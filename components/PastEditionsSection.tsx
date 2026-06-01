'use client';

import { useRef } from 'react';
import { pastEditions, featuredTestimonials, type Session } from '@/lib/content';

export default function PastEditionsSection() {
  return (
    <section className="px-6 md:px-10 py-24 md:py-32 border-t border-stone">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-4">
            02 / 03 — PAST EDITIONS
          </p>
          <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tight leading-none text-paper-white">
            Ce qu&apos;ils en disent
          </h2>
        </div>

        {/* Editions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {pastEditions.map((edition) => (
            <EditionCard key={edition.slug} edition={edition} />
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
          {featuredTestimonials.slice(0, 4).map((t) => (
            <figure key={t.author} className="border-l-2 border-ember pl-6">
              <blockquote className="font-serif italic text-xl md:text-2xl text-paper-white leading-snug">
                « {t.quote} »
              </blockquote>
              <figcaption className="mt-6 font-mono text-[11px] tracking-[0.2em] text-ash">
                <span className="text-paper-white">{t.author.toUpperCase()}</span>
                <br />
                <span className="text-ash">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditionCard({ edition }: { edition: Session }) {
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
    if (v && hasVideo) {
      v.pause();
    }
  };

  return (
    <article
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group relative bg-stone flex flex-col overflow-hidden"
    >
      {hasVideo && (
        <div
          className="aspect-[16/10] relative overflow-hidden"
          style={{
            backgroundImage: edition.videoPoster
              ? `url(${edition.videoPoster})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
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
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-stone via-transparent to-transparent"
          />
          <div className="absolute top-3 right-3 bg-trail-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path d="M2 1L9 5L2 9V1Z" fill="#E8501C" />
            </svg>
            <span className="font-mono text-[9px] tracking-[0.2em] text-paper-white">
              FILM
            </span>
          </div>
        </div>
      )}

      <div className="p-8 md:p-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-ember mb-4">
          <span>{edition.dates}</span>
          <span className="text-ash">{edition.theme}</span>
        </div>
        <h3 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-paper-white">
          {edition.location}
        </h3>
        <p className="mt-4 font-sans text-sm md:text-base text-paper-white/70 leading-relaxed flex-1">
          {edition.intro}
        </p>
      </div>
    </article>
  );
}
