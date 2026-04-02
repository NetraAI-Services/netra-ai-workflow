import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'src', 'db', 'tokens.db');

// Ensure directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

/**
 * Initialize SQLite database with OAuth tokens schema
 */
export function initializeDatabase(): Database.Database {
  const db = new Database(DB_PATH);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create oauth_tokens table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS oauth_tokens (
      id TEXT PRIMARY KEY,
      platformId TEXT NOT NULL,
      userId TEXT NOT NULL,
      accessToken TEXT NOT NULL,
      refreshToken TEXT,
      tokenExpiry INTEGER NOT NULL,
      scope TEXT,
      handle TEXT,
      accountId TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      UNIQUE(platformId, userId)
    )
  `);

  // Create index for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_oauth_tokens_platformId_userId
    ON oauth_tokens(platformId, userId)
  `);

  // Create oauth_state table for CSRF protection
  db.exec(`
    CREATE TABLE IF NOT EXISTS oauth_state (
      state TEXT PRIMARY KEY,
      platformId TEXT NOT NULL,
      userId TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      expiresAt INTEGER NOT NULL
    )
  `);

  // Create index for state cleanup
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_oauth_state_expiresAt
    ON oauth_state(expiresAt)
  `);

  return db;
}

/**
 * Clean up expired OAuth state tokens (call periodically)
 */
export function cleanupExpiredStates(db: Database.Database): void {
  const deleteStmt = db.prepare('DELETE FROM oauth_state WHERE expiresAt < ?');
  deleteStmt.run(Date.now());
}
