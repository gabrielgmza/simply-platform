'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from './Logo';
import { nav } from '@/lib/content';
import { CRYPTO_URL, ROUTES } from '@/lib/routes';

export default function Header() {
  const [menu, setMenu] = useState(false);

  const goPre = () => {
    setMenu(false);
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/') {
        window.location.href = '/#pre';
      } else {
        document.getElementById('pre')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="topbar">
      <nav>
        <Logo />
        <div className="navlinks">
          <Link href={ROUTES.people}>{nav.people}</Link>
          <Link href={ROUTES.business}>{nav.business}</Link>
          <Link href={ROUTES.diamond} className="gold-text">{nav.diamond}</Link>
          <Link href={ROUTES.ai}>{nav.ai}</Link>
          <a href={CRYPTO_URL} target="_blank" rel="noopener noreferrer">{nav.crypto} ↗</a>
          <Link href={ROUTES.partners}>{nav.partners}</Link>
        </div>
        <div className="actions">
          <button className="login" type="button">{nav.login}</button>
          <button className="pre" type="button" onClick={goPre}>{nav.pre}</button>
          <button className="hamb" type="button" onClick={() => setMenu(!menu)} aria-label="menu">☰</button>
        </div>
      </nav>
      {menu && (
        <div className="mobile-menu">
          <Link href={ROUTES.people} onClick={() => setMenu(false)}>{nav.people}</Link>
          <Link href={ROUTES.business} onClick={() => setMenu(false)}>{nav.business}</Link>
          <Link href={ROUTES.diamond} onClick={() => setMenu(false)}>{nav.diamond}</Link>
          <Link href={ROUTES.ai} onClick={() => setMenu(false)}>{nav.ai}</Link>
          <Link href={ROUTES.partners} onClick={() => setMenu(false)}>{nav.partners}</Link>
          <a href={CRYPTO_URL} target="_blank" rel="noopener noreferrer">{nav.crypto} ↗</a>
          <button type="button" onClick={goPre}>{nav.pre}</button>
        </div>
      )}
    </header>
  );
}
