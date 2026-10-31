import type { AstroIntegration, AstroIntegrationLogger } from 'astro';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';
import { POSTER_SUFFIX } from '../data/asset';

const run = promisify(execFile);

// Cambiar si se tocan los ajustes, para que la caché no sirva resultados viejos.
const VERSION = 'v1';
const MAX_SIDE = 2400;
const MAX_VIDEO_SIDE = 1920;
const IMAGES = new Set(['.jpg', '.jpeg', '.png', '.webp']);
// WebM no admite H.264; se deja como llega.
const VIDEOS = new Set(['.mp4', '.m4v', '.mov']);
const CACHE = '.cache/optimize-media';

/** Lista recursiva de archivos dentro de `dir`; vacía si la carpeta no existe. */
async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])),
  );
  return nested.flat();
}

/** Reduce y recomprime una imagen manteniendo formato y nombre, para no tocar el HTML. */
async function optimizeImage(input: Buffer, ext: string): Promise<Buffer> {
  // rotate() aplica la orientación EXIF antes de que se descarten los metadatos.
  const img = sharp(input).rotate().resize(MAX_SIDE, MAX_SIDE, { fit: 'inside', withoutEnlargement: true });
  if (ext === '.png') return img.png({ compressionLevel: 9, palette: true, quality: 85 }).toBuffer();
  if (ext === '.webp') return img.webp({ quality: 80 }).toBuffer();
  return img.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
}

/** Recodifica un video a H.264 liviano y con faststart para que empiece a reproducirse antes de bajar entero. */
async function optimizeVideo(file: string, out: string) {
  await run(ffmpegPath!, [
    '-y', '-i', file,
    '-vf', `scale='min(${MAX_VIDEO_SIDE},iw)':'min(${MAX_VIDEO_SIDE},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2`,
    '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '128k',
    '-movflags', '+faststart',
    out,
  ]);
}

/** Extrae el primer fotograma de un video como póster WebP. */
async function extractPoster(file: string, out: string) {
  const png = `${out}.png`;
  await run(ffmpegPath!, ['-y', '-i', file, '-frames:v', '1', png]);
  await sharp(png).resize(1280, 1280, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 75 }).toFile(out);
  await rm(png);
}

/**
 * Devuelve el resultado cacheado para `key` o lo genera con `make` y lo guarda.
 * Así un build solo procesa lo que se subió desde el anterior.
 */
async function cached(key: string, make: (out: string) => Promise<void>): Promise<string> {
  const path = join(CACHE, key);
  if (await stat(path).catch(() => null)) return path;
  await mkdir(CACHE, { recursive: true });
  const tmp = join(tmpdir(), `om-${key}`);
  await make(tmp);
  await copyFile(tmp, path);
  await rm(tmp);
  return path;
}

/** Procesa un archivo de `dist/uploads`; lo reemplaza solo si la versión optimizada pesa menos. */
async function processFile(file: string, logger: AstroIntegrationLogger, root: string): Promise<number> {
  const ext = extname(file).toLowerCase();
  const original = await readFile(file);
  const hash = createHash('sha256').update(VERSION).update(original).digest('hex').slice(0, 32);

  if (VIDEOS.has(ext)) {
    const poster = await cached(`${hash}${POSTER_SUFFIX}`, (out) => extractPoster(file, out));
    await copyFile(poster, file + POSTER_SUFFIX);
  }

  const optimized = await cached(`${hash}${ext}`, async (out) => {
    if (IMAGES.has(ext)) await writeFile(out, await optimizeImage(original, ext));
    else await optimizeVideo(file, out);
  });
  const size = (await stat(optimized)).size;
  if (size >= original.length) return 0;
  await copyFile(optimized, file);
  const kb = (n: number) => `${Math.round(n / 1024)} KB`;
  logger.info(`${relative(root, file)}: ${kb(original.length)} → ${kb(size)}`);
  return original.length - size;
}

/**
 * Optimiza fotos y videos subidos desde el panel al terminar el build:
 * los originales del repo no cambian, solo la copia publicada en `dist/uploads`.
 */
export default function optimizeMedia(): AstroIntegration {
  return {
    name: 'optimize-media',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = (await walk(join(root, 'uploads'))).filter((f) => {
          const ext = extname(f).toLowerCase();
          return IMAGES.has(ext) || VIDEOS.has(ext);
        });
        let saved = 0;
        // En serie: los videos ya usan todos los núcleos y así la memoria no se dispara.
        for (const f of files) saved += await processFile(f, logger, root);
        if (files.length) logger.info(`${files.length} archivo(s) revisados, ${Math.round(saved / 1024 / 1024)} MB ahorrados`);
      },
    },
  };
}
