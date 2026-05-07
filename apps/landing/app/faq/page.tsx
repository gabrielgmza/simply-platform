import Link from 'next/link';
import { faqContent } from '@/lib/pages';
import { common } from '@/lib/content';

export const metadata = { title: faqContent.title };

export default function Page() {
  return (
    <section className="inner">
      <Link className="back" href="/">{common.back}</Link>
      <div className="panel">
        <div>
          <span className="kicker">{faqContent.k}</span>
          <h1>{faqContent.title}</h1>
          <p>
            Guía rápida sobre Simply, productos, condiciones, seguridad, empresas,
            Diamond Black, cripto y contacto.
          </p>
        </div>
      </div>
      <div className="faq-list">
        {faqContent.items.map(([q, a], i) => (
          <details key={q} open={i === 0}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
