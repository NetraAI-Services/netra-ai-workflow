import Database from 'better-sqlite3';
import { initializeDatabase } from '@/db/init';

let db: Database.Database | null = null;

/**
 * Get or initialize the database connection (singleton pattern)
 */
export function getDatabase(): Database.Database {
  if (!db) {
    db = initializeDatabase();
  }
  return db;
}

/**
 * Close database connection (for cleanup)
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
