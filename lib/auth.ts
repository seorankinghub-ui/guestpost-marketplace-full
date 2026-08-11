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

// Hardcoded demo users — guaranteed to work regardless of DB state
const DEMO_USERS: Record<string, SessionUser> = {
  'admin@guestpost.com': {
    id: 1, email: 'admin@guestpost.com', name: 'Admin User', role: 'admin',
    balance_main: 0, balance_reserved: 0, balance_bonus: 0,
  },
  'buyer@example.com': {
    id: 2, email: 'buyer@example.com', name: 'Sarah Johnson', role: 'buyer',
    balance_main: 500, balance_reserved: 0, balance_bonus: 0,
  },
  'publisher@example.com': {
    id: 5, email: 'publisher@example.com', name: 'Mike Owner', role: 'publisher',
    balance_main: 0, balance_reserved: 0, balance_bonus: 0,
  },
};

const DEMO_PASSWORD = 'password123';

/**
 * Encode user info into a self-contained session token.
 */
function encodeToken(user: SessionUser): string {
  const payload = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    balance_main: user.balance_main,
    balance_reserved: user.balance_reserved,
    balance_bonus: user.balance_bonus,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  });
  return Buffer.from(payload).toString('base64');
}

function decodeToken(token: string): SessionUser | null {
  try {
    const decoded = decodeURIComponent(token);
    const json = Buffer.from(decoded, 'base64').toString('utf8');
    const payload = JSON.parse(json);
    if (payload.exp && payload.exp < Date.now()) return null;
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      balance_main: payload.balance_main || 0,
      balance_reserved: payload.balance_reserved || 0,
      balance_bonus: payload.balance_bonus || 0,
    };
  } catch {
    return null;
  }
}

export function createSession(user: SessionUser): string {
  return encodeToken(user);
}

export function getSession(token: string): SessionUser | null {
  return decodeToken(token);
}

export function destroySession(_token: string): void {
}

export function authenticateUser(email: string, password: string): SessionUser | null {
  const demoUser = DEMO_USERS[email];
  if (demoUser && password === DEMO_PASSWORD) {
    return { ...demoUser };
  }

  try {
    const db = getDb();
    const bcrypt = require('bcryptjs');
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (user) {
      const valid = user.password_hash
        ? bcrypt.compareSync(password, user.password_hash)
        : password === DEMO_PASSWORD;
      if (valid) {
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
    }
  } catch {
  }

  return null;
}

export function registerUser(email: string, password: string, name: string, role: 'buyer' | 'publisher'): SessionUser | null {
  try {
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
  } catch {
    return null;
  }
}
