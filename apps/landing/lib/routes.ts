export const REAL_ROUTES = {
  home: '/',
  people: '/personas',
  business: '/empresas',
  diamond: '/diamond-black',
  ai: '/ai',
  cryptoPage: '/cripto-stablecoins',
  partners: '/partners',
  securityPage: '/trust-center',
  about: '/nosotros',
  innovation: '/innovacion',
  investors: '/inversores-aliados-estrategicos',
  careers: '/trabaja-con-nosotros',
  press: '/kit-de-prensa',
  applicants: '/quienes-pueden-aplicar',
  approvals: '/sujeto-a-aprobacion',
  help: '/centro-de-ayuda',
  faq: '/faq',
  status: '/estado-del-servicio',
  privacy: '/privacidad',
  terms: '/terminos',
  cookies: '/cookies',
  compliance: '/cumplimiento',
  contact: '/contacto',
} as const;

export type PageKey = keyof typeof REAL_ROUTES;

export const SITE_URL = 'https://gosimply.xyz';
export const COMPANY_NAME = 'PaySur INC';
export const CONTACT_EMAIL = 'contacto@gosimply.xyz';
export const CRYPTO_URL = 'https://app.gosimply.xyz/';
