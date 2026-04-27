"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", loading, leftIcon, rightIcon, fullWidth = true, children, className = "", disabled, ...props }, ref) => {
    const base = variant === "primary" ? "btn-primary" : "btn-secondary";
    const width = fullWidth ? "w-full" : "";
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${width} flex items-center justify-center gap-2 ${className}`}
        {...props}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";
