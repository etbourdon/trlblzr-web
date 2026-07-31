// Batch 7 — shown instead of real directory content when the visitor isn't logged in, or is
// logged in but not Alumni and trying to view the Alumni-only list. No 'use client' needed:
// static markup, safe to render from a Server Component (same as components/MemberCard.tsx).

import Link from 'next/link';
import type { Dict } from '@/lib/i18n';

export default function DirectoryTeaser({
  t,
  variant,
  loginHref,
}: {
  t: Dict['directory'];
  variant: 'loggedOut' | 'alumniOnly';
  loginHref?: string;
}) {
  const copy = variant === 'alumniOnly' ? t.teaserAlumni : t.teaserLoggedOut;

  return (
    <div className="max-w-md mx-auto text-center pt-32 md:pt-40 px-6 pb-32">
      <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-paper-white uppercase">
        {t.title}
      </h1>
      <p className="mt-6 font-sans text-base text-ash leading-relaxed">{copy.body}</p>
      <div className="mt-10 flex items-center justify-center gap-6">
        {variant === 'loggedOut' ? (
          <>
            <Link
              href={loginHref || '/login'}
              className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-7 py-4 rounded-full hover:bg-paper-white transition-colors"
            >
              {t.ctaLogin.toUpperCase()}
            </Link>
            <Link
              href="/apply"
              className="font-mono text-xs text-ash hover:text-ember transition-colors"
            >
              {t.ctaApply.toUpperCase()}
            </Link>
          </>
        ) : (
          <Link
            href="/directory"
            className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-7 py-4 rounded-full hover:bg-paper-white transition-colors"
          >
            {t.ctaBackToDirectory.toUpperCase()}
          </Link>
        )}
      </div>
    </div>
  );
}
