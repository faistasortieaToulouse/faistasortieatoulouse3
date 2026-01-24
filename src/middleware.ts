import { NextResponse } from 'next/server';

// Configuration du rate limiting
const RATE_LIMIT = 30; // ✅ max requêtes par IP
const WINDOW_MS = 60_000; // 1 minute
const ipHits = new Map<string, { count: number; timestamp: number }>();

export const config = {
  matcher: ['/api/:path*'], // ✅ protège toutes les routes API
};

export function middleware(req: Request) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';

    const now = Date.now();
    const entry = ipHits.get(ip);

    if (!entry) {
      ipHits.set(ip, { count: 1, timestamp: now });
    } else {
      if (now - entry.timestamp < WINDOW_MS) {
        entry.count++;
      } else {
        entry.count = 1;
        entry.timestamp = now;
      }
    }

    // Trop de requêtes ?
    if (ipHits.get(ip)!.count > RATE_LIMIT) {
      console.warn(`🚫 [RateLimit] IP ${ip} bloquée (${ipHits.get(ip)!.count} req/min)`);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message:
            'Trop de requêtes détectées. Merci de réessayer dans une minute.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return NextResponse.next();
  } catch (err) {
    console.error('⚠️ Middleware error:', err);
    return NextResponse.next();
  }
}
