'use client';

import { useState } from 'react';
import { prereg } from '@/lib/content';

type Status = 'idle' | 'loading' | 'ok' | 'err';

export default function PreregForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<'person' | 'business'>('person');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      type,
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      country: String(fd.get('country') || ''),
      city: String(fd.get('city') || ''),
      company: String(fd.get('company') || ''),
      website: String(fd.get('website') || ''), // honeypot
    };

    try {
      const r = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) {
        setStatus('ok');
        e.currentTarget.reset();
      } else {
        setStatus('err');
        setError(data.error || 'No pudimos enviar tu solicitud.');
      }
    } catch {
      setStatus('err');
      setError('Error de conexión.');
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="card-mock">
        <img src="/assets/standard-card.webp" alt="Simply Visa" />
      </div>
      <div className="twocol">
        <button
          type="button"
          onClick={() => setType('person')}
          style={{ opacity: type === 'person' ? 1 : 0.55 }}
        >
          {prereg.fields.person}
        </button>
        <button
          type="button"
          onClick={() => setType('business')}
          style={{ opacity: type === 'business' ? 1 : 0.55 }}
        >
          {prereg.fields.business}
        </button>
      </div>

      {/* Honeypot — invisible para humanos, atrapa bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
      />

      {type === 'business' && (
        <input name="company" placeholder={prereg.fields.company} autoComplete="organization" />
      )}
      <input required name="name" placeholder={prereg.fields.name} autoComplete="name" />
      <input required name="email" type="email" placeholder={prereg.fields.email} autoComplete="email" />
      <input name="phone" placeholder={prereg.fields.phone} autoComplete="tel" />
      <input name="country" placeholder={prereg.fields.country} autoComplete="country-name" />
      <input name="city" placeholder={prereg.fields.city} autoComplete="address-level2" />

      <label style={{ fontSize: 13, color: '#a1a1aa' }}>
        <input type="checkbox" required style={{ marginRight: 8 }} />
        Acepto términos y privacidad
      </label>

      <button className="btn primary" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando...' : status === 'ok' ? prereg.fields.ok : prereg.fields.send}
      </button>

      {status === 'err' && error && (
        <p style={{ color: '#fca5a5', fontSize: 13, margin: 0 }}>⚠ {error}</p>
      )}
    </form>
  );
}
