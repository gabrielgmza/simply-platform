"use client";

import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, forwardRef } from "react";

interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, hint, error, children }: FormFieldProps) {
  return (
    <div>
      {label && <label className="text-xs text-white/50 mb-1.5 block">{label}</label>}
      {children}
      {hint && !error && <p className="text-xs text-white/40 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input ref={ref} className={className} {...props} />
  )
);
Input.displayName = "Input";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => (
    <select ref={ref} className={className} {...props}>
      {children}
    </select>
  )
);
Select.displayName = "Select";
