# Simply Landing — `apps/landing`

Landing oficial de Simply para `gosimply.xyz`. Forma parte del monorepo `simply-platform` junto con `apps/remesas` y `packages/ui`.

## Stack

- Next.js 15.1.12 (App Router)
- React 19.0.4
- TypeScript
- CSS plano (sin Tailwind por ahora — preserva el sistema de diseño original)

## Estado (Fase 1)

✅ Skeleton + Home funcional
✅ Header con menú móvil
✅ Footer con enlaces a las 22 rutas
✅ 22 páginas placeholder (en construcción)
✅ Security headers configurados (CSP, HSTS, X-Frame-Options, etc.)
✅ Metadata SEO + Open Graph

🚧 **Fase 2:** migrar contenido completo de las 22 páginas
🚧 **Fase 3:** formulario pre-registro conectado a Simply Core, multi-idioma EN/PT, sitemap

## Estructura

```
apps/landing/
├── app/
│   ├── layout.tsx        # Header + Footer + metadata global
│   ├── page.tsx          # Home
│   ├── globals.css       # Sistema de diseño Simply (dark + blue + gold)
│   ├── not-found.tsx     # 404
│   └── [22 rutas]/page.tsx
├── components/
│   ├── Header.tsx        # client (menú móvil)
│   ├── Footer.tsx
│   ├── Logo.tsx
│   ├── Icon.tsx
│   ├── Placeholder.tsx
│   └── PreregForm.tsx    # client
├── lib/
│   ├── content.ts        # textos home (Fase 2 amplía)
│   └── routes.ts         # mapeo rutas + constantes
├── public/
│   ├── favicon.png
│   └── assets/*.webp
├── next.config.js        # security headers
├── package.json
└── tsconfig.json
```

## Deploy en Vercel

1. **Import** `gabrielgmza/simply-platform` (si ya está, agregar nuevo proyecto apuntando al mismo repo)
2. **Project Name:** `simply-landing`
3. **Root Directory:** `apps/landing`
4. **Build Command:** `cd ../.. && pnpm --filter landing build`
5. **Install Command:** `cd ../.. && pnpm install --frozen-lockfile`
6. **Output Directory:** `.next` (default, no tocar)
7. **Domain:** asignar `gosimply.xyz` y `www.gosimply.xyz` desde Settings → Domains

## Local

```bash
cd ~/Documents/simply-platform
pnpm install
pnpm --filter landing dev
# http://localhost:3001
```
