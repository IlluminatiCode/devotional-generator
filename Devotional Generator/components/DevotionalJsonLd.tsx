'use client';

import type { DevotionalArticle } from '@/lib/seo/schema';
import { generateArticleSchema } from '@/lib/seo/schema';

interface DevotionalJsonLdProps {
  devotional: DevotionalArticle;
}

/**
 * Client component to inject Article schema JSON-LD for generated devotionals
 * Use this component when displaying a generated devotional to add rich snippets
 */
export function DevotionalJsonLd({ devotional }: DevotionalJsonLdProps) {
  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] || 'https://devotional-generator.vercel.app';
  const schema = generateArticleSchema(devotional, siteUrl);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Example usage:
 *
 * import { DevotionalJsonLd } from '@/components/DevotionalJsonLd';
 *
 * function DevotionalDisplay({ devotionalData }) {
 *   return (
 *     <>
 *       <DevotionalJsonLd
 *         devotional={{
 *           title: devotionalData.title,
 *           description: devotionalData.content,
 *           bibleVerse: devotionalData.verse,
 *           verseReference: devotionalData.reference,
 *           theme: devotionalData.theme,
 *           datePublished: new Date().toISOString()
 *         }}
 *       />
 *       <div>{devotionalData.content}</div>
 *     </>
 *   );
 * }
 */
