import Link from 'next/link';
import Icon, { iconFor, Badge } from '@/components/Icon';
import { hero, homeCards, ecosystem, appSection, prereg, nav } from '@/lib/content';
import { CRYPTO_URL, ROUTES } from '@/lib/routes';
import PreregForm from '@/components/PreregForm';

const APP_SHOTS = ['app-home.webp', 'app-cards.webp', 'app-analytics.webp', 'app-onboarding.webp'];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <span className="pill">{hero.badge}</span>
          <h1>
            {hero.a}
            <br />
            <em>{hero.b}</em>
          </h1>
          <p>{hero.text}</p>
          <div className="row">
            <Link className="btn primary" href="#pre">{nav.pre}</Link>
            <Link className="btn secondary" href={ROUTES.people}>{nav.people}</Link>
            <Link className="btn secondary" href={ROUTES.business}>{nav.business}</Link>
            <a className="btn secondary" href={CRYPTO_URL} target="_blank" rel="noopener noreferrer">
              {nav.crypto} ↗
            </a>
          </div>
          <div className="bullets">
            {hero.bullets.map((b) => (
              <span key={b}>
                <Icon name={iconFor(b)} size={18} />
                {b}
              </span>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="visa">
            VISA<small>enabled</small>
          </div>
          <img src="/assets/app-home.webp" alt="Simply app" />
        </div>
      </section>

      <section className="stats">
        {hero.stats.map(([n, d]) => (
          <div key={n}>
            <b>{n}</b>
            <span>{d}</span>
          </div>
        ))}
      </section>

      <section className="three">
        {homeCards.map(([t, b], i) => {
          const target = [ROUTES.people, ROUTES.business, ROUTES.diamond][i];
          return (
            <Link key={t} href={target} className={i === 2 ? 'gold' : ''}>
              <h2>{t}</h2>
              <p>{b}</p>
              <span>Ver más →</span>
            </Link>
          );
        })}
      </section>

      <section className="section">
        <h2>{ecosystem.title}</h2>
        <p>{ecosystem.text}</p>
        <div className="section-body">
          <div className="cards">
            {ecosystem.items.map(([t, b]) => (
              <article className="card" key={t}>
                <Badge name={iconFor(t)} />
                <h3>{t}</h3>
                <p>{b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <span className="kicker">{appSection.k}</span>
        <h2>{appSection.title}</h2>
        <p>{appSection.text}</p>
        <div className="section-body">
          <div className="app-grid">
            {APP_SHOTS.map((im, i) => (
              <div className="app-shot" key={im}>
                <img src={`/assets/${im}`} alt={`Simply app ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
          <div className="cards" style={{ marginTop: 18 }}>
            {appSection.platforms.map(([t, b]) => (
              <article className="card" key={t}>
                <Badge name={iconFor(t)} />
                <h3>{t}</h3>
                <p>{b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="split">
        <div>
          <span className="kicker">Trust + AI</span>
          <h2>Seguridad, AI y control operativo.</h2>
          <p>
            Validación, monitoreo, trazabilidad, prevención de fraude, controles de cumplimiento y
            análisis inteligente de comportamiento.
          </p>
        </div>
        <div className="photo">
          <img src="/assets/security-ai.webp" alt="Seguridad AI" loading="lazy" />
        </div>
      </section>

      <section className="pre-section" id="pre">
        <div>
          <span className="kicker">Pre-registro</span>
          <h2>{prereg.title}</h2>
          <p>{prereg.text}</p>
          <div className="cards">
            {prereg.benefits.map(([t, b]) => (
              <article className="card" key={t}>
                <Badge name={iconFor(t)} />
                <h3>{t}</h3>
                <p>{b}</p>
              </article>
            ))}
          </div>
        </div>
        <PreregForm />
      </section>

      <section className="cta">
        <h2>El futuro financiero, más simple.</h2>
        <p>Sumate al pre-registro y accedé primero al ecosistema Simply.</p>
        <Link className="btn primary" href="#pre">{nav.pre}</Link>
      </section>
    </>
  );
}
