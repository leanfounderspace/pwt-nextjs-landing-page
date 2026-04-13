import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USER = 'pwt_tech_admin';
const ADMIN_PASS = 'pwTtech#2026';

// Token bucket: 10 burst, refill 1 token/6s (max 10/min sustained)
const buckets = new Map<string, { tokens: number; last: number }>();
const BUCKET_MAX = 10;
const REFILL_RATE = 6_000; // ms per token

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip) ?? { tokens: BUCKET_MAX, last: now };
  b.tokens = Math.min(BUCKET_MAX, b.tokens + (now - b.last) / REFILL_RATE);
  b.last = now;
  buckets.set(ip, b);
  if (b.tokens < 1) return false;
  b.tokens -= 1;
  return true;
}

function basicAuth(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Basic ')) return false;
  const [user, pass] = atob(auth.slice(6)).split(':');
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/api/chat' && req.method === 'POST') {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many messages. Please wait a moment.' }, { status: 429 });
    }
  }

  if (pathname.startsWith('/admin/chat') || pathname.startsWith('/api/admin')) {
    if (!basicAuth(req)) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="PwT Admin"' },
      });
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ['/api/chat', '/admin/chat/:path*', '/api/admin/:path*'] };
