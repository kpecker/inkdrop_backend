import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './connection';

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    await migrate(db, {
      migrationsFolder: './src/db/migrations',
    });
    
    console.log('✅ Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runMigrations();
}