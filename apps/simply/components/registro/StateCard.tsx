"use client";

import {
  SuccessIllustration,
  WarningIllustration,
  ErrorIllustration,
  EmptyIllustration,
  VerifiedShieldIllustration,
} from "./Illustrations";

type StateKind = "success" | "warning" | "error" | "empty" | "verified";

interface Props {
  kind: StateKind;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const COLOR_BY_KIND: Record<StateKind, { border: string; bg: string }> = {
  success:  { border: "border-green-500/20", bg: "bg-green-500/5" },
  warning:  { border: "border-amber-500/20", bg: "bg-amber-500/5" },
  error:    { border: "border-red-500/20",   bg: "bg-red-500/5" },
  empty:    { border: "border-white/8",      bg: "bg-white/[0.02]" },
  verified: { border: "border-blue-500/25",  bg: "bg-blue-500/5" },
};

const ILLUSTRATION_BY_KIND: Record<StateKind, React.ComponentType<any>> = {
  success:  SuccessIllustration,
  warning:  WarningIllustration,
  error:    ErrorIllustration,
  empty:    EmptyIllustration,
  verified: VerifiedShieldIllustration,
};

export default function StateCard({
  kind,
  title,
  description,
  children,
  className = "",
}: Props) {
  const colors = COLOR_BY_KIND[kind];
  const Illustration = ILLUSTRATION_BY_KIND[kind];

  return (
    <div
      className={[
        "rounded-2xl border p-6 text-center space-y-3 animate-scale-in",
        colors.border,
        colors.bg,
        className,
      ].join(" ")}
    >
      <div className="flex items-center justify-center">
        <Illustration size={kind === "verified" ? 120 : 88} />
      </div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {description && (
        <p className="text-sm text-white/65 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {children && <div className="pt-2">{children}</div>}
    </div>
  );
}
