import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import { common, EMAIL } from '@/lib/content';

export const metadata = { title: 'Contacto' };

export default function Page() {
  return (
    <section className="inner">
      <Link className="back" href="/">{common.back}</Link>
      <div className="panel">
        <div>
          <span className="kicker">{common.official}</span>
          <h1>{common.contact}</h1>
          <p>
            <a href={`mailto:${EMAIL}`} style={{ color: '#60a5fa', fontSize: 22, fontWeight: 700 }}>
              {EMAIL}
            </a>
          </p>
          <p>{common.legal}</p>
        </div>
        <div className="photo">
          <img src="/assets/security-ai.webp" alt="Simply contact" loading="lazy" />
        </div>
      </div>
      <ContactForm />
    </section>
  );
}
