// SEO utilities barrel export
export * from './schema';
export * from './metadata';

/**
 * SEO best practices for Devotional Generator
 *
 * 1. Title Length: 50-60 characters (optimal for Google)
 * 2. Description Length: 150-160 characters
 * 3. Keywords: Focus on user intent, not keyword stuffing
 * 4. H1: One per page, include primary keyword
 * 5. Alt Text: Descriptive for all images
 * 6. Internal Links: Link related devotional themes
 * 7. Page Speed: < 3s load time (use Next.js Image optimization)
 * 8. Mobile-First: Responsive design is critical
 * 9. Structured Data: Always include JSON-LD for content
 * 10. Fresh Content: Update devotionals regularly
 *
 * Target Keywords by Priority:
 * - Tier 1: devotional generator, daily devotional, Bible devotional
 * - Tier 2: Christian devotional, personalized devotional
 * - Tier 3: morning devotional, faith devotional, spiritual growth
 *
 * Content Strategy:
 * - Create devotional library pages for each theme
 * - Add blog with devotional tips and Bible study guides
 * - Include FAQ page with common questions
 * - Build topical landing pages (e.g., /devotional/hope)
 */

export const SEO_CONFIG = {
  siteName: 'Devotional Generator',
  defaultTitle: 'Daily Devotional Generator | Free Christian Bible Devotional Creator',
  titleTemplate: '%s | Devotional Generator',
  description:
    'Create personalized daily devotionals with Bible verses. Free Christian devotional generator for morning prayers, faith building, and spiritual growth.',
  siteUrl: process.env['NEXT_PUBLIC_SITE_URL'] || 'https://devotional-generator.vercel.app',
  twitterHandle: '@devotionalgen',
  locale: 'en_US',
  themeColor: '#4F46E5',
} as const;
