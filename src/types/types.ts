// src/types/types.ts

// Représente une image du carrousel
export interface CarouselImage {
  id: string;
  imageUrl: string;
  description: string;
  imageHint?: string;
}

// Représente un canal Discord
export interface DiscordChannel {
  id: string;
  name: string;
  position: number;
  type: number;
  parent_id?: string;
}

// Représente un événement Discord
export interface DiscordEvent {
  id: string;
  name: string;
  description: string;
  scheduled_start_time: string; // ISO string
  channel_id: string;
  entity_metadata?: {
    location?: string; // lieu de l'événement
  };
  image?: string; // ✅ Ajouté pour permettre l'affichage de l'image de couverture
  guild_id: string; // ✅ Ajout nécessaire pour le lien Discord
}

// Données complètes pour le widget Discord dans le dashboard
export interface DiscordWidgetData {
  channels: DiscordChannel[];
  events: DiscordEvent[];
  images: CarouselImage[];
  guildId: string;
  presence_count?: number; // nombre de membres en ligne (optionnel)
}

// --- Types additionnels partagés ---
// Exemple pour les sondages Discord
export interface DiscordPoll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  channel_id: string;
  created_at: string;
  expires_at?: string;
}

// Exemple pour l'utilisateur (si besoin)
export interface DiscordUser {
  id: string;
  username: string;
  avatar?: string;
  discriminator?: string;
}

// Exemple d’interface pour recommandations IA
export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  date?: string;
  location?: string;
  imageUrl?: string;
}
