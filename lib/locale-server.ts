// Batch 8 fix — Server Components (app/directory/**, app/refuge) previously resolved locale
// only from the `?lang=` query param, with no fallback. lib/locale-provider.tsx persists the
// user's choice to localStorage, which the server can never see — so navigating to one of these
// pages without an explicit `?lang=en` in the URL (e.g. the post-login redirect to /refuge)
// always fell back to French, even for an English-preferring user. Fix: also mirror the locale
// to a cookie whenever it's set client-side (see setLocale in locale-provider.tsx), and have
// Server Components check that cookie as a fallback. Kept in its own file, not lib/i18n.ts,
// because lib/i18n.ts is imported by client components (locale-provider.tsx itself) and
// next/headers cannot be bundled into client code.

import { cookies } from 'next/headers';
import { LOCALE_STORAGE_KEY, type Locale } from '@/lib/i18n';

export async function resolveServerLocale(langParam: string | undefined): Promise<Locale> {
  if (langParam === 'en' || langParam === 'fr') return langParam;
  const store = await cookies();
  const cookieValue = store.get(LOCALE_STORAGE_KEY)?.value;
  if (cookieValue === 'en' || cookieValue === 'fr') return cookieValue;
  return 'fr';
}
