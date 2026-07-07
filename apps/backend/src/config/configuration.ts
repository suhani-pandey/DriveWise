import { z } from 'zod';

/**
 * All external services are optional: the app boots with in-memory adapters
 * and heuristic AI so it runs out of the box. Providing a key/URL switches
 * the corresponding adapter on (see module providers).
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(8000),

  /** When set, the Postgres/Drizzle repository can replace the in-memory one. */
  DATABASE_URL: z.string().url().optional(),

  /** When set, AI answers (recommendations, verdicts) use OpenAI instead of heuristics. */
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),

  /** Danish number-plate lookup (Motorregister data via nrpla.de). */
  NRPLADE_API_TOKEN: z.string().min(1).optional(),
  NRPLADE_BASE_URL: z.string().url().default('https://api.nrpla.de'),

  /** Free VIN decoding — no key required. */
  VPIC_BASE_URL: z.string().url().default('https://vpic.nhtsa.dot.gov/api'),

  CLERK_SECRET_KEY: z.string().optional(),
  CLERK_JWKS_URL: z.string().url().optional(),

  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

export type AppConfig = z.infer<typeof envSchema>;

export const configuration = (): AppConfig => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Environment validation failed');
  }
  return parsed.data;
};
