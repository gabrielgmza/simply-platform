import { MetadataRoute } from 'next';
import { REAL_ROUTES, SITE_URL } from '@/lib/routes';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return Object.values(REAL_ROUTES).map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.7,
  }));
}
