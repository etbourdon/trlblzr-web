'use client';

import Link from 'next/link';
import { useState, useEffect, type FormEvent } from 'react';
import { useLocale } from '@/lib/locale-provider';
import FlowHeader from '@/components/FlowHeader';
import OnboardingProgress from '@/components/OnboardingProgress';
import SessionPicker from '@/components/SessionPicker';
import CityCountryFields from '@/components/CityCountryFields';
import { Field, Input, Textarea, SectionHeader } from '@/components/FormFields';
import type { Dict } from '@/lib/i18n';

type Category = 'dirigeant' | 'athlete';
type Step = 1 | 2 | 3;
type SportLevel = '' | '1' | '2' | '3' | '4' | '5';
type CityValue = '' | 'Paris' | 'Lyon' | 'Bucharest' | 'Autre';

type FormData = {
  firstname: string;
  lastname: string;
  company: string;
  role: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  itra: string;
  utmb: string;
  sessions: string[];
  // Batch 3 — Form v2 fields
  selfDescription: string;
  sportLevel: SportLevel;
  motivation: string;
  lookingFor: string;
  city: CityValue;
  otherCity: string;
  country: string;
  proWebsite: string;
  stravaProfile: string;
  otherLink: string;
  rgpd: boolean;
};

const EMPTY_FORM: FormData = {
  firstname: '',
  lastname: '',
  company: '',
  role: '',
  email: '',
  whatsapp: '',
  linkedin: '',
  itra: '',
  utmb: '',
  sessions: [],
  selfDescription: '',
  sportLevel: '',
  motivation: '',
  lookingFor: '',
  city: '',
  otherCity: '',
  country: '',
  proWebsite: '',
  stravaProfile: '',
  otherLink: '',
  rgpd: false,
};

export default function ApplyPage() {
  const { t, locale } = useLocale();
  const [step, setStep] = useState<Step>(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  // SBL-18 — Tracking Source: URL param ?source=… lu au mount et injecté dans le payload
  const [sourceParam, setSourceParam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // SBL-18 — Lecture du paramètre ?source= au mount (une fois, pas de cookie)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const s = params.get('source');
    if (s) {
      // Sanitize : keep 100 chars max, strip whitespace
      setSourceParam(s.trim().slice(0, 100));
    }
  }, []);

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
    setStep(2);
  };

  const handleBackToProfile = () => setStep(1);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const toggleSession = (slug: string) => {
    setForm((f) => ({
      ...f,
      sessions: f.sessions.includes(slug)
        ? f.sessions.filter((s) => s !== slug)
        : [...f.sessions, slug],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!category) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        ...form,
        category,
        locale,
        source: sourceParam, // SBL-18 — priorité au ?source= explicite si présent
        referer:
          typeof window !== 'undefined' ? document.referrer || '/apply' : '/apply',
      };
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        throw new Error(body.error || t.apply.errorFallback);
      }
      setReference(body.reference);
      setPendingToken(body.pendingToken || null);
      setStep(3);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t.apply.errorUnknown);
    } finally {
      setSubmitting(false);
    }
  };

  const homeHref = locale === 'en' ? '/?lang=en' : '/';

  return (
    <div className="min-h-screen bg-trail-black text-paper-white">
      <FlowHeader homeHref={homeHref} backLabel={t.common.back} />

      <div className="pt-24 md:pt-32 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <OnboardingProgress
            step={step === 3 ? 2 : 1}
            eyebrow={t.progress.eyebrow}
            stepWord={t.progress.stepWord}
            label={step === 3 ? t.progress.step2Label : t.progress.step1Label}
          />
        </div>
      </div>

      <main className="px-6 md:px-10 pb-32">
        <div className="max-w-4xl mx-auto">
          {step === 1 && <StepProfile onSelect={handleCategorySelect} t={t} />}
          {step === 2 && category && (
            <StepInfos
              category={category}
              form={form}
              onChange={handleChange}
              onToggleSession={toggleSession}
              onSubmit={handleSubmit}
              onBack={handleBackToProfile}
              submitting={submitting}
              submitError={submitError}
              t={t}
            />
          )}
          {step === 3 && reference && (
            <StepConfirmation
              reference={reference}
              firstname={form.firstname}
              email={form.email}
              pendingToken={pendingToken}
              t={t}
              homeHref={homeHref}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function StepProfile({ onSelect, t }: { onSelect: (cat: Category) => void; t: Dict }) {
  return (
    <section>
      <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-[0.95] text-paper-white uppercase">
        {t.apply.s1Title} {t.apply.s1TitleHighlight}
      </h1>
      <p className="mt-6 max-w-2xl font-sans text-base md:text-lg text-ash leading-relaxed">
        {t.apply.s1Lead}
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
        <button
          type="button"
          onClick={() => onSelect('dirigeant')}
          className="group bg-stone hover:border-ember border border-stone p-8 md:p-10 text-left transition-colors"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-ember mb-4">
            // {t.apply.s1CategoryLabelDirigeant}
          </p>
          <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-paper-white">
            {t.apply.s1DirigeantTitleLine2}
          </h3>
          <p className="mt-3 font-sans text-sm md:text-base text-ash leading-relaxed">
            {t.apply.s1DirigeantDesc}
          </p>
          <span className="mt-6 inline-block font-mono text-[11px] tracking-[0.2em] text-paper-white group-hover:text-ember transition-colors">
            {t.apply.s1Continue} ↗
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelect('athlete')}
          className="group bg-stone hover:border-ember border border-stone p-8 md:p-10 text-left transition-colors"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-ember mb-4">
            // {t.apply.s1CategoryLabelAthlete}
          </p>
          <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-paper-white">
            {t.apply.s1AthleteTitleLine2}
          </h3>
          <p className="mt-3 font-sans text-sm md:text-base text-ash leading-relaxed">
            {t.apply.s1AthleteDesc}
          </p>
          <span className="mt-6 inline-block font-mono text-[11px] tracking-[0.2em] text-paper-white group-hover:text-ember transition-colors">
            {t.apply.s1Continue} ↗
          </span>
        </button>
      </div>

      <p className="mt-12 font-mono text-[10px] tracking-[0.2em] text-ash uppercase">
        {t.apply.s1Note}
      </p>
    </section>
  );
}

function StepInfos({
  category,
  form,
  onChange,
  onToggleSession,
  onSubmit,
  onBack,
  submitting,
  submitError,
  t,
}: {
  category: Category;
  form: FormData;
  onChange: (field: keyof FormData, value: string | boolean) => void;
  onToggleSession: (slug: string) => void;
  onSubmit: (e: FormEvent) => void;
  onBack: () => void;
  submitting: boolean;
  submitError: string | null;
  t: Dict;
}) {
  const isAthlete = category === 'athlete';
  const selfDescLabel = isAthlete
    ? t.apply.s2SelfDescLabelAthlete
    : t.apply.s2SelfDescLabelDirigeant;

  return (
    <section>
      <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-[0.95] text-paper-white uppercase">
        {t.apply.s2Title}
      </h1>
      <p className="mt-6 max-w-2xl font-sans text-base md:text-lg text-ash leading-relaxed">
        {t.apply.s2Lead}
      </p>

      <form onSubmit={onSubmit} className="mt-12 space-y-10">
        {/* Profil sélectionné */}
        <div className="flex items-center justify-between border-b border-stone pb-5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-ash mb-1">
              {t.apply.s2ProfileLabel.toUpperCase()}
            </p>
            <p className="font-display font-bold text-xl text-paper-white">
              {isAthlete ? t.apply.s2ProfileValueAthlete : t.apply.s2ProfileValueDirigeant}
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="font-mono text-[10px] tracking-[0.2em] text-paper-white/70 hover:text-ember transition-colors"
          >
            {t.apply.s2ChangeLink.toUpperCase()}
          </button>
        </div>

        {/* Sessions qui t'intéressent (multi-choix) */}
        <Field label={t.apply.s2SessionLabel} hint={t.apply.s2SessionHint}>
          <SessionPicker selected={form.sessions} onToggle={onToggleSession} />
        </Field>

        {/* Identité */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label={t.apply.s2Firstname} required>
            <Input value={form.firstname} onChange={(v) => onChange('firstname', v)} required />
          </Field>
          <Field label={t.apply.s2Lastname} required>
            <Input value={form.lastname} onChange={(v) => onChange('lastname', v)} required />
          </Field>
        </div>

        {!isAthlete && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label={t.apply.s2Company} required>
              <Input value={form.company} onChange={(v) => onChange('company', v)} required />
            </Field>
            <Field label={t.apply.s2Role} hint={t.apply.s2RoleHint} required>
              <Input value={form.role} onChange={(v) => onChange('role', v)} required />
            </Field>
          </div>
        )}

        {isAthlete && (
          <Field label={t.apply.s2Role} hint={t.apply.s2RoleHint}>
            <Input value={form.role} onChange={(v) => onChange('role', v)} />
          </Field>
        )}

        {isAthlete && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label={t.apply.s2Itra} hint={t.apply.s2ItraShortHint}>
              <Input
                value={form.itra}
                onChange={(v) => onChange('itra', v)}
                inputMode="numeric"
              />
            </Field>
            <Field label={t.apply.s2Utmb} hint={t.apply.s2UtmbShortHint}>
              <Input
                value={form.utmb}
                onChange={(v) => onChange('utmb', v)}
                inputMode="numeric"
              />
            </Field>
          </div>
        )}

        {/* SECTION — À propos de toi (self-description) */}
        <SectionHeader label={t.apply.s2SectionAbout} />
        <Field label={selfDescLabel} hint={t.apply.s2SelfDescHint}>
          <Textarea
            value={form.selfDescription}
            onChange={(v) => onChange('selfDescription', v)}
            rows={3}
          />
        </Field>

        {/* SECTION — Niveau trail (spectrum 1-5) */}
        <SectionHeader label={t.apply.s2SectionSport} />
        <Field label={t.apply.s2SportLevelLabel} hint={t.apply.s2SportLevelHint}>
          <div className="space-y-2 mt-2">
            {(['1', '2', '3', '4', '5'] as const).map((lvl) => {
              const labelKey = `s2SportLevel${lvl}` as keyof Dict['apply'];
              const label = t.apply[labelKey] as string;
              return (
                <label
                  key={lvl}
                  className={`flex items-start gap-3 border p-3 rounded cursor-pointer transition-colors ${
                    form.sportLevel === lvl
                      ? 'border-ember bg-ember/5'
                      : 'border-stone hover:border-paper-white/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="sportLevel"
                    value={lvl}
                    checked={form.sportLevel === lvl}
                    onChange={() => onChange('sportLevel', lvl)}
                    className="mt-1 accent-ember"
                  />
                  <span className="font-sans text-sm text-paper-white leading-snug">
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
        </Field>

        {/* SECTION — Localisation */}
        <SectionHeader label={t.apply.s2SectionLocation} />
        <CityCountryFields
          city={form.city}
          otherCity={form.otherCity}
          country={form.country}
          onCityChange={(v) => onChange('city', v)}
          onOtherCityChange={(v) => onChange('otherCity', v)}
          onCountryChange={(v) => onChange('country', v)}
          t={t}
        />

        {/* SECTION — Motivation */}
        <SectionHeader label={t.apply.s2SectionMotivation} />
        <Field label={t.apply.s2MotivationLabel} hint={t.apply.s2MotivationHint} required>
          <Textarea
            value={form.motivation}
            onChange={(v) => onChange('motivation', v)}
            rows={3}
            required
          />
        </Field>
        <Field label={t.apply.s2LookingForLabel} hint={t.apply.s2LookingForHint} required>
          <Textarea
            value={form.lookingFor}
            onChange={(v) => onChange('lookingFor', v)}
            rows={3}
            required
          />
        </Field>

        {/* SECTION — Contact */}
        <SectionHeader label={t.apply.s2SectionContact} />
        <Field label={t.apply.s2Email} required>
          <Input
            type="email"
            value={form.email}
            onChange={(v) => onChange('email', v)}
            required
          />
        </Field>
        <Field label={t.apply.s2Whatsapp} required>
          <Input
            type="tel"
            value={form.whatsapp}
            onChange={(v) => onChange('whatsapp', v)}
            placeholder="+33 6 …"
            required
          />
        </Field>

        {/* SECTION — Liens (LinkedIn + Pro website + Strava + Other) */}
        <SectionHeader label={t.apply.s2SectionLinks} />
        <Field label={t.apply.s2Linkedin} hint={t.apply.s2LinkedinHint}>
          <Input
            type="url"
            value={form.linkedin}
            onChange={(v) => onChange('linkedin', v)}
            placeholder="https://linkedin.com/in/…"
          />
        </Field>
        <Field label={t.apply.s2ProWebsiteLabel} hint={t.apply.s2ProWebsiteHint}>
          <Input
            type="url"
            value={form.proWebsite}
            onChange={(v) => onChange('proWebsite', v)}
            placeholder="https://…"
          />
        </Field>
        <Field label={t.apply.s2StravaLabel}>
          <Input
            type="url"
            value={form.stravaProfile}
            onChange={(v) => onChange('stravaProfile', v)}
            placeholder="https://strava.com/athletes/…"
          />
        </Field>
        <Field label={t.apply.s2OtherLinkLabel} hint={t.apply.s2OtherLinkHint}>
          <Input
            type="url"
            value={form.otherLink}
            onChange={(v) => onChange('otherLink', v)}
            placeholder="https://…"
          />
        </Field>

        {/* RGPD */}
        <label className="flex items-start gap-3 font-sans text-sm text-ash leading-relaxed cursor-pointer">
          <input
            type="checkbox"
            checked={form.rgpd}
            onChange={(e) => onChange('rgpd', e.target.checked)}
            required
            className="mt-1 w-4 h-4 accent-ember"
          />
          <span>
            {t.apply.s2Rgpd.split('etienne@bourdon.com')[0]}
            <a href="mailto:etienne@bourdon.com" className="text-ember hover:underline">
              etienne@bourdon.com
            </a>
            {t.apply.s2Rgpd.split('etienne@bourdon.com')[1] || ''} *
          </span>
        </label>

        {submitError && (
          <div className="font-mono text-xs text-ember border border-ember/50 px-4 py-3 rounded">
            <p className="font-bold mb-2">⚠ {t.apply.errorTitle}</p>
            <p className="text-paper-white/80">{submitError}</p>
            <p className="mt-3 text-paper-white/60 text-[10px]">
              {t.apply.errorFooter}{' '}
              <a href="mailto:etienne@bourdon.com" className="text-ember hover:underline">
                etienne@bourdon.com
              </a>{' '}
              {t.apply.errorFooterEnd}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting || !form.rgpd}
            className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-7 py-4 rounded-full hover:bg-paper-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting
              ? `${t.apply.s2Submitting.toUpperCase()}`
              : `${t.apply.s2Submit.toUpperCase()} ↗`}
          </button>
        </div>
      </form>
    </section>
  );
}

function StepConfirmation({
  reference,
  firstname,
  email,
  pendingToken,
  t,
  homeHref,
}: {
  reference: string;
  firstname: string;
  email: string;
  pendingToken: string | null;
  t: Dict;
  homeHref: string;
}) {
  const [currentEmail, setCurrentEmail] = useState(email);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [changeStatus, setChangeStatus] = useState<'idle' | 'saving' | 'error'>('idle');

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (!pendingToken || resendCooldown > 0) return;
    setResendStatus('sending');
    try {
      const res = await fetch('/api/auth/resend-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pendingToken }),
      });
      if (!res.ok) throw new Error();
      setResendStatus('sent');
      setResendCooldown(60);
    } catch {
      setResendStatus('error');
    }
  };

  const handleChangeEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!pendingToken || !newEmail.trim()) return;
    setChangeStatus('saving');
    try {
      const res = await fetch('/api/auth/update-pending-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pendingToken, newEmail: newEmail.trim() }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error();
      setCurrentEmail(newEmail.trim());
      setShowChangeEmail(false);
      setNewEmail('');
      setChangeStatus('idle');
      setResendStatus('sent');
      setResendCooldown(60);
    } catch {
      setChangeStatus('error');
    }
  };

  return (
    <section>
      <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-[0.95] text-paper-white uppercase">
        {t.apply.s3Title}
      </h1>

      <div className="mt-6 inline-flex items-center gap-3 border border-ember/40 bg-stone px-6 py-4 rounded">
        <span className="font-display font-bold text-2xl text-ember">✓</span>
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-ash">
            {t.apply.s3Ref.toUpperCase()}
          </p>
          <p className="font-mono text-sm tracking-[0.15em] text-paper-white">{reference}</p>
        </div>
      </div>

      <p className="mt-10 max-w-xl font-sans text-lg md:text-xl text-paper-white leading-relaxed">
        {firstname ? `${firstname}, ` : ''}
        {t.apply.s3Thanks}
      </p>

      <div className="mt-6 max-w-md border border-stone rounded-lg p-6 space-y-4">
        <div>
          <p className="font-sans text-sm text-ash leading-relaxed">{t.apply.s3EmailCheck}</p>
          <p className="mt-2 font-mono text-xs text-paper-white/80">
            {t.apply.s3EmailSentTo} <span className="text-paper-white">{currentEmail}</span>
          </p>
        </div>

        {pendingToken && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || resendStatus === 'sending'}
              className="font-mono text-xs tracking-[0.15em] text-paper-white border border-paper-white/30 px-5 py-3 rounded-full hover:border-ember hover:text-ember transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0
                ? `${t.apply.s3ResendCta.toUpperCase()} (${resendCooldown}s)`
                : t.apply.s3ResendCta.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={() => setShowChangeEmail((v) => !v)}
              className="font-mono text-xs tracking-[0.15em] text-paper-white border border-paper-white/30 px-5 py-3 rounded-full hover:border-ember hover:text-ember transition-colors"
            >
              {t.apply.s3ChangeEmailCta.toUpperCase()}
            </button>
          </div>
        )}

        {resendStatus === 'sent' && (
          <p className="font-mono text-xs text-ember">{t.apply.s3ResendSent}</p>
        )}
        {resendCooldown > 0 && resendStatus !== 'sent' && (
          <p className="font-mono text-[10px] text-ash">{t.apply.s3ResendCooldown}</p>
        )}

        {showChangeEmail && pendingToken && (
          <form onSubmit={handleChangeEmail} className="flex flex-wrap items-end gap-3">
            <div className="w-56">
              <Field label={t.apply.s3ChangeEmailLabel}>
                <Input type="email" value={newEmail} onChange={setNewEmail} required />
              </Field>
            </div>
            <button
              type="submit"
              disabled={changeStatus === 'saving'}
              className="font-mono text-xs tracking-[0.15em] bg-ember text-trail-black px-5 py-3 rounded-full hover:bg-paper-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t.apply.s3ChangeEmailSubmit.toUpperCase()}
            </button>
          </form>
        )}
        {changeStatus === 'error' && (
          <p className="font-mono text-xs text-ember">{t.apply.s3ChangeEmailError}</p>
        )}

        <p className="font-mono text-[11px] text-ash/70 pt-3 border-t border-stone">
          <Link href="/login" className="hover:text-ember transition-colors">
            {t.apply.s3LoginLink}
          </Link>
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href={homeHref}
          className="font-mono text-xs tracking-[0.2em] text-paper-white border border-paper-white/30 px-7 py-4 rounded-full hover:border-ember hover:text-ember transition-colors"
        >
          {t.apply.s3CtaHome.toUpperCase()}
        </Link>
      </div>

      <p className="mt-12 font-mono text-[10px] tracking-[0.2em] text-ash">
        {t.apply.s3Contact.toUpperCase()} →{' '}
        <a
          href="mailto:etienne@bourdon.com"
          className="text-paper-white hover:text-ember transition-colors"
        >
          ETIENNE@BOURDON.COM
        </a>
      </p>
    </section>
  );
}

