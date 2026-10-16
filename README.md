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
5. Proyectos: cuando exista el listado, un dato por proyecto (slug, título, ubicación, tipología, imágenes) y una ruta `src/app/proyectos/[slug]`. Con Cache Components, define `generateStaticParams`.

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
