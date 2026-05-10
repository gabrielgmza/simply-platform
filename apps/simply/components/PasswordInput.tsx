"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";

export interface PasswordRule {
  label: string;
  test: (pwd: string) => boolean;
}

const RULES: PasswordRule[] = [
  { label: "Mínimo 10 caracteres", test: (p) => p.length >= 10 },
  { label: "Al menos 1 mayúscula",  test: (p) => /[A-Z]/.test(p) },
  { label: "Al menos 1 número",     test: (p) => /[0-9]/.test(p) },
];

export function isPasswordValid(password: string): boolean {
  return RULES.every((r) => r.test(password));
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  showRules?: boolean;
  autoFocus?: boolean;
  label?: string;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Tu password",
  showRules = true,
  autoFocus = false,
  label,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium block">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="new-password"
          spellCheck={false}
          className="w-full pr-11 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 outline-none focus:border-blue-500 transition"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-white transition"
          aria-label={visible ? "Ocultar password" : "Mostrar password"}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {showRules && value.length > 0 && (
        <div className="space-y-1 pt-1">
          {RULES.map((rule) => {
            const ok = rule.test(value);
            return (
              <div
                key={rule.label}
                className={`flex items-center gap-1.5 text-xs transition ${
                  ok ? "text-green-400" : "text-zinc-500"
                }`}
              >
                {ok ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                {rule.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
