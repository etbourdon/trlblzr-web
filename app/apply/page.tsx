'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, type FormEvent } from 'react';
import { upcomingSessions } from '@/lib/content';

type Category = 'dirigeant' | 'athlete';
type Step = 1 | 2 | 3;

type FormData = {
  firstname: string;
  lastname: string;
  company: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  itra: string;
  utmb: string;
  session: string;
  rgpd: boolean;
};

const EMPTY_FORM: FormData = {
  firstname: '',
  lastname: '',
  company: '',
  email: '',
  whatsapp: '',
  linkedin: '',
  itra: '',
  utmb: '',
  session: '',
  rgpd: false,
};

export default function ApplyPage() {
  const [step, setStep] = useState<Step>(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  // Scroll to top on step change
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
    setStep(2);
  };

  const handleBackToProfile = () => {
    setStep(1);
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
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
        referer:
          typeof window !== 'undefined'
            ? document.referrer || '/apply'
            : '/apply',
      };
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        throw new Error(body.error || 'Une erreur est survenue. Réessaie ou écris à etienne@bourdon.com.');
      }
      setReference(body.reference);
      setStep(3);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-trail-black text-paper-white">
      {/* Header simplifié — logo + back + lang */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between bg-trail-black/85 backdrop-blur-[2px] border-b border-stone">
        <Link href="/" className="flex items-center gap-3 group">
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
        <Link
          href="/"
          className="font-mono text-[10px] md:text-[11px] tracking-[0.2em] text-paper-white/70 hover:text-ember transition-colors"
        >
          ← RETOUR
        </Link>
      </header>

      {/* Stepper */}
      <div className="pt-24 md:pt-32 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Stepper step={step} category={category} />
        </div>
      </div>

      {/* Steps */}
      <main className="px-6 md:px-10 pb-32">
        <div className="max-w-4xl mx-auto">
          {step === 1 && <StepProfile onSelect={handleCategorySelect} />}
          {step === 2 && category && (
            <StepInfos
              category={category}
              form={form}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onBack={handleBackToProfile}
              submitting={submitting}
              submitError={submitError}
            />
          )}
          {step === 3 && reference && (
            <StepConfirmation reference={reference} firstname={form.firstname} />
          )}
        </div>
      </main>
    </div>
  );
}

function Stepper({ step, category }: { step: Step; category: Category | null }) {
  return (
    <div className="font-mono text-[10px] tracking-[0.3em] text-ash flex items-center gap-6 flex-wrap mb-10">
      <span className={step === 1 ? 'text-ember' : 'text-paper-white/60'}>
        01 PROFIL
      </span>
      <span className="text-ash/40">·</span>
      <span className={step === 2 ? 'text-ember' : 'text-paper-white/60'}>
        02 INFOS
      </span>
      <span className="text-ash/40">·</span>
      <span className={step === 3 ? 'text-ember' : 'text-paper-white/60'}>
        03 ENVOI
      </span>
      <span className="ml-auto text-ash">
        ÉTAPE {step} / 3
        {category && step >= 2 && (
          <span className="ml-3">
            · <span className="text-ember">{category === 'dirigeant' ? 'DIRIGEANT' : 'ATHLÈTE'}</span>
          </span>
        )}
      </span>
    </div>
  );
}

function StepProfile({ onSelect }: { onSelect: (cat: Category) => void }) {
  return (
    <section>
      <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-[0.95] text-paper-white uppercase">
        Rejoindre le club.
      </h1>
      <p className="mt-6 max-w-2xl font-sans text-base md:text-lg text-ash leading-relaxed">
        Quelques minutes pour qu&apos;on apprenne à se connaître. Sélectionne d&apos;abord ton
        profil — les informations qu&apos;on te demandera ensuite dépendent de ce choix.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
        <button
          type="button"
          onClick={() => onSelect('dirigeant')}
          className="group bg-stone hover:border-ember border border-stone p-8 md:p-10 text-left transition-colors"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-ember mb-4">
            // 01 — DIRIGEANT
          </p>
          <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-paper-white">
            Entrepreneur
          </h3>
          <p className="mt-3 font-sans text-sm md:text-base text-ash leading-relaxed">
            Fondateur, CEO, investisseur, leader. Tu veux rejoindre la communauté et
            participer à une session — quel que soit ton niveau de trail.
          </p>
          <span className="mt-6 inline-block font-mono text-[11px] tracking-[0.2em] text-paper-white group-hover:text-ember transition-colors">
            CONTINUER ↗
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelect('athlete')}
          className="group bg-stone hover:border-ember border border-stone p-8 md:p-10 text-left transition-colors"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-ember mb-4">
            // 02 — ATHLÈTE
          </p>
          <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-paper-white">
            Pro / Élite
          </h3>
          <p className="mt-3 font-sans text-sm md:text-base text-ash leading-relaxed">
            Trail runner pro ou semi-pro. Tu peux nous rejoindre pour partager ton
            expérience, encadrer les sessions et bénéficier de la communauté.
          </p>
          <span className="mt-6 inline-block font-mono text-[11px] tracking-[0.2em] text-paper-white group-hover:text-ember transition-colors">
            CONTINUER ↗
          </span>
        </button>
      </div>

      <p className="mt-12 font-mono text-[10px] tracking-[0.2em] text-ash">
        SESSIONS TRAITÉES SOUS 48–72 H · SI ÉLIGIBLE, TU RECEVRAS UN LIEN POUR RÉSERVER UN APPEL DÉCOUVERTE DE 30 MIN AVEC ETIENNE
      </p>
    </section>
  );
}

function StepInfos({
  category,
  form,
  onChange,
  onSubmit,
  onBack,
  submitting,
  submitError,
}: {
  category: Category;
  form: FormData;
  onChange: (field: keyof FormData, value: string | boolean) => void;
  onSubmit: (e: FormEvent) => void;
  onBack: () => void;
  submitting: boolean;
  submitError: string | null;
}) {
  const isAthlete = category === 'athlete';

  return (
    <section>
      <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-[0.95] text-paper-white uppercase">
        Quelques infos.
      </h1>
      <p className="mt-6 max-w-2xl font-sans text-base md:text-lg text-ash leading-relaxed">
        Tout ce qu&apos;il nous faut pour évaluer ta candidature. WhatsApp est notre canal
        principal de communication pour les sessions.
      </p>

      <form onSubmit={onSubmit} className="mt-12 space-y-8">
        {/* Profil sélectionné */}
        <div className="flex items-center justify-between border-b border-stone pb-5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-ash mb-1">
              PROFIL SÉLECTIONNÉ
            </p>
            <p className="font-display font-bold text-xl text-paper-white">
              {isAthlete ? 'Athlète · Pro / Élite' : 'Dirigeant · Entrepreneur'}
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="font-mono text-[10px] tracking-[0.2em] text-paper-white/70 hover:text-ember transition-colors"
          >
            CHANGER →
          </button>
        </div>

        {/* Session ciblée */}
        <Field label="Session ciblée">
          <select
            value={form.session}
            onChange={(e) => onChange('session', e.target.value)}
            className="w-full bg-stone border border-stone focus:border-ember text-paper-white px-4 py-3 font-mono text-sm rounded outline-none transition-colors"
          >
            <option value="">— Sans session ciblée —</option>
            {upcomingSessions
              .filter((s) => s.status === 'upcoming')
              .map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.location} — {s.dates} · {s.theme}
                </option>
              ))}
          </select>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Prénom" required>
            <Input value={form.firstname} onChange={(v) => onChange('firstname', v)} required />
          </Field>
          <Field label="Nom" required>
            <Input value={form.lastname} onChange={(v) => onChange('lastname', v)} required />
          </Field>
        </div>

        {!isAthlete && (
          <Field label="Société" required>
            <Input value={form.company} onChange={(v) => onChange('company', v)} required />
          </Field>
        )}

        {isAthlete && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Index ITRA" hint="ou laisse vide si pas applicable">
              <Input
                value={form.itra}
                onChange={(v) => onChange('itra', v)}
                inputMode="numeric"
              />
            </Field>
            <Field label="Index UTMB" hint="ou laisse vide">
              <Input
                value={form.utmb}
                onChange={(v) => onChange('utmb', v)}
                inputMode="numeric"
              />
            </Field>
          </div>
        )}

        <Field label="Email" required>
          <Input
            type="email"
            value={form.email}
            onChange={(v) => onChange('email', v)}
            required
          />
        </Field>

        <Field label="WhatsApp" required>
          <Input
            type="tel"
            value={form.whatsapp}
            onChange={(v) => onChange('whatsapp', v)}
            placeholder="+33 6 …"
            required
          />
        </Field>

        <Field label="LinkedIn" hint="optionnel">
          <Input
            type="url"
            value={form.linkedin}
            onChange={(v) => onChange('linkedin', v)}
            placeholder="https://linkedin.com/in/…"
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
            J&apos;accepte que mes informations soient utilisées par{' '}
            <span className="text-paper-white">TRLBLZR.RUN</span> pour traiter ma candidature
            et me recontacter. Conformément au RGPD, je peux à tout moment demander la
            suppression de mes données en écrivant à{' '}
            <a href="mailto:etienne@bourdon.com" className="text-ember hover:underline">
              etienne@bourdon.com
            </a>
            . *
          </span>
        </label>

        {submitError && (
          <p className="font-mono text-xs text-ember border border-ember/50 px-4 py-3 rounded">
            ⚠ {submitError}
          </p>
        )}

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting || !form.rgpd}
            className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-7 py-4 rounded-full hover:bg-paper-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'ENVOI EN COURS…' : 'SOUMETTRE MA CANDIDATURE ↗'}
          </button>
        </div>
      </form>
    </section>
  );
}

function StepConfirmation({
  reference,
  firstname,
}: {
  reference: string;
  firstname: string;
}) {
  return (
    <section>
      <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-[0.95] text-paper-white uppercase">
        Candidature reçue.
      </h1>
      <p className="mt-6 font-sans text-base md:text-lg text-ash leading-relaxed">
        Merci {firstname || ''}. On revient vers toi sous 48 à 72 heures avec une réponse personnalisée.
      </p>

      <div className="mt-12 inline-flex items-center gap-3 border border-ember/40 bg-stone px-6 py-4 rounded">
        <span className="font-display font-bold text-2xl text-ember">✓</span>
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-ash">RÉFÉRENCE</p>
          <p className="font-mono text-sm tracking-[0.15em] text-paper-white">{reference}</p>
        </div>
      </div>

      <div className="mt-12 max-w-3xl space-y-6">
        <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-paper-white">
          Voici la suite
        </h2>
        <p className="font-sans text-base text-ash leading-relaxed">
          Etienne va personnellement étudier ta candidature. Toutes les soumissions passent
          par une revue manuelle — c&apos;est ce qui garde le club exigeant.
        </p>

        <ul className="space-y-4 font-sans text-base text-ash leading-relaxed">
          <li className="border-l-2 border-ember pl-4">
            <strong className="text-paper-white">Revue de ta candidature (48–72 h).</strong>{' '}
            On évalue le profil et l&apos;alignement avec les sessions à venir.
          </li>
          <li className="border-l-2 border-ember pl-4">
            <strong className="text-paper-white">Réponse par email.</strong> Si éligible,
            tu recevras un lien direct pour réserver un appel découverte de 30 min avec
            Etienne, qui finalise l&apos;inscription.
          </li>
          <li className="border-l-2 border-ember pl-4">
            <strong className="text-paper-white">Sinon, on t&apos;écrit aussi.</strong>{' '}
            Si la session ciblée est complète ou si le timing n&apos;est pas le bon, on revient
            vers toi dès qu&apos;une fenêtre se libère.
          </li>
        </ul>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <a
          href="https://cal.com/bourdon/discovery"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-7 py-4 rounded-full hover:bg-paper-white transition-colors"
        >
          RÉSERVER UN APPEL DÉCOUVERTE ↗
        </a>
        <Link
          href="/"
          className="font-mono text-xs tracking-[0.2em] text-paper-white border border-paper-white/30 px-7 py-4 rounded-full hover:border-ember hover:text-ember transition-colors"
        >
          RETOUR À L&apos;ACCUEIL
        </Link>
      </div>

      <p className="mt-12 font-mono text-[10px] tracking-[0.2em] text-ash">
        UNE QUESTION URGENTE ? →{' '}
        <a href="mailto:etienne@bourdon.com" className="text-paper-white hover:text-ember transition-colors">
          ETIENNE@BOURDON.COM
        </a>
      </p>
    </section>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] tracking-[0.25em] text-paper-white/80 mb-2">
        {label.toUpperCase()}
        {required && <span className="text-ember ml-1">*</span>}
        {hint && <span className="text-ash ml-2 normal-case tracking-normal">— {hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  inputMode,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url';
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      inputMode={inputMode}
      className="w-full bg-stone border border-stone focus:border-ember text-paper-white px-4 py-3 font-mono text-sm rounded outline-none transition-colors placeholder:text-ash/60"
    />
  );
}
