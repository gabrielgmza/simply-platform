import Link from 'next/link';

export default function Placeholder({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <section className="inner">
      <Link className="back" href="/">← Volver a Simply</Link>
      <div className="panel">
        <div>
          {kicker && <span className="kicker">{kicker}</span>}
          <h1>{title}</h1>
          <p>
            Esta sección está en construcción. En breve estará disponible con todo el contenido detallado.
          </p>
        </div>
      </div>
    </section>
  );
}
