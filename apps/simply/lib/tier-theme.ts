// Paletas por nivel de cuenta

export type TierCode =
  | 'STANDARD'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | 'DIAMOND'
  | 'BLACK_DIAMOND'
  | 'standard'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'black_diamond';

export interface TierTheme {
  // Hero / cards principales
  heroGradient: string;       // bg-gradient-to-br ...
  heroRing: string;           // ring-1 ring-... (borde sutil)
  // Acento (badges, botones secundarios)
  accentText: string;
  accentBg: string;
  accentRing: string;
  // Icono del tier
  iconColor: string;
  // Progress bar
  progressBar: string;
  // Acción primaria (botones Enviar/Recibir)
  primaryBtnBg: string;
  primaryBtnText: string;
  // Label del tier para mostrar
  label: string;
}

const THEMES: Record<string, TierTheme> = {
  standard: {
    heroGradient: 'bg-gradient-to-br from-blue-600/30 via-sky-500/20 to-cyan-500/15',
    heroRing: 'ring-1 ring-blue-400/20',
    accentText: 'text-blue-300',
    accentBg: 'bg-blue-500/15',
    accentRing: 'ring-blue-500/30',
    iconColor: 'text-blue-400',
    progressBar: 'bg-blue-400',
    primaryBtnBg: 'bg-blue-600 hover:bg-blue-500',
    primaryBtnText: 'text-white',
    label: 'Standard',
  },
  silver: {
    heroGradient: 'bg-gradient-to-br from-slate-400/30 via-slate-500/20 to-blue-700/20',
    heroRing: 'ring-1 ring-slate-400/30',
    accentText: 'text-slate-200',
    accentBg: 'bg-slate-400/15',
    accentRing: 'ring-slate-400/30',
    iconColor: 'text-slate-300',
    progressBar: 'bg-slate-300',
    primaryBtnBg: 'bg-slate-500 hover:bg-slate-400',
    primaryBtnText: 'text-white',
    label: 'Plata',
  },
  gold: {
    heroGradient: 'bg-gradient-to-br from-amber-500/35 via-yellow-500/25 to-orange-500/20',
    heroRing: 'ring-1 ring-amber-400/30',
    accentText: 'text-amber-200',
    accentBg: 'bg-amber-500/15',
    accentRing: 'ring-amber-500/30',
    iconColor: 'text-amber-300',
    progressBar: 'bg-amber-400',
    primaryBtnBg: 'bg-amber-500 hover:bg-amber-400',
    primaryBtnText: 'text-zinc-900',
    label: 'Oro',
  },
  platinum: {
    heroGradient: 'bg-gradient-to-br from-slate-200/20 via-cyan-300/15 to-indigo-900/40',
    heroRing: 'ring-1 ring-cyan-400/30',
    accentText: 'text-cyan-100',
    accentBg: 'bg-cyan-400/15',
    accentRing: 'ring-cyan-400/30',
    iconColor: 'text-cyan-200',
    progressBar: 'bg-gradient-to-r from-slate-200 to-cyan-300',
    primaryBtnBg: 'bg-gradient-to-r from-slate-300 to-cyan-400 hover:from-slate-200 hover:to-cyan-300',
    primaryBtnText: 'text-zinc-900',
    label: 'Platino',
  },
  diamond: {
    heroGradient: 'bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-pink-500/20',
    heroRing: 'ring-1 ring-violet-400/30',
    accentText: 'text-violet-200',
    accentBg: 'bg-violet-500/15',
    accentRing: 'ring-violet-500/30',
    iconColor: 'text-violet-300',
    progressBar: 'bg-violet-400',
    primaryBtnBg: 'bg-violet-600 hover:bg-violet-500',
    primaryBtnText: 'text-white',
    label: 'Diamante',
  },
  black_diamond: {
    heroGradient: 'bg-gradient-to-br from-zinc-900 via-black to-amber-900/40',
    heroRing: 'ring-1 ring-amber-500/40',
    accentText: 'text-amber-300',
    accentBg: 'bg-amber-500/10',
    accentRing: 'ring-amber-500/40',
    iconColor: 'text-amber-400',
    progressBar: 'bg-gradient-to-r from-amber-400 to-slate-300',
    primaryBtnBg: 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500',
    primaryBtnText: 'text-black',
    label: 'Black Diamond',
  },
};

export function getTierTheme(level?: string | null): TierTheme {
  if (!level) return THEMES.standard;
  return THEMES[level.toLowerCase()] || THEMES.standard;
}
