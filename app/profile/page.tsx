'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/locale-provider';
import FlowHeader from '@/components/FlowHeader';
import SessionPicker from '@/components/SessionPicker';
import { Field, Input, Textarea, SectionHeader } from '@/components/FormFields';
import { SPORT_LEVEL_LABELS, CITY_OPTIONS } from '@/lib/field-options';
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
  country: string;
  sportLevel: SportLevel;
  lookingFor: string;
  motivation: string;
  profilePictureUrl: string;
  sessions: string[];
};

const EMPTY_FORM: FormState = {
  selfDescription: '',
  role: '',
  company: '',
  linkedin: '',
  stravaProfile: '',
  proWebsite: '',
  otherLink: '',
  city: '',
  country: '',
  sportLevel: '',
  lookingFor: '',
  motivation: '',
  profilePictureUrl: '',
  sessions: [],
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
          country: c.country || '',
          sportLevel: (CODE_BY_SPORT_LABEL[c.sportLevel] as SportLevel) || '',
          lookingFor: c.lookingFor || '',
          motivation: c.motivation || '',
          profilePictureUrl: c.profilePictureUrl || '',
          sessions: mapLabelsToSlugs(c.sessionLabels),
        });
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

  const toggleSession = (slug: string) => {
    setForm((f) => ({
      ...f,
      sessions: f.sessions.includes(slug)
        ? f.sessions.filter((s) => s !== slug)
        : [...f.sessions, slug],
    }));
    setSaved(false);
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

              <form onSubmit={handleSubmit} className="mt-10 space-y-8">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label={t.apply.s2CityLabel}>
                    <select
                      value={form.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full bg-stone border border-stone focus:border-ember text-paper-white px-4 py-3 font-mono text-sm rounded outline-none transition-colors"
                    >
                      <option value="">—</option>
                      {CITY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c === 'Autre' ? t.apply.s2CityOther : c}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={t.apply.s2CountryLabel} hint={t.apply.s2CountryHint}>
                    <Input value={form.country} onChange={(v) => handleChange('country', v)} />
                  </Field>
                </div>

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
                  <Input
                    type="url"
                    value={form.profilePictureUrl}
                    onChange={(v) => handleChange('profilePictureUrl', v)}
                    placeholder="https://…"
                  />
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
