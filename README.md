# CinemaPortfolio — Edith Jordan

Astro + Tailwind + Sveltia CMS.

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build
```

## Contenido
- Eventos de fotografía: `src/content/events/*.md`
- Filmmaking: `src/content/videos/*.md`
- Correo e Instagram: `src/data/contact.json` (panel → Inicio → Contacto)
- Colores, roles y áreas: `src/data/site.ts` y `src/styles/global.css`

Español en `/` e inglés en `/en/`. Textos fijos en `src/i18n/ui.ts`; el contenido
usa los campos opcionales "en inglés" del panel (`title_en`, `bio_en`) y, si están vacíos, el español.

## Panel `/admin` (Sveltia CMS)
Se edita todo desde `/admin`. Las subidas van a `public/uploads/` y las fotos se convierten a WebP al subirlas.

- Fotos y videos subidos se comprimen solos al publicar (`src/integrations/optimize-media.ts`): fotos a máx. 2400 px,
  videos H.264 máx. 1080p con póster automático. Los originales del repo no cambian; caché en `.cache/`.
- Cada foto tiene "Descripción" (texto alt) opcional en el panel; si falta se usa "<título> — foto N".
- **En la web publicada**: “Sign In Using Access Token” con un token de GitHub *fine-grained* limitado al repo,
  permiso **Contents: Read and write**. Funciona en cualquier navegador, también en el celular.
- **En local**: con `pnpm dev` corriendo, abrir `http://localhost:4321/admin/index.html` en Chrome/Edge/Brave y elegir
  “Work with Local Repository” → carpeta del proyecto. No funciona en Firefox (usa la File System Access API).
- El panel hace commit directo a `backend.branch` de `public/admin/config.yml`; esa rama debe aceptar pushes
  de la cuenta que edita.

## SEO
- Título y descripción por idioma: `seo.title` / `seo.description` en `src/i18n/ui.ts`.
- `Base.astro` agrega canonical, hreflang, Open Graph (`public/og.png`, 1200×630) y datos estructurados `Person`.
- `@astrojs/sitemap` genera `sitemap-index.xml`; `src/pages/robots.txt.ts` lo enlaza. `site` sale de `SITE_URL`.
- Con dominio propio: verificarlo en Google Search Console y enviar el sitemap.

## Publicar en Cloudflare Pages
1. Conectar `ejordanzarate/CinemaPortfolio` en Cloudflare Pages: rama `main`, build `pnpm build`, salida `dist`,
   variables `NODE_VERSION=24`, `PNPM_VERSION=11` y `SITE_URL` (URL `*.pages.dev` o el dominio). Sin `BASE_PATH`.
2. Desplegar el worker [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) y su OAuth App de GitHub
   para entrar con “Sign In with GitHub” en lugar de token.
3. En `public/admin/config.yml` poner `base_url` = URL del worker.

## GitHub Pages
Cada merge a `main` publica el sitio con `.github/workflows/deploy.yml` en
`https://<usuario>.github.io/CinemaPortfolio/`. El panel funciona ahí con login por token.

## Créditos de logos
Logos de herramientas en `src/assets/logos/`: Simple Icons 13.21.0 (CC0), CapCut de Hugeicons (MIT)
y Reaper de FontAudio por @fefanto (CC BY 4.0). Las marcas pertenecen a sus dueños.
