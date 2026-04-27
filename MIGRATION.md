# Migración a monorepo - Pasos manuales

Este ZIP contiene la nueva estructura `simply-platform/`. Acá te guío para migrar sin romper nada.

## Paso 1 — Backup del proyecto actual

```bash
cp -r ~/Documents/simply-remesas ~/Documents/simply-remesas.backup
```

## Paso 2 — Descomprimir el monorepo en una nueva carpeta

```bash
cd ~/Documents
unzip ~/Downloads/simply-platform.zip
cd simply-platform
ls
```

Deberías ver:
```
apps/  packages/  package.json  pnpm-workspace.yaml  turbo.json  tsconfig.base.json  README.md  .gitignore
```

## Paso 3 — Instalar dependencias

```bash
pnpm install
```

Esto va a tardar un par de minutos. Instala turbo, next, react y todos los packages del workspace.

## Paso 4 — Probar que compile

```bash
pnpm --filter remesas build
```

Si compila OK ✅ pasamos al siguiente paso.

## Paso 5 — Probar en local

```bash
pnpm --filter remesas dev
```

Abrí http://localhost:3000 (o http://127.0.0.1:3000). Deberías ver la app igual que antes.

## Paso 6 — Crear repo en GitHub y subir

```bash
cd ~/Documents/simply-platform
git init
git add .
git commit -m "feat: initial monorepo with apps/remesas + packages/ui + packages/contracts"

gh repo create gabrielgmza/simply-platform --private --source=. --push
```

## Paso 7 — Migrar el deploy de Vercel

Vas a Vercel → proyecto `simply-remesas` → **Settings**:

1. **General → Root Directory**: cambiar a `apps/remesas`
2. **Build & Development Settings**:
   - Framework Preset: **Next.js**
   - Build Command: `cd ../.. && pnpm --filter remesas build`
   - Install Command: `cd ../.. && pnpm install --frozen-lockfile`
   - Output Directory: `.next` (default)
3. **Settings → Git**: cambiar **Production Branch** a `main` (si no está)
4. **Git** → **Connected Git Repository**: cambiar de `gabrielgmza/simply-remesas` a `gabrielgmza/simply-platform`

Después un redeploy manual (Deployments → Redeploy).

## Paso 8 — Si todo funciona, archivar el repo viejo

```bash
gh repo edit gabrielgmza/simply-remesas --description "ARCHIVED - migrated to simply-platform"
gh repo archive gabrielgmza/simply-remesas
```

## En caso de problemas

- Si `pnpm install` falla: probá `rm -rf node_modules && pnpm install --force`
- Si build falla por imports: verificá que `next.config.mjs` tenga `transpilePackages: ["@simply/ui", "@simply/contracts"]`
- Si Tailwind no aplica estilos: verificá que `tailwind.config.ts` incluya `"../../packages/ui/src/**/*.{ts,tsx}"` en `content`
- Si Vercel falla: revisá Build Logs y compará con el comando local que funciona
