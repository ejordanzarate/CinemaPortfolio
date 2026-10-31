import type { APIRoute } from 'astro';

/** robots.txt con la URL absoluta del sitemap, que cambia según `site` y la base. */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(`${import.meta.env.BASE_URL.replace(/\/$/, '')}/sitemap-index.xml`, site);
  return new Response(`User-agent: *\nAllow: /\nDisallow: ${import.meta.env.BASE_URL.replace(/\/$/, '')}/admin/\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
