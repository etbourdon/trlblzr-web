'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@/lib/locale-provider';
import FlowHeader from '@/components/FlowHeader';
import { Field, Input } from '@/components/FormFields';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { t, locale } = useLocale();
  const searchParams = useSearchParams();
  const expired = searchParams.get('error') === 'expired';

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const homeHref = locale === 'en' ? '/?lang=en' : '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/auth/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
    } finally {
      // Toujours "envoyé" côté UI, même en cas d'erreur réseau — on ne révèle jamais
      // si l'email correspond à une candidature (cf /api/auth/request-link).
      setSubmitting(false);
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-trail-black text-paper-white">
      <FlowHeader homeHref={homeHref} backLabel={t.common.back} />

      <main className="pt-32 md:pt-40 px-6 md:px-10 pb-32">
        <div className="max-w-md mx-auto">
          {sent ? (
            <>
              <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-paper-white uppercase">
                {t.login.checkTitle}
              </h1>
              <p className="mt-6 font-sans text-base text-ash leading-relaxed">
                {t.login.checkBody}
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-paper-white uppercase">
                {t.login.title}
              </h1>
              <p className="mt-6 font-sans text-base text-ash leading-relaxed">{t.login.lead}</p>

              {expired && (
                <p className="mt-6 font-mono text-xs text-ember border border-ember/50 px-4 py-3 rounded">
                  {t.login.errorExpired}
                </p>
              )}

              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                <Field label={t.login.emailLabel} required>
                  <Input
                    type="email"
                    value={email}
                    onChange={setEmail}
                    required
                    placeholder="you@example.com"
                  />
                </Field>
                <button
                  type="submit"
                  disabled={submitting || !email}
                  className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-7 py-4 rounded-full hover:bg-paper-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? t.login.submitting.toUpperCase() : `${t.login.submit.toUpperCase()} ↗`}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
