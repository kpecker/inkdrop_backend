import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import process = require('process');

async function main() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set');
    }
    const client = postgres(process.env.DATABASE_URL);
    const db = drizzle({ client });
}


