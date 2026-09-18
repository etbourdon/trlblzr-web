'use client';

import Link from 'next/link';
import Image from 'next/image';
import LangSwitcher from './LangSwitcher';
import { useLocale } from '@/lib/locale-provider';

export default function Header() {
  const { t } = useLocale();

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
            <span className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight text-paper-white">
              TRLBLZR
            </span>
            <span className="font-display font-bold text-lg sm:text-xl md:text-2xl tracking-tight text-ember">
              .run
            </span>
          </div>
          <span className="font-display font-semibold text-[8px] md:text-[10px] tracking-[0.25em] text-ember mt-1.5">
            {t.header.sublogo}
          </span>
        </div>
      </Link>

      <nav className="hidden lg:flex items-center gap-8 font-mono text-[11px] tracking-[0.2em] text-paper-white">
        <Link href="#sessions" className="hover:text-ember transition-colors">
          {t.nav.sessions.toUpperCase()}
        </Link>
        <Link href="#athletes" className="hover:text-ember transition-colors">
          {t.nav.athletes.toUpperCase()}
        </Link>
        <Link href="#club" className="hover:text-ember transition-colors">
          {t.nav.club.toUpperCase()}
        </Link>
      </nav>

      <div className="flex items-center gap-3 sm:gap-4">
        <LangSwitcher />
        <Link
          href="/login"
          aria-label={t.nav.memberLogin}
          className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.2em] text-paper-white hover:text-ember transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <span className="hidden sm:inline">{t.nav.memberLogin.toUpperCase()}</span>
        </Link>
        <Link
          href="/apply"
          className="font-mono text-[11px] tracking-[0.2em] whitespace-nowrap bg-ember text-trail-black px-4 py-2 rounded-full hover:bg-paper-white transition-colors"
        >
          {t.common.apply.toUpperCase()} ↗
        </Link>
      </div>
    </header>
  );
}
