import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between bg-gradient-to-b from-trail-black/80 via-trail-black/40 to-transparent backdrop-blur-[2px]">
      <Link href="/" className="flex items-center gap-3 group">
        <Image
          src="/icon.png"
          alt="TRLBLZR"
          width={56}
          height={56}
          priority
          className="transition-transform group-hover:scale-105 w-12 h-12 md:w-14 md:h-14"
        />
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-0">
            <span className="font-display font-bold text-3xl md:text-4xl tracking-tight text-paper-white">
              TRLBLZR
            </span>
            <span className="font-display font-bold text-xl md:text-2xl tracking-tight text-ember">
              .run
            </span>
          </div>
          <span className="font-display font-semibold text-[8px] md:text-[10px] tracking-[0.25em] text-ash mt-1.5">
            TRAIL RUNNING BUSINESS CLUB
          </span>
        </div>
      </Link>

      <nav className="hidden lg:flex items-center gap-8 font-mono text-[11px] tracking-[0.2em] text-paper-white">
        <Link href="#circle" className="hover:text-ember transition-colors">
          EXPERIENCES
        </Link>
        <Link href="#club" className="hover:text-ember transition-colors">
          THE CLUB
        </Link>
        <Link href="#philosophy" className="hover:text-ember transition-colors">
          PHILOSOPHY
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <span
          className="hidden md:inline font-mono text-[10px] tracking-[0.2em] text-ash"
          aria-label="Langue"
        >
          <span className="text-paper-white">FR</span> · EN
        </span>
        <Link
          href="#apply"
          className="font-mono text-[11px] tracking-[0.2em] bg-ember text-trail-black px-5 py-2.5 rounded-full hover:bg-paper-white transition-colors"
        >
          APPLY ↗
        </Link>
      </div>
    </header>
  );
}
