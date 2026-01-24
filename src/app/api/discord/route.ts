import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function GET() {
  if (!DISCORD_GUILD_ID || !DISCORD_BOT_TOKEN) {
    return NextResponse.json({ error: 'Configuration Discord manquante' }, { status: 500 });
  }

  try {
    // --- Widget (canaux + membres) - public ---
    const widgetRes = await fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`, {
      cache: 'no-store',
    });
    const widgetData = widgetRes.ok ? await widgetRes.json() : { members: [], channels: [] };

    // --- Événements à venir - nécessite token bot ---
    const eventsRes = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/events?with_user_count=true`,
      {
        headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
        cache: 'no-store',
      }
    );
    const eventsData = eventsRes.ok ? await eventsRes.json() : [];

    // --- Retour combiné ---
    return NextResponse.json(
      { widget: widgetData, events: eventsData },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err) {
    console.error('❌ Erreur Discord API :', err);
    return NextResponse.json({ error: 'Impossible de charger les données Discord.' }, { status: 500 });
  }
}
