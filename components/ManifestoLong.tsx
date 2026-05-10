import Link from 'next/link';
import { manifestoLong } from '@/lib/content';

export default function ManifestoLong() {
  const paragraphs = manifestoLong.split('\n\n');

  return (
    <section
      id="philosophy"
      className="px-6 md:px-10 py-32 md:py-48 border-t border-stone"
    >
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-12 text-center">
          PHILOSOPHY
        </p>

        <div className="font-serif text-xl md:text-2xl text-paper-white leading-relaxed space-y-8">
          {paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? 'text-2xl md:text-3xl' : ''}>
              {p}
            </p>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="#"
            className="font-mono text-[11px] tracking-[0.2em] text-ash hover:text-ember transition-colors"
          >
            LIRE LE MANIFESTE COMPLET →
          </Link>
        </div>
      </div>
    </section>
  );
}
