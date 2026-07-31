'use client';

// Minimal fixed header shared by "flow" pages (/apply, /login, /profile) — logo, lang switcher,
// back-to-home link. Distinct from the full marketing Header.tsx used on the homepage.

import Link from 'next/link';
import Image from 'next/image';
import LangSwitcher from '@/components/LangSwitcher';

export default function FlowHeader({
  homeHref,
  backLabel,
  backHref,
}: {
  homeHref: string;
  backLabel: string;
  // Batch 8 — logo always goes to the marketing homepage (brand consistency); the "back" text
  // link can point elsewhere (e.g. /refuge from a member-area page) when provided.
  backHref?: string;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between bg-trail-black/85 backdrop-blur-[2px] border-b border-stone">
      <Link href={homeHref} className="flex items-center gap-3 group">
        <Image
          src="/icon.png"
          alt="TRLBLZR"
          width={44}
          height={44}
          className="w-9 h-9 transition-transform group-hover:scale-105"
        />
        <span className="font-display font-bold text-base md:text-lg tracking-tight text-paper-white">
          TRLBLZR
          <span className="text-ember">.run</span>
        </span>
      </Link>
      <div className="flex items-center gap-5">
        <LangSwitcher />
        <Link
          href={backHref || homeHref}
          className="font-mono text-[10px] md:text-[11px] tracking-[0.2em] text-paper-white/70 hover:text-ember transition-colors"
        >
          {backLabel.toUpperCase()}
        </Link>
      </div>
    </header>
  );
}
