import { NextRequest, NextResponse } from 'next/server';

// Récupération des variables d'environnement
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

export async function GET(req: NextRequest) {
  try {
    // 1. Vérification de la configuration critique
    if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
      console.error("Configuration Error: DISCORD_BOT_TOKEN or DISCORD_GUILD_ID is missing.");
      return NextResponse.json({ 
        error: 'Server configuration missing Discord token or Guild ID.' 
      }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const imageHash = searchParams.get('imageHash');

    // 2. Vérification des paramètres de la requête
    if (!eventId || !imageHash) {
      return NextResponse.json({ error: 'Missing eventId or imageHash parameters' }, { status: 400 });
    }

    // URL Discord correcte pour l'image
    const url = `https://cdn.discordapp.com/guilds/${DISCORD_GUILD_ID}/events/${eventId}/${imageHash}.png?size=256`;

    // 3. Récupération de l'image avec Bot
    const imageRes = await fetch(url, {
      headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
      signal: AbortSignal.timeout(5000),
    });

    if (!imageRes.ok) {
      console.warn(`Discord Fetch Failed: URL=${url}, Status=${imageRes.status}`);
      return NextResponse.json({ 
        error: `Failed to fetch image from Discord (Status: ${imageRes.status})` 
      }, { status: imageRes.status });
    }

    // 4. Renvoyer l'image
    const buffer = await imageRes.arrayBuffer();
    const contentType = imageRes.headers.get('content-type') || 'image/png';

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (err) {
    console.error('API Internal Error:', err);
    // Ici on ne peut pas logguer imageRes ou imageUrl, seulement l'erreur
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
