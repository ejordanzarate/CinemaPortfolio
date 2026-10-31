// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import optimizeMedia from './src/integrations/optimize-media';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages sirve el sitio bajo /CinemaPortfolio/; con dominio propio queda en "/".
  // URLs absolutas de canonical, Open Graph y sitemap; con dominio propio se pasa SITE_URL.
  site: process.env.SITE_URL ?? 'https://ejordanzarate.github.io',
  base: process.env.BASE_PATH ?? '/',
  // Español en "/" y inglés en "/en/".
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: false },
  },
  // Comprime fotos y videos subidos desde el panel al publicar.
  integrations: [
    optimizeMedia(),
    sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } }, filter: (page) => !page.includes('/admin') }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});