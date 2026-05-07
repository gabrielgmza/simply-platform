'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'ok' | 'err';

export default function BusinessForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setError(null);

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
        setError(data.error || 'No pudimos enviar la solicitud.');
      }
    } catch {
      setStatus('err');
      setError('Error de conexión.');
    }
  };

  return (
    <form className="form wide" onSubmit={onSubmit}>
      <h2>Evaluación empresarial</h2>

      <input
        type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
      />

      <input required name="company" placeholder="Empresa" autoComplete="organization" />
      <input required name="name" placeholder="Nombre" autoComplete="name" />
      <input required name="email" type="email" placeholder="Email corporativo" autoComplete="email" />
      <textarea name="message" placeholder="Qué necesitás resolver" />
      <button className="btn primary" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Enviando...' : status === 'ok' ? 'Solicitud recibida ✓' : 'Solicitar evaluación'}
      </button>
      {status === 'err' && error && (
        <p style={{ color: '#fca5a5', fontSize: 13, margin: 0 }}>⚠ {error}</p>
      )}
    </form>
  );
}
