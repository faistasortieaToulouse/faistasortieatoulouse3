import { DiscordEvent } from '@/types/types';
import { DiscordEvents } from '@/components/DiscordEvents';

const GUILD_ID = '1422806103267344416';

export const revalidate = 60;

export default async function DiscordEventsPage() {
  const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN || '';

  let eventsData: DiscordEvent[] = [];
  if (DISCORD_TOKEN) {
    try {
      const res = await fetch(
        `https://discord.com/api/v10/guilds/${GUILD_ID}/scheduled-events`,
        {
          headers: { Authorization: `Bot ${DISCORD_TOKEN}` },
          next: { revalidate: 60 },
        }
      );
      eventsData = res.ok ? await res.json() : [];
    } catch {
      eventsData = [];
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">📆 Événements Discord</h1>
      <DiscordEvents events={eventsData} limit={20} />

    </div>
  );
}
