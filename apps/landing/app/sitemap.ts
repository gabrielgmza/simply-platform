import type { MetadataRoute } from 'next';
import { ROUTES, SITE_URL } from '@/lib/routes';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return Object.values(ROUTES).map((path) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }));
}
