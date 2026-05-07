'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const KEY = 'simply_cookies_v1';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {}
  }, []);

  const close = (value: 'accept' | 'reject') => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie" role="dialog" aria-label="Aviso de cookies">
      <b>Cookies</b>
      <p>
        Simply puede utilizar cookies y tecnologías similares para operar el sitio,
        recordar preferencias, medir uso, mejorar rendimiento y prevenir fraude.
      </p>
      <button onClick={() => close('accept')}>Aceptar</button>
      <button onClick={() => close('reject')}>Rechazar</button>
      <Link href="/cookies" onClick={() => close('reject')}>Configurar</Link>
    </div>
  );
}
