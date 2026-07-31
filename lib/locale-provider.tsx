'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  LOCALES,
  dictionary,
  type Dict,
  type Locale,
} from './i18n';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dict;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as string[]).includes(value);
}

// Batch 8 — mirrors the locale to a cookie alongside localStorage, so Server Components
// (app/directory/**, app/refuge — see lib/locale-server.ts) can resolve the user's actual
// preference even when navigated to without an explicit `?lang=` (e.g. the post-login redirect).
function persistLocaleCookie(value: Locale) {
  document.cookie = `${LOCALE_STORAGE_KEY}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Détection au mount : URL param > localStorage > Accept-Language > default
  // L'URL param est prioritaire pour préserver la locale arrivant de PIM
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);

    let detected: Locale = DEFAULT_LOCALE;
    if (isLocale(urlLang)) {
      detected = urlLang;
      window.localStorage.setItem(LOCALE_STORAGE_KEY, urlLang);
    } else if (isLocale(stored)) {
      detected = stored;
    } else if (navigator.language?.toLowerCase().startsWith('en')) {
      detected = 'en';
    }

    persistLocaleCookie(detected);
    setLocaleState(detected);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    persistLocaleCookie(newLocale);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLocale);
    window.history.replaceState({}, '', url.toString());
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: dictionary[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error(
      'useLocale must be used inside <LocaleProvider> — wrap your layout body with it.',
    );
  }
  return ctx;
}
