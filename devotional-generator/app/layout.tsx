import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ToastProvider from '@/components/ToastProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] || 'https://devotional-generator.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Daily Devotional Generator | Free Christian Bible Devotional Creator',
    template: '%s | Devotional Generator',
  },
  description:
    'Create personalized daily devotionals with Bible verses. Free Christian devotional generator for morning prayers, faith building, and spiritual growth. Generate meaningful devotionals instantly.',
  keywords: [
    'devotional generator',
    'daily devotional',
    'Bible devotional',
    'Christian devotional',
    'devotional maker',
    'Bible study tool',
    'Christian prayer',
    'spiritual devotional',
    'morning devotional',
    'faith devotional',
    'personalized devotional',
    'Bible verse devotional',
    'Christian meditation',
    'daily prayer',
    'Scripture devotional',
  ],
  authors: [{ name: 'Devotional Generator' }],
  creator: 'Devotional Generator',
  publisher: 'Devotional Generator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Devotional Generator',
    title: 'Daily Devotional Generator | Free Christian Bible Devotional Creator',
    description:
      'Create personalized daily devotionals with Bible verses. Free Christian devotional generator for spiritual growth and faith building.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Devotional Generator - Create Personalized Christian Devotionals',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Devotional Generator | Free Christian Bible Devotional Creator',
    description:
      'Create personalized daily devotionals with Bible verses. Free Christian devotional generator for spiritual growth.',
    images: ['/twitter-image.png'],
    creator: '@devotionalgen',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'religion',
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Daily Devotional Generator',
    description:
      'Create personalized daily devotionals with Bible verses. Free Christian devotional generator for spiritual growth.',
    url: siteUrl,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Devotional Generator',
      url: siteUrl,
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Christians, believers, spiritual seekers',
    },
    keywords:
      'devotional generator, daily devotional, Bible devotional, Christian devotional, spiritual growth',
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="canonical" href={siteUrl} />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Devotional Gen" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
