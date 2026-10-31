/**
 * Antepone la ruta base del sitio a rutas locales ("/uploads/x.jpg").
 * Necesario en GitHub Pages, donde el sitio vive bajo /CinemaPortfolio/;
 * las URLs externas se devuelven tal cual.
 */
export function asset(path: string): string {
  if (!path.startsWith('/')) return path;
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path;
}

// La integración optimize-media deja junto a cada video subido su primer fotograma con este sufijo.
export const POSTER_SUFFIX = '.poster.webp';

/**
 * Póster automático de un video subido, o `undefined` si no hay uno:
 * solo existe en el build publicado y no para videos externos.
 */
export function posterFor(video: string): string | undefined {
  if (!import.meta.env.PROD || !video.startsWith('/uploads/')) return undefined;
  return asset(video + POSTER_SUFFIX);
}
