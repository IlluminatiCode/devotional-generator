# Security Implementation Guide
## Quick Start for Developers

This guide provides practical examples for implementing security features in the Devotional Generator application.

---

## Table of Contents

1. [Express.js Implementation](#expressjs-implementation)
2. [Next.js Implementation](#nextjs-implementation)
3. [API Routes Security](#api-routes-security)
4. [Common Use Cases](#common-use-cases)
5. [Testing Security Features](#testing-security-features)

---

## Express.js Implementation

### Basic Setup

```typescript
import express from 'express';
import {
  applySecurityMiddleware,
  initializeSecurity,
  validateDevotionalInput,
  secureRoute
} from './lib/security';

const app = express();

// Step 1: Initialize security (validates environment)
initializeSecurity();

// Step 2: Apply comprehensive security middleware
applySecurityMiddleware(app, {
  enableRateLimit: true,
  enableCSRF: true,
  enableXSS: true,
  enableCORS: true,
  enableHelmet: true,
  corsOrigins: [
    'http://localhost:3000',
    'https://devotional-generator.vercel.app'
  ]
});

// Step 3: Define secure routes
app.post('/api/generate',
  validateDevotionalInput,
  secureRoute(async (req, res) => {
    const { theme, tone, style, length } = req.body;

    // Your business logic here
    const result = await generateDevotional({ theme, tone, style, length });

    res.json({ success: true, data: result });
  })
);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Custom Rate Limiting

```typescript
import { createRateLimiter } from './lib/security';

// Create custom rate limiter for specific endpoint
const customLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: 'Too many requests for this resource',
  keyGenerator: (req) => {
    // Custom key generation (e.g., by user ID)
    return req.headers['x-user-id'] as string;
  }
});

app.post('/api/premium-feature',
  customLimiter.middleware(),
  handler
);
```

### Input Validation

```typescript
import { validateInput, Validator, ValidationSchema } from './lib/security';

// Define validation schema
const customSchema: ValidationSchema = {
  email: {
    type: 'email',
    required: true,
    sanitize: true
  },
  age: {
    type: 'number',
    required: true,
    min: 18,
    max: 120
  },
  username: {
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    sanitize: true
  },
  website: {
    type: 'url',
    required: false
  }
};

// Use in route
app.post('/api/register',
  validateInput(customSchema),
  async (req, res) => {
    // req.body now contains only validated data
    const { email, age, username, website } = req.body;
    // Process...
  }
);
```

### CSRF Protection

```typescript
import { csrfProtection } from './lib/security';

// Apply CSRF protection
app.use(csrfProtection({
  cookieName: '_csrf',
  headerName: 'X-CSRF-Token',
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production'
}));

// GET endpoint - generate token
app.get('/api/form', (req, res) => {
  res.json({
    csrfToken: res.locals.csrfToken // Token automatically generated
  });
});

// POST endpoint - verify token
app.post('/api/submit', (req, res) => {
  // CSRF token automatically verified before this handler runs
  res.json({ success: true });
});
```

### API Key Protection

```typescript
import { apiKeyAuth, SecureEnvironment } from './lib/security';

// Protected route requiring API key
app.get('/api/admin/stats',
  apiKeyAuth({ required: true }),
  async (req, res) => {
    // Only accessible with valid API key
    const stats = await getStats();
    res.json(stats);
  }
);

// Access secure environment variables
const env = SecureEnvironment.getInstance();
const geminiApiKey = env.get('GEMINI_API_KEY');
```

---

## Next.js Implementation

### Middleware Configuration

The middleware is already configured in `middleware.ts`. It automatically applies:
- Rate limiting
- Security headers
- CORS
- Request validation
- Content-Type checking

### API Route Example

```typescript
// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Validator, Sanitizer, ValidationSchema } from '@/lib/security';

const schema: ValidationSchema = {
  theme: {
    type: 'string',
    required: true,
    enum: ['Patience', 'Forgiveness', 'Leadership', 'Hope', 'Love', 'Faith'],
    sanitize: true
  },
  tone: {
    type: 'string',
    required: true,
    enum: ['Encouraging', 'Reflective', 'Motivating'],
    sanitize: true
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validated = Validator.validate(body, schema);

    // Sanitize (additional layer)
    const sanitized = {
      theme: Sanitizer.xss(validated.theme),
      tone: Sanitizer.xss(validated.tone)
    };

    // Process request
    const result = await generateDevotional(sanitized);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    if (Array.isArray(error)) {
      // Validation errors
      return NextResponse.json({
        error: 'Validation failed',
        details: error.map(e => ({
          field: e.field,
          message: e.message
        }))
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}
```

### Server Component with CSRF

```typescript
// app/components/DevotionalForm.tsx
'use client';

import { useState, useEffect } from 'react';

export default function DevotionalForm() {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Fetch CSRF token
    fetch('/api/csrf-token')
      .then(res => res.json())
      .then(data => setCsrfToken(data.csrfToken));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ /* form data */ })
    });

    const result = await response.json();
    // Handle result...
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Environment Variables

```typescript
// lib/config.ts
import { SecureEnvironment } from './security';

const env = SecureEnvironment.getInstance();

export const config = {
  geminiApiKey: env.get('GEMINI_API_KEY'),
  nodeEnv: env.get('NODE_ENV', 'development'),
  // Public variables (safe to expose to client)
  publicApiUrl: process.env.NEXT_PUBLIC_API_URL
};

// Never expose sensitive keys
export function getPublicConfig() {
  return {
    apiUrl: config.publicApiUrl
    // Do not include geminiApiKey or other sensitive data
  };
}
```

---

## API Routes Security

### 1. Protected API Route

```typescript
import { apiKeyAuth, validateInput } from './lib/security';

app.post('/api/protected',
  apiKeyAuth({ required: true }),
  validateInput(schema),
  async (req, res) => {
    // Only accessible with valid API key and valid input
    res.json({ success: true });
  }
);
```

### 2. Rate-Limited Endpoint

```typescript
import { generationLimiter } from './lib/security';

app.post('/api/generate',
  generationLimiter.middleware(), // 20 requests per hour
  validateDevotionalInput,
  async (req, res) => {
    // Generate devotional
  }
);
```

### 3. CORS-Protected Endpoint

```typescript
import { corsMiddleware } from './lib/security';

app.use('/api/public', corsMiddleware({
  origin: ['https://trusted-domain.com'],
  credentials: true,
  methods: ['GET', 'POST']
}));
```

---

## Common Use Cases

### Use Case 1: Sanitize User-Generated Content

```typescript
import { Sanitizer } from './lib/security';

function processUserContent(content: string) {
  // Remove XSS
  const xssSafe = Sanitizer.xss(content);

  // Remove SQL injection patterns
  const sqlSafe = Sanitizer.sql(xssSafe);

  // Remove NoSQL injection patterns
  const noSqlSafe = Sanitizer.noSql(sqlSafe);

  return noSqlSafe;
}

// Usage
const userInput = req.body.comment;
const safeContent = processUserContent(userInput);
```

### Use Case 2: Validate Email and URL

```typescript
import { Sanitizer, Validator } from './lib/security';

function validateUserProfile(data: any) {
  const schema = {
    email: { type: 'email', required: true },
    website: { type: 'url', required: false },
    bio: { type: 'string', maxLength: 500, sanitize: true }
  };

  return Validator.validate(data, schema);
}

// Usage
try {
  const profile = validateUserProfile(req.body);
  // Save to database
} catch (errors) {
  res.status(400).json({ errors });
}
```

### Use Case 3: Generate and Verify CSRF Tokens

```typescript
import { CSRFTokenManager } from './lib/security';

const csrfManager = new CSRFTokenManager({
  secret: process.env.CSRF_SECRET,
  maxAge: 86400000 // 24 hours
});

// Generate token for form
app.get('/form', (req, res) => {
  const token = csrfManager.generateToken(req.sessionID);
  res.render('form', { csrfToken: token });
});

// Verify token on submission
app.post('/submit', (req, res) => {
  const token = req.body._csrf;

  if (!csrfManager.verifyToken(token, req.sessionID)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  // Process form
});
```

### Use Case 4: Rotate API Keys

```typescript
import { APIKeyManager } from './lib/security';

const keyManager = APIKeyManager.getInstance();

// Generate new key
const newKey = keyManager.generateKey();
console.log('New API key:', newKey);

// Rotate existing key (24-hour grace period)
const rotatedKey = keyManager.rotateKey(oldKey, 24 * 60 * 60 * 1000);
console.log('Rotated key:', rotatedKey);

// Revoke key immediately
keyManager.revokeKey(compromisedKey);
```

### Use Case 5: Secure File Upload

```typescript
import { validateInput, Sanitizer } from './lib/security';
import multer from 'multer';

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

app.post('/api/upload',
  upload.single('image'),
  (req, res) => {
    // Sanitize filename
    const filename = Sanitizer.path(req.file.originalname);

    // Process upload
    res.json({ filename });
  }
);
```

---

## Testing Security Features

### Test Rate Limiting

```typescript
// test/security/rateLimit.test.ts
import request from 'supertest';
import app from '../app';

describe('Rate Limiting', () => {
  it('should enforce rate limits', async () => {
    // Make requests up to the limit
    for (let i = 0; i < 20; i++) {
      await request(app).post('/api/generate').expect(200);
    }

    // Next request should be rate limited
    const response = await request(app)
      .post('/api/generate')
      .expect(429);

    expect(response.body.error).toContain('rate limit');
  });
});
```

### Test Input Validation

```typescript
describe('Input Validation', () => {
  it('should reject invalid input', async () => {
    const response = await request(app)
      .post('/api/generate')
      .send({
        theme: 'Invalid Theme', // Not in enum
        tone: 'Encouraging'
      })
      .expect(400);

    expect(response.body.error).toBe('Validation failed');
  });

  it('should sanitize XSS attempts', async () => {
    const response = await request(app)
      .post('/api/generate')
      .send({
        theme: 'Patience<script>alert("xss")</script>',
        tone: 'Encouraging'
      });

    expect(response.body.data).not.toContain('<script>');
  });
});
```

### Test CSRF Protection

```typescript
describe('CSRF Protection', () => {
  it('should reject requests without CSRF token', async () => {
    await request(app)
      .post('/api/submit')
      .send({ data: 'test' })
      .expect(403);
  });

  it('should accept requests with valid CSRF token', async () => {
    // Get token
    const tokenResponse = await request(app).get('/api/csrf-token');
    const csrfToken = tokenResponse.body.csrfToken;

    // Use token
    await request(app)
      .post('/api/submit')
      .set('X-CSRF-Token', csrfToken)
      .send({ data: 'test' })
      .expect(200);
  });
});
```

### Test API Key Authentication

```typescript
describe('API Key Authentication', () => {
  it('should reject requests without API key', async () => {
    await request(app)
      .get('/api/admin/stats')
      .expect(401);
  });

  it('should accept requests with valid API key', async () => {
    await request(app)
      .get('/api/admin/stats')
      .set('X-API-Key', process.env.API_KEY)
      .expect(200);
  });

  it('should reject invalid API keys', async () => {
    await request(app)
      .get('/api/admin/stats')
      .set('X-API-Key', 'invalid-key')
      .expect(401);
  });
});
```

---

## Best Practices

### 1. Always Validate and Sanitize

```typescript
// BAD - Direct use of user input
const theme = req.body.theme;
const result = await generateDevotional(theme);

// GOOD - Validate and sanitize
const validated = Validator.validate(req.body, schema);
const sanitized = Sanitizer.xss(validated.theme);
const result = await generateDevotional(sanitized);
```

### 2. Use Environment Variables Securely

```typescript
// BAD - Direct access to sensitive variables
const apiKey = process.env.GEMINI_API_KEY;

// GOOD - Use SecureEnvironment
const env = SecureEnvironment.getInstance();
const apiKey = env.get('GEMINI_API_KEY');
```

### 3. Never Expose Sensitive Data

```typescript
// BAD - Exposing sensitive data in error
catch (error) {
  res.json({ error: error.message, apiKey: config.apiKey });
}

// GOOD - Sanitized error response
catch (error) {
  console.error('[ERROR]', error); // Log server-side only
  res.json({ error: 'An error occurred' });
}
```

### 4. Apply Multiple Security Layers

```typescript
// Defense in depth
app.post('/api/critical',
  apiKeyAuth({ required: true }),     // Layer 1: Authentication
  authLimiter.middleware(),            // Layer 2: Rate limiting
  validateInput(schema),               // Layer 3: Input validation
  csrfProtection(),                    // Layer 4: CSRF protection
  async (req, res) => {
    // Business logic
  }
);
```

---

## Troubleshooting

### Rate Limit Issues

**Problem:** Legitimate users being rate limited

**Solution:**
```typescript
// Increase limits or use custom key generator
const limiter = createRateLimiter({
  max: 200, // Increase limit
  keyGenerator: (req) => {
    // Use authenticated user ID instead of IP
    return req.user?.id || req.ip;
  }
});
```

### CSRF Token Errors

**Problem:** Token validation fails on legitimate requests

**Solution:**
```typescript
// Ensure cookies are sent with credentials
fetch('/api/endpoint', {
  credentials: 'include', // Include cookies
  headers: {
    'X-CSRF-Token': token
  }
});
```

### CORS Errors

**Problem:** Blocked by CORS policy

**Solution:**
```typescript
// Add your domain to allowed origins
corsMiddleware({
  origin: [
    'http://localhost:3000',
    'https://your-production-domain.com'
  ],
  credentials: true
})
```

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [API Security Top 10](https://owasp.org/www-project-api-security/)
- [Security Headers Reference](https://securityheaders.com/)
- [Content Security Policy Guide](https://content-security-policy.com/)

---

**Last Updated:** September 30, 2025
**Version:** 1.0.0