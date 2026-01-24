// src/app/api/altcha/route.ts
import { NextResponse } from 'next/server';
import { createChallenge } from 'altcha-lib';

export const runtime = 'nodejs';

const ALTCHA_HMAC_SECRET = process.env.ALTCHA_HMAC_SECRET;

if (!ALTCHA_HMAC_SECRET) {
  console.warn('⚠️ [ALTCHA API] ALTCHA_HMAC_SECRET manquant. ALTCHA ne fonctionnera pas sans clé !');
}

export async function GET(req: Request) {
  console.log('🔹 [ALTCHA API] Requête GET reçue pour challenge');

  if (!ALTCHA_HMAC_SECRET) {
    return NextResponse.json(
      { success: false, message: 'ALTCHA non configuré sur le serveur.' },
      { status: 500 }
    );
  }

  try {
    const ua = req.headers.get('user-agent') || '';
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);

    // Ajuster la complexité selon l'appareil
    const maxNumber = isMobile ? 50000 : 100000;
    const durationSeconds = 180; // durée de validité du challenge en secondes

    const challenge = await createChallenge({
      hmacKey: ALTCHA_HMAC_SECRET,
      algorithm: 'SHA-256',
      maxNumber,
      expires: new Date(Date.now() + durationSeconds * 1000), // expiration
      // ❌ metadata supprimé car non supporté
    });

    // Debug : log avec info sur l'appareil
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ [ALTCHA API] Challenge généré :', challenge, {
        device: isMobile ? 'mobile' : 'desktop',
        maxNumber,
        expiresInSeconds: durationSeconds,
      });
    }

    return NextResponse.json(challenge, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'Content-Type': 'application/json',
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
        'Referrer-Policy': 'no-referrer',
      },
    });
  } catch (err) {
    console.error('❌ [ALTCHA API] Erreur lors de la génération du challenge :', err);

    return NextResponse.json(
      {
        success: false,
        message: 'Erreur interne lors de la génération du challenge ALTCHA.',
      },
      { status: 500 }
    );
  }
}
