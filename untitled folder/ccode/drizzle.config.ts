import { defineConfig } from 'drizzle-kit';
import { validateEnv } from './src/types/env';

const env = validateEnv();

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});