import Link from 'next/link';

export default function ClubSection() {
  return (
    <section id="club" className="px-6 md:px-10 py-24 md:py-32 border-t border-stone">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-4">
            03 / 03 — THE CLUB
          </p>
          <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tight leading-none text-paper-white">
            La communauté
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
              {/* Gradient bottom-up pour lisibilité texte */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-trail-black/85 via-trail-black/40 to-transparent"
              />
              {/* Touche ember discrète en haut */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-ember/15 via-transparent to-transparent mix-blend-overlay"
              />
              <div className="relative z-10">
                <span className="font-display font-bold text-7xl md:text-9xl text-paper-white leading-none">
                  250+
                </span>
                <div className="mt-2 font-mono text-[10px] tracking-[0.25em] text-paper-white/85">
                  COUREURS · ENTREPRENEURS
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 md:pl-8">
            <p className="font-serif italic text-2xl md:text-3xl text-paper-white leading-snug mb-8">
              Plus de 250 entrepreneurs et investisseurs qui courent ensemble — sans
              petits fours, sans pitchs, en vrai.
            </p>

            <ul className="space-y-4 font-sans text-base text-ash">
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-ember">→</span>
                <span>
                  <strong className="text-paper-white">Social Runs hebdomadaires</strong> à
                  Paris et Lyon, in real life.
                </span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-ember">→</span>
                <span>
                  <strong className="text-paper-white">Communauté WhatsApp + LinkedIn</strong>{' '}
                  pour partager training, expérience, news Trail × Leadership.
                </span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-ember">→</span>
                <span>
                  <strong className="text-paper-white">Accès prioritaire</strong> aux
                  sessions immersives en montagne.
                </span>
              </li>
            </ul>

            <Link
              href="#apply"
              className="mt-10 inline-block font-mono text-[11px] tracking-[0.2em] text-paper-white border border-paper-white/30 px-6 py-3 rounded-full hover:border-ember hover:text-ember transition-colors"
            >
              REJOINDRE LE CLUB ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
