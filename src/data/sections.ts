import { getCollection } from 'astro:content';
import { navLinks } from './site';

/**
 * Enlaces del menú cuyas secciones tienen contenido.
 * Las secciones vacías no se renderizan, así que su ancla no existiría.
 * Las condiciones deben coincidir con las de cada componente de sección.
 */
export async function visibleNavLinks() {
  const [events, videos, makeup, design] = await Promise.all([
    getCollection('events'),
    getCollection('videos'),
    getCollection('makeup'),
    getCollection('design'),
  ]);
  const hidden = new Set<string>();
  if (!events.some((e) => e.data.photos.length > 0)) hidden.add('#fotografia');
  if (!videos.some((p) => p.data.works.length > 0)) hidden.add('#filmmaking');
  if (!makeup.some((l) => l.data.photos.length > 0)) hidden.add('#maquillaje');
  if (!design.some((p) => p.data.pieces.length > 0)) hidden.add('#diseno');
  return navLinks.filter((l) => !hidden.has(l.href));
}
