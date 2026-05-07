import Link from 'next/link';
import Icon, { iconFor, Badge } from './Icon';
import { common, EMAIL } from '@/lib/content';
import type { PageData } from '@/lib/pages';
import { CRYPTO_URL } from '@/lib/routes';

type Props = {
  data: PageData;
  pageKey: string;
  children?: React.ReactNode;
};

export default function PageGeneric({ data, pageKey, children }: Props) {
  const isPeople = pageKey === 'people';
  const isCrypto = pageKey === 'crypto';
  const gold = !!data.gold;

  return (
    <section className="inner">
      <Link className="back" href="/">{common.back}</Link>

      <div className={'panel ' + (gold ? 'gold' : '')}>
        <div>
          <span className="kicker">{data.k}</span>
          <h1>{data.title}</h1>
          <p>{data.text}</p>
          {data.legal && <small>{common.legal}</small>}
          <div className="row">
            {isCrypto && (
              <a className="btn primary" href={CRYPTO_URL} target="_blank" rel="noopener noreferrer">
                Ir a app cripto ↗
              </a>
            )}
            <Link className={'btn ' + (gold ? 'gold' : 'primary')} href="/contacto">
              {common.contact}
            </Link>
          </div>
        </div>
        {data.image && (
          isPeople ? (
            <img className="phone-img" src="/assets/app-cards.webp" alt={data.title} loading="lazy" />
          ) : (
            <div className={'photo ' + (gold ? 'gold' : '')}>
              <img src={`/assets/${data.image}`} alt={data.title} loading="lazy" />
            </div>
          )
        )}
      </div>

      {data.media && (
        <section className="media">
          <div>
            <h2>Logo Simply listo para descargar</h2>
            <p>Incluye logo, favicon e imágenes fuente en la carpeta public/assets.</p>
          </div>
          <div className="media-logo">
            <span className="logo">
              <img src="/assets/simply-mark.png" alt="Simply" />
              <span>simply</span>
            </span>
          </div>
          <a className="btn secondary" href="/assets/simply-mark.png" download>Descargar PNG →</a>
        </section>
      )}

      {data.groups?.map(([title, items]) => (
        <section className="section" key={title}>
          <h2>{title}</h2>
          <div className="section-body">
            <div className="cards">
              {items.map(([t, b]) => (
                <article className={'card ' + (gold ? 'gold' : '')} key={t}>
                  <Badge name={iconFor(t)} gold={gold} />
                  <h3>{t}</h3>
                  <p>{b}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {data.items && (
        <section className="section">
          <h2>{data.title}</h2>
          <div className="section-body">
            <div className="cards">
              {data.items.map(([t, b]) => (
                <article className={'card ' + (gold ? 'gold' : '')} key={t}>
                  <Badge name={iconFor(t)} gold={gold} />
                  <h3>{t}</h3>
                  <p>{b}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {children}
    </section>
  );
}
