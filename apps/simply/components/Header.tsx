'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LANDING_URL = 'https://gosimply.xyz';

const NAV_ITEMS = [
  { label: 'Personas', href: `${LANDING_URL}/personas`, external: true },
  { label: 'Empresas', href: `${LANDING_URL}/empresas`, external: true },
  { label: 'AI', href: `${LANDING_URL}/ai`, external: true },
  { label: 'Cripto', href: '/', external: false, highlight: true },
  { label: 'Partners', href: `${LANDING_URL}/partners`, external: true },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<'es' | 'en' | 'pt'>('es');
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header className="fixed top-2 inset-x-0 z-50 px-4 pointer-events-none">
      <nav className="pointer-events-auto max-w-7xl mx-auto px-4 sm:px-5 py-3 flex items-center justify-between gap-4 rounded-[1.7rem] border border-white/[0.08] bg-black/65 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
        {/* Logo */}
        <a href={LANDING_URL} className="shrink-0 flex items-center" aria-label="Simply">
          <img
            src="/assets/logo-simply.webp"
            alt="Simply"
            className="h-11 sm:h-12 w-auto"
            draggable={false}
          />
        </a>

        {/* Nav desktop */}
        <div className="hidden xl:flex items-center gap-8 text-sm text-zinc-300">
          {NAV_ITEMS.map((item) => {
            const baseClass = item.highlight
              ? 'text-blue-300 hover:text-blue-200 transition'
              : 'hover:text-white transition';
            return item.external ? (
              <a key={item.label} href={item.href} className={baseClass}>
                {item.label}
              </a>
            ) : (
              <Link key={item.label} href={item.href} className={baseClass}>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Acciones derecha */}
        <div className="flex items-center gap-2 sm:gap-3">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as 'es' | 'en' | 'pt')}
            className="bg-transparent border border-zinc-800 rounded-xl px-2 sm:px-3 py-2 text-xs text-zinc-300 outline-none hover:border-zinc-600"
            aria-label="Idioma"
          >
            <option value="es" className="bg-black">ES</option>
            <option value="en" className="bg-black">EN</option>
            <option value="pt" className="bg-black">PT</option>
          </select>

          <Link
            href="/login"
            className="hidden sm:block hover:text-white px-3 py-2 text-sm text-zinc-300 transition"
          >
            Ingresar
          </Link>

          <a
            href={`${LANDING_URL}/#preregistro`}
            className="hidden md:block bg-blue-600 hover:bg-blue-500 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold shadow-[0_0_30px_rgba(37,99,235,0.45)] transition"
          >
            Pre-registro
          </a>

          {isHome && (
            <Link
              href="/historial"
              className="hidden lg:block border border-zinc-800 hover:border-zinc-600 rounded-xl px-3 py-2 text-xs text-zinc-300 transition"
            >
              Historial
            </Link>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="xl:hidden border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300"
            aria-label="menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Menú mobile */}
      {menuOpen && (
        <div className="pointer-events-auto xl:hidden max-w-7xl mx-auto mt-2 rounded-3xl border border-zinc-800 bg-black/95 backdrop-blur-2xl px-6 py-5 grid gap-4 text-zinc-300 shadow-2xl">
          {NAV_ITEMS.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                className={item.highlight ? 'text-blue-300' : 'text-left'}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={item.highlight ? 'text-blue-300' : 'text-left'}
              >
                {item.label}
              </Link>
            ),
          )}
          <Link
            href="/historial"
            onClick={() => setMenuOpen(false)}
            className="text-left"
          >
            Historial
          </Link>
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="text-left sm:hidden"
          >
            Ingresar
          </Link>
          <a href={`${LANDING_URL}/#preregistro`} className="text-left text-blue-300">
            Pre-registro
          </a>
        </div>
      )}
    </header>
  );
}
