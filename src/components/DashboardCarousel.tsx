// src/components/DashboardCarousel.tsx
'use client';

import DashboardClient from '@/components/DashboardClient';
import { CarouselImage, DiscordChannel, DiscordEvent, DiscordWidgetData } from '@/types/types';

// --- Constantes globales ---
const GUILD_ID = '1422806103267344416';
const FTS_LOGO_URL =
  '/images/logoFTS180iphone.jpg';

// --- Liste complète des images du carrousel ---
const CAROUSEL_IMAGES: string[] = [
  '/images/ftsbar600.jpg',
  '/images/ftsbaton600.jpg',
  '/images/ftscinema600.jpg',
  '/images/ftsconcert600.jpg',
  '/images/ftscovoiturage600.jpg',
  '/images/ftsdanse600.jpg',
  '/images/ftsemploi600.jpg',
  '/images/ftsjeu600.jpg',
  '/images/ftslecture600.jpg',
  '/images/ftslogement600.jpg',
  '/images/ftsmusee600.jpg',
  '/images/ftspeinture600.jpg',
  '/images/ftsphoto600.jpg',
  '/images/ftspiquenique600.jpg',
  '/images/ftsplage600.jpg',
  '/images/ftsrando600.jpg',
  '/images/ftsrestaurant600.jpg',
  '/images/ftssalondethe600.jpg',
  '/images/ftstehatre600.jpg',
  '/images/ftsyoga600.jpg',
  '/images/ftszumba600.jpg',
];


// --- Composant principal ---
export default function DashboardCarousel() {
  // Conversion des URLs en CarouselImage
  const images: CarouselImage[] = CAROUSEL_IMAGES.map((url, index) => ({
    id: `img-${index}`,
    imageUrl: url,
    description: '', // Description vide par défaut
  }));

  // --- Création d'un objet DiscordWidgetData complet ---
  const widgetData: DiscordWidgetData & { presence_count?: number } = {
    channels: [] as DiscordChannel[], // vide pour le carrousel
    events: [] as DiscordEvent[],     // vide pour le carrousel
    images,
    guildId: GUILD_ID,
    presence_count: 0,                // optionnel
  };

  return (
    <DashboardClient
      discordData={widgetData}    // ✅ passe l'objet complet
      eventsData={widgetData.events}
      discordPolls={[]}            // vide si aucun sondage
      totalMembers={0}             // nombre fictif ou réel si disponible
      ftsLogoUrl={FTS_LOGO_URL}    // logo FTS
    />
  );
}
