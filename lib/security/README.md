# Security Module

Enterprise-grade security implementation for the Devotional Generator application.

## Overview

This security module provides comprehensive protection against common web vulnerabilities and implements security best practices following OWASP Top 10 2021 and API Security Top 10 2023 standards.

## Features

- Rate Limiting (multi-tier)
- Input Validation & Sanitization
- CSRF Protection
- XSS Prevention
- API Key Management
- Environment Variable Security
- Security Headers & CSP
- CORS Configuration
- Request Size Limiting
- Content Type Validation

## Quick Start

### Installation

```bash
npm install
```

### Basic Usage (Express)

```typescript
import express from 'express';
import { applySecurityMiddleware, initializeSecurity } from './lib/security';

const app = express();

// Initialize and apply security
initializeSecurity();
applySecurityMiddleware(app);

app.listen(3000);
```

### Basic Usage (Next.js)

Security middleware is automatically applied via `middleware.ts`. For API routes:

```typescript
import { Validator, Sanitizer } from '@/lib/security';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validated = Validator.validate(body, schema);
  // Process...
}
```

## Modules

### 1. Rate Limiting (`rateLimit.ts`)

Prevents brute force attacks and API abuse.

**Features:**
- IP + User-Agent fingerprinting
- Configurable limits per route
- Automatic cleanup
- Standard headers (RFC 6585)

**Usage:**
```typescript
import { apiLimiter, generationLimiter } from './lib/security';

app.use('/api', apiLimiter.middleware());
app.post('/api/generate', generationLimiter.middleware(), handler);
```

**Default Limits:**
- General API: 100 requests/15 minutes
- Authentication: 5 requests/15 minutes
- Content Generation: 20 requests/hour

### 2. Input Validation (`validation.ts`)

Validates and sanitizes all user inputs.

**Features:**
- Type validation (string, number, email, URL, etc.)
- Length constraints
- Pattern matching
- Enum validation
- XSS sanitization
- SQL/NoSQL injection prevention

**Usage:**
```typescript
import { validateInput } from './lib/security';

app.post('/api/endpoint',
  validateInput({
    email: { type: 'email', required: true },
    age: { type: 'number', min: 18, max: 120 }
  }),
  handler
);
```

### 3. Security Headers (`headers.ts`)

Configures security headers and CORS.

**Features:**
- Content Security Policy (CSP)
- HSTS with preload
- Clickjacking protection
- MIME sniffing prevention
- CORS configuration

**Usage:**
```typescript
import { securityHeaders, corsMiddleware } from './lib/security';

app.use(securityHeaders());
app.use(corsMiddleware({ origin: ['https://trusted-domain.com'] }));
```

### 4. API Protection (`apiProtection.ts`)

Protects API keys and environment variables.

**Features:**
- API key hashing (SHA-256)
- Key rotation with grace period
- Environment variable encryption
- Sensitive data filtering

**Usage:**
```typescript
import { apiKeyAuth, SecureEnvironment } from './lib/security';

app.use('/api/admin', apiKeyAuth({ required: true }));

const env = SecureEnvironment.getInstance();
const apiKey = env.get('GEMINI_API_KEY');
```

### 5. CSRF & XSS Protection (`csrf.ts`)

Prevents cross-site attacks.

**Features:**
- HMAC-based CSRF tokens
- XSS content sanitization
- Content-Type validation
- Clickjacking prevention

**Usage:**
```typescript
import { csrfProtection, xssProtection } from './lib/security';

app.use(csrfProtection());
app.use(xssProtection());
```

### 6. Express Middleware (`express-middleware.ts`)

All-in-one security setup for Express apps.

**Usage:**
```typescript
import { applySecurityMiddleware } from './lib/security';

applySecurityMiddleware(app, {
  enableRateLimit: true,
  enableCSRF: true,
  enableXSS: true,
  enableCORS: true
});
```

## Configuration

### Environment Variables

Required:
```env
NODE_ENV=production
GEMINI_API_KEY=your_api_key_here
```

Optional:
```env
CSRF_SECRET=your_csrf_secret
ENCRYPTION_KEY=your_encryption_key
API_KEYS=key1,key2,key3
```

### CORS Configuration

```typescript
corsMiddleware({
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
})
```

### Rate Limit Configuration

```typescript
createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
  message: 'Too many requests'
})
```

## Security Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Configure secure API keys
- [ ] Enable HTTPS/TLS
- [ ] Set production CORS origins
- [ ] Configure rate limiting with Redis (optional)
- [ ] Enable security logging
- [ ] Run security audit (`npm run security:audit`)
- [ ] Test all security features
- [ ] Review and update dependencies

## Testing

Run security tests:

```bash
npm run security:audit      # NPM security audit
npm run security:check      # Check for outdated packages
npm run security:update     # Update and fix vulnerabilities
```

## OWASP Coverage

This module addresses:

✓ A01:2021 - Broken Access Control
✓ A02:2021 - Cryptographic Failures
✓ A03:2021 - Injection
✓ A04:2021 - Insecure Design
✓ A05:2021 - Security Misconfiguration
✓ A06:2021 - Vulnerable Components
✓ A07:2021 - Authentication Failures
✓ A08:2021 - Software Integrity Failures
✓ A09:2021 - Logging Failures
✓ A10:2021 - SSRF

## API Security Coverage

✓ API1:2023 - Broken Object Level Authorization
✓ API2:2023 - Broken Authentication
✓ API3:2023 - Broken Object Property Level Authorization
✓ API4:2023 - Unrestricted Resource Consumption
✓ API5:2023 - Broken Function Level Authorization
✓ API6:2023 - Unrestricted Access to Sensitive Business Flows
✓ API7:2023 - Server Side Request Forgery
✓ API8:2023 - Security Misconfiguration
✓ API9:2023 - Improper Inventory Management
✓ API10:2023 - Unsafe Consumption of APIs

## Documentation

- [Security Audit Report](../../SECURITY_AUDIT_REPORT.md) - Comprehensive security audit
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md) - Practical examples and use cases
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [API Security Top 10](https://owasp.org/www-project-api-security/)

## Security Issues

To report security vulnerabilities:
- DO NOT create public GitHub issues
- Email: security@your-domain.com
- Include detailed steps to reproduce

## License

ISC

## Support

For questions or issues:
- Review the Implementation Guide
- Check the Security Audit Report
- Contact the development team

---

**Version:** 1.0.0
**Last Updated:** September 30, 2025
**Maintained by:** Development Team