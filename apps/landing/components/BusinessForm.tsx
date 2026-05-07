'use client';

import { useState } from 'react';

export default function BusinessForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Fase 3: enviar al backend
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <form className="form wide" onSubmit={onSubmit}>
      <h2>Evaluación empresarial</h2>
      <input required name="company" placeholder="Empresa" autoComplete="organization" />
      <input required name="name" placeholder="Nombre" autoComplete="name" />
      <input required name="email" type="email" placeholder="Email corporativo" autoComplete="email" />
      <textarea name="message" placeholder="Qué necesitás resolver" />
      <button className="btn primary" type="submit">
        {sent ? 'Solicitud recibida ✓' : 'Solicitar evaluación'}
      </button>
    </form>
  );
}
