import aboutData from './about.json';
import collageData from './collage.json';

// Ejemplos locales (src/placeholder, fuera del repo); con glob, si la carpeta no existe queda vacío y el build no falla.
const demo = import.meta.glob<{ default: unknown }>('../placeholder/*.json', { eager: true });
const aboutDemo = demo['../placeholder/about.json']?.default as typeof aboutData | undefined;
const collageDemo = demo['../placeholder/collage.json']?.default as typeof collage | undefined;

// En `astro dev` se ven los ejemplos si existen; el sitio publicado usa solo lo del panel.
export const about = (import.meta.env.DEV && aboutDemo) || aboutData;
export const collage: { clips: { video: string; poster?: string }[] } = (import.meta.env.DEV && collageDemo) || collageData;
