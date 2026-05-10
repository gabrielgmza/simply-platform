"use client";

/**
 * Ilustraciones SVG inline con animaciones CSS.
 * Pesan ~1KB cada una, sin librerías externas.
 */

interface Props {
  size?: number;
  className?: string;
}

// ─────────────────────────────────────────────────────────────
// SUCCESS: círculo + check con animación de "draw"
// ─────────────────────────────────────────────────────────────

export function SuccessIllustration({ size = 96, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* Glow */}
      <defs>
        <radialGradient id="succ-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(34,197,94)" stopOpacity="0.35" />
          <stop offset="70%" stopColor="rgb(34,197,94)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="succ-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(34,197,94)" stopOpacity="0.20" />
          <stop offset="100%" stopColor="rgb(34,197,94)" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      <circle cx="48" cy="48" r="46" fill="url(#succ-glow)" />
      <circle
        cx="48" cy="48" r="32"
        fill="url(#succ-bg)"
        stroke="rgb(34,197,94)"
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />

      {/* Check con animación de draw */}
      <path
        d="M34 48 L44 58 L62 38"
        stroke="rgb(74,222,128)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: 50,
          strokeDashoffset: 50,
          animation: "drawCheck 600ms ease-out 200ms forwards",
        }}
      />

      <style>{`
        @keyframes drawCheck { to { stroke-dashoffset: 0; } }
      `}</style>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// WARNING: triángulo con animación sutil de pulse
// ─────────────────────────────────────────────────────────────

export function WarningIllustration({ size = 96, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id="warn-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(251,191,36)" stopOpacity="0.30" />
          <stop offset="70%" stopColor="rgb(251,191,36)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="warn-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(251,191,36)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="rgb(251,191,36)" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      <circle cx="48" cy="48" r="46" fill="url(#warn-glow)" />
      <path
        d="M48 16 L82 76 L14 76 Z"
        fill="url(#warn-bg)"
        stroke="rgb(251,191,36)"
        strokeWidth="1.5"
        strokeOpacity="0.6"
        strokeLinejoin="round"
      />

      {/* Línea + punto */}
      <line
        x1="48" y1="38" x2="48" y2="58"
        stroke="rgb(251,191,36)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="48" cy="68" r="2.5" fill="rgb(251,191,36)" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// ERROR: círculo con X
// ─────────────────────────────────────────────────────────────

export function ErrorIllustration({ size = 96, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id="err-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(239,68,68)" stopOpacity="0.35" />
          <stop offset="70%" stopColor="rgb(239,68,68)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="err-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(239,68,68)" stopOpacity="0.20" />
          <stop offset="100%" stopColor="rgb(239,68,68)" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      <circle cx="48" cy="48" r="46" fill="url(#err-glow)" />
      <circle
        cx="48" cy="48" r="32"
        fill="url(#err-bg)"
        stroke="rgb(239,68,68)"
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />

      {/* X */}
      <line x1="38" y1="38" x2="58" y2="58"
        stroke="rgb(248,113,113)" strokeWidth="3.5" strokeLinecap="round"
        style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: "drawX 350ms ease-out forwards" }}
      />
      <line x1="58" y1="38" x2="38" y2="58"
        stroke="rgb(248,113,113)" strokeWidth="3.5" strokeLinecap="round"
        style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: "drawX 350ms ease-out 150ms forwards" }}
      />

      <style>{`@keyframes drawX { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// EMPTY: caja vacía sutil
// ─────────────────────────────────────────────────────────────

export function EmptyIllustration({ size = 96, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="empty-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>
      </defs>
      <rect x="20" y="32" width="56" height="44" rx="6"
        fill="url(#empty-bg)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <path d="M20 40 L48 56 L76 40"
        fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="38" y1="22" x2="38" y2="32" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="48" y1="18" x2="48" y2="32" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="58" y1="22" x2="58" y2="32" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// VERIFIED: shield con check (para resultado final del KYC)
// ─────────────────────────────────────────────────────────────

export function VerifiedShieldIllustration({ size = 120, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id="verified-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.45" />
          <stop offset="70%" stopColor="rgb(59,130,246)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="shield-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.30" />
          <stop offset="100%" stopColor="rgb(37,99,235)" stopOpacity="0.10" />
        </linearGradient>
      </defs>

      <circle cx="60" cy="60" r="58" fill="url(#verified-glow)" />

      {/* Shield */}
      <path
        d="M60 22 L88 32 V58 C88 76 76 90 60 96 C44 90 32 76 32 58 V32 Z"
        fill="url(#shield-fill)"
        stroke="rgb(96,165,250)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Check interno */}
      <path
        d="M46 60 L56 70 L74 50"
        stroke="rgb(147,197,253)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: 60,
          strokeDashoffset: 60,
          animation: "drawShieldCheck 700ms ease-out 250ms forwards",
        }}
      />

      <style>{`
        @keyframes drawShieldCheck { to { stroke-dashoffset: 0; } }
      `}</style>
    </svg>
  );
}
