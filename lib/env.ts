import { z } from 'zod';

/**
 * Environment variable schema with validation rules
 * Using Zod for runtime type checking and validation
 */
const envSchema = z.object({
  GEMINI_API_KEY: z
    .string()
    .min(1, 'GEMINI_API_KEY is required')
    .startsWith('AIza', 'GEMINI_API_KEY must be a valid Google API key'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default('http://localhost:3000'),
});

/**
 * Parsed and validated environment variables
 * @throws {Error} If environment variables are invalid
 */
export const env = envSchema.parse({
  GEMINI_API_KEY: process.env['GEMINI_API_KEY'],
  NODE_ENV: process.env['NODE_ENV'],
  NEXT_PUBLIC_APP_URL: process.env['NEXT_PUBLIC_APP_URL'],
});

/**
 * Type-safe environment variable access
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables at build time
 * This function should be called during application initialization
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse({
      GEMINI_API_KEY: process.env['GEMINI_API_KEY'],
      NODE_ENV: process.env['NODE_ENV'],
      NEXT_PUBLIC_APP_URL: process.env['NEXT_PUBLIC_APP_URL'],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
      throw new Error(`Environment validation failed:\n${issues.join('\n')}`);
    }
    throw error;
  }
}
