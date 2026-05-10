import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3 group">
        <Image
          src="/icon.png"
          alt=""
          width={28}
          height={28}
          className="transition-transform group-hover:scale-110"
        />
        <span className="font-display font-bold text-base tracking-tight text-paper-white">
          TRLBLZR
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] tracking-[0.2em] text-paper-white">
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
          className="font-mono text-[11px] tracking-[0.2em] bg-ember text-trail-black px-4 py-2 rounded-full hover:bg-paper-white transition-colors"
        >
          APPLY ↗
        </Link>
      </div>
    </header>
  );
}
