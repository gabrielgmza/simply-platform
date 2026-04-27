# Simply Platform

Monorepo del ecosistema Simply by PaySur.

## Estructura

```
apps/
  remesas/      Frontend Simply Remesas (Next.js)

packages/
  ui/           Componentes web compartidos
  contracts/    Tipos TypeScript compartidos
```

## Comandos

```bash
# Instalar todo
pnpm install

# Dev de remesas
pnpm --filter remesas dev

# Build completo
pnpm build

# Build solo de un app
pnpm --filter remesas build

# Limpiar
pnpm clean
```

## Agregar un componente nuevo a UI

1. Crear archivo en `packages/ui/src/components/MyComponent.tsx`
2. Exportar en `packages/ui/src/components/index.ts`
3. Usarlo en remesas: `import { MyComponent } from "@simply/ui"`

## Deploy en Vercel

En el proyecto de Vercel:
- **Root Directory**: `apps/remesas`
- **Build Command**: `cd ../.. && pnpm --filter remesas build`
- **Install Command**: `cd ../.. && pnpm install --frozen-lockfile`
- **Output Directory**: `.next`

## Próximas fases

- Fase 2: migrar `simply-crypto` → `apps/crypto`
- Fase 3: migrar `simply-backend` → `apps/backend`
- Fase 4: migrar `simply-app` → `apps/mobile` + `packages/ui-native`
