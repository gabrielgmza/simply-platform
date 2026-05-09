'use client';

import { useState } from 'react';

const LANDING_URL = 'https://gosimply.xyz';
const COMPANY_NAME = 'PaySur INC';
const COMPANY_ADDRESS = '651 North Broad Street, Middletown, Delaware, Estados Unidos';

const SOCIALS: [string, string][] = [
  ['X', '#'],
  ['Instagram', '#'],
  ['LinkedIn', '#'],
  ['YouTube', '#'],
];

const COUNTRIES = [
  'Argentina', 'Brasil', 'Chile', 'Colombia', 'México', 'Perú',
  'Uruguay', 'Estados Unidos', 'España', 'Venezuela',
];

const FOOTER_COLS: [string, [string, string][]][] = [
  ['Productos', [
    ['Personas', `${LANDING_URL}/personas`],
    ['Empresas', `${LANDING_URL}/empresas`],
    ['Diamond Black', `${LANDING_URL}/diamond-black`],
    ['AI', `${LANDING_URL}/ai`],
    ['Cripto', `${LANDING_URL}/cripto-stablecoins`],
  ]],
  ['Empresa', [
    ['Nosotros', `${LANDING_URL}/nosotros`],
    ['Innovación', `${LANDING_URL}/innovacion`],
    ['Trust Center', `${LANDING_URL}/trust-center`],
    ['Partners', `${LANDING_URL}/partners`],
    ['Inversores', `${LANDING_URL}/inversores-aliados-estrategicos`],
    ['Trabajá con nosotros', `${LANDING_URL}/trabaja-con-nosotros`],
    ['Kit de prensa', `${LANDING_URL}/kit-de-prensa`],
  ]],
  ['Ayuda', [
    ['Quiénes pueden aplicar', `${LANDING_URL}/quienes-pueden-aplicar`],
    ['Sujeto a aprobación', `${LANDING_URL}/sujeto-a-aprobacion`],
    ['Centro de ayuda', `${LANDING_URL}/centro-de-ayuda`],
    ['Contacto', `${LANDING_URL}/contacto`],
    ['FAQ', `${LANDING_URL}/faq`],
    ['Estado del servicio', `${LANDING_URL}/estado-del-servicio`],
  ]],
  ['Legal', [
    ['Privacidad', `${LANDING_URL}/privacidad`],
    ['Términos', `${LANDING_URL}/terminos`],
    ['Cookies', `${LANDING_URL}/cookies`],
    ['Cumplimiento', `${LANDING_URL}/cumplimiento`],
  ]],
];

export default function Footer() {
  const [country, setCountry] = useState('Argentina');

  return (
    <footer className="relative z-10 border-t border-zinc-900 bg-black px-6 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_2.4fr] gap-12">
          {/* Columna izquierda: logo + tagline + socials + país */}
          <div>
            <a href={LANDING_URL} className="inline-flex items-center" aria-label="Simply">
              <img
                src="/assets/logo-simply.webp"
                alt="Simply"
                className="h-11 w-auto"
                draggable={false}
              />
            </a>
            <p className="mt-5 text-zinc-400 max-w-sm leading-relaxed">
              Tu dinero, sin fricción. Pagos, tarjeta Visa, cripto, stablecoins y operaciones inteligentes en un solo ecosistema.
            </p>
            <p className="mt-4 text-xs text-zinc-600">
              Simply es una marca operada por {COMPANY_NAME}. Sujeto a aprobación regulatoria según jurisdicción.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-zinc-500">
              {SOCIALS.map(([name, url]) => (
                <a key={name} href={url} className="hover:text-white transition">
                  {name}
                </a>
              ))}
            </div>
            <div className="mt-7">
              <label className="text-xs text-zinc-600">País</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-2 w-full max-w-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-sm text-zinc-300 outline-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Columnas de links */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FOOTER_COLS.map(([title, items]) => (
              <div key={title}>
                <h4 className="font-semibold text-white">{title}</h4>
                <div className="mt-4 space-y-3 text-sm text-zinc-500">
                  {items.map(([label, url]) => (
                    <a
                      key={label}
                      href={url}
                      className="block hover:text-white text-left transition"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between gap-4 text-xs text-zinc-600">
          <p>© 2026 Simply / {COMPANY_NAME}. Todos los derechos reservados.</p>
          <p>{COMPANY_ADDRESS}</p>
          <a
            href={`${LANDING_URL}/sujeto-a-aprobacion`}
            className="text-left hover:text-white transition"
          >
            Sujeto a aprobación
          </a>
          <p>{country}</p>
        </div>
      </div>
    </footer>
  );
}
