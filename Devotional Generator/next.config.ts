import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Strict TypeScript Mode */
  typescript: {
    ignoreBuildErrors: false,
  },

  /* ESLint Configuration */
  eslint: {
    ignoreDuringBuilds: false,
  },

  /* Experimental Features */
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ['@/components', '@/lib', '@/types'],
  },

  /* Performance Optimizations */
  poweredByHeader: false,

  /* Compiler Options */
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  /* Image Configuration */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /* Headers for SEO and Security */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
