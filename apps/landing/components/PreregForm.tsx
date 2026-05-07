'use client';

import { useState } from 'react';
import { prereg } from '@/lib/content';

export default function PreregForm() {
  const [sent, setSent] = useState(false);
  const [type, setType] = useState<'person' | 'business'>('person');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Fase 3: enviar al backend Simply Core (POST /api/v1/identity/find-or-create)
    setSent(true);
    setTimeout(() => setSent(false), 4000);
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
      <button className="btn primary" type="submit">
        {sent ? prereg.fields.ok : prereg.fields.send}
      </button>
    </form>
  );
}
