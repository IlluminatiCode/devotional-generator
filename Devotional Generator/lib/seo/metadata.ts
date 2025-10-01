import { Metadata } from 'next';

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] || 'https://devotional-generator.vercel.app';

/**
 * Generate page-specific metadata with SEO optimization
 */
export function generateMetadata({
  title,
  description,
  keywords = [],
  ogImage = '/og-image.png',
  noIndex = false,
  canonicalUrl,
}: {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
}): Metadata {
  const defaultKeywords = [
    'devotional generator',
    'daily devotional',
    'Bible devotional',
    'Christian devotional',
  ];

  const fullTitle = `${title} | Devotional Generator`;
  const canonical = canonicalUrl || siteUrl;

  return {
    title: fullTitle,
    description,
    keywords: [...defaultKeywords, ...keywords],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: canonical,
      siteName: 'Devotional Generator',
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    alternates: {
      canonical,
    },
  };
}

/**
 * Common SEO keywords for devotional content
 */
export const devotionalKeywords = [
  'devotional generator',
  'daily devotional',
  'Bible devotional',
  'Christian devotional',
  'morning devotional',
  'faith devotional',
  'prayer devotional',
  'Scripture meditation',
  'spiritual growth',
  'Bible study',
  'Christian meditation',
  'devotional maker',
  'personalized devotional',
  'Bible verse generator',
  'faith builder',
];

/**
 * Theme-specific keywords
 */
export const themeKeywords = {
  hope: ['hope devotional', 'Bible verses about hope', 'Christian hope'],
  faith: ['faith devotional', 'faith building', 'strengthen faith'],
  love: ['love devotional', 'God\'s love', 'Christian love'],
  peace: ['peace devotional', 'inner peace', 'peace of God'],
  strength: ['strength devotional', 'spiritual strength', 'God\'s strength'],
  forgiveness: ['forgiveness devotional', 'God\'s forgiveness', 'forgiving others'],
  gratitude: ['gratitude devotional', 'thankfulness', 'Christian gratitude'],
  courage: ['courage devotional', 'spiritual courage', 'faith courage'],
  joy: ['joy devotional', 'Christian joy', 'joy in Christ'],
  wisdom: ['wisdom devotional', 'Biblical wisdom', 'God\'s wisdom'],
};
