import Link from 'next/link';

export const metadata = { title: 'Página no encontrada' };

export default function NotFound() {
  return (
    <section className="inner">
      <div className="panel">
        <div>
          <span className="kicker">404</span>
          <h1>No encontramos esta página</h1>
          <p>Puede que el enlace haya cambiado o que la sección esté en construcción.</p>
          <div className="row">
            <Link className="btn primary" href="/">Volver al inicio</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
