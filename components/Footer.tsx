'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale-provider';
import { pimUrl } from '@/lib/i18n';

export default function Footer() {
  const { t, locale } = useLocale();

  return (
    <footer className="px-6 md:px-10 py-12 border-t border-stone">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        <div className="col-span-2">
          <p className="font-display font-bold text-2xl tracking-tight text-paper-white">
            TRLBLZR<span className="text-ember">.run</span>
          </p>
          <p className="mt-3 font-sans text-sm text-ash max-w-md leading-relaxed">
            {t.footer.descr}
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-ember mb-4">
            {t.footer.explore.toUpperCase()}
          </p>
          <ul className="space-y-2 font-sans text-sm text-ash">
            <li>
              <Link href="#sessions" className="hover:text-ember transition-colors">
                {t.nav.sessions}
              </Link>
            </li>
            <li>
              <Link href="#athletes" className="hover:text-ember transition-colors">
                {t.nav.athletes}
              </Link>
            </li>
            <li>
              <Link href="#club" className="hover:text-ember transition-colors">
                {t.nav.club}
              </Link>
            </li>
            <li>
              <Link href="/apply" className="hover:text-ember transition-colors">
                {t.common.apply} ↗
              </Link>
            </li>
            <li className="pt-2 mt-2 border-t border-stone/60">
              <Link href="/login" className="hover:text-ember transition-colors">
                {t.footer.memberLogin}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-ember mb-4">
            {t.footer.follow.toUpperCase()}
          </p>
          <ul className="space-y-2 font-sans text-sm text-ash">
            <li>
              <a
                href="https://www.instagram.com/pitch_in_motion_"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ember transition-colors"
              >
                Instagram ↗
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/pitch-in-motion/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ember transition-colors"
              >
                LinkedIn ↗
              </a>
            </li>
            <li>
              <a href="mailto:contact@trlblzr.run" className="hover:text-ember transition-colors">
                Email
              </a>
            </li>
            <li className="pt-2 mt-2 border-t border-stone/60">
              <a
                href={pimUrl('', locale, {
                  source: 'trlblzr',
                  medium: 'footer',
                  campaign: 'sister_brand',
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ember transition-colors"
              >
                {t.footer.sisterBrand} ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-stone flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[10px] tracking-[0.25em] text-ash">
        <span>{t.footer.copyright}</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-ember transition-colors">
            Confidentialité
          </Link>
          <Link href="/mentions-legales" className="hover:text-ember transition-colors">
            Mentions légales
          </Link>
        </div>
        <span className="text-paper-white">{t.footer.tagline}</span>
      </div>
    </footer>
  );
}
