'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { REAL_ROUTES, type PageKey, COMPANY_NAME, CONTACT_EMAIL, CRYPTO_URL } from '@/lib/routes';

const LANGS = { es: 'ES', en: 'EN', pt: 'PT' } as const;
type Lang = keyof typeof LANGS;

const SOCIALS: [string, string][] = [['X', '#'], ['Instagram', '#'], ['LinkedIn', '#'], ['YouTube', '#']];
const COMPANY_ADDRESS_ES = '651 North Broad Street, Middletown, Delaware, Estados Unidos';
const COMPANY_ADDRESS_EN = '651 North Broad Street, Middletown, Delaware, United States';

const SIMPLY_LOGO_HORIZONTAL = '/assets/logo-simply.webp';
const STANDARD_CARD_IMAGE = '/assets/standard-card.webp';
const DIAMOND_CARD_IMAGE = '/assets/diamond-card.webp';
const HERO_WEB_IMAGE = '/assets/hero-web.webp';
const BUSINESS_DASHBOARD_IMAGE = '/assets/business-dashboard.webp';
const PARTNERS_TECH_IMAGE = '/assets/partners-tech.webp';
const DIAMOND_HERO_IMAGE = '/assets/diamond-hero.webp';
const PEOPLE_INVEST_IMAGE = '/assets/people-invest.webp';
const BUSINESS_IMAGE = '/assets/business-office.webp';
const PARTNERS_IMAGE = '/assets/partners-office.webp';
const DIAMOND_LIFESTYLE_IMAGE = '/assets/diamond-lifestyle.webp';
const APP_HOME = '/assets/app-home.webp';
const APP_CARDS = '/assets/app-cards.webp';
const APP_ANALYTICS = '/assets/app-analytics.webp';
const APP_ONBOARDING = '/assets/app-onboarding.webp';
const LIFESTYLE_PAYMENT = '/assets/lifestyle-payment.webp';
const LIFESTYLE_AI = '/assets/lifestyle-ai-savings.webp';
const LIFESTYLE_DIAMOND = '/assets/lifestyle-diamond.webp';
const LIFESTYLE_TRAVEL = '/assets/lifestyle-travel.webp';

const ROUTE_TO_PAGE = Object.fromEntries(
  Object.entries(REAL_ROUTES).map(([page, route]) => [route, page]),
) as Record<string, PageKey>;

const cx = (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(' ');

// ============ ICONOS PREMIUM ============
type IconKind =
  | 'apple' | 'arrows' | 'badge' | 'chart' | 'bot' | 'brain' | 'briefcase' | 'building'
  | 'check' | 'dollar' | 'coins' | 'card' | 'crown' | 'file' | 'fingerprint' | 'gem'
  | 'globe' | 'headset' | 'heart' | 'hotel' | 'key' | 'landmark' | 'laptop' | 'layers'
  | 'lock' | 'network' | 'plane' | 'qr' | 'receipt' | 'scan' | 'shield' | 'shopping'
  | 'phone' | 'sparkles' | 'star' | 'user' | 'users' | 'wallet';

function PremiumSvgIcon({
  kind = 'sparkles',
  size = 24,
  strokeWidth = 1.8,
  className = '',
}: { kind?: IconKind; size?: number; strokeWidth?: number; className?: string }) {
  const baseProps = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth, strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const, className, 'aria-hidden': true,
  };
  const icons: Record<IconKind, React.ReactNode> = {
    apple: <><path d="M15.8 6.2c.8-1 1.2-2.1 1.1-3.2-1.2.1-2.4.8-3.1 1.7-.7.8-1.2 1.9-1.1 3 1.2.1 2.3-.5 3.1-1.5Z"/><path d="M18.8 13.2c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.1-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.3-.8s1.9.8 3.3.8c1.4 0 2.2-1.2 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.8-1.1-2.8-4Z"/></>,
    arrows: <><path d="M7 7h13l-3-3"/><path d="M20 7l-3 3"/><path d="M17 17H4l3-3"/><path d="M4 17l3 3"/></>,
    badge: <><path d="M8.5 3.6 12 2l3.5 1.6 3.8.5.5 3.8L22 12l-1.6 3.5-.5 3.8-3.8.5L12 22l-3.5-1.6-3.8-.5-.5-3.8L2 12l1.6-3.5.5-3.8 3.8-.5Z"/><path d="m8.8 12 2.2 2.2 4.5-5"/></>,
    chart: <><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-5"/><path d="M12 16V8"/><path d="M16 16v-7"/><path d="M20 16v-3"/></>,
    bot: <><rect x="5" y="7" width="14" height="11" rx="3"/><path d="M12 7V4"/><path d="M8.5 12h.01"/><path d="M15.5 12h.01"/><path d="M9 16h6"/><path d="M3 11v4"/><path d="M21 11v4"/></>,
    brain: <><path d="M9 3.5a3 3 0 0 0-3 3v.3a3.4 3.4 0 0 0-2 3.1 3.2 3.2 0 0 0 1.4 2.7A3.7 3.7 0 0 0 9 20.5"/><path d="M15 3.5a3 3 0 0 1 3 3v.3a3.4 3.4 0 0 1 2 3.1 3.2 3.2 0 0 1-1.4 2.7A3.7 3.7 0 0 1 15 20.5"/><path d="M9 3.5v17"/><path d="M15 3.5v17"/><path d="M9 9h3"/><path d="M12 14h3"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/><path d="M10 12v2h4v-2"/></>,
    building: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h.01"/><path d="M12 7h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M9 21v-5h6v5"/></>,
    check: <path d="M20 6 9 17l-5-5"/>,
    dollar: <><circle cx="12" cy="12" r="9"/><path d="M12 6v12"/><path d="M15.5 8.5H10a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8.5"/></>,
    coins: <><ellipse cx="9" cy="6" rx="6" ry="3"/><path d="M3 6v4c0 1.7 2.7 3 6 3s6-1.3 6-3V6"/><path d="M9 13v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4"/><path d="M15 10c3.3 0 6 1.3 6 3"/></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/><path d="M7 15h4"/><path d="M15 15h2"/></>,
    crown: <><path d="m3 8 4 3 5-7 5 7 4-3-2 11H5L3 8Z"/><path d="M5 19h14"/></>,
    file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6"/><path d="M8 13h8"/><path d="M8 17h6"/></>,
    fingerprint: <><path d="M6.5 10.5a5.5 5.5 0 0 1 11 0"/><path d="M5 14c.3 4 3 6 7 6"/><path d="M19 14c-.2 2.8-1.4 4.6-3.4 5.5"/><path d="M9 14.5v-4a3 3 0 0 1 6 0v1.5"/><path d="M12 14v6"/></>,
    gem: <><path d="M6 3h12l4 6-10 12L2 9l4-6Z"/><path d="M2 9h20"/><path d="M6 3l6 6 6-6"/><path d="m8 9 4 12 4-12"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/></>,
    headset: <><path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="12" width="4" height="6" rx="2"/><rect x="17" y="12" width="4" height="6" rx="2"/><path d="M18 19c-1 1.5-3 2-6 2"/></>,
    heart: <><path d="M20.5 9.5c0 6-8.5 11-8.5 11s-8.5-5-8.5-11A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.5 3.5Z"/><path d="M8 13h2l1-3 2 6 1-3h2"/></>,
    hotel: <><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M16 8h2a2 2 0 0 1 2 2v11"/><path d="M8 7h4"/><path d="M8 11h4"/><path d="M8 15h4"/><path d="M3 21h18"/></>,
    key: <><circle cx="7.5" cy="14.5" r="3.5"/><path d="M10 12 21 1"/><path d="m16 6 2 2"/><path d="m13 9 2 2"/></>,
    landmark: <><path d="M3 9 12 3l9 6"/><path d="M4 10h16"/><path d="M6 10v8"/><path d="M10 10v8"/><path d="M14 10v8"/><path d="M18 10v8"/><path d="M3 21h18"/></>,
    laptop: <><rect x="5" y="4" width="14" height="11" rx="2"/><path d="M3 19h18l-2-4H5l-2 4Z"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 15v2"/></>,
    network: <><circle cx="12" cy="12" r="3"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 7.2 10 10"/><path d="m14 10 3-2.8"/><path d="m10 14-3 2.8"/><path d="m14 14 3 2.8"/></>,
    plane: <><path d="M2 16 22 7l-9 15-2-7-9 1Z"/><path d="M22 7 11 15"/></>,
    qr: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3z"/><path d="M21 14v7h-4"/><path d="M14 21h1"/></>,
    receipt: <><path d="M6 2h12v20l-2-1-2 1-2-1-2 1-2-1-2 1V2Z"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M9 15h4"/></>,
    scan: <><path d="M4 7V5a1 1 0 0 1 1-1h2"/><path d="M17 4h2a1 1 0 0 1 1 1v2"/><path d="M20 17v2a1 1 0 0 1-1 1h-2"/><path d="M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M7 12h10"/></>,
    shield: <><path d="M12 2 20 5v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5l8-3Z"/><path d="m8.5 12 2.4 2.4 4.8-5"/></>,
    shopping: <><path d="M6 8h12l-1 13H7L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/><path d="M9 13h6"/></>,
    phone: <><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 18h4"/></>,
    sparkles: <><path d="M12 2 14 8l6 2-6 2-2 6-2-6-6-2 6-2 2-6Z"/><path d="M19 15l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"/><path d="M4 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z"/></>,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.9 6.6 19.8l1-6.1-4.4-4.3 6.1-.9L12 3Z"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/><path d="m16 15 2 2 4-4"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M2 20a7 7 0 0 1 14 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 15a6 6 0 0 1 6 5"/></>,
    wallet: <><path d="M4 7h15a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12"/><path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z"/></>,
  };
  return <svg {...baseProps}>{icons[kind] ?? icons.sparkles}</svg>;
}

function normalizeIconKey(value = '') {
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getPremiumIconKind(value = ''): IconKind {
  const text = normalizeIconKey(value);
  if (/visa|tarjeta|card/.test(text)) return 'card';
  if (/qr/.test(text)) return 'qr';
  if (/fci|fondo|fund|inversion|investment|coins|renta|rendimiento/.test(text)) return 'coins';
  if (/cashback|\$|money|cuota|financi|financing|48|60|pago|payment|revenue|factoring/.test(text)) return 'dollar';
  if (/reward|beneficio|points|puntos/.test(text)) return 'sparkles';
  if (/ai|ia|advisor|asesor|inteligencia|risk|riesgo|fraud|fraude|score/.test(text)) return 'brain';
  if (/seguridad|security|trust|shield|cumplimiento|compliance|kyc|kyb|audit|auditoria|validacion/.test(text)) return 'shield';
  if (/transfer|multi|divisa|stable|crypto|cripto|swap/.test(text)) return 'arrows';
  if (/empresa|business|comercio|merchant|partner|proveedor|provider|erp|role|rol|usuario/.test(text)) return 'building';
  if (/factura|invoice|receipt|ticket|conciliacion/.test(text)) return 'receipt';
  if (/viaje|travel|hotel|lounge|vip|aeropuerto|elite/.test(text)) return 'plane';
  if (/concierge|advisor|soporte|support|ayuda|help/.test(text)) return 'headset';
  if (/medical|medica|salud|seguro|insurance|coverage|cobertura/.test(text)) return 'heart';
  if (/shop|compra|garantia|warranty|designer/.test(text)) return 'shopping';
  if (/diamond|black|premium|private|exclusiv/.test(text)) return 'gem';
  if (/android|phone|mobile|movil/.test(text)) return 'phone';
  if (/ios|iphone|apple/.test(text)) return 'apple';
  if (/web|browser|navegador|laptop/.test(text)) return 'laptop';
  if (/network|partner|ecosistema/.test(text)) return 'network';
  return 'sparkles';
}

function IconBadge({ children, gold = false, size = 'md' }: { children?: React.ReactNode; gold?: boolean; size?: 'md' | 'lg' }) {
  const kind = getPremiumIconKind(typeof children === 'string' ? children : '');
  const dims = size === 'lg' ? 'w-16 h-16 rounded-[1.35rem]' : 'w-13 h-13 rounded-[1.15rem]';
  const iconSize = size === 'lg' ? 28 : 22;
  const tone = gold
    ? 'border-[#d7b35a]/35 bg-[radial-gradient(circle_at_30%_20%,rgba(255,230,160,0.32),transparent_34%),linear-gradient(145deg,rgba(215,179,90,0.20),rgba(10,10,10,0.72))] text-[#f5df9a] shadow-[0_0_32px_rgba(215,179,90,0.22),inset_0_1px_0_rgba(255,255,255,0.18)]'
    : 'border-blue-400/30 bg-[radial-gradient(circle_at_30%_20%,rgba(130,190,255,0.36),transparent_34%),linear-gradient(145deg,rgba(37,99,235,0.22),rgba(10,10,10,0.76))] text-blue-100 shadow-[0_0_32px_rgba(37,99,235,0.24),inset_0_1px_0_rgba(255,255,255,0.16)]';
  return (
    <div className={`${dims} relative grid place-items-center border ${tone} overflow-hidden transition duration-500 group-hover:scale-105`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.28),transparent)] -translate-x-[120%] group-hover:translate-x-[120%] duration-700" />
      <PremiumSvgIcon kind={kind} size={iconSize} strokeWidth={1.65} className="relative z-10 drop-shadow-[0_0_14px_currentColor]" />
    </div>
  );
}

const SIMPLY_MARK = '/assets/logo-simply.webp';

function Logo({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  return (
    <div className={cx('flex items-center', className)}>
      <img
        src={SIMPLY_LOGO_HORIZONTAL}
        alt="Simply"
        className={compact ? 'h-7 w-auto' : 'h-8 sm:h-9 w-auto'}
        draggable={false}
      />
    </div>
  );
}

function Button({
  children, onClick, href, variant = 'primary', className = '', type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'gold';
  className?: string;
  type?: 'button' | 'submit';
}) {
  const cls = variant === 'gold'
    ? 'text-black bg-[linear-gradient(135deg,#d7b35a,#f0d889,#b7862f)] shadow-[0_0_25px_rgba(214,173,84,0.25)] hover:shadow-[0_0_45px_rgba(214,173,84,0.50)]'
    : variant === 'secondary'
      ? 'border border-zinc-700 hover:border-blue-500 bg-black/30 text-white'
      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_35px_rgba(37,99,235,0.45)]';
  const base = cx(
    'inline-flex items-center justify-center px-6 py-3 rounded-2xl text-sm font-semibold transition hover:-translate-y-0.5',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
    cls, className,
  );
  if (href) return <a href={href} className={base}>{children}</a>;
  return <button type={type} onClick={onClick} className={base}>{children}</button>;
}

function SectionTitle({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <div>
      <div className="text-blue-400 text-sm mb-4">{kicker}</div>
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      {text && <p className="mt-5 text-zinc-400 text-base leading-relaxed max-w-3xl">{text}</p>}
    </div>
  );
}

// ============ MOCKUPS ============
function PhoneMockup({ privateMode = false }: { privateMode?: boolean }) {
  const movements = privateMode
    ? [['Concierge', 'Reserva confirmada', '24/7'], ['Lounge access', 'Aeropuerto', 'Activo'], ['Hotel upgrade', 'Suite disponible', 'VIP']]
    : [['Netflix', 'Suscripción', '-$4.299'], ['Seguro auto', 'Vence mañana', '-20% detectado'], ['Cashback', 'Rewards', '+1.5%*']];
  return (
    <div className="relative mx-auto w-[296px] sm:w-[334px] h-[610px] sm:h-[688px] rounded-[3.2rem] bg-[linear-gradient(145deg,#262626,#0b0b0b)] border border-zinc-700 shadow-[0_35px_110px_rgba(0,0,0,0.95)] p-4 rotate-1 hover:rotate-0 hover:-translate-y-1 transition duration-700">
      <div className="absolute left-1/2 top-3 -translate-x-1/2 w-28 h-6 rounded-b-2xl bg-black border-x border-b border-zinc-800 z-10" />
      <div className="h-full rounded-[2.55rem] bg-[radial-gradient(circle_at_50%_0%,rgba(96,165,250,0.24),transparent_26%),linear-gradient(180deg,#1f2b46,#0a0f1a_72%)] border border-zinc-800 px-5 py-7 overflow-hidden">
        <div className="flex justify-between items-center text-xs text-zinc-300"><span>9:41</span><span className="tracking-widest">●●●</span></div>
        <div className="mt-8 flex items-center justify-between">
          <div>
            <div className="text-base text-white font-medium">{privateMode ? 'Diamond Black' : 'Hola, Martín'}</div>
            <div className={`text-xs mt-1 ${privateMode ? 'text-[#e7d3a1]' : 'text-blue-300'}`}>{privateMode ? 'Membership activo' : 'AI Advisor activo'}</div>
          </div>
          <div className="w-10 h-10 rounded-2xl border border-zinc-700 bg-white/[0.04] grid place-items-center text-zinc-300">⌁</div>
        </div>
        <div className="mt-8 rounded-[1.7rem] border bg-white/[0.07] border-white/[0.09] p-5">
          <div className="text-sm text-zinc-400">{privateMode ? 'Concierge privado' : 'Saldo disponible'}</div>
          <div className="mt-2 text-[2.2rem] leading-none font-semibold tracking-tight text-white">{privateMode ? '24/7' : '$125.680,50'}</div>
          <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
            <span className={`w-2 h-2 rounded-full ${privateMode ? 'bg-[#d7b35a]' : 'bg-blue-500'}`} />
            {privateMode ? 'Advisor · Viajes · Experiencias' : 'ARS · Cuenta principal'}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button className={`${privateMode ? 'bg-[linear-gradient(135deg,#d7b35a,#b7862f)] text-black' : 'bg-blue-600 text-white'} rounded-2xl py-3.5 text-sm font-semibold`}>{privateMode ? 'Concierge' : 'Enviar'}</button>
            <button className="border border-zinc-700 rounded-2xl py-3.5 text-sm text-white">{privateMode ? 'Advisor' : 'Recibir'}</button>
          </div>
        </div>
        <div className={`${privateMode ? 'bg-[#b08a2d]/15 border-[#b08a2d]/25 text-[#f0d889]' : 'bg-blue-600/15 border-blue-500/25 text-blue-100'} mt-5 rounded-2xl border p-4 text-sm leading-relaxed`}>
          {privateMode ? 'Tu advisor encontró disponibilidad para upgrade y late check-out.' : 'No usaste una suscripción en 3 meses. ¿Querés revisarla?'}
        </div>
        <div className="mt-5 flex justify-between items-center text-sm"><b className="text-white">{privateMode ? 'Privilegios' : 'Movimientos'}</b><span className="text-zinc-500 text-xs">Ver todo</span></div>
        {movements.map(([a, b, c]) => (
          <div key={a} className="mt-3 rounded-2xl bg-white/[0.055] border border-white/[0.06] p-4 flex justify-between gap-3 text-sm">
            <div className="min-w-0"><b className="text-white block">{a}</b><div className="text-xs text-zinc-500 mt-1">{b}</div></div>
            <span className="text-zinc-300 text-right shrink-0">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardMockup({ compact = false, diamond = false }: { compact?: boolean; diamond?: boolean }) {
  const src = diamond ? DIAMOND_CARD_IMAGE : STANDARD_CARD_IMAGE;
  const label = diamond ? 'Simply Diamond Black Visa' : 'Simply Visa';
  const frame = diamond
    ? 'border-[#8a6a1f]/40 shadow-[0_42px_110px_rgba(180,140,40,0.18)]'
    : 'border-blue-500/25 shadow-[0_42px_110px_rgba(37,99,235,0.20)]';
  return (
    <div className={`relative w-full ${compact ? 'max-w-[460px]' : 'max-w-[560px]'} aspect-[4/3] rounded-[2rem] overflow-hidden border ${frame} bg-black hover:-translate-y-2 transition duration-500`}>
      <img decoding="async" src={src} alt={label} className="absolute inset-0 h-full w-full object-cover object-center" loading="lazy" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_35%,rgba(0,0,0,0.10))]" />
    </div>
  );
}

function PhotoPanel({ src, alt, glow = 'blue', className = '' }: { src: string; alt: string; glow?: 'blue' | 'gold'; className?: string }) {
  const frame = glow === 'gold'
    ? 'border-[#8a6a1f]/35 shadow-[0_35px_120px_rgba(176,138,45,0.18)]'
    : 'border-blue-500/25 shadow-[0_35px_120px_rgba(37,99,235,0.20)]';
  return (
    <div className={`relative rounded-[2rem] overflow-hidden border ${frame} bg-black aspect-[4/3] w-full ${className}`}>
      <img decoding="async" src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover object-center transition duration-700 hover:scale-[1.025]" loading="lazy" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.035),transparent_42%,rgba(0,0,0,0.16))]" />
    </div>
  );
}

function AppRender({ src, alt, className = '' }: { src: string; alt: string; className?: string; glow?: 'blue' | 'gold' }) {
  return (
    <div className={`relative grid place-items-center ${className}`}>
      <img decoding="async" src={src} alt={alt} className="relative z-10 max-h-full max-w-full object-contain transition duration-700 hover:scale-[1.025]" loading="lazy" />
    </div>
  );
}

function AppShowcase() {
  const apps: [string, string][] = [
    [APP_HOME, 'Inicio Simply'],
    [APP_CARDS, 'Tarjeta Simply'],
    [APP_ANALYTICS, 'Analítica Simply'],
    [APP_ONBOARDING, 'Onboarding Simply'],
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {apps.map(([src, alt]) => (
        <div key={alt} className="rounded-[2rem] border border-zinc-800 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.18),transparent_38%),linear-gradient(180deg,#05070d,#020202)] p-5 min-h-[420px] overflow-hidden hover:border-blue-500/45 transition">
          <AppRender src={src} alt={alt} className="h-[390px]" />
        </div>
      ))}
    </div>
  );
}

function CardGrid({ items, columns = 'md:grid-cols-2 xl:grid-cols-4', gold = false }: { items: ReadonlyArray<readonly [string, string]>; columns?: string; gold?: boolean }) {
  return (
    <div className={`grid ${columns} gap-5`}>
      {items.map(([title, body]) => (
        <article key={title} className={`group rounded-[2rem] border p-7 hover:-translate-y-1 transition duration-500 ${gold ? 'border-[#8a6a1f]/20 bg-black/35 hover:border-[#d7b35a]/50 hover:shadow-[0_0_36px_rgba(176,138,45,0.16)]' : 'border-zinc-800 bg-zinc-950/75 hover:border-blue-500/40 hover:shadow-[0_0_36px_rgba(37,99,235,0.10)]'}`}>
          <div className="mb-5"><IconBadge gold={gold}>{title + ' ' + body}</IconBadge></div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-4 text-zinc-400 leading-relaxed text-sm">{body}</p>
        </article>
      ))}
    </div>
  );
}

import { CONTENT, type Content } from '@/lib/content';

// ============ MAIN COMPONENT ============
type Props = { initialPage?: PageKey };

export default function SimplyLanding({ initialPage = 'home' }: Props) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('es');
  const [page] = useState<PageKey>(initialPage);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | number | null>(0);
  const [faqQuery, setFaqQuery] = useState('');
  const [faqTopic, setFaqTopic] = useState('all');
  const [showCookie, setShowCookie] = useState(false);
  const [country, setCountry] = useState('Argentina');
  const [leadType, setLeadType] = useState<'person' | 'business'>('person');
  const [interest, setInterest] = useState('Cuenta / tarjeta');
  const [legalChecks, setLegalChecks] = useState({ terms: false, privacy: false, approval: false, commercial: false });
  const [preStatus, setPreStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [preError, setPreError] = useState<string | null>(null);
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [contactError, setContactError] = useState<string | null>(null);
  const [demoStatus, setDemoStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [demoError, setDemoError] = useState<string | null>(null);

  const t: Content = CONTENT[lang];
  const h = t.home;

  useEffect(() => {
    try { if (!localStorage.getItem('simply_cookies_v1')) setShowCookie(true); } catch {}
  }, []);

  const openPage = (p: PageKey) => {
    setMenuOpen(false);
    const route = REAL_ROUTES[p];
    if (route) router.push(route);
  };
  const goHome = () => openPage('home');
  const scrollToPrereg = () => {
    setMenuOpen(false);
    if (page !== 'home') {
      router.push('/#preregistro');
    } else {
      document.querySelector('#preregistro')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const closeCookie = (value: 'accept' | 'reject') => {
    try { localStorage.setItem('simply_cookies_v1', value); } catch {}
    setShowCookie(false);
  };

  const submitPrereg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!(legalChecks.terms && legalChecks.privacy && legalChecks.approval)) return;
    setPreStatus('loading'); setPreError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      type: leadType,
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      country: country,
      city: String(fd.get('city') || ''),
      company: String(fd.get('company') || ''),
      interest,
      website: String(fd.get('website') || ''),
    };
    try {
      const r = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) { setPreStatus('ok'); e.currentTarget.reset(); }
      else { setPreStatus('err'); setPreError(data.error || 'No pudimos enviar la solicitud.'); }
    } catch { setPreStatus('err'); setPreError('Error de conexión.'); }
  };

  const submitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactStatus('loading'); setContactError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      topic: String(fd.get('reason') || 'Soporte'),
      message: String(fd.get('message') || ''),
      website: String(fd.get('website') || ''),
    };
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) { setContactStatus('ok'); e.currentTarget.reset(); }
      else { setContactStatus('err'); setContactError(data.error || 'No pudimos enviar el mensaje.'); }
    } catch { setContactStatus('err'); setContactError('Error de conexión.'); }
  };

  const submitDemo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDemoStatus('loading'); setDemoError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      type: 'business' as const,
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      company: String(fd.get('company') || ''),
      message: String(fd.get('message') || ''),
      website: String(fd.get('website') || ''),
    };
    try {
      const r = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) { setDemoStatus('ok'); e.currentTarget.reset(); }
      else { setDemoStatus('err'); setDemoError(data.error || 'No pudimos enviar la solicitud.'); }
    } catch { setDemoStatus('err'); setDemoError('Error de conexión.'); }
  };

  const footerCols = [
    [t.common.footerTitles.products, [['people', 'Personas'], ['business', 'Empresas'], ['diamond', 'Diamond Black'], ['ai', 'AI'], ['cryptoPage', 'Cripto']] as const],
    [t.common.footerTitles.company, [['about', t.common.pages.about], ['innovation', t.common.pages.innovation], ['securityPage', t.common.pages.securityPage], ['partners', t.common.pages.partners], ['investors', t.common.pages.investors], ['careers', t.common.pages.careers], ['press', t.common.pages.press]] as const],
    [t.common.footerTitles.help, [['applicants', t.common.pages.applicants], ['approvals', t.common.pages.approvals], ['help', t.common.pages.help], ['contact', t.common.pages.contact], ['faq', t.common.pages.faq], ['status', t.common.pages.status]] as const],
    [t.common.footerTitles.legal, [['privacy', t.common.pages.privacy], ['terms', t.common.pages.terms], ['cookies', t.common.pages.cookies], ['compliance', t.common.pages.compliance]] as const],
  ] as const;

  const Header = () => (
    <header className="fixed top-2 inset-x-0 z-50 px-4 pointer-events-none">
      <nav className="pointer-events-auto max-w-7xl mx-auto px-4 sm:px-5 py-3 flex items-center justify-between gap-4 rounded-[1.7rem] border border-white/[0.08] bg-black/65 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
        <button onClick={goHome} className="shrink-0 flex items-center"><Logo /></button>
        <div className="hidden xl:flex items-center gap-8 text-sm text-zinc-300">
          <button onClick={() => openPage('people')} className="hover:text-white transition">{t.common.nav.people}</button>
          <button onClick={() => openPage('business')} className="hover:text-white transition">{t.common.nav.business}</button>
          <button onClick={() => openPage('ai')} className="hover:text-white transition">{t.common.nav.ai}</button>
          <a href={CRYPTO_URL} className="text-blue-300 hover:text-blue-200 transition">{t.common.nav.crypto}</a>
          <button onClick={() => openPage('partners')} className="hover:text-white transition">{t.common.nav.partners}</button>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} className="bg-transparent border border-zinc-800 rounded-xl px-2 sm:px-3 py-2 text-xs text-zinc-300 outline-none hover:border-zinc-600">
            {Object.entries(LANGS).map(([k, v]) => <option key={k} value={k} className="bg-black">{v}</option>)}
          </select>
          <button className="hidden sm:block hover:text-white px-3 py-2 text-sm text-zinc-300 transition">{t.common.login}</button>
          <button onClick={scrollToPrereg} className="hidden md:block bg-blue-600 hover:bg-blue-500 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold shadow-[0_0_30px_rgba(37,99,235,0.45)]">{t.common.preregister}</button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="xl:hidden border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300" aria-label="menu">☰</button>
        </div>
      </nav>
      {menuOpen && (
        <div className="pointer-events-auto xl:hidden max-w-7xl mx-auto mt-2 rounded-3xl border border-zinc-800 bg-black/95 backdrop-blur-2xl px-6 py-5 grid gap-4 text-zinc-300 shadow-2xl">
          <button onClick={() => openPage('people')} className="text-left">{t.common.nav.people}</button>
          <button onClick={() => openPage('business')} className="text-left">{t.common.nav.business}</button>
          <button onClick={() => openPage('ai')} className="text-left">{t.common.nav.ai}</button>
          <a href={CRYPTO_URL} className="text-blue-300">{t.common.nav.crypto}</a>
          <button onClick={() => openPage('partners')} className="text-left">{t.common.nav.partners}</button>
          <button onClick={scrollToPrereg} className="text-left text-blue-300">{t.common.preregister}</button>
        </div>
      )}
    </header>
  );

  const Footer = () => (
    <footer className="relative z-10 border-t border-zinc-900 bg-black px-6 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_2.4fr] gap-12">
          <div>
            <Logo />
            <p className="mt-5 text-zinc-400 max-w-sm leading-relaxed">{h.footerTag}</p>
            <p className="mt-4 text-xs text-zinc-600">{t.common.shortLegal}</p>
            <div className="mt-7 flex flex-wrap gap-3 text-zinc-500">
              {SOCIALS.map(([s, url]) => <a key={s} href={url} className="hover:text-white">{s}</a>)}
            </div>
            <div className="mt-7">
              <label className="text-xs text-zinc-600">{t.common.country}</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="mt-2 w-full max-w-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-sm text-zinc-300 outline-none">
                {t.common.countries.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {footerCols.map(([title, items]) => (
              <div key={title}>
                <h4 className="font-semibold text-white">{title}</h4>
                <div className="mt-4 space-y-3 text-sm text-zinc-500">
                  {items.map(([key, label]) => (
                    <button key={key} onClick={() => openPage(key as PageKey)} className="block hover:text-white text-left">{label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between gap-4 text-xs text-zinc-600">
          <p>© 2026 Simply / {COMPANY_NAME}. {t.common.ui.copyright}</p>
          <p>{lang === 'en' ? COMPANY_ADDRESS_EN : COMPANY_ADDRESS_ES}</p>
          <button onClick={() => openPage('approvals')} className="text-left hover:text-white">{t.common.ui.viewApprovals}</button>
          <p>{country}</p>
        </div>
      </div>
    </footer>
  );

  const CookieBanner = () => showCookie ? (
    <div className="fixed bottom-5 left-5 right-5 md:left-auto md:right-5 md:w-[430px] z-[70] rounded-3xl border border-zinc-800 bg-black/90 backdrop-blur-2xl p-5 shadow-2xl">
      <h3 className="font-semibold">{t.common.ui.cookiesTitle}</h3>
      <p className="mt-2 text-sm text-zinc-400">{t.common.ui.cookiesText}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={() => closeCookie('accept')} className="bg-blue-600 px-4 py-2 rounded-xl text-sm">{t.common.ui.accept}</button>
        <button onClick={() => closeCookie('reject')} className="border border-zinc-700 px-4 py-2 rounded-xl text-sm">{t.common.ui.reject}</button>
        <button onClick={() => openPage('cookies')} className="text-blue-400 px-2 py-2 text-sm">{t.common.ui.configure}</button>
      </div>
    </div>
  ) : null;

  const MobileCTA = () => (
    <div className="md:hidden fixed bottom-4 inset-x-4 z-40">
      <button onClick={scrollToPrereg} className="w-full bg-blue-600 rounded-2xl py-4 font-semibold shadow-[0_0_35px_rgba(37,99,235,0.5)]">{t.common.preregister}</button>
    </div>
  );

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <main className="min-h-screen bg-black text-white font-sans overflow-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_75%_8%,rgba(45,127,249,0.28),transparent_25%),radial-gradient(circle_at_15%_38%,rgba(45,127,249,0.13),transparent_22%),linear-gradient(180deg,#000,#030303)]" />
      <Header />
      <div className="relative z-10 pt-16 md:pt-20 scroll-smooth">{children}</div>
      <Footer />
      <CookieBanner />
      <MobileCTA />
    </main>
  );

  // ========== PAGE: HOME ==========
  if (page === 'home') return (
    <Shell>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 md:pt-10 pb-12 md:pb-16 grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
        <div>
          <div className="inline-flex mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-300 text-sm">{h.badge}</div>
          <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-semibold leading-[1.05] tracking-tight">
            {h.titleA}<br/><span className="text-blue-500">{h.titleB}</span>
          </h1>
          <p className="mt-5 text-base text-zinc-400 max-w-xl leading-relaxed">{h.subtitle}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button onClick={scrollToPrereg} className="px-7 py-4 text-base">{t.common.preregister}</Button>
            <button onClick={() => openPage('people')} className="text-zinc-400 hover:text-white text-sm transition">{t.common.nav.people} →</button>
            <button onClick={() => openPage('business')} className="text-zinc-400 hover:text-white text-sm transition">{t.common.nav.business} →</button>
            <a href={CRYPTO_URL} className="text-zinc-400 hover:text-white text-sm transition">{t.common.nav.crypto} →</a>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-zinc-400">
            {h.heroBullets.map((x) => (
              <div key={x} className="group rounded-2xl border border-zinc-800 bg-white/[0.03] px-4 py-4 hover:border-blue-500/40 transition">
                <div className="flex items-center gap-3">
                  <PremiumSvgIcon kind={getPremiumIconKind(x)} size={18} strokeWidth={1.8} className="text-blue-300 drop-shadow-[0_0_12px_rgba(96,165,250,0.55)]" />
                  <span>{x}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[440px] md:min-h-[560px] grid place-items-center overflow-hidden">
          <div className="absolute inset-12 rounded-full blur-3xl opacity-50" style={{ background: 'rgba(37,99,235,0.32)' }} />
          <img decoding="async" fetchPriority="high" src={APP_ONBOARDING} alt="Simply app" className="relative z-10 max-h-[560px] w-auto object-contain transition duration-700 hover:scale-[1.025]" loading="eager" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {h.stats.map(([n, d]) => (
          <div key={n} className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 hover:-translate-y-1 hover:border-blue-500/40 transition">
            <div className="text-3xl font-semibold text-white">{n}</div>
            <div className="mt-2 text-sm text-zinc-500">{d}</div>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-5">
        <button onClick={() => openPage('people')} className="text-left rounded-[2rem] border border-zinc-800 bg-zinc-950/75 p-8 hover:border-blue-500/50 hover:-translate-y-1 transition">
          <h2 className="text-3xl font-semibold">{h.peopleTitle}</h2>
          <p className="mt-4 text-zinc-400 leading-relaxed">{h.peopleText}</p>
          <span className="mt-8 inline-block text-blue-400">{t.common.ui.viewPeople}</span>
        </button>
        <button onClick={() => openPage('business')} className="text-left rounded-[2rem] border border-zinc-800 bg-zinc-950/75 p-8 hover:border-blue-500/50 hover:-translate-y-1 transition">
          <h2 className="text-3xl font-semibold">{h.businessTitle}</h2>
          <p className="mt-4 text-zinc-400 leading-relaxed">{h.businessText}</p>
          <span className="mt-8 inline-block text-blue-400">{t.common.ui.viewBusiness}</span>
        </button>
        <button onClick={() => openPage('diamond')} className="text-left rounded-[2rem] border border-[#8a6a1f]/30 bg-[linear-gradient(135deg,#070707,#111,#1a1408)] p-8 hover:border-[#d7b35a]/60 hover:-translate-y-1 transition">
          <h2 className="text-3xl font-semibold text-[#f0d889]">{h.diamondTitle}</h2>
          <p className="mt-4 text-zinc-400 leading-relaxed">{h.diamondText}</p>
          <span className="mt-8 inline-block text-[#d9c08a]">{t.common.ui.viewDiamond}</span>
        </button>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <SectionTitle kicker="01 · Ecosistema" title={h.ecosystemTitle} text={h.ecosystemText} />
        <div className="mt-10"><CardGrid items={h.ecosystem} /></div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <SectionTitle kicker={t.common.ui.appKicker} title={t.common.ui.appTitle} text={t.common.ui.appText} />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {([
            [LIFESTYLE_PAYMENT, 'Pagos QR', 'Cobrá y pagá en cualquier comercio.'],
            [LIFESTYLE_AI, 'AI ahorro', 'Detectamos oportunidades cada mes.'],
            [LIFESTYLE_DIAMOND, 'Diamond Black', 'Beneficios premium globales.'],
            [LIFESTYLE_TRAVEL, 'Multi-divisa', 'Tu dinero, sin fronteras.'],
          ] as const).map(([src, title, desc]) => (
            <div key={title} className="group relative rounded-[2rem] border border-zinc-800 overflow-hidden aspect-[3/4] hover:border-blue-500/45 transition">
              <img decoding="async" src={src} alt={`Simply ${title}`} className="absolute inset-0 w-full h-full object-cover object-center transition duration-700 group-hover:scale-[1.04]" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-1 text-xs text-zinc-300 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-950/70 p-6 md:p-8">
          <div className="text-blue-400 text-sm mb-3">Android · iOS · Web</div>
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.common.ui.platformTitle}</h3>
          <p className="mt-4 text-zinc-400 leading-relaxed max-w-3xl">{t.common.ui.platformText}</p>
          <div className="mt-7 grid md:grid-cols-3 gap-4">
            {t.common.ui.platformCards.map(([platform, description]) => (
              <div key={platform} className="group rounded-3xl border border-zinc-800 bg-black/45 p-6 hover:border-blue-500/45 hover:-translate-y-1 transition">
                <IconBadge>{platform}</IconBadge>
                <div className="mt-5 text-2xl font-semibold text-white">{platform}</div>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <SectionTitle kicker={t.common.ui.securityKicker} title={h.securityTitle} text={h.securityText} />
        <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden border border-blue-500/25 shadow-[0_35px_120px_rgba(37,99,235,0.20)] bg-black">
          <img decoding="async" src={BUSINESS_DASHBOARD_IMAGE} alt="Seguridad, AI y control operativo" className="absolute inset-0 w-full h-full object-cover object-center" loading="lazy" />
        </div>
      </section>

      <section id="preregistro" className="scroll-mt-28 max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        <div>
          <SectionTitle kicker={t.common.ui.preregKicker} title={h.preregTitle} text={h.preregSubtitle} />
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {h.preregBenefits.map(([icon, title, body]) => (
              <div key={title} className="group rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 hover:-translate-y-1 hover:border-blue-500/50 transition">
                <IconBadge>{`${icon} ${title} ${body}`}</IconBadge>
                <h3 className="mt-5 font-semibold">{title}</h3>
                <p className="mt-3 text-sm text-zinc-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-zinc-600">{h.legalNote}</p>
        </div>
        <div className="rounded-[2rem] border border-slate-700/60 bg-[linear-gradient(180deg,#0d1422,#05070d)] p-5 md:p-7 shadow-2xl">
          <div className="grid gap-5">
            <div className="flex justify-center py-2"><CardMockup compact /></div>
            <form onSubmit={submitPrereg} className="grid gap-3">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} />
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setLeadType('person')} className={`rounded-2xl px-5 py-4 border ${leadType === 'person' ? 'border-blue-500 bg-blue-600/15' : 'border-zinc-800'}`}>{h.preregFields.person}</button>
                <button type="button" onClick={() => setLeadType('business')} className={`rounded-2xl px-5 py-4 border ${leadType === 'business' ? 'border-blue-500 bg-blue-600/15' : 'border-zinc-800'}`}>{h.preregFields.business}</button>
              </div>
              {leadType === 'business' && <input name="company" placeholder={h.preregFields.company} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 text-white" />}
              <select name="interest" value={interest} onChange={(e) => setInterest(e.target.value)} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none text-zinc-300">
                {h.preregFields.interests.map((x) => <option key={x}>{x}</option>)}
              </select>
              <div className="grid md:grid-cols-2 gap-3">
                <input name="name" required placeholder={h.preregFields.name} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 text-white" />
                <input name="email" required type="email" placeholder={h.preregFields.email} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 text-white" />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input name="phone" placeholder={h.preregFields.phone} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 text-white" />
                <input name="city" placeholder={h.preregFields.city} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 text-white" />
              </div>
              {([['terms', h.preregFields.terms], ['privacy', h.preregFields.privacy], ['approval', h.preregFields.approval], ['commercial', h.preregFields.commercial]] as const).map(([key, label]) => (
                <label key={key} className="flex gap-3 text-xs text-zinc-500">
                  <input type="checkbox" checked={legalChecks[key]} onChange={(e) => setLegalChecks({ ...legalChecks, [key]: e.target.checked })} required={key !== 'commercial'} />{label}
                </label>
              ))}
              <button type="submit" disabled={preStatus === 'loading'} className="bg-blue-600 hover:bg-blue-500 rounded-2xl px-5 py-4 font-semibold disabled:opacity-50">
                {preStatus === 'loading' ? 'Enviando...' : preStatus === 'ok' ? h.preregFields.success : h.preregFields.submit}
              </button>
              {preStatus === 'err' && preError && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 text-sm">⚠ {preError}</div>}
            </form>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 text-center bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.32),transparent_35%)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">{h.ctaTitle}</h2>
          <p className="mt-5 text-zinc-400 text-base">{h.ctaText}</p>
          <div className="mt-9 flex justify-center gap-4 flex-wrap">
            <Button onClick={scrollToPrereg}>{t.common.preregister}</Button>
            <Button href={CRYPTO_URL} variant="secondary">{t.common.nav.crypto}</Button>
          </div>
        </div>
      </section>
    </Shell>
  );

  // ========== HELPERS para páginas internas ==========
  const renderGenericPage = (data: any, legal = false) => (
    <Shell>
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <button onClick={goHome} className="text-blue-400 text-sm mb-6">{t.common.back}</button>
        <div className="rounded-[2.4rem] border border-zinc-800 bg-[radial-gradient(circle_at_80%_0%,rgba(37,99,235,0.16),transparent_28%),linear-gradient(180deg,rgba(9,9,11,0.92),rgba(3,3,3,0.92))] p-8 md:p-12">
          <div className="grid lg:grid-cols-[1fr_0.7fr] gap-10 items-center">
            <div>
              <div className="text-blue-400 text-sm">{data.updated || data.kicker}</div>
              <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight">{data.title}</h1>
              <p className="mt-5 text-zinc-400 leading-relaxed text-base max-w-3xl">{data.intro || data.body}</p>
              {legal && <p className="mt-5 text-xs text-zinc-600">{t.common.legalReview}</p>}
            </div>
            {data.metrics && (
              <div className="grid grid-cols-2 gap-3">
                {data.metrics.map(([value, label]: [string, string]) => (
                  <div key={value + label} className="rounded-3xl border border-zinc-800 bg-black/40 p-5">
                    <div className="text-2xl font-semibold text-white">{value}</div>
                    <div className="mt-2 text-sm text-zinc-500">{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {data.bullets && (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.bullets.map((b: string) => (
              <div key={b} className="group rounded-3xl border border-zinc-800 bg-white/[0.035] p-6 text-zinc-300 hover:border-blue-500/35 transition">
                <IconBadge>{b}</IconBadge>
                <div className="mt-4 font-medium">{b}</div>
              </div>
            ))}
          </div>
        )}
        {data.sections && (
          <div className="mt-10 grid lg:grid-cols-2 gap-5">
            {data.sections.map(([title, body]: [string, string]) => (
              <article key={title} className="rounded-3xl border border-zinc-800 bg-white/[0.035] p-6 md:p-8 hover:border-blue-500/35 transition">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-3 text-zinc-400 leading-relaxed">{body}</p>
              </article>
            ))}
          </div>
        )}
        {data.blocks && (
          <div className="mt-10 grid lg:grid-cols-2 gap-5">
            {data.blocks.map(([title, body]: [string, string]) => (
              <article key={title} className="rounded-[2rem] border border-blue-500/20 bg-blue-600/[0.06] p-7 md:p-8">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <p className="mt-4 text-zinc-400 leading-relaxed">{body}</p>
              </article>
            ))}
          </div>
        )}
        {data.values && (
          <div className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-950/70 p-7 md:p-8">
            <h2 className="text-3xl font-semibold">{data.valuesTitle || 'Principios'}</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {data.values.map((v: string) => (
                <span key={v} className="rounded-full border border-zinc-800 bg-black/50 px-4 py-2 text-zinc-300 text-sm">{v}</span>
              ))}
            </div>
          </div>
        )}
      </section>
    </Shell>
  );

  // ========== PAGE: PEOPLE ==========
  if (page === 'people') return (
    <Shell>
      <section className="max-w-7xl mx-auto px-6 py-8 md:py-10 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <button onClick={goHome} className="text-blue-400 text-sm mb-5">{t.common.back}</button>
          <SectionTitle kicker={t.people.kicker} title={t.people.title} text={t.people.intro} />
          <Button onClick={scrollToPrereg} className="mt-8">{t.common.ui.joinList}</Button>
        </div>
        <div className="relative grid place-items-center min-h-[480px] overflow-hidden">
          <img decoding="async" src={APP_HOME} alt="Simply app" className="max-h-[520px] object-contain" loading="lazy" />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden border border-blue-500/25 shadow-[0_35px_120px_rgba(37,99,235,0.20)] bg-black">
          <img decoding="async" src={PEOPLE_INVEST_IMAGE} alt="Simply para personas" className="absolute inset-0 w-full h-full object-cover object-center" loading="lazy" />
        </div>
        <SectionTitle kicker={t.common.ui.investmentsKicker} title={t.common.ui.investmentsTitle} text={t.common.ui.investmentsText} />
      </section>
      <section className="max-w-7xl mx-auto px-6 pb-14">
        <h2 className="text-3xl font-semibold mb-5">{t.people.useCasesTitle}</h2>
        <CardGrid items={t.people.useCases} />
      </section>
      <section className="max-w-7xl mx-auto px-6 pb-20 space-y-12">
        {t.people.groups.map((group) => (
          <div key={group.title}>
            <h2 className="text-3xl font-semibold mb-5">{group.title}</h2>
            <CardGrid items={group.items} />
          </div>
        ))}
      </section>
      <section className="max-w-7xl mx-auto px-6 pb-28">
        <div className="rounded-[2.4rem] border border-[#8a6a1f]/25 bg-[linear-gradient(135deg,#070707,#111,#1a1408)] p-8 md:p-10 grid lg:grid-cols-[1fr_0.8fr] gap-8 items-center">
          <div>
            <div className="text-[#d9c08a] text-sm mb-4">{t.people.diamondTeaser.kicker}</div>
            <h2 className="text-3xl md:text-4xl font-semibold">{t.people.diamondTeaser.title}</h2>
            <p className="mt-5 text-zinc-400 leading-relaxed">{t.people.diamondTeaser.text}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="gold" onClick={() => openPage('diamond')}>{t.common.ui.viewDiamond}</Button>
              <Button variant="secondary" onClick={scrollToPrereg}>{t.common.ui.requestInvite}</Button>
            </div>
          </div>
          <CardMockup diamond />
        </div>
      </section>
    </Shell>
  );

  // ========== PAGE: BUSINESS ==========
  if (page === 'business') return (
    <Shell>
      <section className="max-w-7xl mx-auto px-6 py-8 md:py-10 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <button onClick={goHome} className="text-blue-400 text-sm mb-5">{t.common.back}</button>
          <SectionTitle kicker={t.business.kicker} title={t.business.title} text={t.business.intro} />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => openPage('contact')}>{t.common.ui.designBusiness}</Button>
          </div>
        </div>
        <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden border border-blue-500/25 shadow-[0_35px_120px_rgba(37,99,235,0.20)] bg-black">
          <img decoding="async" src={BUSINESS_DASHBOARD_IMAGE} alt="Simply empresas dashboard" className="absolute inset-0 w-full h-full object-cover object-center" loading="lazy" />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 pb-14">
        <h2 className="text-3xl font-semibold mb-5">{t.business.useCasesTitle}</h2>
        <CardGrid items={t.business.useCases} columns="md:grid-cols-2 xl:grid-cols-3" />
      </section>
      <section className="max-w-7xl mx-auto px-6 pb-20 space-y-12">
        {t.business.groups.map((group) => (
          <div key={group.title}>
            <h2 className="text-3xl font-semibold mb-5">{group.title}</h2>
            <CardGrid items={group.items} />
          </div>
        ))}
      </section>
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <form onSubmit={submitDemo} className="rounded-[2rem] border border-zinc-800 bg-zinc-950/80 p-7 grid gap-4">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} />
          <input name="company" required placeholder={t.business.demoFields.company} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 text-white" />
          <input name="name" required placeholder={t.business.demoFields.name} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 text-white" />
          <input name="email" required type="email" placeholder={t.business.demoFields.email} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 text-white" />
          <textarea name="message" placeholder={t.business.demoFields.message} rows={4} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 text-white" />
          <button type="submit" disabled={demoStatus === 'loading'} className="bg-blue-600 hover:bg-blue-500 rounded-2xl px-5 py-4 font-semibold disabled:opacity-50">
            {demoStatus === 'loading' ? 'Enviando...' : demoStatus === 'ok' ? t.business.demoFields.success : t.business.demoFields.submit}
          </button>
          {demoStatus === 'err' && demoError && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 text-sm">⚠ {demoError}</div>}
        </form>
      </section>
    </Shell>
  );

  // ========== PAGE: DIAMOND BLACK ==========
  if (page === 'diamond') return (
    <Shell>
      <section className="max-w-7xl mx-auto px-6 py-8 md:py-10">
        <button onClick={goHome} className="text-[#d9c08a] text-sm mb-5">{t.common.back}</button>
        <div className="relative overflow-hidden rounded-[2.8rem] border border-[#8a6a1f]/30 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.10),transparent_18%),radial-gradient(circle_at_80%_18%,rgba(180,140,40,0.18),transparent_24%),linear-gradient(135deg,#050505,#0b0b0b_45%,#111111_75%,#1a1408)] p-8 md:p-12 shadow-[0_40px_120px_rgba(180,140,40,0.10)]">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(120deg,transparent,rgba(255,215,120,0.10),transparent)]" />
          <div className="relative grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
            <div>
              <div className="inline-flex rounded-full border border-[#b08a2d]/35 bg-[#b08a2d]/10 px-4 py-2 text-sm text-[#e7d3a1]">{t.diamond.kicker}</div>
              <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-white">{t.diamond.title}</h1>
              <p className="mt-5 text-zinc-300 text-base leading-relaxed max-w-2xl">{t.diamond.intro}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="gold" onClick={scrollToPrereg}>{t.common.ui.requestAccess}</Button>
                <button onClick={() => openPage('contact')} className="rounded-2xl px-6 py-3 font-semibold border border-[#8a6a1f]/40 text-[#e7d3a1] bg-black/30 transition hover:border-[#d7b35a]/70 hover:bg-[#b08a2d]/10 hover:shadow-[0_0_30px_rgba(176,138,45,0.20)] hover:-translate-y-0.5">{t.common.ui.talkAdvisor}</button>
              </div>
            </div>
            <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden border border-[#8a6a1f]/35 shadow-[0_35px_120px_rgba(176,138,45,0.18)] bg-black">
              <img decoding="async" src={DIAMOND_HERO_IMAGE} alt="Diamond Black lifestyle" className="absolute inset-0 w-full h-full object-cover object-center" loading="lazy" />
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-[#8a6a1f]/20 pt-10">
          <div className="max-w-3xl mb-6">
            <div className="text-[#d9c08a] text-sm mb-3">{t.common.ui.diamondBase}</div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.common.ui.diamondBaseTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.diamond.features.map(([title, body]) => (
              <div key={title} className="group rounded-3xl border border-[#8a6a1f]/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] backdrop-blur p-6 transition hover:border-[#d7b35a]/50 hover:shadow-[0_0_30px_rgba(176,138,45,0.12)]">
                <IconBadge gold>{`${title} ${body}`}</IconBadge>
                <h3 className="mt-5 font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-[#8a6a1f]/20 pt-10">
          <div className="max-w-3xl">
            <div className="text-[#d9c08a] text-sm mb-3">{t.common.ui.diamondPrivileges}</div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.common.ui.diamondPrivilegesTitle}</h2>
            <p className="mt-4 text-zinc-400 leading-relaxed">{t.common.ui.diamondPrivilegesText}</p>
          </div>
          <div className="mt-8 grid lg:grid-cols-2 gap-5">
            {t.diamond.categories.map((category) => (
              <div key={category.title} className="rounded-[2rem] border border-[#8a6a1f]/20 bg-black/35 p-6 md:p-7 hover:border-[#d7b35a]/45 transition">
                <h3 className="text-2xl font-semibold text-[#f0d889]">{category.title}</h3>
                <div className="mt-5 space-y-4">
                  {category.items.map(([title, body]) => (
                    <div key={title} className="group rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 hover:border-[#d7b35a]/30 transition">
                      <div className="flex items-start gap-4">
                        <IconBadge gold>{`${title} ${body}`}</IconBadge>
                        <div>
                          <div className="font-semibold text-white">{title}</div>
                          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative mt-8 text-xs text-zinc-500">{t.common.ui.diamondLegal}</p>
      </section>
    </Shell>
  );

  // ========== PAGE: AI ==========
  if (page === 'ai') return (
    <Shell>
      <section className="max-w-7xl mx-auto px-6 py-8 md:py-10">
        <button onClick={goHome} className="text-blue-400 text-sm mb-5">{t.common.back}</button>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <SectionTitle kicker={t.ai.kicker} title={t.ai.title} text={t.ai.intro} />
          <div className="grid place-items-center min-h-[480px]">
            <img decoding="async" src={APP_ANALYTICS} alt="AI y analítica" className="max-h-[520px] object-contain" loading="lazy" />
          </div>
        </div>
        <div className="mt-10"><CardGrid items={t.ai.modules} columns="md:grid-cols-2 xl:grid-cols-3" /></div>
      </section>
    </Shell>
  );

  // ========== PAGE: CRYPTO ==========
  if (page === 'cryptoPage') return (
    <Shell>
      <section className="max-w-7xl mx-auto px-6 py-8 md:py-10">
        <button onClick={goHome} className="text-blue-400 text-sm mb-5">{t.common.back}</button>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionTitle kicker={t.crypto.kicker} title={t.crypto.title} text={t.crypto.intro} />
            <Button href={CRYPTO_URL} className="mt-8">{t.common.ui.goCrypto}</Button>
          </div>
        </div>
        <div className="mt-10"><CardGrid items={t.crypto.items} columns="md:grid-cols-2 xl:grid-cols-2" /></div>
      </section>
    </Shell>
  );

  // ========== PAGE: PARTNERS ==========
  if (page === 'partners') return (
    <Shell>
      <section className="max-w-7xl mx-auto px-6 py-8 md:py-10">
        <button onClick={goHome} className="text-blue-400 text-sm mb-5">{t.common.back}</button>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionTitle kicker={t.partners.kicker} title={t.partners.title} text={t.partners.intro} />
            <Button onClick={() => openPage('contact')} className="mt-8">{t.common.ui.proposeAlliance}</Button>
          </div>
          <div className="relative aspect-[16/10] w-full rounded-[2rem] overflow-hidden border border-blue-500/25 shadow-[0_35px_120px_rgba(37,99,235,0.20)] bg-black">
            <img decoding="async" src={PARTNERS_TECH_IMAGE} alt="Simply Partners ecosistema" className="absolute inset-0 w-full h-full object-cover object-center" loading="lazy" />
          </div>
        </div>
        <div className="mt-10"><CardGrid items={t.partners.items} columns="md:grid-cols-2 xl:grid-cols-3" /></div>
      </section>
    </Shell>
  );

  // ========== PAGE: APPROVALS ==========
  if (page === 'approvals') return (
    <Shell>
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-16">
        <button onClick={goHome} className="text-blue-400 text-sm mb-8">{t.common.back}</button>
        <SectionTitle kicker={t.approvals.kicker} title={t.approvals.title} text={t.approvals.intro} />
        <div className="mt-10 overflow-x-auto rounded-[2rem] border border-zinc-800">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-zinc-950 text-zinc-400">
              <tr>
                <th className="p-5">{t.common.ui.tableProduct}</th>
                <th className="p-5">{t.common.ui.tableCondition}</th>
              </tr>
            </thead>
            <tbody>
              {t.approvals.rows.map(([a, b]) => (
                <tr key={a} className="border-t border-zinc-900">
                  <td className="p-5 font-semibold text-white">{a}</td>
                  <td className="p-5 text-zinc-400">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Shell>
  );

  // ========== PAGE: CONTACT ==========
  if (page === 'contact') return (
    <Shell>
      <section className="max-w-6xl mx-auto px-6 py-14 md:py-16 grid lg:grid-cols-2 gap-10">
        <div>
          <button onClick={goHome} className="text-blue-400 text-sm mb-8">{t.common.back}</button>
          <SectionTitle kicker={t.pages.contact.kicker} title={t.pages.contact.title} text={t.pages.contact.body} />
          <p className="mt-6 text-zinc-500">{t.common.ui.contactNote}</p>
        </div>
        <form onSubmit={submitContact} className="rounded-[2rem] border border-zinc-800 bg-zinc-950/75 p-7 grid gap-4">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} />
          <input name="name" required placeholder={t.common.ui.name} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 text-white" />
          <input name="email" required type="email" placeholder="Email" className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 text-white" />
          <select name="reason" className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none text-zinc-300">
            <option>{t.common.ui.reasonSupport}</option>
            <option>{t.common.ui.reasonSales}</option>
            <option>{t.common.ui.reasonPress}</option>
            <option>{t.common.ui.reasonPartners}</option>
            <option>{t.common.ui.reasonPrivacy}</option>
          </select>
          <textarea name="message" placeholder={t.common.ui.message} rows={5} className="bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 text-white" />
          <button type="submit" disabled={contactStatus === 'loading'} className="bg-blue-600 hover:bg-blue-500 rounded-2xl px-5 py-4 font-semibold disabled:opacity-50">
            {contactStatus === 'loading' ? 'Enviando...' : contactStatus === 'ok' ? t.common.ui.contactSuccess : t.common.ui.sendContact}
          </button>
          {contactStatus === 'err' && contactError && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 text-sm">⚠ {contactError}</div>}
        </form>
      </section>
    </Shell>
  );

  // ========== PAGE: FAQ ==========
  if (page === 'faq') {
    const faq = t.faqPage;
    const normalized = faqQuery.trim().toLowerCase();
    const categories = faq.categories
      .filter((c) => faqTopic === 'all' || c.id === faqTopic)
      .map((c) => ({
        ...c,
        items: c.items.filter(([q, a]) => !normalized || `${q} ${a}`.toLowerCase().includes(normalized)),
      }))
      .filter((c) => c.items.length > 0);
    const totalResults = categories.reduce((acc, c) => acc + c.items.length, 0);

    return (
      <Shell>
        <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
          <button onClick={goHome} className="text-blue-400 text-sm mb-6">{t.common.back}</button>
          <div className="rounded-[2.4rem] border border-zinc-800 bg-[radial-gradient(circle_at_80%_0%,rgba(37,99,235,0.18),transparent_28%),linear-gradient(180deg,rgba(9,9,11,0.92),rgba(3,3,3,0.92))] p-8 md:p-12">
            <div className="grid lg:grid-cols-[1fr_0.75fr] gap-10 items-center">
              <div>
                <div className="text-blue-400 text-sm">{faq.kicker}</div>
                <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight">{faq.title}</h1>
                <p className="mt-6 text-zinc-400 leading-relaxed text-lg max-w-3xl">{faq.intro}</p>
              </div>
              <div className="rounded-[2rem] border border-blue-500/20 bg-blue-600/[0.06] p-6">
                <div className="text-sm text-zinc-400">{t.common.ui.searchResults}</div>
                <div className="mt-2 text-4xl font-semibold">{totalResults}</div>
                <div className="mt-2 text-sm text-zinc-500">{t.common.ui.availableAnswers}</div>
                <div className="mt-5 text-xs text-zinc-500 leading-relaxed">{t.common.ui.infoMayVary}</div>
              </div>
            </div>
          </div>
          <div className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950/75 p-5 md:p-6">
            <div className="grid lg:grid-cols-[1fr_auto] gap-4 items-center">
              <input value={faqQuery} onChange={(e) => setFaqQuery(e.target.value)} placeholder={t.common.ui.searchPlaceholder} className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 text-zinc-200" />
              <button onClick={() => { setFaqQuery(''); setFaqTopic('all'); setOpenFaq(0); }} className="rounded-2xl border border-zinc-800 px-5 py-4 text-sm text-zinc-300 hover:border-blue-500/50 transition">{t.common.ui.clearFilters}</button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {faq.topics.map(([id, label]) => (
                <button key={id} onClick={() => { setFaqTopic(id); setOpenFaq(0); }} className={`rounded-full px-4 py-2 text-sm border transition ${faqTopic === id ? 'border-blue-500 bg-blue-600/20 text-blue-200' : 'border-zinc-800 bg-black/40 text-zinc-400 hover:border-zinc-600'}`}>{label}</button>
              ))}
            </div>
          </div>
          <div className="mt-8 space-y-6">
            {categories.length === 0 && (
              <div className="rounded-[2rem] border border-zinc-800 bg-white/[0.035] p-8">
                <h2 className="text-2xl font-semibold">{t.common.ui.noResultsTitle}</h2>
                <p className="mt-3 text-zinc-400">{t.common.ui.noResultsText}</p>
              </div>
            )}
            {categories.map((category) => (
              <section key={category.id} className="rounded-[2rem] border border-zinc-800 bg-zinc-950/70 p-5 md:p-6">
                <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
                <div className="space-y-3">
                  {category.items.map(([q, a], idx) => {
                    const key = `${category.id}-${idx}`;
                    const isOpen = openFaq === key;
                    return (
                      <div key={key} className="rounded-3xl border border-zinc-800 bg-black/35 overflow-hidden hover:border-blue-500/35 transition">
                        <button onClick={() => setOpenFaq(isOpen ? null : key)} className="w-full p-6 text-left flex justify-between gap-4 items-start">
                          <b className="text-white leading-relaxed">{q}</b>
                          <span className="text-blue-400 text-xl leading-none">{isOpen ? '−' : '+'}</span>
                        </button>
                        {isOpen && <p className="px-6 pb-6 text-zinc-400 leading-relaxed">{a}</p>}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
          <div className="mt-10 grid md:grid-cols-2 gap-5">
            <article className="rounded-[2rem] border border-blue-500/20 bg-blue-600/[0.06] p-7">
              <h2 className="text-2xl font-semibold">{t.common.ui.commercialHelpTitle}</h2>
              <p className="mt-3 text-zinc-400 leading-relaxed">{t.common.ui.commercialHelpText}</p>
              <Button onClick={() => openPage('contact')} className="mt-6">{t.common.ui.goContact}</Button>
            </article>
            <article className="rounded-[2rem] border border-zinc-800 bg-zinc-950/75 p-7">
              <h2 className="text-2xl font-semibold">{t.common.ui.approvalTitle}</h2>
              <p className="mt-3 text-zinc-400 leading-relaxed">{t.common.ui.approvalText}</p>
              <Button onClick={() => openPage('approvals')} variant="secondary" className="mt-6">{t.common.ui.viewConditions}</Button>
            </article>
          </div>
        </section>
      </Shell>
    );
  }

  // ========== Páginas legales / informativas ==========
  if (page === 'privacy') return renderGenericPage(t.privacy, true);
  if (page === 'terms') return renderGenericPage(t.terms, true);
  if (page === 'about') return renderGenericPage(t.about);

  // ========== Páginas dentro de t.pages ==========
  const pageData = (t.pages as any)[page];
  if (pageData) return renderGenericPage(pageData);

  // Fallback al home
  return renderGenericPage({ title: page, kicker: '—', body: '' });
}
