import { MetadataRoute } from 'next';

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] || 'https://devotional-generator.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  // Base routes
  const routes = ['', '/about', '/contact', '/privacy', '/terms'].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Add devotional categories/themes if you have dynamic routes
  const themes = [
    'hope',
    'faith',
    'love',
    'peace',
    'strength',
    'forgiveness',
    'gratitude',
    'courage',
  ].map((theme) => ({
    url: `${siteUrl}/devotional/${theme}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...themes];
}
