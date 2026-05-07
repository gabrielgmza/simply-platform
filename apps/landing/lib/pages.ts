import { EMAIL, COMPANY } from './routes';
import { ADDRESS } from './content';

export type PageItem = readonly [string, string];
export type PageGroup = readonly [string, ReadonlyArray<PageItem>];

export type PageData = {
  title: string;
  k: string;
  text: string;
  image?: string;
  gold?: boolean;
  legal?: boolean;
  media?: boolean;
  groups?: ReadonlyArray<PageGroup>;
  items?: ReadonlyArray<PageItem>;
};

export const pages = {
  people: {
    title: 'Simply para personas',
    k: 'Control financiero premium',
    text: 'Pagos, tarjeta Visa, QR, fondos comunes con rentabilidad diaria*, cashback hasta 1%*, financiación hasta 48 cuotas mensuales*, asistencias, seguridad, apertura de cuenta en USA* y AI asesora.',
    image: 'people-invest.webp',
    groups: [
      ['Uso diario', [
        ['Cuenta digital', 'Saldo, movimientos, transferencias y alertas en tiempo real.'],
        ['Tarjeta Visa', 'Tarjeta física, virtual y control desde la app.'],
        ['Cuenta en USA*', 'Apertura sujeta a elegibilidad, validación y proveedores.'],
      ]],
      ['Seguridad y tarjetas', [
        ['Tarjetas de un solo uso', 'Tarjetas virtuales que se desactivan después de una compra.'],
        ['Control de suscripciones', 'Alertas sobre cobros recurrentes y servicios no utilizados.'],
        ['Protección de compras', 'Herramientas para reducir riesgo en compras digitales.'],
      ]],
      ['AI y beneficios', [
        ['AI asesora', 'Asistencia para entender movimientos, oportunidades y alertas.'],
        ['Optimización de gastos', 'Detecta suscripciones inactivas y alternativas convenientes.'],
        ['Pack de asistencias', 'Hogar, mascotas, instalaciones y mantenimiento.'],
      ]],
    ],
  },
  business: {
    title: 'Simply para empresas',
    k: 'Infraestructura financiera inteligente',
    text: 'El sistema financiero operativo para empresas que quieren pagar, cobrar, auditar, invertir excedentes, financiarse, operar multi-divisa y reducir fraude desde una sola plataforma.',
    image: 'business-office.webp',
    groups: [
      ['Gestión financiera', [
        ['Gestión de gastos inteligente', 'Tarjetas virtuales para empleados, foto del ticket y justificación automática.'],
        ['Generación de facturas*', 'Emisión y organización de comprobantes según país e integraciones.'],
        ['Fondos comunes*', 'Inversión de excedentes con rentabilidad diaria.'],
      ]],
      ['Operaciones y pagos', [
        ['Pagos masivos', 'Pagos trazables a proveedores, colaboradores, aliados o clientes.'],
        ['Multi-divisa en tiempo real', 'Operación entre monedas con mayor transparencia.'],
        ['Stablecoins cotidianas', 'Tesorería, pagos o liquidaciones con stablecoins.'],
      ]],
      ['Riesgo y fraude', [
        ['Validación de proveedores', 'Revisión de cuentas destino, señales de riesgo y posibles fraudes.'],
        ['Control de fraude empresarial', 'Reglas, alertas y monitoreo de riesgos internos y externos.'],
        ['Salud financiera de clientes', 'Analítica en tiempo real para estimar riesgo.'],
      ]],
      ['Financiación e integraciones', [
        ['Revenue-Based Financing*', 'Financiación repagada como porcentaje de ventas diarias.'],
        ['Factoring con un click*', 'Anticipo de facturas pendientes desde la plataforma.'],
        ['Múltiples usuarios y roles', 'Permisos, límites, jerarquías y aprobaciones.'],
      ]],
    ],
  },
  diamond: {
    title: 'Diamond Black',
    k: 'Acceso por invitación · Ultra exclusivo',
    text: 'Una propuesta ultra exclusiva para clientes de alto patrimonio que buscan discreción, prioridad, atención personalizada y una experiencia financiera superior.',
    image: 'diamond-lifestyle.webp',
    gold: true,
    groups: [
      ['Beneficios base', [
        ['Cashback hasta 1.5%*', 'Beneficio diferencial sujeto a campaña y condiciones.'],
        ['Hasta 60 cuotas mensuales*', 'Financiación preferencial sujeta a evaluación.'],
        ['AI patrimonial', 'Asistencia inteligente para ordenar información y detectar oportunidades.'],
      ]],
      ['Servicios exclusivos', [
        ['Coberturas médicas masivas', 'Seguros de viaje superiores a USD/EUR 50.000 con repatriaciones.'],
        ['Garantías extremas', 'Protección de compras y extensión de garantías.'],
      ]],
      ['Viajes y experiencias', [
        ['Preventas exclusivas', 'Acceso anticipado a conciertos y eventos.'],
        ['Hoteles y salas VIP', 'Upgrades, desayuno, spa, late check-out y lounges.'],
        ['Concierge 24/7', 'Viajes, yates, jets, visas, regalos y reservas imposibles.'],
      ]],
    ],
  },
  ai: {
    title: 'AI financiera Simply',
    k: 'AI-first con límites responsables',
    text: 'AI para riesgo, soporte, fraude, automatización, análisis de comportamiento y asesoría. La AI ayuda a operar mejor; no reemplaza controles humanos o decisiones reguladas.',
    image: 'security-ai.webp',
    items: [
      ['AI Advisor para personas', 'Optimización de gastos, suscripciones, alertas y lectura financiera simple.'],
      ['AI Advisor para empresas', 'Asistencia por usuario, limitada por permisos, rol y políticas internas.'],
      ['AI Risk Engine', 'Señales tempranas, scoring interno y salud financiera.'],
      ['AI Fraud Engine', 'Patrones anómalos, proveedores riesgosos y actividad sospechosa.'],
    ],
  },
  crypto: {
    title: 'Cripto & Stablecoins',
    k: 'Activos digitales para operaciones reales',
    text: 'Simply conecta la experiencia financiera tradicional con cripto y stablecoins para pagos, tesorería, cobertura operativa y transferencias.',
    image: 'crypto-desk.webp',
    items: [
      ['Stablecoins cotidianas', 'Uso para pagos, tesorería o liquidaciones.'],
      ['Operación cripto', 'Acceso desde app.gosimply.xyz.'],
      ['Cumplimiento', 'Monitoreo, validaciones y trazabilidad.'],
      ['Riesgos', 'Activos digitales pueden tener riesgos regulatorios y de mercado.'],
    ],
  },
  partners: {
    title: 'Partners',
    k: 'Ecosistema abierto',
    text: 'Simply puede integrarse con bancos, PSPs, comercios, brokers, aseguradoras, proveedores cripto, ERPs y aliados tecnológicos.',
    image: 'partners-office.webp',
    items: [
      ['Bancos y PSPs', 'Rieles financieros, cuentas, pagos y procesamiento.'],
      ['Brokers e inversiones', 'Productos ofrecidos por entidades autorizadas.'],
      ['Aseguradoras', 'Seguros embebidos, asistencias y coberturas on-demand.'],
      ['Tecnología', 'ERP, datos, verificación, compliance, AI y antifraude.'],
    ],
  },
  about: {
    title: 'Nosotros',
    k: 'Finanzas simples, tecnología profunda.',
    text: 'Simply nace para rediseñar la relación entre personas, empresas y dinero. Una plataforma financiera debe ser clara, inmediata, segura y disponible cuando el usuario la necesita.',
    items: [
      ['Misión', 'Simplificar el acceso a servicios financieros modernos mediante una experiencia digital clara, segura e inteligente.'],
      ['Visión', 'Construir una de las compañías financieras más innovadoras del mundo, con AI integrada en gran parte de sus operaciones.'],
      ['Empresa', `${COMPANY} · ${ADDRESS}`],
    ],
  },
  innovation: {
    title: 'Innovación',
    k: 'Fintech AI-first.',
    text: 'Simply combina infraestructura financiera, diseño premium, cripto, stablecoins, riesgo, automatización y AI operativa para construir una compañía financiera moderna, escalable y global.',
    items: [
      ['AI operativa', 'Soporte, monitoreo, riesgo, fraude y automatización.'],
      ['Infraestructura modular', 'Cuenta, tarjeta, pagos, QR, cripto, inversiones, financiación, seguridad, empresas y Diamond Black.'],
      ['Escala global', 'Adaptación por país, proveedor, regulación, idioma y moneda.'],
    ],
  },
  trust: {
    title: 'Trust Center',
    k: 'Confianza por diseño.',
    text: 'La confianza es una arquitectura: KYC/KYB, monitoreo, prevención de fraude, roles, auditoría, trazabilidad, protección de datos y proveedores regulados.',
    items: [
      ['Identidad y elegibilidad', 'Validación de identidad, documentación, perfil transaccional y listas de control.'],
      ['Prevención de fraude', 'Análisis de comportamiento, actividad inusual y proveedores riesgosos.'],
      ['Protección de datos', 'Controles de acceso, monitoreo, registros y buenas prácticas.'],
    ],
  },
  investors: {
    title: 'Inversores / Aliados estratégicos',
    k: 'Infraestructura fintech AI-first',
    text: 'Simply combina personas, empresas, cripto, stablecoins, Diamond Black, AI operativa y una arquitectura preparada para escalar con partners estratégicos.',
    items: [
      ['Tesis', 'El mercado financiero migra hacia experiencias integradas, móviles, AI-first y multimoneda.'],
      ['Qué buscamos', 'Aliados estratégicos, proveedores regulados, capital inteligente e integraciones tecnológicas.'],
      ['Contacto', EMAIL],
    ],
  },
  careers: {
    title: 'Trabajá con nosotros',
    k: 'Construí finanzas más simples.',
    text: 'Buscamos builders con criterio operativo, velocidad y ambición global para crear una fintech AI-first.',
    items: [
      ['Perfiles', 'Ingeniería, mobile, cloud, seguridad, data, producto, diseño, compliance, riesgo, growth y partners.'],
      ['Cultura', 'Equipos pequeños, documentación clara, automatización y decisiones basadas en datos.'],
      ['Aplicar', `Enviar perfil a ${EMAIL} con asunto Careers Simply.`],
    ],
  },
  press: {
    title: 'Prensa / Media Kit',
    k: 'Recursos institucionales.',
    text: 'Simply es una fintech AI-first desarrollada por PaySur INC, enfocada en infraestructura financiera simple, segura y global.',
    media: true,
    items: [
      ['Boilerplate', 'Simply integra cuenta digital, tarjeta Visa, pagos, cripto, inversiones, financiación, seguridad y herramientas para empresas.'],
      ['Uso del logo', 'Mantener proporciones, contraste y área de protección.'],
      ['Contacto de prensa', EMAIL],
    ],
  },
  help: {
    title: 'Centro de ayuda',
    k: 'Soporte claro, por email y autoservicio.',
    text: 'Encontrá respuestas sobre pre-registro, cuenta, tarjeta Visa, QR, inversiones, financiación, empresas, Diamond Black, cripto, privacidad y seguridad.',
    items: [
      ['Canal oficial', `Email: ${EMAIL}. Simply no ofrece atención telefónica como canal oficial.`],
      ['Antes de contactarnos', 'Revisá FAQ, términos, privacidad, Trust Center y productos sujetos a aprobación.'],
      ['Seguridad', 'No solicitamos contraseñas, códigos, frases semilla ni claves privadas.'],
    ],
  },
  privacy: {
    title: 'Política de Privacidad',
    k: 'Última actualización: 2026',
    text: `Simply, marca operada por ${COMPANY}, puede recopilar datos de contacto, formularios, dispositivo, preferencias, validaciones KYC/KYB y datos necesarios para productos sujetos a aprobación.`,
    legal: true,
    items: [
      ['Responsable', `${COMPANY}, ${ADDRESS}. Contacto: ${EMAIL}.`],
      ['Finalidades', 'Gestionar pre-registros, responder consultas, evaluar solicitudes, prevenir fraude, cumplir obligaciones y operar productos.'],
      ['AI y automatización', 'Podemos usar AI para soporte, clasificación, riesgo y prevención de fraude con límites responsables.'],
      ['Derechos', 'Según jurisdicción, el usuario puede solicitar acceso, rectificación, eliminación u oposición por email.'],
    ],
  },
  terms: {
    title: 'Términos y Condiciones',
    k: 'Última actualización: 2026',
    text: 'Estos Términos regulan el uso del sitio, pre-registro, formularios, contenidos y servicios asociados a Simply.',
    legal: true,
    items: [
      ['Aceptación', 'Al usar el sitio, el usuario acepta términos, privacidad, cookies, cumplimiento y condiciones específicas.'],
      ['Pre-registro', 'No constituye apertura de cuenta, aprobación crediticia ni disponibilidad garantizada.'],
      ['Productos sujetos a aprobación', 'Financiación, cashback, cuenta USA, inversiones, cripto, seguros y Diamond Black dependen de elegibilidad y proveedores.'],
      ['Limitación', 'La información no constituye asesoramiento financiero, legal, fiscal, contable o de inversión.'],
    ],
  },
  cookies: {
    title: 'Política de Cookies',
    k: 'Medición, seguridad y experiencia.',
    text: 'Simply puede utilizar cookies y tecnologías similares para operar el sitio, recordar preferencias, medir uso, mejorar rendimiento y prevenir fraude.',
    items: [
      ['Necesarias', 'Permiten que el sitio funcione y mantenga seguridad.'],
      ['Analíticas', 'Ayudan a entender visitas, rendimiento y conversión.'],
      ['Preferencias', 'Recuerdan idioma, país y configuración.'],
      ['Gestión', 'El usuario puede aceptar, rechazar o configurar cookies desde el navegador.'],
    ],
  },
  compliance: {
    title: 'Cumplimiento',
    k: 'Operación responsable.',
    text: 'Simply incorpora principios de cumplimiento, prevención de fraude, validación de identidad, trazabilidad, monitoreo, roles, auditoría y adaptación regulatoria.',
    items: [
      ['KYC / KYB', 'Validación de personas, empresas, autoridades, beneficiarios y actividad.'],
      ['AML/CFT', 'Controles contra lavado de activos, financiación del terrorismo, sanciones y listas restrictivas.'],
      ['Fraude', 'Análisis de patrones, anomalías, dispositivos, IP y abuso operativo.'],
      ['Restricciones', 'Podemos rechazar, limitar o suspender solicitudes por riesgo o incumplimiento.'],
    ],
  },
  approvals: {
    title: 'Productos sujetos a aprobación',
    k: 'Claridad legal y comercial',
    text: 'Algunos productos dependen de evaluación crediticia, KYC/KYB, regulación, proveedores, país, integraciones, documentación y políticas internas.',
    items: [
      ['Financiación estándar hasta 48 cuotas', 'Evaluación crediticia, políticas comerciales, proveedor y regulación.'],
      ['Diamond Black hasta 60 cuotas', 'Invitación, evaluación, proveedor y condiciones.'],
      ['Cashback estándar hasta 1%', 'Campaña, perfil, comercio y condiciones.'],
      ['Cashback Diamond Black hasta 1.5%', 'Perfil, invitación, campaña y disponibilidad.'],
      ['Fondos comunes', 'Proveedor autorizado, perfil, regulación y riesgo. No es asesoramiento financiero.'],
      ['Cripto / stablecoins', 'Regulación, proveedor, disponibilidad y riesgos operativos.'],
    ],
  },
  applicants: {
    title: 'Quiénes pueden aplicar',
    k: 'Elegibilidad clara',
    text: 'Simply está pensado para distintos perfiles, sujeto a validaciones, regulación, disponibilidad e integraciones habilitadas.',
    items: [
      ['Personas', 'Clientes que quieren cuenta, tarjeta, pagos, inversiones y beneficios.'],
      ['Empresas', 'Comercios, equipos, financieras, marketplaces e importadores/exportadores.'],
      ['Partners', 'Bancos, PSPs, brokers, aseguradoras, ERPs y proveedores tecnológicos.'],
    ],
  },
  status: {
    title: 'Estado del servicio',
    k: 'Transparencia operativa',
    text: 'Estado informativo de módulos y disponibilidad.',
    items: [
      ['Sitio web', 'Operativo'],
      ['App cripto', 'Operativa'],
      ['Pre-registro', 'Activo'],
      ['Diamond Black', 'Acceso por invitación'],
    ],
  },
} satisfies Record<string, PageData>;

export const faqContent = {
  title: 'Preguntas frecuentes',
  k: 'Respuestas rápidas',
  items: [
    ['¿Qué es Simply?', 'Una plataforma financiera AI-first para personas y empresas.'],
    ['¿Simply ya está disponible?', 'La web permite pre-registro y acceso informativo; algunos productos están sujetos a aprobación.'],
    ['¿Hay app?', 'Sí, Simply está pensado para Android, iOS y Web.'],
    ['¿Cuántas cuotas ofrece?', 'Clientes estándar hasta 48 cuotas* y Diamond Black hasta 60 cuotas*, sujeto a aprobación.'],
    ['¿Cuál es el cashback?', 'Hasta 1% para estándar y hasta 1.5% para Diamond Black, sujeto a condiciones.'],
    ['¿Cuál es el canal de contacto?', 'Email: contacto@gosimply.xyz. No hay canal telefónico oficial.'],
  ] as const,
};
