import { getDb } from './db';

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: 'buyer' | 'publisher' | 'admin';
  balance_main: number;
  balance_reserved: number;
  balance_bonus: number;
}

export function createSession(user: SessionUser): string {
  const db = getDb();
  const token = Buffer.from(`${user.id}:${Date.now()}:${Math.random()}`).toString('base64');
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24h

  // Store in DB
  db.prepare(
    'INSERT OR REPLACE INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)'
  ).run(token, user.id, expires);

  return token;
}

export function getSession(token: string): SessionUser | null {
  const db = getDb();
  
  // URL-decode the token (cookies may arrive URL-encoded)
  const decoded = decodeURIComponent(token);

  // Clean expired sessions
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now());

  const row = db.prepare(
    `SELECT u.id, u.email, u.name, u.role, u.balance_main, u.balance_reserved, u.balance_bonus
     FROM sessions s JOIN users u ON s.user_id = u.id
     WHERE s.token = ? AND s.expires_at > ?`
  ).get(decoded, Date.now()) as any;

  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    balance_main: row.balance_main || 0,
    balance_reserved: row.balance_reserved || 0,
    balance_bonus: row.balance_bonus || 0,
  };
}

export function destroySession(token: string): void {
  const db = getDb();
  const decoded = decodeURIComponent(token);
  db.prepare('DELETE FROM sessions WHERE token = ?').run(decoded);
}

export function authenticateUser(email: string, password: string): SessionUser | null {
  const db = getDb();
  const bcrypt = require('bcryptjs');

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user) return null;

  const valid = user.password_hash
    ? bcrypt.compareSync(password, user.password_hash)
    : password === 'password123'; // Demo fallback

  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    balance_main: user.balance_main || 0,
    balance_reserved: user.balance_reserved || 0,
    balance_bonus: user.balance_bonus || 0,
  };
}

export function registerUser(email: string, password: string, name: string, role: 'buyer' | 'publisher'): SessionUser | null {
  const db = getDb();
  const bcrypt = require('bcryptjs');

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return null;

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    'INSERT INTO users (email, password_hash, name, role, balance_main, avatar_initials) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(email, hash, name, role, 0, name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2));

  return {
    id: result.lastInsertRowid as number,
    email,
    name,
    role,
    balance_main: 0,
    balance_reserved: 0,
    balance_bonus: 0,
  };
}
