# Ico Alum (icoalum.net)

Sitio de Ico Alum: cancelería de aluminio, PVC, cristal templado y fachadas, Zapopan, Jalisco, desde 1979.

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · Tailwind v4 · TypeScript · Motion (`motion/react`) · Phosphor (peso light) · `next/font` (Archivo, Geist, Geist Mono).

> Next 16 cambia APIs: antes de tocar metadata, redirects, params, fuentes o caché, lee la guía en `node_modules/next/dist/docs/`.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # compila y prerenderiza
npx tsc --noEmit
```

## Estructura

```
src/app/            rutas, layout global, robots.ts, sitemap.ts
src/components/     Header, Footer, WhatsAppFloat, CookieBanner, Analytics, Logo, TrackLink
src/components/ui/  Button, Eyebrow, Container, Section, Frame, Placeholder, PaneReveal, Reveal
src/lib/site.ts     única fuente de datos de la empresa (teléfono, correos, dirección, WhatsApp)
src/lib/routes.ts   rutas de la arquitectura: sitemap, menú, rutas con hero
src/lib/seo.ts      buildMetadata({ title, description, path })
src/lib/analytics.ts track(evento, datos) y consentimiento
```

Tokens y escala tipográfica: `src/app/globals.css`. Spec visual: `Proyectos/icoalum/diseno/2026-10-16-direccion-visual/` en el vault de Company OS.

## Reglas de diseño

Esquinas rectas; ámbar solo como relleno de botón con texto tinta; Phosphor light; sin serif; solo `transform` y `opacity` en animación; sin guiones largos (em/en dash) en ningún texto; el CTA de cotizar siempre se llama "Cotizar proyecto".

## Cómo agregar una página o un proyecto

1. Crea `src/app/<ruta>/page.tsx` y exporta `metadata = buildMetadata({ title, description, path })`.
2. Agrega la ruta a `src/lib/routes.ts` (entra al sitemap solo).
3. Si el primer bloque es un hero oscuro a sangre: ponle `data-hero` al elemento y agrega la ruta a `heroRoutes`. Sin eso, el header nace sólido y `main` deja 72px de aire arriba.
4. Imágenes: `<Frame src alt ratio />`; si aún no hay foto, `<Frame pendiente="descripción" />` muestra el Placeholder `[PENDIENTE CLIENTE]`.
5. Proyectos: ver la sección siguiente.

## Cómo agregar un proyecto nuevo

1. Edita `src/data/projects.ts` y agrega (o reemplaza un marcador de) un objeto al arreglo `projects`. La ficha `/proyectos/<slug>`, el listado, los filtros, el anterior/siguiente y el sitemap salen solos.
2. Campos de `Project`:
   - `slug`: en minúsculas y con guiones; es la URL (`/proyectos/<slug>`).
   - `nombre`, `ubicacion`, `descripcion`: texto de la ficha.
   - `tipo`: `"Residencial"`, `"Comercial"` o `"Edificación vertical"` (define el filtro de `/proyectos`).
   - `anio`: número, o `null` si aún no se confirma (la ficha muestra `[PENDIENTE CLIENTE]`).
   - `sistemas`: lista de marcas o sistemas usados (por ejemplo `["Cuprum Eurovent", "Teufelbeschlag"]`); vacío muestra `[PENDIENTE CLIENTE]`.
   - `galeria`: lista de `{ src, alt, pendiente, ratio }`. La primera es la portada. Sin `src` se muestra el Placeholder con el texto de `pendiente`.
   - `ratioPortada`: `"4/5"`, `"16/9"` o `"1/1"` (portada del home).
   - `pendiente`: `false` cuando los datos son reales. Con `true` la ficha lleva `noindex` y no entra al sitemap.
3. Fotos en `public/proyectos/<slug>/` y se referencian como `src: "/proyectos/<slug>/portada.jpg"`. Usa `.jpg` o `.webp` optimizados; `next/image` genera los tamaños.
4. `npm run build` y revisa `/proyectos/<slug>`.

Los servicios viven igual en `src/data/services.ts` (un objeto por línea y una ruta `/servicios/<slug>` por cada uno).

## Variables de entorno

Ninguna es obligatoria para compilar.

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL base (default `https://icoalum.net`) |
| `NEXT_PUBLIC_WHATSAPP` | Número con lada de país, solo dígitos. Vacío = no hay botón flotante |
| `NEXT_PUBLIC_GA_ID` | Medición GA4; solo carga tras aceptar cookies |
| `RESEND_API_KEY` | Correo del formulario de cotización (servidor) |
| `SUPABASE_URL` | Base de datos (servidor) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio de Supabase (solo servidor, nunca `NEXT_PUBLIC_`) |

## Backend de leads

Los formularios (contacto rápido del home, `/contacto` y `/cotizar`) llaman a Server Actions (`src/app/actions/lead.ts`, `contact.ts`, `quote.ts`) que pasan por `src/lib/leads/submit.ts`: guarda en Supabase y envía correo con Resend, en paralelo. Basta con que uno funcione para dar éxito.

**Modo degradado (sin variables):** el sitio compila y los formularios responden éxito, pero no se envía ni se guarda nada; solo se registra en la consola del servidor el tipo y un folio (sin datos personales). Los planos de `/cotizar` se ignoran. Si hay algo configurado y todo lo configurado falla, la acción lanza un error genérico y el formulario muestra "inténtalo de nuevo".

**Activarlo** (en `.env.local` y en las variables del proyecto en Vercel; plantilla en `.env.example`):

1. Resend: crea la API key y ponla en `RESEND_API_KEY`. Destino por defecto `presupuestos2@icoalum.net` (cambia con `LEADS_TO_EMAIL`, admite varios separados por coma). Remitente por defecto `Ico Alum <onboarding@resend.dev>` (solo envía a la cuenta dueña de Resend); verifica el dominio y define `LEADS_FROM_EMAIL`.
2. Supabase: crea el proyecto, pon `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (solo servidor, nunca `NEXT_PUBLIC_`).
3. Aplica la migración `supabase/migrations/0001_leads.sql` (tabla `leads` con RLS sin políticas públicas y bucket privado `planos`):
   ```bash
   npx supabase login
   npx supabase link --project-ref <ref-del-proyecto>
   npx supabase db push
   ```
4. Cada correo lleva `reply_to` = correo del cliente. Los planos se suben al bucket `planos` y el correo incluye enlaces firmados de 7 días.

**Anti-abuso:** campo trampa oculto `website` (y `empresa_web` en los formularios actuales) que debe llegar vacío; límites de largo por campo; máx. 5 envíos por IP cada 10 minutos. Ese límite vive en memoria, así que en serverless (Vercel) es de mejor esfuerzo (cada instancia lleva su cuenta); para uno estricto usa el firewall de Vercel o un KV.

**Planos:** hasta 3 archivos (PDF, DWG, DXF, PNG, JPG o WEBP), 10 MB c/u, validados en servidor por extensión, MIME y tamaño. `next.config.ts` sube `serverActions.bodySizeLimit` a 32 MB.

**Tests:** `npm test` (usa `node --test`, sin dependencias extra).
