import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-10 pt-24 pb-10 overflow-hidden">
      {/* Topographic SVG background — subtle */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, transparent 30%, #E8501C 31%, transparent 32%), radial-gradient(circle at 30% 60%, transparent 38%, #E8501C 39%, transparent 40%), radial-gradient(circle at 40% 50%, transparent 46%, #E8501C 47%, transparent 48%)",
          backgroundSize: '600px 600px',
        }}
      />

      <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full relative z-10">
        <p className="font-mono text-[11px] tracking-[0.3em] text-ember mb-6">
          TRLBLZR // 0001 — WEEK-END · TRAIL &amp; MOVEMENT
        </p>

        <h1 className="font-display font-bold text-[14vw] md:text-[10vw] lg:text-[9rem] xl:text-[12rem] leading-[0.85] tracking-tight text-paper-white">
          ENTRE DANS
          <br />
          L&apos;<span className="text-ember">EXTRA</span>ORDINAIRE.
        </h1>

        <p className="mt-10 max-w-xl font-sans text-base md:text-lg text-ash leading-relaxed">
          Des immersions de course en montagne pour dirigeants, conduites par des
          athlètes de trail professionnels. <span className="text-paper-white">On ne pitche pas — on s&apos;aligne.</span> Le mouvement fait le reste.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link
            href="#apply"
            className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-6 py-3 rounded-full hover:bg-paper-white transition-colors"
          >
            POSTULER ↗
          </Link>
          <Link
            href="#circle"
            className="font-mono text-xs tracking-[0.2em] text-paper-white border border-paper-white/30 px-6 py-3 rounded-full hover:border-ember hover:text-ember transition-colors"
          >
            VOIR LES SESSIONS
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-end font-mono text-[10px] tracking-[0.2em] text-ash relative z-10">
        <span>SESSION // 0001 — ANNECY · 22-24 MAI 2026</span>
        <span className="hidden md:inline">↓ SCROLL</span>
      </div>
    </section>
  );
}
