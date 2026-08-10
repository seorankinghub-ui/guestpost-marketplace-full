import { getDb } from './db';

// Simple password-based auth (no external NextAuth dependency at runtime)
// Uses the same bcryptjs for password verification

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: 'buyer' | 'publisher' | 'admin';
  balance_main: number;
  balance_reserved: number;
  balance_bonus: number;
}

// In-memory session store (tokens → users)
const sessions = new Map<string, { user: SessionUser; expires: number }>();

// Clean expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions) {
    if (session.expires < now) sessions.delete(token);
  }
}, 300000);

export function createSession(user: SessionUser): string {
  const token = Buffer.from(`${user.id}:${Date.now()}:${Math.random()}`).toString('base64');
  sessions.set(token, { user, expires: Date.now() + 24 * 60 * 60 * 1000 }); // 24h
  return token;
}

export function getSession(token: string): SessionUser | null {
  // URL-decode the token (cookies may arrive URL-encoded)
  const decoded = decodeURIComponent(token);
  const session = sessions.get(decoded);
  if (!session || session.expires < Date.now()) {
    sessions.delete(decoded);
    return null;
  }
  // Extend session
  session.expires = Date.now() + 24 * 60 * 60 * 1000;
  return session.user;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}

export function authenticateUser(email: string, password: string): SessionUser | null {
  const db = getDb();
  const bcrypt = require('bcryptjs');
  
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user) return null;

  // For demo seed data, accept 'password123' directly
  // In production, use bcrypt.compare(password, user.password_hash)
  const valid = user.password_hash ? bcrypt.compareSync(password, user.password_hash) : password === 'password123';
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    balance_main: user.balance_main,
    balance_reserved: user.balance_reserved,
    balance_bonus: user.balance_bonus,
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
  ).run(email, hash, name, role, role === 'buyer' ? 0 : 0, name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2));

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
