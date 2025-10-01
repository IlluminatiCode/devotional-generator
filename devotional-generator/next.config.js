/**
 * Next.js Configuration with Security Headers
 * OWASP Reference: A05:2021 – Security Misconfiguration
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode for better development experience
  reactStrictMode: true,

  // Security headers
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          // Strict Transport Security (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          // XSS Protection (for older browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Control DNS prefetching
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions Policy (Feature Policy)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
          },
          // Cross-Origin headers
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          // Remove X-Powered-By header
          {
            key: 'X-Powered-By',
            value: '' // This removes the header
          },
          // Content Security Policy - Customize based on your needs
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
      {
        // Additional headers for API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          },
          {
            key: 'Surrogate-Control',
            value: 'no-store'
          }
        ],
      },
    ];
  },

  // Environment variable validation
  env: {
    // Never expose sensitive keys to the client
    // Only NEXT_PUBLIC_ prefixed variables are exposed
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable source maps in production for error tracking (optional)
  productionBrowserSourceMaps: false,

  // Compress responses
  compress: true,

  // Configure allowed domains for images
  images: {
    domains: [
      'localhost',
      // Add your allowed image domains here
    ],
    // Content Security Policy for images
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Webpack configuration for additional security
  webpack: (config, { isServer }) => {
    // Add security-related webpack plugins here if needed

    // Disable source maps in production for security
    if (!isServer && process.env.NODE_ENV === 'production') {
      config.devtool = false;
    }

    return config;
  },

  // Experimental security features
  experimental: {
    // Enable strict mode for better security
    strictNextHead: true,
  },

  // Redirects for security
  async redirects() {
    return [
      // Redirect HTTP to HTTPS in production
      ...(process.env.NODE_ENV === 'production'
        ? [
            {
              source: '/:path*',
              has: [
                {
                  type: 'header',
                  key: 'x-forwarded-proto',
                  value: 'http',
                },
              ],
              destination: 'https://:path*',
              permanent: true,
            },
          ]
        : []),
    ];
  },

  // Rewrites for API security
  async rewrites() {
    return {
      beforeFiles: [
        // Hide internal API structure
        {
          source: '/api/v1/:path*',
          destination: '/api/:path*',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

// Content Security Policy configuration
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' ${
    process.env.NODE_ENV === 'production' ? '' : "'unsafe-eval'"
  };
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'none';
  manifest-src 'self';
  media-src 'self';
  worker-src 'self' blob:;
  connect-src 'self' https://api.gemini.com ${
    process.env.NODE_ENV === 'production'
      ? 'https://devotional-generator.vercel.app'
      : 'http://localhost:3000'
  };
  upgrade-insecure-requests;
  block-all-mixed-content;
`;

module.exports = nextConfig;