'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { toBlob } from 'html-to-image';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/locale-provider';
import FlowHeader from '@/components/FlowHeader';
import SessionPicker from '@/components/SessionPicker';
import CityCountryFields from '@/components/CityCountryFields';
import MemberCard from '@/components/MemberCard';
import { Field, Input, Textarea, SectionHeader } from '@/components/FormFields';
import { SPORT_LEVEL_LABELS } from '@/lib/field-options';
import { mapLabelsToSlugs } from '@/lib/session-mapping';
import type { Dict } from '@/lib/i18n';

const CODE_BY_SPORT_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(SPORT_LEVEL_LABELS).map(([code, label]) => [label, code]),
);

type SportLevel = '' | '1' | '2' | '3' | '4' | '5';

type FormState = {
  selfDescription: string;
  role: string;
  company: string;
  linkedin: string;
  stravaProfile: string;
  proWebsite: string;
  otherLink: string;
  city: string;
  otherCity: string;
  country: string;
  sportLevel: SportLevel;
  lookingFor: string;
  motivation: string;
  profilePictureUrl: string;
  sessions: string[];
  preferredLanguage: 'FR' | 'EN';
};

const COMPLETION_FIELDS: (keyof FormState)[] = [
  'selfDescription',
  'role',
  'linkedin',
  'sportLevel',
  'lookingFor',
  'motivation',
  'profilePictureUrl',
];

function computeCompletion(form: FormState): number {
  const total = COMPLETION_FIELDS.length + 2; // + location + sessions
  let filled = COMPLETION_FIELDS.filter((f) => Boolean(form[f])).length;
  if (form.city || form.otherCity) filled += 1;
  if (form.sessions.length > 0) filled += 1;
  return Math.round((filled / total) * 100);
}

const EMPTY_FORM: FormState = {
  selfDescription: '',
  role: '',
  company: '',
  linkedin: '',
  stravaProfile: '',
  proWebsite: '',
  otherLink: '',
  city: '',
  otherCity: '',
  country: '',
  sportLevel: '',
  lookingFor: '',
  motivation: '',
  profilePictureUrl: '',
  sessions: [],
  preferredLanguage: 'FR',
};

export default function ProfilePage() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const homeHref = locale === 'en' ? '/?lang=en' : '/';

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Batch 5.2 — Member Card
  const [category, setCategory] = useState('');
  const [itra, setItra] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cardBio, setCardBio] = useState('');
  const [cardLookingFor, setCardLookingFor] = useState('');
  const [cardConsent, setCardConsent] = useState(false);
  const [cardStatus, setCardStatus] = useState<
    'draft' | 'submitted' | 'validated' | 'suspended' | null
  >(null);
  const [cardDeleteAfter, setCardDeleteAfter] = useState<string | null>(null);
  const [memberNo, setMemberNo] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [submittingCard, setSubmittingCard] = useState(false);
  const [cardSubmitError, setCardSubmitError] = useState<string | null>(null);
  const [downloadingCard, setDownloadingCard] = useState(false);
  const [suspending, setSuspending] = useState(false);
  const [suspendError, setSuspendError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.status === 401) {
          router.replace('/login');
          return;
        }
        const body = await res.json();
        if (!res.ok || !body.ok) throw new Error();
        if (cancelled) return;
        const c = body.candidate;
        setName(c.name || '');
        setForm({
          selfDescription: c.selfDescription || '',
          role: c.role || '',
          company: c.company || '',
          linkedin: c.linkedin || '',
          stravaProfile: c.stravaProfile || '',
          proWebsite: c.proWebsite || '',
          otherLink: c.otherLink || '',
          city: c.city || '',
          otherCity: c.otherCity || '',
          country: c.country || '',
          sportLevel: (CODE_BY_SPORT_LABEL[c.sportLevel] as SportLevel) || '',
          lookingFor: c.lookingFor || '',
          motivation: c.motivation || '',
          profilePictureUrl: c.profilePictureUrl || '',
          sessions: mapLabelsToSlugs(c.sessionLabels),
          preferredLanguage: c.preferredLanguage === 'EN' ? 'EN' : 'FR',
        });
        setCategory(c.category || '');
        setItra(c.itra || '');
        setWhatsapp(c.whatsapp || '');
        setCardBio(c.cardBio || '');
        setCardLookingFor(c.cardLookingFor || '');
        setCardConsent(Boolean(c.cardConsent));
        setCardStatus(c.cardStatus || null);
        setCardDeleteAfter(c.cardDeleteAfter || null);
        setMemberNo(typeof c.memberNo === 'number' ? c.memberNo : null);
      } catch {
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  };

  const completion = useMemo(() => computeCompletion(form), [form]);

  const toggleSession = (slug: string) => {
    setForm((f) => ({
      ...f,
      sessions: f.sessions.includes(slug)
        ? f.sessions.filter((s) => s !== slug)
        : [...f.sessions, slug],
    }));
    setSaved(false);
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/profile/upload', { method: 'POST', body });
      const result = await res.json();
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      if (!res.ok || !result.ok) throw new Error(result.error || 'Upload failed');
      setForm((f) => ({ ...f, profilePictureUrl: result.url }));
      setSaved(false);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace(homeHref);
  };

  const isAthlete = category === 'Athlète';
  const cityDisplay = form.city === 'Autre' ? form.otherCity : form.city;
  const metaLine = [
    [form.role, form.company].filter(Boolean).join(' @ '),
    [cityDisplay, form.country].filter(Boolean).join(', '),
  ]
    .filter(Boolean)
    .join(' · ');
  const sportLevelNumber = form.sportLevel ? parseInt(form.sportLevel, 10) : null;

  const handleGenerateCard = async () => {
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch('/api/profile/card/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: name.split(' ')[0] || '',
          isAthlete,
          role: form.role,
          company: form.company,
          selfDescription: form.selfDescription,
          motivation: form.motivation,
          lookingFor: form.lookingFor,
          sportLevel: form.sportLevel,
          preferredLang: form.preferredLanguage,
        }),
      });
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      const result = await res.json();
      if (!res.ok || !result.ok) throw new Error(result.error || 'Generation failed');
      setCardBio(result.bio);
      setCardLookingFor(result.lookingFor);
    } catch {
      setGenerateError(t.card.generateErrorMessage);
    } finally {
      setGenerating(false);
    }
  };

  const captureCardBlob = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    return toBlob(cardRef.current, { pixelRatio: 2 });
  };

  const handleDownloadCard = async () => {
    setDownloadingCard(true);
    try {
      const blob = await captureCardBlob();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trlblzr-member-card-${memberNo ? String(memberNo).padStart(4, '0') : 'preview'}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingCard(false);
    }
  };

  const handleSubmitCard = async () => {
    setSubmittingCard(true);
    setCardSubmitError(null);
    try {
      let cardImageUrl: string | undefined;
      const blob = await captureCardBlob();
      if (blob) {
        const uploadBody = new FormData();
        uploadBody.append('file', blob, 'card.png');
        const uploadRes = await fetch('/api/profile/card/upload-image', {
          method: 'POST',
          body: uploadBody,
        });
        if (uploadRes.status === 401) {
          router.replace('/login');
          return;
        }
        const uploadResult = await uploadRes.json();
        if (uploadRes.ok && uploadResult.ok) cardImageUrl = uploadResult.url;
      }

      const res = await fetch('/api/profile/card/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: cardBio,
          lookingFor: cardLookingFor,
          consent: cardConsent,
          cardImageUrl,
        }),
      });
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      const result = await res.json();
      if (!res.ok || !result.ok) throw new Error(result.error || 'Submit failed');
      setCardStatus('submitted');
      setCardDeleteAfter(null);
      setMemberNo(result.memberNo ?? memberNo);
    } catch {
      setCardSubmitError(t.card.submitErrorMessage);
    } finally {
      setSubmittingCard(false);
    }
  };

  const handleSuspendCard = async () => {
    if (!window.confirm(t.card.suspendConfirm)) return;
    setSuspending(true);
    setSuspendError(null);
    try {
      const res = await fetch('/api/profile/card/suspend', { method: 'POST' });
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      const result = await res.json();
      if (!res.ok || !result.ok) throw new Error(result.error || 'Suspend failed');
      setCardStatus('suspended');
      setCardDeleteAfter(result.deleteAfter || null);
    } catch {
      setSuspendError(t.card.suspendErrorMessage);
    } finally {
      setSuspending(false);
    }
  };

  const handleReactivateCard = async () => {
    setSuspending(true);
    setSuspendError(null);
    try {
      const res = await fetch('/api/profile/card/reactivate', { method: 'POST' });
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      const result = await res.json();
      if (!res.ok || !result.ok) throw new Error(result.error || 'Reactivate failed');
      setCardStatus('validated');
      setCardDeleteAfter(null);
    } catch {
      setSuspendError(t.card.reactivateErrorMessage);
    } finally {
      setSuspending(false);
    }
  };

  return (
    <div className="min-h-screen bg-trail-black text-paper-white">
      <FlowHeader homeHref={homeHref} backLabel={t.common.back} />

      <main className="pt-32 md:pt-40 px-6 md:px-10 pb-32">
        <div className="max-w-2xl mx-auto">
          {loading ? null : loadError ? (
            <p className="font-mono text-sm text-ember">{t.profile.loadErrorMessage}</p>
          ) : (
            <>
              <div className="flex items-center justify-between gap-6">
                <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-paper-white uppercase">
                  {t.profile.title}
                </h1>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="font-mono text-[10px] tracking-[0.2em] text-paper-white/70 hover:text-ember transition-colors whitespace-nowrap"
                >
                  {t.profile.logoutLabel.toUpperCase()}
                </button>
              </div>
              {name && <p className="mt-2 font-mono text-xs text-ash">{name}</p>}
              <p className="mt-6 font-sans text-base text-ash leading-relaxed">{t.profile.lead}</p>

              <div className="mt-6">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-ash mb-2">
                  <span>{t.profile.completionLabel.toUpperCase()}</span>
                  <span className="text-paper-white">{completion}%</span>
                </div>
                <div className="h-1.5 w-full bg-stone rounded-full overflow-hidden">
                  <div
                    className="h-full bg-ember transition-all"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-10 space-y-8">
                <Field label={t.profile.languageLabel}>
                  <div className="flex gap-3">
                    {(['FR', 'EN'] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setForm((f) => ({ ...f, preferredLanguage: lang }));
                          setSaved(false);
                        }}
                        className={`font-mono text-xs tracking-[0.2em] px-5 py-2 rounded-full border transition-colors ${
                          form.preferredLanguage === lang
                            ? 'border-ember bg-ember/10 text-ember'
                            : 'border-stone text-paper-white/70 hover:border-paper-white/40'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label={t.profile.selfDescLabel}>
                  <Textarea
                    value={form.selfDescription}
                    onChange={(v) => handleChange('selfDescription', v)}
                    rows={3}
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label={t.apply.s2Role} hint={t.apply.s2RoleHint}>
                    <Input value={form.role} onChange={(v) => handleChange('role', v)} />
                  </Field>
                  <Field label={t.apply.s2Company}>
                    <Input value={form.company} onChange={(v) => handleChange('company', v)} />
                  </Field>
                </div>

                <SectionHeader label={t.apply.s2SessionLabel} />
                <Field label={t.apply.s2SessionLabel} hint={t.apply.s2SessionHint}>
                  <SessionPicker selected={form.sessions} onToggle={toggleSession} />
                </Field>

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
                            onChange={() => handleChange('sportLevel', lvl)}
                            className="mt-1 accent-ember"
                          />
                          <span className="font-sans text-sm text-paper-white leading-snug">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </Field>

                <SectionHeader label={t.apply.s2SectionLocation} />
                <CityCountryFields
                  city={form.city}
                  otherCity={form.otherCity}
                  country={form.country}
                  onCityChange={(v) => handleChange('city', v)}
                  onOtherCityChange={(v) => handleChange('otherCity', v)}
                  onCountryChange={(v) => handleChange('country', v)}
                  t={t}
                />

                <SectionHeader label={t.apply.s2SectionMotivation} />
                <Field label={t.apply.s2MotivationLabel}>
                  <Textarea
                    value={form.motivation}
                    onChange={(v) => handleChange('motivation', v)}
                    rows={3}
                  />
                </Field>
                <Field label={t.apply.s2LookingForLabel}>
                  <Textarea
                    value={form.lookingFor}
                    onChange={(v) => handleChange('lookingFor', v)}
                    rows={3}
                  />
                </Field>

                <SectionHeader label={t.apply.s2SectionLinks} />
                <Field label={t.apply.s2Linkedin} hint={t.apply.s2LinkedinHint}>
                  <Input
                    type="url"
                    value={form.linkedin}
                    onChange={(v) => handleChange('linkedin', v)}
                    placeholder="https://linkedin.com/in/…"
                  />
                </Field>
                <Field label={t.apply.s2ProWebsiteLabel} hint={t.apply.s2ProWebsiteHint}>
                  <Input
                    type="url"
                    value={form.proWebsite}
                    onChange={(v) => handleChange('proWebsite', v)}
                    placeholder="https://…"
                  />
                </Field>
                <Field label={t.apply.s2StravaLabel}>
                  <Input
                    type="url"
                    value={form.stravaProfile}
                    onChange={(v) => handleChange('stravaProfile', v)}
                    placeholder="https://strava.com/athletes/…"
                  />
                </Field>
                <Field label={t.apply.s2OtherLinkLabel} hint={t.apply.s2OtherLinkHint}>
                  <Input
                    type="url"
                    value={form.otherLink}
                    onChange={(v) => handleChange('otherLink', v)}
                    placeholder="https://…"
                  />
                </Field>
                <Field label={t.profile.pictureLabel}>
                  <div className="flex items-center gap-4">
                    {form.profilePictureUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.profilePictureUrl}
                        alt=""
                        className="w-16 h-16 rounded-full object-cover border border-stone"
                      />
                    )}
                    <label className="font-mono text-xs tracking-[0.2em] text-paper-white border border-paper-white/30 px-5 py-3 rounded-full hover:border-ember hover:text-ember transition-colors cursor-pointer disabled:opacity-40">
                      {uploading ? t.profile.savingLabel.toUpperCase() : t.profile.pictureLabel.toUpperCase()}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {uploadError && (
                    <p className="mt-2 font-mono text-xs text-ember">{uploadError}</p>
                  )}
                </Field>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-7 py-4 rounded-full hover:bg-paper-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {saving ? t.profile.savingLabel.toUpperCase() : t.profile.saveLabel.toUpperCase()}
                  </button>
                  {saved && (
                    <span className="font-mono text-xs text-ember">{t.profile.savedMessage}</span>
                  )}
                </div>
              </form>

              <div className="mt-16 pt-10 border-t border-stone">
                <h2 className="font-display font-bold text-2xl tracking-tight text-paper-white uppercase mb-6">
                  {t.card.sectionLabel}
                </h2>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div ref={cardRef}>
                    <MemberCard
                      photoUrl={form.profilePictureUrl}
                      memberNo={memberNo}
                      name={name || '—'}
                      metaLine={metaLine}
                      bio={cardBio}
                      lookingFor={cardLookingFor}
                      sportLevel={sportLevelNumber}
                      itra={itra}
                      linkedin={form.linkedin}
                      stravaProfile={form.stravaProfile}
                      proWebsite={form.proWebsite}
                      whatsapp={whatsapp}
                    />
                  </div>

                  <div className="flex-1 w-full space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={handleGenerateCard}
                        disabled={generating}
                        className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-7 py-4 rounded-full hover:bg-paper-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {generating
                          ? t.card.generatingLabel.toUpperCase()
                          : (cardBio ? t.card.regenerateLabel : t.card.generateLabel).toUpperCase()}
                      </button>
                      {(cardBio || cardLookingFor) && (
                        <button
                          type="button"
                          onClick={handleDownloadCard}
                          disabled={downloadingCard}
                          className="font-mono text-xs tracking-[0.2em] text-paper-white border border-paper-white/30 px-7 py-4 rounded-full hover:border-ember hover:text-ember transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {downloadingCard
                            ? t.card.downloadingLabel.toUpperCase()
                            : t.card.downloadLabel.toUpperCase()}
                        </button>
                      )}
                    </div>
                    {generateError && (
                      <p className="font-mono text-xs text-ember">{generateError}</p>
                    )}

                    {(cardBio || cardLookingFor) && (
                      <>
                        <Field label={t.card.bioFieldLabel}>
                          <Textarea
                            value={cardBio}
                            onChange={(v) => {
                              setCardBio(v);
                              setCardStatus(null);
                            }}
                            rows={2}
                          />
                        </Field>
                        <Field label={t.card.lookingForFieldLabel}>
                          <Textarea
                            value={cardLookingFor}
                            onChange={(v) => {
                              setCardLookingFor(v);
                              setCardStatus(null);
                            }}
                            rows={2}
                          />
                        </Field>
                      </>
                    )}

                    <label className="flex items-start gap-3 font-sans text-sm text-ash leading-relaxed cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cardConsent}
                        onChange={(e) => setCardConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-ember"
                      />
                      <span>{t.card.consentLabel}</span>
                    </label>

                    {cardStatus !== 'suspended' && (
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={handleSubmitCard}
                          disabled={submittingCard || !cardBio || !cardLookingFor || !cardConsent}
                          className="font-mono text-xs tracking-[0.2em] text-paper-white border border-paper-white/30 px-7 py-4 rounded-full hover:border-ember hover:text-ember transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {submittingCard
                            ? t.card.submittingLabel.toUpperCase()
                            : t.card.submitLabel.toUpperCase()}
                        </button>
                      </div>
                    )}
                    {!cardBio && !cardLookingFor && (
                      <p className="font-mono text-xs text-ash">{t.card.needsGenerationMessage}</p>
                    )}
                    {cardSubmitError && (
                      <p className="font-mono text-xs text-ember">{cardSubmitError}</p>
                    )}
                    {cardStatus === 'submitted' && (
                      <p className="font-mono text-xs text-ember">{t.card.submittedMessage}</p>
                    )}
                    {cardStatus === 'validated' && (
                      <p className="font-mono text-xs text-ember">{t.card.validatedMessage}</p>
                    )}

                    {(cardStatus === 'submitted' || cardStatus === 'validated') && (
                      <div className="pt-6 border-t border-stone/50">
                        <button
                          type="button"
                          onClick={handleSuspendCard}
                          disabled={suspending}
                          className="font-mono text-xs tracking-[0.2em] text-ash border border-ash/30 px-7 py-4 rounded-full hover:border-ember hover:text-ember transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {suspending
                            ? t.card.suspendingLabel.toUpperCase()
                            : t.card.suspendLabel.toUpperCase()}
                        </button>
                      </div>
                    )}

                    {cardStatus === 'suspended' && (
                      <div className="pt-6 border-t border-stone/50 space-y-4">
                        <p className="font-mono text-xs text-ash">
                          {cardDeleteAfter
                            ? t.card.suspendedMessage.replace('{date}', cardDeleteAfter)
                            : t.card.suspendedMessage.replace('{date}', '—')}
                        </p>
                        <button
                          type="button"
                          onClick={handleReactivateCard}
                          disabled={suspending}
                          className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-7 py-4 rounded-full hover:bg-paper-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {suspending
                            ? t.card.reactivatingLabel.toUpperCase()
                            : t.card.reactivateLabel.toUpperCase()}
                        </button>
                      </div>
                    )}
                    {suspendError && <p className="font-mono text-xs text-ember">{suspendError}</p>}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
