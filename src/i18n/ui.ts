export const languages = { es: 'ES', en: 'EN' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

// Títulos de sección partidos en dos: la segunda parte va en color.
export const ui = {
  es: {
    'nav.inicio': 'Inicio',
    'nav.sobre-mi': 'Sobre mí',
    'nav.filmmaking': 'Filmmaking',
    'nav.maquillaje': 'Maquillaje',
    'nav.fotografia': 'Fotografía',
    'nav.diseno': 'Diseño',
    'nav.contacto': 'Contacto',
    'menu': 'Menú',
    'theme.toggle': 'Cambiar tema',
    'hero.degree': 'Licenciada en Cine',
    'seo.title': 'Edith Jordan | Filmmaking, fotografía y maquillaje',
    'seo.description': 'Portafolio de Edith Jordan, licenciada en Cine: filmmaking (dirección, producción, postproducción y fotografía), fotografía de eventos, maquillaje y diseño gráfico.',
    'about.title': ['Sobre ', 'mí'],
    'film.title': ['Film', 'making'],
    'makeup.title': ['Maqui', 'llaje'],
    'photo.title': ['Foto', 'grafía'],
    'design.title': ['Diseño ', 'gráfico'],
    'contact.title': ['Hable', 'mos'],
    'contact.word': 'Contacto',
    'contact.email': 'Correo',
    'prev': 'Anterior',
    'next': 'Siguiente',
    'play': 'Reproducir',
    'enlarge': 'Ampliar',
    'media.photo': 'foto',
    'sound.on': 'Activar sonido',
    'sound.off': 'Silenciar',
    'design.Carrusel': 'Carruseles',
    'design.Reel': 'Reels',
    'design.Pieza': 'Piezas',
  },
  en: {
    'nav.inicio': 'Home',
    'nav.sobre-mi': 'About me',
    'nav.filmmaking': 'Filmmaking',
    'nav.maquillaje': 'Makeup',
    'nav.fotografia': 'Photography',
    'nav.diseno': 'Design',
    'nav.contacto': 'Contact',
    'menu': 'Menu',
    'theme.toggle': 'Toggle theme',
    'hero.degree': 'Film Graduate',
    'seo.title': 'Edith Jordan | Filmmaking, photography & makeup',
    'seo.description': 'Portfolio of Edith Jordan, film graduate: filmmaking (directing, production, post-production and cinematography), event photography, makeup and graphic design.',
    'about.title': ['About ', 'me'],
    'film.title': ['Film', 'making'],
    'makeup.title': ['Make', 'up'],
    'photo.title': ['Photo', 'graphy'],
    'design.title': ['Graphic ', 'design'],
    'contact.title': ['Let’s ', 'talk'],
    'contact.word': 'Contact',
    'contact.email': 'Email',
    'prev': 'Previous',
    'next': 'Next',
    'play': 'Play',
    'enlarge': 'Enlarge',
    'media.photo': 'photo',
    'sound.on': 'Unmute',
    'sound.off': 'Mute',
    'design.Carrusel': 'Carousels',
    'design.Reel': 'Reels',
    'design.Pieza': 'Pieces',
  },
} as const;

// Los valores guardados en el contenido (roles, áreas) están en español; aquí su traducción.
const terms: Record<string, string> = {
  Dirección: 'Directing',
  Producción: 'Production',
  Postproducción: 'Post-production',
  'Dirección de Fotografía': 'Cinematography',
  Fotografía: 'Photography',
  Maquillaje: 'Makeup',
  'Diseño Gráfico': 'Graphic Design',
};

/** Idioma de la página actual según la ruta (Astro.currentLocale). */
export function getLang(locale: string | undefined): Lang {
  return locale && locale in languages ? (locale as Lang) : defaultLang;
}

/** Devuelve la función de traducción de textos fijos para `lang`. */
export function useT(lang: Lang) {
  return <K extends keyof (typeof ui)['es']>(key: K): (typeof ui)['es'][K] | (typeof ui)['en'][K] => ui[lang][key];
}

/** Traduce un término guardado en español (rol, área); en español lo deja igual. */
export function term(value: string, lang: Lang): string {
  return lang === 'en' ? (terms[value] ?? value) : value;
}

/**
 * Lee un campo traducible del contenido: en inglés usa `<campo>_en` si la
 * dueña lo llenó en el panel y, si no, cae al texto en español.
 */
export function localized<T extends Record<string, unknown>>(data: T, field: keyof T & string, lang: Lang): string {
  const en = data[`${field}_en`];
  return lang === 'en' && typeof en === 'string' && en.trim() ? en : String(data[field] ?? '');
}

/**
 * Texto alternativo de una foto: el que escribió la dueña en el panel
 * (en inglés si existe) o, si no, "<título> — foto N" para no dejarla muda.
 */
export function altFor(item: { alt?: string; alt_en?: string }, title: string, n: number, lang: Lang): string {
  const custom = localized(item, 'alt', lang).trim();
  return custom || `${title} — ${ui[lang]['media.photo']} ${n}`;
}
