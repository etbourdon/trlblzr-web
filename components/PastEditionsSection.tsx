import { pastEditions, featuredTestimonials } from '@/lib/content';

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {pastEditions.map((edition) => (
            <article
              key={edition.slug}
              className="group relative bg-stone p-8 md:p-10 flex flex-col"
            >
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-ember mb-4">
                <span>{edition.dates}</span>
                <span className="text-ash">{edition.theme}</span>
              </div>
              <h3 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-paper-white">
                {edition.location}
              </h3>
              <p className="mt-4 font-sans text-sm md:text-base text-paper-white/70 leading-relaxed">
                {edition.intro}
              </p>
            </article>
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
