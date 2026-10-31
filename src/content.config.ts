import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { designTypes } from './data/site';

// Cada foto lleva su texto alternativo opcional; si falta, se genera con el título.
const media = z.object({
  src: z.string(),
  alt: z.string().optional(),
  alt_en: z.string().optional(),
});

// Los archivos de estas carpetas los crea y edita Sveltia CMS desde /admin.
// Los campos `*_en` son la traducción opcional; si están vacíos se usa el español.
// Cada entrada es un grupo (evento, look, proyecto); el panel elige si se muestran
// por grupos o todo junto (src/data/grouping.json).

/** Carpeta de una colección: en `astro dev` los ejemplos locales de src/placeholder (fuera del repo), para ver el diseño sin contenido real. */
const folder = (name: string) => `./src/${import.meta.env.DEV ? 'placeholder' : 'content'}/${name}`;

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: folder('events') }),
  schema: z.object({
    title: z.string(),
    title_en: z.string().optional(),
    date: z.coerce.date(),
    photos: z.array(media).default([]),
  }),
});

const work = z.object({
  title: z.string(),
  title_en: z.string().optional(),
  position: z.string(),
  youtube: z.string().optional(),
  image: z.string().optional(),
  image_alt: z.string().optional(),
  image_alt_en: z.string().optional(),
});

const videos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: folder('videos') }),
  schema: z.object({
    title: z.string(),
    title_en: z.string().optional(),
    order: z.number().default(0),
    works: z.array(work).default([]),
  }),
});

const makeup = defineCollection({
  loader: glob({ pattern: '**/*.md', base: folder('makeup') }),
  schema: z.object({
    title: z.string(),
    title_en: z.string().optional(),
    photos: z.array(media).default([]),
    order: z.number().default(0),
  }),
});

const piece = z.object({
  title: z.string(),
  title_en: z.string().optional(),
  type: z.enum(designTypes),
  images: z.array(media).default([]),
  video: z.string().optional(),
  youtube: z.string().optional(),
});

const design = defineCollection({
  loader: glob({ pattern: '**/*.md', base: folder('design') }),
  schema: z.object({
    title: z.string(),
    title_en: z.string().optional(),
    order: z.number().default(0),
    pieces: z.array(piece).default([]),
  }),
});

export const collections = { events, videos, makeup, design };
