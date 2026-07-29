// Shared form building blocks — originally lived only in app/apply/page.tsx, now also used by
// /login and /profile (Batch 5.1). Kept intentionally tiny/unstyled-beyond-the-design-system.

export function SectionHeader({ label }: { label: string }) {
  return (
    <div className="pt-4 border-t border-stone">
      <p className="font-mono text-[10px] tracking-[0.3em] text-ember">// {label.toUpperCase()}</p>
    </div>
  );
}

export function Field({
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

export function Input({
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

export function Textarea({
  value,
  onChange,
  rows = 3,
  required = false,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-stone border border-stone focus:border-ember text-paper-white px-4 py-3 font-sans text-sm rounded outline-none transition-colors placeholder:text-ash/60 resize-y leading-relaxed"
    />
  );
}
