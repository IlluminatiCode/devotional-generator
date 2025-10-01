// Schema.org structured data generators for rich snippets

export interface DevotionalArticle {
  title: string;
  description: string;
  bibleVerse?: string;
  verseReference?: string;
  theme?: string;
  datePublished?: string;
}

/**
 * Generate Article schema for individual devotionals
 * Use this when a user generates a devotional
 */
export function generateArticleSchema(article: DevotionalArticle, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    articleBody: article.description,
    datePublished: article.datePublished || new Date().toISOString(),
    dateModified: article.datePublished || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Devotional Generator',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Devotional Generator',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': siteUrl,
    },
    about: {
      '@type': 'Thing',
      name: article.theme || 'Christian Devotional',
    },
    keywords: 'devotional, Bible, Christian, faith, spiritual growth',
  };
}

/**
 * Generate FAQPage schema for devotional topics
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate HowTo schema for devotional creation guide
 */
export function generateHowToSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Create a Personalized Daily Devotional',
    description: 'Step-by-step guide to generate meaningful Christian devotionals with Bible verses',
    image: `${siteUrl}/og-image.png`,
    totalTime: 'PT2M',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Select Your Theme',
        text: 'Choose a spiritual theme or topic that resonates with your current journey (e.g., hope, faith, peace, strength).',
        url: `${siteUrl}#step1`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Choose Bible Translation',
        text: 'Select your preferred Bible translation (NIV, KJV, ESV, etc.) for the Scripture references.',
        url: `${siteUrl}#step2`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Generate Devotional',
        text: 'Click the generate button to create a personalized devotional with a relevant Bible verse and reflection.',
        url: `${siteUrl}#step3`,
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Read and Reflect',
        text: 'Read your personalized devotional, meditate on the Scripture, and apply the insights to your spiritual journey.',
        url: `${siteUrl}#step4`,
      },
    ],
  };
}

/**
 * Generate Organization schema for brand entity
 */
export function generateOrganizationSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Devotional Generator',
    alternateName: 'Daily Devotional Creator',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      'Free online devotional generator creating personalized Christian devotionals with Bible verses for daily spiritual growth.',
    sameAs: [
      'https://twitter.com/devotionalgen',
      'https://facebook.com/devotionalgen',
      'https://instagram.com/devotionalgen',
    ],
  };
}
