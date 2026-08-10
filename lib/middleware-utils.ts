// Middleware to handle CORS and extract session from cookie
// Next.js Edge middleware — runs on every request

export function getAuthTokenFromRequest(request: Request): string | null {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/session_token=([^;]+)/);
  return match ? match[1] : null;
}

export function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = [
    '/buyer/', '/publisher/', '/admin/',
    '/api/sites', '/api/orders', '/api/wallet', '/api/admin'
  ];
  return protectedPaths.some(p => pathname.startsWith(p));
}

// We don't use Next.js middleware.ts for auth because it runs on Edge
// and we use better-sqlite3 which needs Node.js. Instead we check auth
// in each API route and page server component directly.
