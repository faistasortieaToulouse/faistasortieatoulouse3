// src/app/api/discord/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Nettoyage des variables : on sécurise les entrées du .env
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID?.replace(/\D/g, ''); 
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN?.trim();

export async function GET() {
  // 1. Vérification de la configuration
  if (!DISCORD_GUILD_ID || !DISCORD_BOT_TOKEN) {
    console.error("❌ Config Discord manquante dans .env");
    return NextResponse.json(
      { error: 'Configuration Discord incomplète', events: [] }, 
      { status: 200 }
    );
  }

  try {
    // 2. Appel à l'API Discord avec Cache (60 secondes)
    // Cela évite l'erreur 429 si tu rafraîchis trop souvent
    const eventsRes = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/scheduled-events?with_user_count=true`,
      {
        headers: { 
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 } // Cache les données pendant 1 minute
      }
    );

    // Gestion spécifique du Rate Limit (429) pour informer le client
    if (eventsRes.status === 429) {
      console.warn("⚠️ Discord Rate Limit atteint");
      return NextResponse.json(
        { error: 'Discord est un peu fatigué, réessayez dans quelques secondes.', events: [] },
        { status: 200 }
      );
    }

    if (!eventsRes.ok) {
      const errorText = await eventsRes.text();
      console.error(`❌ Discord API Error ${eventsRes.status}:`, errorText);
      return NextResponse.json(
        { error: `Erreur Discord (${eventsRes.status})`, events: [] }, 
        { status: 200 }
      );
    }

    const rawEvents = await eventsRes.json();
    const dataToProcess = Array.isArray(rawEvents) ? rawEvents : [];

    // 3. Normalisation des données
    const normalizedEvents = dataToProcess.map((ev: any) => ({
      id: ev.id,
      title: ev.name, 
      description: ev.description || "",
      date: ev.scheduled_start_time, 
      location: ev.entity_metadata?.location || "Serveur Discord",
      image: ev.image 
        ? `https://cdn.discordapp.com/guild-events/${ev.id}/${ev.image}.png?size=1024` 
        : null,
      source: "Discord"
    }));

    // 4. Réponse finale
    return NextResponse.json({ 
      total: normalizedEvents.length, 
      events: normalizedEvents 
    });

  } catch (err: any) {
    console.error('❌ Erreur critique API Discord :', err.message);
    return NextResponse.json(
      { error: 'Impossible de joindre Discord pour le moment.', events: [] }, 
      { status: 200 }
    );
  }
}