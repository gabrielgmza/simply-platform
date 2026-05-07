export const ROUTES = {
  home: '/',
  people: '/personas',
  business: '/empresas',
  diamond: '/diamond-black',
  ai: '/ai',
  crypto: '/cripto-stablecoins',
  partners: '/partners',
  about: '/nosotros',
  innovation: '/innovacion',
  trust: '/trust-center',
  investors: '/inversores-aliados-estrategicos',
  careers: '/trabaja-con-nosotros',
  press: '/kit-de-prensa',
  help: '/centro-de-ayuda',
  faq: '/faq',
  privacy: '/privacidad',
  terms: '/terminos',
  cookies: '/cookies',
  compliance: '/cumplimiento',
  approvals: '/sujeto-a-aprobacion',
  applicants: '/quienes-pueden-aplicar',
  status: '/estado-del-servicio',
  contact: '/contacto',
} as const;

export type RouteKey = keyof typeof ROUTES;

export const COMPANY = 'PaySur INC';
export const EMAIL = 'contacto@gosimply.xyz';
export const CRYPTO_URL = 'https://app.gosimply.xyz/';
export const SITE_URL = 'https://gosimply.xyz';
