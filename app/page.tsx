import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-trail-black text-paper-white">
      <div className="mb-10">
        <Image
          src="/icon.png"
          alt=""
          width={72}
          height={72}
          priority
          className="opacity-95"
        />
      </div>

      <h1 className="font-display font-bold text-6xl md:text-8xl tracking-tight leading-none">
        TRLBLZR
      </h1>

      <p className="font-mono text-[11px] md:text-xs tracking-[0.25em] text-ember mt-6">
        WEEK-END · TRAIL &amp; MOVEMENT
      </p>

      <p className="font-mono text-[10px] tracking-[0.35em] text-ash mt-20">
        COMING SOON
      </p>

      <footer className="absolute bottom-8 font-mono text-[9px] tracking-[0.3em] text-ash/60">
        TRLBLZR // 0001
      </footer>
    </main>
  );
}
