# Simply Remesas

Frontend público para envíos de dinero a LatAm vía Vita Wallet.

## Stack
- Next.js 15 (App Router)
- React 19
- Tailwind CSS 3
- TypeScript

## Quick start

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables
cp .env.local.example .env.local

# 3. Correr en local
npm run dev
```

Abrir http://localhost:3000

## Deploy a Vercel

1. Crear repo en GitHub: `gabrielgmza/simply-remesas`
2. Conectar repo a Vercel
3. Variable de entorno en Vercel:
   - `CORE_API_URL` = `https://simply-backend-888610796336.southamerica-east1.run.app/api/v1`
4. Deploy automático

## Estructura

```
app/
├── page.tsx              ← Step 1: cotización pública
├── login/page.tsx        ← Step 2: identificación
├── beneficiario/page.tsx ← Step 3: datos del receptor
├── confirmar/page.tsx    ← Step 4: confirmación + pago
├── exito/[order]/page.tsx ← Tracking
├── historial/page.tsx
├── api/
│   ├── quote/route.ts    ← proxy a /api/v1/remesas/quote
│   ├── auth/route.ts     ← proxy a /api/v1/identity/find-or-create
│   ├── transfer/route.ts ← proxy a /api/v1/remesas/transfer
│   └── order/[order]/route.ts ← proxy a /api/v1/remesas/order/:order
├── globals.css
└── layout.tsx

lib/
├── core.ts    ← cliente HTTP al backend
└── session.ts ← sesión client-side
```

## Flujo del usuario

1. **Cotización** (público) — monto + país → ve precio con markup
2. **Login** — email + nombre → crea LEAD en Core via Identity
3. **Beneficiario** — nombre, banco, CC, propósito
4. **Confirmar** — review + click "pagar"
5. **Tracking** — polling cada 5s al backend hasta `completed`

## Pendiente

- [ ] Form dinámico por país (`/api/v1/remesas/forms/:country` cuando exista)
- [ ] Integrar pago real (CVU/USDT) post-confirmación
- [ ] Historial de operaciones por customer (cuando el endpoint exista en Core)
- [ ] Magic link para login (hoy es solo find-or-create con email)
- [ ] /admin/markup para gestionar markups (interfaz interna)

## Notas

- Las credenciales Vita viven en simply-backend (Cloud Run env vars)
- No se almacena información sensible en localStorage, solo customerId + email
- El customerId proviene del Identity Service (Core)
