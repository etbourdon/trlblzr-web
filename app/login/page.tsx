'use client';

import { Suspense, useEffect, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from '@/lib/locale-provider';
import FlowHeader from '@/components/FlowHeader';
import { Field, Input } from '@/components/FormFields';

const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const expired = searchParams.get('error') === 'expired';

  // Batch 6 — OTP is the default path; an expired-link redirect is link-flow-specific, so land
  // straight on the link tab in that case rather than showing an unrelated error under OTP.
  const [mode, setMode] = useState<'otp' | 'link'>(expired ? 'link' : 'otp');

  // Magic-link state — unchanged from Batch 5.1.
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  // Batch 6 — OTP state.
  const [otpStep, setOtpStep] = useState<'email' | 'code'>('email');
  const [otpEmail, setOtpEmail] = useState('');
  const [code, setCode] = useState('');
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [failedTries, setFailedTries] = useState(0);
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [resendRemaining, setResendRemaining] = useState(0);

  useEffect(() => {
    if (!sentAt) return;
    const tick = () => {
      const remaining = Math.max(0, OTP_RESEND_COOLDOWN_MS - (Date.now() - sentAt));
      setResendRemaining(Math.ceil(remaining / 1000));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sentAt]);

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

  const requestOtp = async () => {
    setOtpSubmitting(true);
    try {
      await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, locale }),
      });
    } finally {
      // Same "always looks like it worked" behavior as the link flow — never reveals whether
      // the email matched anything.
      setOtpSubmitting(false);
      setOtpStep('code');
      setSentAt(Date.now());
      setCode('');
      setOtpError(false);
      setFailedTries(0);
    }
  };

  const verifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setOtpVerifying(true);
    setOtpError(false);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, code }),
      });
      const result = await res.json();
      if (res.ok && result.ok) {
        router.push('/profile');
        return;
      }
      throw new Error();
    } catch {
      setOtpError(true);
      setFailedTries((n) => n + 1);
      setCode('');
    } finally {
      setOtpVerifying(false);
    }
  };

  const canResend = resendRemaining <= 0;

  return (
    <div className="min-h-screen bg-trail-black text-paper-white">
      <FlowHeader homeHref={homeHref} backLabel={t.common.back} />

      <main className="pt-32 md:pt-40 px-6 md:px-10 pb-32">
        <div className="max-w-md mx-auto">
          {mode === 'otp' ? (
            <>
              <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-paper-white uppercase">
                {t.login.title}
              </h1>

              {otpStep === 'email' ? (
                <>
                  <p className="mt-6 font-sans text-base text-ash leading-relaxed">
                    {t.login.otpLead}
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      requestOtp();
                    }}
                    className="mt-10 space-y-6"
                  >
                    <Field label={t.login.emailLabel} required>
                      <Input
                        type="email"
                        value={otpEmail}
                        onChange={setOtpEmail}
                        required
                        placeholder="you@example.com"
                      />
                    </Field>
                    <button
                      type="submit"
                      disabled={otpSubmitting || !otpEmail}
                      className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-7 py-4 rounded-full hover:bg-paper-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {otpSubmitting
                        ? t.login.otpSubmitting.toUpperCase()
                        : `${t.login.otpSubmit.toUpperCase()} ↗`}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <p className="mt-6 font-sans text-base text-ash leading-relaxed">
                    {t.login.otpSentHint}
                  </p>
                  <form onSubmit={verifyOtp} className="mt-10 space-y-6">
                    <Field label={t.login.otpVerify}>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoFocus
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        placeholder="000000"
                        className="w-full bg-stone border border-stone focus:border-ember text-paper-white px-4 py-3 font-mono text-2xl tracking-[0.5em] text-center rounded outline-none transition-colors placeholder:text-ash/40"
                      />
                    </Field>
                    {otpError && (
                      <p className="font-mono text-xs text-ember">{t.login.otpErrorInvalid}</p>
                    )}
                    {failedTries >= 3 && (
                      <p className="font-mono text-xs text-ash">{t.login.otpHintManyTries}</p>
                    )}
                    <button
                      type="submit"
                      disabled={otpVerifying || code.length !== 6}
                      className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-7 py-4 rounded-full hover:bg-paper-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {otpVerifying
                        ? t.login.otpVerifying.toUpperCase()
                        : t.login.otpVerify.toUpperCase()}
                    </button>
                    <div className="flex items-center gap-4 font-mono text-xs text-ash">
                      <button
                        type="button"
                        onClick={requestOtp}
                        disabled={!canResend}
                        className="hover:text-ember transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {canResend
                          ? t.login.otpResend.toUpperCase()
                          : `${t.login.otpResendIn.toUpperCase()} ${resendRemaining}S`}
                      </button>
                      <span className="text-stone">·</span>
                      <button
                        type="button"
                        onClick={() => setOtpStep('email')}
                        className="hover:text-ember transition-colors"
                      >
                        {t.login.otpChangeEmail.toUpperCase()}
                      </button>
                    </div>
                  </form>
                </>
              )}

              <button
                type="button"
                onClick={() => setMode('link')}
                className="mt-10 font-mono text-xs text-ash hover:text-ember transition-colors"
              >
                {t.login.switchToLink}
              </button>
            </>
          ) : sent ? (
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

              <button
                type="button"
                onClick={() => setMode('otp')}
                className="mt-10 font-mono text-xs text-ash hover:text-ember transition-colors"
              >
                {t.login.switchToOtp}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
