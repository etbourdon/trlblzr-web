// Shared City/Country block — used by /apply and /profile. Auto-fills Country for known
// cities (still editable) and reveals a free-text "which city?" input when City = Autre,
// since Country alone can't capture an arbitrary city name.

import { Field, Input } from '@/components/FormFields';
import { CITY_OPTIONS, CITY_TO_COUNTRY } from '@/lib/field-options';
import type { Dict } from '@/lib/i18n';

export default function CityCountryFields({
  city,
  otherCity,
  country,
  onCityChange,
  onOtherCityChange,
  onCountryChange,
  t,
}: {
  city: string;
  otherCity: string;
  country: string;
  onCityChange: (city: string) => void;
  onOtherCityChange: (v: string) => void;
  onCountryChange: (v: string) => void;
  t: Dict;
}) {
  const handleCityChange = (value: string) => {
    onCityChange(value);
    const autoCountry = CITY_TO_COUNTRY[value as keyof typeof CITY_TO_COUNTRY];
    if (autoCountry) onCountryChange(autoCountry);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label={t.apply.s2CityLabel}>
          <select
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
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
          <Input value={country} onChange={onCountryChange} />
        </Field>
      </div>

      {city === 'Autre' && (
        <Field label={t.apply.s2OtherCityLabel}>
          <Input value={otherCity} onChange={onOtherCityChange} />
        </Field>
      )}
    </>
  );
}
