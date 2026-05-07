import { EMAIL, COMPANY } from './routes';

export const ADDRESS = '651 North Broad Street, Middletown, Delaware, Estados Unidos';

export const nav = {
  people: 'Personas',
  business: 'Empresas',
  diamond: 'Diamond Black',
  ai: 'AI',
  crypto: 'Cripto',
  partners: 'Partners',
  login: 'Ingresar',
  pre: 'Pre-registro',
};

export const common = {
  back: '← Volver a Simply',
  contact: 'Contacto',
  official: 'Canal oficial: email',
  legal: 'Contenido informativo. Productos sujetos a aprobación, disponibilidad, regulación, proveedor, jurisdicción e integraciones habilitadas.',
  rights: 'Todos los derechos reservados.',
};

export const hero = {
  badge: 'AI-first fintech · Personas · Empresas · Cripto',
  a: 'Tu dinero,',
  b: 'sin fricción.',
  text: 'Una plataforma financiera AI-first para personas y empresas: pagos, tarjeta Visa, cripto, stablecoins, financiación, rewards, seguridad avanzada, inversiones y operaciones inteligentes en un solo ecosistema, disponible para Android, iOS y Web.',
  bullets: ['AI en operaciones', 'Seguridad avanzada', 'Experiencia multimoneda', 'Diseño global'],
  stats: [
    ['24/7', 'monitoreo y seguridad'],
    ['AI', 'operación inteligente'],
    ['1%', 'cashback estándar*'],
    ['48', 'cuotas estándar*'],
  ] as const,
};

export const homeCards = [
  ['Personas', 'Pagá, invertí, protegé compras, optimizá gastos y accedé a beneficios desde una experiencia premium.'],
  ['Empresas', 'Controlá gastos, cobros, pagos masivos, facturación*, multi-divisa, fraude, stablecoins, factoring* y financiación.'],
  ['Diamond Black', 'Acceso por invitación para clientes de alto patrimonio: concierge 24/7, viajes de élite y beneficios seleccionados.'],
] as const;

export const ecosystem = {
  title: 'Un ecosistema financiero, no una app más.',
  text: 'Cuenta, tarjeta, cripto, stablecoins, AI, seguridad, beneficios y financiación conectados en una experiencia simple de usar y potente por dentro.',
  items: [
    ['Cuenta digital', 'Saldos, movimientos, control y apertura de cuenta en USA*, según disponibilidad.'],
    ['Tarjeta Visa', 'Física, virtual y de un solo uso para comprar con más control.'],
    ['Cripto & stablecoins', 'Activos digitales para operaciones cotidianas, tesorería y pagos, según disponibilidad.'],
    ['AI financiera', 'Riesgo, fraude, soporte, optimización de gastos y asesoría inteligente.'],
  ] as const,
};

export const appSection = {
  k: 'App Simply',
  title: 'Una app premium, clara y lista para operar.',
  text: 'Pantallas diseñadas para administrar dinero, tarjetas, gastos, analítica y acceso de forma simple. Simply está pensado para operar desde Android, iOS y Web.',
  platforms: [
    ['Android', 'App móvil para usuarios Android, con acceso a cuenta, tarjeta, pagos, AI y beneficios según disponibilidad.'],
    ['iOS', 'App móvil para iPhone con experiencia premium, seguridad y control financiero.'],
    ['Web', 'Acceso web responsive para operar, gestionar información y usar Simply desde navegador.'],
  ] as const,
};

export const prereg = {
  title: 'Pre-registro Simply',
  text: 'Acceso anticipado a tarjeta Visa, QR, fondos comunes de inversión con rentabilidad diaria*, cashback hasta 1%*, Rewards y financiación hasta 48 cuotas mensuales*. Sujeto a aprobación.',
  benefits: [
    ['Tarjeta Visa', 'Física o virtual, según disponibilidad.'],
    ['QR', 'Pagos y cobros con integraciones habilitadas.'],
    ['Fondos comunes', 'Inversiones con rentabilidad diaria*, según proveedor y perfil.'],
    ['Cashback hasta 1%*', 'Beneficios por consumo según campaña.'],
    ['Rewards', 'Puntos, recompensas y beneficios.'],
    ['Hasta 48 cuotas*', 'Financiación mensual sujeta a aprobación.'],
  ] as const,
  fields: {
    person: 'Soy persona',
    business: 'Soy empresa',
    name: 'Nombre y apellido',
    email: 'Email',
    phone: 'Teléfono',
    country: 'País',
    city: 'Ciudad',
    company: 'Empresa',
    send: 'Enviar pre-registro',
    ok: 'Pre-registro recibido.',
  },
};

export const cookiesText = 'Simply puede utilizar cookies y tecnologías similares para operar el sitio, recordar preferencias, medir uso, mejorar rendimiento y prevenir fraude.';

export const footerCols: ReadonlyArray<readonly [string, ReadonlyArray<readonly [string, string]>]> = [
  ['Productos', [
    ['/personas', 'Personas'],
    ['/empresas', 'Empresas'],
    ['/diamond-black', 'Diamond Black'],
    ['/ai', 'AI'],
    ['/cripto-stablecoins', 'Cripto'],
  ]],
  ['Empresa', [
    ['/nosotros', 'Nosotros'],
    ['/innovacion', 'Innovación'],
    ['/trust-center', 'Trust Center'],
    ['/partners', 'Partners'],
    ['/inversores-aliados-estrategicos', 'Inversores / aliados'],
    ['/trabaja-con-nosotros', 'Trabaja con nosotros'],
    ['/kit-de-prensa', 'Kit de prensa'],
  ]],
  ['Ayuda', [
    ['/quienes-pueden-aplicar', 'Quiénes pueden aplicar'],
    ['/sujeto-a-aprobacion', 'Sujeto a aprobación'],
    ['/centro-de-ayuda', 'Centro de ayuda'],
    ['/faq', 'FAQ'],
    ['/estado-del-servicio', 'Estado del servicio'],
    ['/contacto', 'Contacto'],
  ]],
  ['Legal', [
    ['/privacidad', 'Privacidad'],
    ['/terminos', 'Términos'],
    ['/cookies', 'Cookies'],
    ['/cumplimiento', 'Cumplimiento'],
  ]],
];

export { EMAIL, COMPANY };
