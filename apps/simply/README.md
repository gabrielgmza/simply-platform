# apps/simply

App principal de Simply: motor universal de movimiento de dinero.

## Instalación (en el monorepo)

```bash
cd ~/Documents/simply-platform

# Descomprimir esta carpeta dentro de apps/
cp -r ~/Downloads/simply-app/apps/simply apps/simply

# Instalar dependencias del workspace
pnpm install

# Probar local
pnpm --filter simply dev
```

Abrí http://127.0.0.1:3000

## Estructura

```
apps/simply/
├── app/
│   ├── page.tsx                    ← Calculadora libre (home)
│   ├── login/page.tsx              ← Identificación
│   ├── destinatario/page.tsx       ← Datos del receptor (banco / wallet)
│   ├── confirmar/page.tsx          ← Review + ejecutar
│   ├── exito/[order]/page.tsx      ← Tracking
│   ├── historial/page.tsx
│   └── api/
│       ├── transfer-engine/
│       │   ├── quote/route.ts
│       │   └── execute/route.ts
│       ├── auth/route.ts           ← /identity/find-or-create
│       └── order/[order]/route.ts
├── lib/
│   ├── core.ts                     ← cliente HTTP al Core
│   └── destinations.ts             ← catálogo unificado de destinos
├── globals.css
├── layout.tsx
├── package.json
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Flujo del usuario

1. **Home** — calculadora libre. Cliente elige monto + moneda origen + destino. Cotiza en vivo.
2. **Login** — email + nombre/apellido (crea LEAD en Core).
3. **Destinatario** — formulario adaptativo:
   - Si destino es banco: datos beneficiario + banco + cuenta
   - Si destino es wallet cripto: address
4. **Confirmar** — review + ejecutar.
5. **Tracking** — polling cada 5s al `/transfer-engine/order/:order`.

## Deploy en Vercel

Crear nuevo proyecto en Vercel apuntando a `gabrielgmza/simply-platform`:
- **Root Directory**: `apps/simply`
- **Build Command**: `cd ../.. && pnpm --filter simply build`
- **Install Command**: `cd ../.. && pnpm install --frozen-lockfile`
- **Environment Variables**:
  - `CORE_API_URL` = `https://simply-backend-888610796336.southamerica-east1.run.app/api/v1`

## Estado actual

- ✅ Calculadora libre con cotización vía `/transfer-engine/quote`
- ✅ Soporte fiat→fiat para CL, CO, MX, VE, PE, AR, US
- ⏳ Cripto destination: deshabilitado (esperando confirmación de Vita)
- ⏳ Provider Vita necesita credenciales (mañana)

## Próximos pasos

1. Cuando Vita confirme las credenciales, todo arranca a cotizar.
2. Cuando Vita confirme cripto↔fiat, habilitamos los destinos crypto.
3. Cuando sumemos otro provider (Bridge, Bitso), aparece automático en `quoteAll`.
