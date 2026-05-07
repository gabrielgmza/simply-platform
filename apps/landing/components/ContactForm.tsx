'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Fase 3: enviar al backend
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <form className="form wide" onSubmit={onSubmit}>
      <h2>Contacto</h2>
      <input required name="name" placeholder="Nombre" autoComplete="name" />
      <input required name="email" type="email" placeholder="Email" autoComplete="email" />
      <select name="topic" defaultValue="Soporte">
        <option>Soporte</option>
        <option>Comercial</option>
        <option>Prensa</option>
        <option>Partners</option>
        <option>Privacidad</option>
      </select>
      <textarea required name="message" placeholder="Mensaje" />
      <button className="btn primary" type="submit">
        {sent ? 'Mensaje recibido ✓' : 'Enviar'}
      </button>
    </form>
  );
}
