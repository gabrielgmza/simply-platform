import React from 'react';
type IconName =
  | 'sparkles' | 'card' | 'qr' | 'ai' | 'shield' | 'money' | 'coins'
  | 'users' | 'building' | 'globe' | 'gem' | 'plane' | 'headset'
  | 'receipt' | 'lock' | 'phone' | 'laptop' | 'network';

const PATHS: Record<IconName, React.ReactElement> = {
  sparkles: <><path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z"/><path d="M19 15l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"/></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/><path d="M7 15h4"/></>,
  qr: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 15h3v3h-3zM20 14v7h-5"/></>,
  ai: <><path d="M9 3.5a3 3 0 0 0-3 3v.3a3.4 3.4 0 0 0-2 3.1 3.2 3.2 0 0 0 1.4 2.7A3.7 3.7 0 0 0 9 20.5"/><path d="M15 3.5a3 3 0 0 1 3 3v.3a3.4 3.4 0 0 1 2 3.1 3.2 3.2 0 0 1-1.4 2.7A3.7 3.7 0 0 1 15 20.5"/><path d="M9 3.5v17M15 3.5v17M9 10h3M12 14h3"/></>,
  shield: <><path d="M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5l8-3Z"/><path d="m8.5 12 2.4 2.4 4.8-5"/></>,
  money: <><circle cx="12" cy="12" r="9"/><path d="M12 6v12M15.5 8.5H10a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8.5"/></>,
  coins: <><ellipse cx="9" cy="6" rx="6" ry="3"/><path d="M3 6v4c0 1.7 2.7 3 6 3s6-1.3 6-3V6"/><path d="M9 13v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4"/></>,
  users: <><circle cx="9" cy="8" r="3"/><path d="M2 20a7 7 0 0 1 14 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 15a6 6 0 0 1 6 5"/></>,
  building: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01M9 21v-5h6v5"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
  gem: <><path d="M6 3h12l4 6-10 12L2 9l4-6Z"/><path d="M2 9h20M6 3l6 6 6-6M8 9l4 12 4-12"/></>,
  plane: <><path d="M2 16 22 7l-9 15-2-7-9 1Z"/><path d="M22 7 11 15"/></>,
  headset: <><path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="12" width="4" height="6" rx="2"/><rect x="17" y="12" width="4" height="6" rx="2"/><path d="M18 19c-1 1.5-3 2-6 2"/></>,
  receipt: <><path d="M6 2h12v20l-2-1-2 1-2-1-2 1-2-1-2 1V2Z"/><path d="M9 7h6M9 11h6M9 15h4"/></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 15v2"/></>,
  phone: <><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 18h4"/></>,
  laptop: <><rect x="5" y="4" width="14" height="11" rx="2"/><path d="M3 19h18l-2-4H5l-2 4Z"/></>,
  network: <><circle cx="12" cy="12" r="3"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 7.2 10 10m4 0 3-2.8m-7 6.8-3 2.8m7-2.8 3 2.8"/></>,
};

export function iconFor(t: string): IconName {
  const s = (t || '').toLowerCase();
  if (/visa|card|tarjeta|cart/.test(s)) return 'card';
  if (/qr/.test(s)) return 'qr';
  if (/ai|ia|fraud|riesgo|risk/.test(s)) return 'ai';
  if (/segur|trust|kyc|compliance|priv/.test(s)) return 'shield';
  if (/fondo|fund|invest|renta|coins/.test(s)) return 'coins';
  if (/cash|cuota|financ|payment|pago|money/.test(s)) return 'money';
  if (/empresa|business|erp|fact|proveedor/.test(s)) return 'building';
  if (/diamond|black|vip|premium/.test(s)) return 'gem';
  if (/viaje|travel|hotel|lounge/.test(s)) return 'plane';
  if (/concierge|soporte|help|ayuda/.test(s)) return 'headset';
  if (/android|ios|app|phone/.test(s)) return 'phone';
  if (/web/.test(s)) return 'laptop';
  if (/partner|ecosistema|network/.test(s)) return 'network';
  return 'sparkles';
}

export default function Icon({
  name = 'sparkles',
  size = 24,
  className = '',
}: { name?: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[name] ?? PATHS.sparkles}
    </svg>
  );
}

export function Badge({ name, gold = false }: { name: IconName; gold?: boolean }) {
  return (
    <span className={'badge ' + (gold ? 'gold' : '')}>
      <Icon name={name} size={26} />
    </span>
  );
}
