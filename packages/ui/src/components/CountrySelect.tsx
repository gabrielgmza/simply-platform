"use client";

import { SelectHTMLAttributes } from "react";

interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
}

interface CountrySelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  countries: Country[];
  value: string;
  onChange: (code: string) => void;
}

export function CountrySelect({ countries, value, onChange, ...props }: CountrySelectProps) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} {...props}>
      {countries.map((c) => (
        <option key={c.code} value={c.code}>
          {c.flag} {c.name} ({c.currency})
        </option>
      ))}
    </select>
  );
}
