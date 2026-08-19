// SBL-26 follow-up — unified 3-step progress indicator spanning the whole apply funnel, not just
// one page: 1/3 the form (app/apply), 2/3 confirming the email (still app/apply, its own last
// internal step), 3/3 completing the profile (app/apply/confirmed). Replaces the old per-page
// Stepper (form-internal sub-steps) and the standalone "eyebrow" labels that gave no sense of
// where a candidate stood in the overall journey.

export default function OnboardingProgress({
  step,
  eyebrow,
  stepWord,
  label,
}: {
  step: 1 | 2 | 3;
  eyebrow: string;
  stepWord: string;
  label: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex gap-1.5 max-w-[180px] mb-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`flex-1 h-[3px] rounded-full ${n <= step ? 'bg-ember' : 'bg-stone'}`}
          />
        ))}
      </div>
      <p className="font-mono text-[10px] tracking-[0.25em] text-ember">
        {eyebrow.toUpperCase()} — {stepWord.toUpperCase()} {step}/3
      </p>
      <p className="mt-1 font-mono text-xs tracking-[0.1em] text-paper-white/80">{label}</p>
    </div>
  );
}
