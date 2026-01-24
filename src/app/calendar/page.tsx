import CalendarClient from './page-client';

// --- Construction dynamique + revalidation ---
export const dynamic = 'force-dynamic'; 
export const revalidate = 300; // 5 minutes

// --- Interface des événements Discord ---
interface DiscordEvent {
  id: string;
  name: string;
  scheduled_start_time: string;
  description?: string;
  channel_id: string | null;
  entity_type: 1 | 2 | 3;
  entity_metadata: {
    location?: string;
  } | null;
}

const GUILD_ID = '1422806103267344416';

// --- Fetch serveur des événements Discord ---
async function fetchEventsData(): Promise<DiscordEvent[]> {
  const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;
  if (!DISCORD_TOKEN) {
    console.warn("DISCORD_BOT_TOKEN est manquant.");
    return [];
  }

  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}/scheduled-events`,
      { 
        headers: { Authorization: `Bot ${DISCORD_TOKEN}` }, 
        next: { revalidate: 300 }, // Revalidation Next.js
      }
    );
    
    if (!res.ok) {
      console.error(`Erreur Discord API: statut ${res.status} (${res.statusText})`);
      return [];
    }
    
    const events: DiscordEvent[] = await res.json();
    return events;
    
  } catch (err) {
    console.error("Erreur lors de la récupération des événements :", err);
    return [];
  }
}

export default async function CalendarServerPage() {
  const eventsData = await fetchEventsData();
  
  const now = new Date();
  const upcomingEvents = eventsData
    .filter(event => new Date(event.scheduled_start_time) >= now)
    .sort((a, b) => new Date(a.scheduled_start_time).getTime() - new Date(b.scheduled_start_time).getTime());

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <section className="border rounded-lg shadow-sm p-4 bg-card text-card-foreground">
        <h2 className="text-xl font-bold mb-3 text-primary">Calendrier des Événements Discord</h2>
        <CalendarClient eventsData={eventsData} upcomingEvents={upcomingEvents} />
      </section>
    </div>
  );
}
