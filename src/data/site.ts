// Si se cambian, actualizar también las opciones en public/admin/config.yml.
export const filmmakingRoles = ['Dirección', 'Producción', 'Postproducción', 'Dirección de Fotografía'];

// Áreas de trabajo: chips del hero.
export const areas = [...filmmakingRoles, 'Fotografía', 'Maquillaje', 'Diseño Gráfico'];

// Tipos de pieza de Diseño Gráfico; mantener igual a las opciones de public/admin/config.yml.
export const designTypes = ['Carrusel', 'Reel', 'Pieza'] as const;

// `key` apunta al texto traducido en src/i18n/ui.ts.
export const navLinks = [
  { key: 'nav.inicio', href: '#inicio' },
  { key: 'nav.sobre-mi', href: '#sobre-mi' },
  { key: 'nav.filmmaking', href: '#filmmaking' },
  { key: 'nav.maquillaje', href: '#maquillaje' },
  { key: 'nav.fotografia', href: '#fotografia' },
  { key: 'nav.diseno', href: '#diseno' },
  { key: 'nav.contacto', href: '#contacto' },
] as const;

