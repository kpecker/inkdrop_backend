import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { validateEnv } from '../types/env';

const env = validateEnv();

// Create postgres connection
const client = postgres(env.DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
});

// Create drizzle instance
export const db = drizzle(client, { 
  schema,
  logger: env.NODE_ENV === 'development',
});

export type Database = typeof db;

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function closeDatabaseConnection(): Promise<void> {
  await client.end();
}