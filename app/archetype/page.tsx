'use client';

// SBL-35 — native Trailblazer Archetype quiz, replacing the external Notion form. Session-gated
// like /profile (results attach straight to session.candidateId — no more manual email/name
// matching against a separate Notion "Archetype Responses" table). Retaking simply overwrites
// the previous result.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/lib/locale-provider';
import FlowHeader from '@/components/FlowHeader';
import ArchetypeAnalysis from '@/components/ArchetypeAnalysis';
import {
  ALL_ARCHETYPE_QUESTIONS,
  isComplete,
  archetypeBadge,
  type ArchetypeAnswers,
} from '@/lib/archetype';

export default function ArchetypePage() {
  const { t, locale } = useLocale();
  const router = useRouter();
  const homeHref = locale === 'en' ? '/?lang=en' : '/';
  const refugeHref = locale === 'en' ? '/refuge?lang=en' : '/refuge';

  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<ArchetypeAnswers>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ primary: string; secondary: string; analysis: string } | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.status === 401) {
          router.replace(`/login?next=${encodeURIComponent('/archetype')}`);
          return;
        }
        if (cancelled) return;
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleSelect = (questionId: string, value: string) => {
    setAnswers((a) => ({ ...a, [questionId]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!isComplete(answers)) {
      setError(t.archetype.incompleteError);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/profile/archetype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (res.status === 401) {
        router.replace(`/login?next=${encodeURIComponent('/archetype')}`);
        return;
      }
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error();
      setResult({ primary: body.primary, secondary: body.secondary, analysis: body.analysis });
    } catch {
      setError(t.archetype.generationError);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-trail-black text-paper-white">
        <FlowHeader homeHref={homeHref} backLabel={t.common.back} backHref={refugeHref} />
      </div>
    );
  }

  if (result) {
    const primaryBadge = archetypeBadge(result.primary, locale);
    const secondaryBadge = archetypeBadge(result.secondary, locale);
    return (
      <div className="min-h-screen bg-trail-black text-paper-white">
        <FlowHeader homeHref={homeHref} backLabel={t.common.back} backHref={refugeHref} />
        <main className="pt-32 md:pt-40 px-6 md:px-10 pb-32">
          <div className="max-w-2xl mx-auto space-y-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-ember mb-3">
                // {t.archetype.eyebrow.toUpperCase()}
              </p>
              <h1 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight text-paper-white">
                {t.archetype.resultHeading}
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="font-mono text-xs tracking-[0.15em] text-ember bg-ember/10 border border-ember/30 rounded-full px-3 py-1.5">
                {primaryBadge?.emoji} {t.archetype.primaryLabel}: {primaryBadge?.label}
              </span>
              <span className="font-mono text-xs tracking-[0.15em] text-dust bg-dust/10 border border-dust/30 rounded-full px-3 py-1.5">
                {secondaryBadge?.emoji} {t.archetype.secondaryLabel}: {secondaryBadge?.label}
              </span>
            </div>

            <div className="border-t border-stone pt-6">
              <ArchetypeAnalysis text={result.analysis} />
            </div>

            <p className="font-mono text-[10px] text-ash">{t.archetype.privateNote}</p>

            <Link
              href="/refuge"
              className="inline-block font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-7 py-4 rounded-full hover:bg-paper-white transition-colors"
            >
              {t.archetype.backToRefuge.toUpperCase()}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-trail-black text-paper-white">
      <FlowHeader homeHref={homeHref} backLabel={t.common.back} backHref={refugeHref} />
      <main className="pt-32 md:pt-40 px-6 md:px-10 pb-32">
        <div className="max-w-2xl mx-auto space-y-10">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-ember mb-3">
              // {t.archetype.eyebrow.toUpperCase()}
            </p>
            <h1 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight text-paper-white">
              {t.archetype.quizTitle}
            </h1>
            <p className="mt-4 font-sans text-base text-ash leading-relaxed">
              {t.archetype.quizLead}
            </p>
            <p className="mt-2 font-mono text-[10px] text-ash">{t.archetype.privateNote}</p>
          </div>

          <div className="space-y-8">
            {ALL_ARCHETYPE_QUESTIONS.map((q, i) => (
              <div key={q.id} className="border-t border-stone pt-6">
                <p className="font-mono text-[10px] tracking-[0.25em] text-ember mb-2">
                  {i + 1}/{ALL_ARCHETYPE_QUESTIONS.length} — {q.axisLabel[locale].toUpperCase()}
                </p>
                <p className="font-display font-bold text-lg text-paper-white mb-4">
                  {q.prompt[locale]}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(q.id, opt.value)}
                        className={`text-left px-4 py-3 rounded border font-sans text-sm leading-snug transition-colors ${
                          selected
                            ? 'border-ember bg-ember/10 text-paper-white'
                            : 'border-stone text-ash hover:border-ember/50 hover:text-paper-white'
                        }`}
                      >
                        {opt.label[locale]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {error && <p className="font-mono text-xs text-ember">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="font-mono text-xs tracking-[0.2em] bg-ember text-trail-black px-7 py-4 rounded-full hover:bg-paper-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? t.archetype.submittingCta.toUpperCase() : t.archetype.submitCta.toUpperCase()}
          </button>
        </div>
      </main>
    </div>
  );
}
