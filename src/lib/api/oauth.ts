import crypto from 'crypto';
import { getDatabase } from '@/lib/db';

/**
 * Encrypt sensitive tokens before storage
 */
export function encryptToken(token: string): string {
  const appSecret = process.env.APP_SECRET || 'dev-secret-key-change-in-production';
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(appSecret, 'salt', 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = cipher.update(token, 'utf8', 'hex') + cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt encrypted tokens from storage
 */
export function decryptToken(encrypted: string): string {
  const appSecret = process.env.APP_SECRET || 'dev-secret-key-change-in-production';
  const [ivHex, ciphertext] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const key = crypto.scryptSync(appSecret, 'salt', 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  return decipher.update(ciphertext, 'hex', 'utf8') + decipher.final('utf8');
}

/**
 * Generate CSRF state parameter and store in database
 */
export function generateState(platformId: string, userId: string): string {
  const state = crypto.randomBytes(32).toString('hex');
  const db = getDatabase();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  const stmt = db.prepare(`
    INSERT INTO oauth_state (state, platformId, userId, timestamp, expiresAt)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(state, platformId, userId, Date.now(), expiresAt);

  return state;
}

/**
 * Validate and retrieve CSRF state parameter
 */
export function validateState(state: string): { platformId: string; userId: string } | null {
  const db = getDatabase();

  const stmt = db.prepare(`
    SELECT platformId, userId, expiresAt
    FROM oauth_state
    WHERE state = ?
  `);
  const result = stmt.get(state) as any;

  if (!result) {
    return null;
  }

  // Check if state has expired
  if (result.expiresAt < Date.now()) {
    db.prepare('DELETE FROM oauth_state WHERE state = ?').run(state);
    return null;
  }

  // Delete state after use (one-time use only)
  db.prepare('DELETE FROM oauth_state WHERE state = ?').run(state);

  return {
    platformId: result.platformId,
    userId: result.userId,
  };
}

/**
 * Store OAuth token in database
 */
export function storeToken(data: {
  platformId: string;
  userId: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry: number;
  scope?: string;
  handle?: string;
  accountId?: string;
}): void {
  const db = getDatabase();
  const { v4: uuid } = require('uuid');

  const stmt = db.prepare(`
    INSERT INTO oauth_tokens (id, platformId, userId, accessToken, refreshToken, tokenExpiry, scope, handle, accountId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(platformId, userId) DO UPDATE SET
      accessToken = excluded.accessToken,
      refreshToken = excluded.refreshToken,
      tokenExpiry = excluded.tokenExpiry,
      scope = excluded.scope,
      handle = excluded.handle,
      accountId = excluded.accountId,
      updatedAt = ?
  `);

  stmt.run(
    uuid(),
    data.platformId,
    data.userId,
    encryptToken(data.accessToken),
    data.refreshToken ? encryptToken(data.refreshToken) : null,
    data.tokenExpiry,
    data.scope,
    data.handle,
    data.accountId,
    Date.now(),
    Date.now()
  );
}

/**
 * Retrieve OAuth token from database
 */
export function getToken(
  platformId: string,
  userId: string
): {
  accessToken: string;
  refreshToken?: string;
  tokenExpiry: number;
  scope?: string;
  handle?: string;
  accountId?: string;
} | null {
  const db = getDatabase();

  const stmt = db.prepare(`
    SELECT accessToken, refreshToken, tokenExpiry, scope, handle, accountId
    FROM oauth_tokens
    WHERE platformId = ? AND userId = ?
  `);
  const result = stmt.get(platformId, userId) as any;

  if (!result) {
    return null;
  }

  return {
    accessToken: decryptToken(result.accessToken),
    refreshToken: result.refreshToken ? decryptToken(result.refreshToken) : undefined,
    tokenExpiry: result.tokenExpiry,
    scope: result.scope,
    handle: result.handle,
    accountId: result.accountId,
  };
}

/**
 * Check if token is expired
 */
export function isTokenExpired(tokenExpiry: number): boolean {
  // Refresh if expiry is within next 5 minutes
  return Date.now() >= tokenExpiry - 5 * 60 * 1000;
}

/**
 * Delete OAuth token from database
 */
export function deleteToken(platformId: string, userId: string): void {
  const db = getDatabase();

  const stmt = db.prepare(`
    DELETE FROM oauth_tokens
    WHERE platformId = ? AND userId = ?
  `);
  stmt.run(platformId, userId);
}

/**
 * Get all connected platforms for a user
 */
export function getConnectedPlatforms(userId: string): Array<{
  platformId: string;
  handle?: string;
  accountId?: string;
}> {
  const db = getDatabase();

  const stmt = db.prepare(`
    SELECT DISTINCT platformId, handle, accountId
    FROM oauth_tokens
    WHERE userId = ?
  `);
  return stmt.all(userId) as any[];
}
