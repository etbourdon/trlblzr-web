'use client';

// Mesure d'audience commune trlblzr.run + pitchinmotion.com (Google Analytics 4, une seule propriété).
// - Inactif tant que NEXT_PUBLIC_GA_ID n'est pas défini (aucun script, aucun bandeau).
// - Aucune requête vers Google avant consentement explicite (le script n'est même pas chargé).
// - Mesure uniquement sur les domaines de production (pas en local, pas sur les previews Vercel).
// - Pages vues « nettoyées » : pas de numéro de membre, pas de paramètres d'URL hors UTM/langue.
// - Le consentement est mémorisé en localStorage (pas de cookie) ; le retrait supprime les cookies _ga*.

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/lib/locale-provider';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CONSENT_KEY = 'ga-consent';
const OPEN_EVENT = 'open-cookie-settings';

// Les deux domaines partagent le même identifiant de mesure : le « linker » relie les sessions
// quand un visiteur passe de l'un à l'autre (à condition qu'il ait accepté sur les deux sites).
const SITE_DOMAINS = ['trlblzr.run', 'pitchinmotion.com'];
const SKIP_PATHS = ['/login', '/profile', '/api'];
const KEEP_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'lang'];

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    [key: string]: unknown;
  }
}

function onProductionDomain(hostname: string) {
  return SITE_DOMAINS.some((d) => hostname === d || hostname.endsWith('.' + d));
}

export function cleanPath(pathname: string) {
  // /directory/<numéro de membre> → /directory/[memberNo] (l'annuaire ne doit pas fuiter dans les stats)
  return pathname.replace(/^\/directory\/(?!alumni(?:\/|$))[^/]+/, '/directory/[memberNo]');
}

function cleanSearch(search: string) {
  const src = new URLSearchParams(search);
  const out = new URLSearchParams();
  KEEP_PARAMS.forEach((k) => {
    const v = src.get(k);
    if (v) out.set(k, v);
  });
  const s = out.toString();
  return s ? '?' + s : '';
}

function loadGoogleTag() {
  if (!GA_ID || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  } as Gtag;
  window['ga-disable-' + GA_ID] = false;
  window.gtag('js', new Date());
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('config', GA_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: 34128000, // 13 mois
    linker: { domains: SITE_DOMAINS },
  });
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
  document.head.appendChild(s);
}

function eraseGoogleCookies() {
  const host = window.location.hostname;
  const bases = [host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (name === '_ga' || name.startsWith('_ga_') || name === '_gid' || name === '_gat') {
      bases.forEach((d) => {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + d;
      });
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }
  });
}

const COPY = {
  fr: {
    text: "Nous mesurons l'audience de trlblzr.run et pitchinmotion.com avec Google Analytics pour comprendre quelles pages vous intéressent et comment vous passez d'un site à l'autre. Aucune publicité, aucun profilage.",
    accept: 'Accepter',
    refuse: 'Refuser',
    more: 'En savoir plus',
  },
  en: {
    text: 'We measure the audience of trlblzr.run and pitchinmotion.com with Google Analytics to understand which pages interest you and how you move between the two sites. No advertising, no profiling.',
    accept: 'Accept',
    refuse: 'Decline',
    more: 'Learn more',
  },
} as const;

export default function Analytics() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const [consent, setConsent] = useState<'granted' | 'denied' | null>(null);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const lastSent = useRef<string>('');

  const enabled = !!GA_ID;

  // Lecture du choix mémorisé, uniquement sur les domaines de production.
  useEffect(() => {
    if (!enabled || !onProductionDomain(window.location.hostname)) return;
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(CONSENT_KEY);
    } catch {
      /* stockage indisponible : on redemande */
    }
    if (stored === 'granted' || stored === 'denied') setConsent(stored);
    else setOpen(true);
    setReady(true);
  }, [enabled]);

  // Réouverture du bandeau depuis le pied de page / la page confidentialité.
  useEffect(() => {
    if (!enabled) return;
    const h = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, h);
    return () => window.removeEventListener(OPEN_EVENT, h);
  }, [enabled]);

  const choose = useCallback((value: 'granted' | 'denied') => {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
    setConsent(value);
    setOpen(false);
    if (value === 'denied') {
      if (GA_ID) window['ga-disable-' + GA_ID] = true;
      eraseGoogleCookies();
    }
  }, []);

  // Chargement de Google Tag + pages vues nettoyées (seulement si consentement accordé).
  useEffect(() => {
    if (!enabled || !ready || consent !== 'granted') return;
    if (SKIP_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) return;
    loadGoogleTag();
    const path = cleanPath(pathname) + cleanSearch(window.location.search);
    if (lastSent.current === path) return;
    lastSent.current = path;
    window.gtag?.('event', 'page_view', {
      page_path: path,
      page_location: window.location.origin + path,
      page_title: document.title,
    });
  }, [enabled, ready, consent, pathname]);

  // Passages explicites d'un site à l'autre (complète le « linker » quand la session n'est pas reliée).
  useEffect(() => {
    if (!enabled || consent !== 'granted') return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a') as HTMLAnchorElement | null;
      if (!a || !a.hostname || a.hostname === window.location.hostname) return;
      const target = SITE_DOMAINS.find((d) => a.hostname === d || a.hostname.endsWith('.' + d));
      if (!target) return;
      window.gtag?.('event', 'cross_site_click', {
        from_site: window.location.hostname,
        to_site: target,
        link_path: cleanPath(a.pathname),
      });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [enabled, consent]);

  if (!enabled || !open) return null;
  const c = COPY[locale] ?? COPY.fr;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookies"
      className="fixed inset-x-0 bottom-0 z-[100] flex flex-col gap-4 border-t border-stone bg-trail-black/95 px-6 py-4 backdrop-blur md:flex-row md:items-center md:justify-between md:px-10"
    >
      <p className="font-sans text-sm leading-relaxed text-ash max-w-3xl">
        {c.text}{' '}
        <a href="/privacy#cookies" className="underline hover:text-ember transition-colors">
          {c.more}
        </a>
      </p>
      <div className="flex gap-3 shrink-0">
        <button type="button" onClick={() => choose('denied')} className="px-4 py-2 font-mono text-xs tracking-[0.15em] text-paper-white border border-stone hover:border-ember transition-colors">
          {c.refuse}
        </button>
        <button type="button" onClick={() => choose('granted')} className="px-4 py-2 font-mono text-xs tracking-[0.15em] text-trail-black bg-ember hover:opacity-90 transition-opacity">
          {c.accept}
        </button>
      </div>
    </div>
  );
}

// Lien « Gérer mes cookies » (pied de page, page confidentialité). N'affiche rien si la mesure est désactivée.
export function CookieSettingsLink({ className = '' }: { className?: string }) {
  const { locale } = useLocale();
  if (!GA_ID) return null;
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
    >
      {locale === 'en' ? 'Manage cookies' : 'Gérer mes cookies'}
    </button>
  );
}
