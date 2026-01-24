// src/app/(main)/page.tsx
import DashboardClient from '@/components/DashboardClient';
import { DiscordChannel, DiscordEvent, DiscordWidgetData } from '@/types/types';
import { TimeWeatherBar } from '@/components/time-weather-bar';
import Image from 'next/image';
import { ClientOnly } from '@/components/ClientOnly';
// import ftsLogo from '../../../public/icons/logoFTS180iphone.jpg';

export const revalidate = 300;

const GUILD_ID = '1422806103267344416';
const POLLS_CHANNEL_ID = '1422806103904882842';

// MODIFICATION CLÉ: Remplacement de l'URL Firebase par le chemin local statique.
const FTS_LOGO_URL = '/icons/logoFTS180iphone.jpg'; // <-- MODIFICATION CLÉ: Remplacer l'objet par le chemin string

export default async function DashboardPage() {
  const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN || '';

  // --- Fetch Channels ---
  let channelsData: DiscordChannel[] = [];
  if (DISCORD_TOKEN) {
    try {
      const res = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/channels`, {
        headers: { Authorization: `Bot ${DISCORD_TOKEN}` },
        next: { revalidate: 300 },
      });
      channelsData = res.ok ? await res.json() : [];
    } catch {
      channelsData = [];
    }
  }

  // --- Fetch Members ---
  let membersData: any[] = [];
  if (DISCORD_TOKEN) {
    try {
      const res = await fetch(
        `https://discord.com/api/v10/guilds/${GUILD_ID}/members?limit=1000`,
        { headers: { Authorization: `Bot ${DISCORD_TOKEN}` }, next: { revalidate: 300 } }
      );
      membersData = res.ok ? await res.json() : [];
    } catch {
      membersData = [];
    }
  }
  const totalMembersCount = membersData.length;

  // --- Fetch Events ---
  let eventsData: DiscordEvent[] = [];
  if (DISCORD_TOKEN) {
    try {
      const res = await fetch(
        `https://discord.com/api/v10/guilds/${GUILD_ID}/scheduled-events`,
        { headers: { Authorization: `Bot ${DISCORD_TOKEN}` }, next: { revalidate: 60 } }
      );
      eventsData = res.ok ? await res.json() : [];
    } catch {
      eventsData = [];
    }
  }

  // --- Fetch Widget ---
  let widgetData: Partial<DiscordWidgetData & { presence_count?: number }> = {};
  try {
    const res = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/widget.json`, {
      next: { revalidate: 300 },
    });
    widgetData = res.ok ? await res.json() : {};
  } catch {
    widgetData = {};
  }

  // --- Fetch Polls ---
  let discordPolls: any[] = [];
  if (DISCORD_TOKEN) {
    try {
      const res = await fetch(
        `https://discord.com/api/v10/channels/${POLLS_CHANNEL_ID}/messages?limit=100`,
        { headers: { Authorization: `Bot ${DISCORD_TOKEN}` }, next: { revalidate: 60 } }
      );
      if (res.ok) {
        const messages = await res.json();
        discordPolls = messages.filter((msg: any) => msg.poll && !msg.poll.expired);
      }
    } catch {
      discordPolls = [];
    }
  }

  // --- Préparer discordData conforme à DiscordWidgetData ---
  const discordData: DiscordWidgetData & { presence_count: number } = {
    channels: channelsData,
    events: eventsData,
    images: widgetData.images || [],
    guildId: GUILD_ID,
    presence_count: widgetData.presence_count || 0,
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header côté serveur */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="font-headline text-4xl font-bold text-primary">Tableau de bord</h1>
          <p className="mt-2 text-accent">
            Application pour faire des sorties à Toulouse : discute des sorties, échange et organise.
          </p>
          <p className="mt-2 text-accent">Tout est gratuit et sans limite !</p>
          <p className="mt-2 text-accent">Avec FTS on est bien dans la ville rose !</p>
        </div>
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image src={FTS_LOGO_URL} alt="Logo FTS" fill className="rounded-lg object-cover" unoptimized />
        </div>
      </header>

      {/* TimeWeatherBar full width */}
      <ClientOnly>
        <TimeWeatherBar />
      </ClientOnly>

      {/* Client Component pour le dashboard interactif */}
      <DashboardClient
        discordData={discordData}
        discordPolls={discordPolls}
        eventsData={eventsData}
        totalMembers={totalMembersCount}
        ftsLogoUrl={FTS_LOGO_URL}
      />
    </div>
  );
}
