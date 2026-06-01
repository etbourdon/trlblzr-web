'use client';

import { useLocale } from '@/lib/locale-provider';

// Style inline minimal, identique à PIM pour cohérence cross-brand.
// Sur fond sombre TRLBLZR : default text-ash, active text-paper-white.

export default function LangSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <span
      className="hidden md:inline font-mono text-[10px] tracking-[0.2em] text-ash"
      role="group"
      aria-label="Sélecteur de langue / Language switcher"
    >
      <button
        type="button"
        onClick={() => setLocale('fr')}
        aria-pressed={locale === 'fr'}
        className={`transition-colors ${
          locale === 'fr' ? 'text-paper-white' : 'hover:text-paper-white'
        }`}
      >
        FR
      </button>
      {' · '}
      <button
        type="button"
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        className={`transition-colors ${
          locale === 'en' ? 'text-paper-white' : 'hover:text-paper-white'
        }`}
      >
        EN
      </button>
    </span>
  );
}
