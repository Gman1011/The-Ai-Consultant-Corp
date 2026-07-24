import type { MetadataRoute } from 'next';
import { PRODUCTS } from '@/data/products';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/shop', '/about', '/faq', '/contact', '/shipping', '/returns', '/privacy', '/terms'].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
    })
  );

  const productPages = PRODUCTS.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
