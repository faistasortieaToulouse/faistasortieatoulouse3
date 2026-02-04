'use client';

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Image, { StaticImageData } from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Users, Calendar as CalendarIcon, BellRing, Store, Share2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { DiscordEvent, DiscordWidgetData, CarouselImage } from "@/types/types";
import placeholderData from "@/lib/placeholder-images.json";

import { DashboardMenu } from "./DashboardMenu";
import { DiscordWidget } from "./discord-widget";
import { DiscordChannelList } from "./discord-channel-list";
import { DiscordEvents } from "./discord-events";
import { DiscordPolls } from "./discord-polls";
import { AiRecommendations } from "./ai-recommendations";
import InstallPWAiOS from "@/components/InstallPWAiOS";
import APKDownloadModal from "@/components/APKDownloadModal";
import React from "react";
import Carousel from "../components/Carousel";
import DesktopOnly from "@/components/DesktopOnly";

const DesktopQRCode = dynamic(() => import("@/components/DesktopQRCode"), { ssr:false });
const TimeWeatherBar = dynamic(
  () => import("./time-weather-bar").then(mod => mod.TimeWeatherBar),
  { ssr: false }
);

interface DashboardClientProps {
  stats: any; // Ajout de la prop pour recevoir les données du JSON
  discordData: DiscordWidgetData & { presence_count?: number };
  discordPolls: any[];
  eventsData: DiscordEvent[];
  totalMembers: number;
  ftsLogoUrl?: string | StaticImageData;
}

export default function DashboardClient({
  stats, // On récupère stats ici
  discordData,
  discordPolls,
  eventsData,
  totalMembers,
  ftsLogoUrl,
}: DashboardClientProps) {
  const { toast } = useToast();

  const onlineMembers = discordData.presence_count ?? 0;

  const upcomingEventsCount = useMemo(() => {
    const now = new Date();
    return eventsData.filter(ev => new Date(ev.scheduled_start_time) >= now).length;
  }, [eventsData]);

  const upcomingEventsWeekCount = useMemo(() => {
    const now = new Date();
    const sevenDays = new Date();
    sevenDays.setDate(now.getDate() + 7);
    return eventsData.filter(ev => {
      const start = new Date(ev.scheduled_start_time);
      return start >= now && start <= sevenDays;
    }).length;
  }, [eventsData]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mon Application TWA/PWA",
          text: "Téléchargez Mon Application pour ne rien manquer de nos événements et discussions !",
          url: "https://faistasortieatoulouse.online",
        });
        toast({ title: "Partage réussi 🎉", description: "Merci d'avoir partagé l'application !" });
      } catch {
        toast({
          title: "Partage annulé",
          description: "Le partage a été interrompu ou non supporté par le navigateur.",
          variant: "destructive",
        });
      }
    } else {
      navigator.clipboard.writeText("https://faistasortieatoulouse.online");
      toast({
        title: "Lien copié !",
        description: "Le lien de l'application a été copié dans votre presse-papiers.",
      });
    }
  };

  const carouselImages: CarouselImage[] = placeholderData.carouselImages.map(
    (img: string | CarouselImage, index: number) =>
      typeof img === "string"
        ? { id: index.toString(), imageUrl: img, description: `Image ${index + 1}` }
        : img
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-x-hidden">
      {/* Carrousel */}
<section className="flex justify-center w-full">
  <div className="max-w-4xl w-full">
    <Carousel images={carouselImages} />
  </div>
</section>

{/* ✅ SECTION STATISTIQUES HEBDOMADAIRES */}
          {stats && (
            <section className="w-full max-w-4xl mx-auto">
              <Card className="p-5 border-none bg-slate-50 dark:bg-slate-900/50 shadow-sm rounded-[2rem]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  
                  {/* Colonne Gauche : Détails avec liens */}
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center md:text-left">
                      Consulter les événements ↗
                    </h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                      <a href="https://ftstoulouse.vercel.app/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                        <StatItem label="Evènements sur Meetup" value={stats.detailsLive.meetup} color="text-pink-600" />
                      </a>
                      <a href="https://ftstoulouse.vercel.app/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                        <StatItem label="Sorties Cinéma" value={stats.detailsLive.cinema} color="text-purple-600" />
                      </a>
                      <a href="https://ftstoulouse.vercel.app/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                        <StatItem label="Evènements sur l'Agenda" value={stats.detailsLive.agenda} color="text-blue-600" />
                      </a>
                      <a href="https://ftstoulouse.vercel.app/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                        <StatItem label="Sorties de Jeux" value={stats.detailsLive.jeux} color="text-orange-600" />
                      </a>
                    </div>
                  </div>

                  {/* Colonne Droite : Totaux et Bouton d'action */}
                  <div className="flex flex-col gap-3">
{/* Bloc Articles publiés cliquable */}
<a 
  href="https://ftstoulouse.vercel.app/" 
  target="_blank" 
  rel="noopener noreferrer" 
  className="group block"
>
  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between items-center transition-all group-hover:shadow-md group-hover:border-primary/30 group-hover:scale-[1.02]">
    <div className="flex flex-col">
      <span className="text-xs font-bold text-slate-500 uppercase">Articles publiés</span>
      <span className="text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Voir le blog ↗
      </span>
    </div>
    <span className="text-3xl font-black text-slate-800 dark:text-white">
      {stats.totalArticles}
    </span>
  </div>
</a>

                    <a href="https://ftstoulouse.vercel.app/" target="_blank" rel="noopener noreferrer" className="group">
                      <div className="bg-primary p-4 rounded-2xl shadow-lg shadow-primary/20 flex justify-between items-center text-white transition-all group-hover:bg-primary/90 group-hover:scale-[1.02]">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase opacity-90">Total Sorties</span>
                          <span className="text-[10px] opacity-75 font-medium italic">(Meetup + Agenda)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-black">
                            {stats.detailsLive.meetup + stats.detailsLive.agenda}
                          </span>
                          <Share2 className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </a>

                    <p className="text-[9px] text-center text-slate-400 font-medium italic mt-1">
                      Données arrêtées au {new Date(stats.lastUpdate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

            </div>
          </Card>
        </section>
      )}

      {/* Stats rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="p-4 flex flex-col justify-between w-full h-auto min-h-[6rem]">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-700">Membres en ligne</div>
              <div className="text-2xl font-bold">{onlineMembers}</div>
              <div className="text-xs text-gray-500">Actuellement sur le Discord</div>
            </div>
            <Users className="h-5 w-5 text-primary" />
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between w-full h-auto min-h-[6rem]">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-700">Événements à venir</div>
              <div className="text-2xl font-bold">{upcomingEventsCount}</div>
              <div className="text-xs text-gray-500">Planifiés sur le Discord</div>
            </div>
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
        </Card>
      </div>

{/* ✅ Carte 3 : Lien vers le Guide (ftstoulouse.vercel.app) */}
  <a 
    href="https://ftstoulouse.vercel.app/" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="group"
  >
    <Card className="p-4 flex flex-col justify-between w-full h-auto min-h-[6rem] border-primary/20 transition-all group-hover:shadow-md group-hover:border-primary group-hover:bg-primary/5">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-bold text-primary">FTS Toulouse ↗</div>
          <div className="text-lg font-black leading-tight mt-1">Guide des sorties à Toulouse</div>
          <div className="text-[10px] text-gray-500 mt-1 uppercase font-semibold">Consulter le site web</div>
        </div>
        <MapPin className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
      </div>
    </Card>
  </a>

      {/* Menu dashboard */}
      <DashboardMenu ftsLogoUrl={ftsLogoUrl} />

      {/* Grille principale responsive avec scroll horizontal si besoin */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colonne gauche */}
          <div className="flex flex-col gap-8">
            <Card className="p-4 w-full min-w-0 overflow-hidden">
              <h2 className="text-xl font-bold mb-3 text-primary">Événements Discord à Venir</h2>
              <div className="overflow-x-auto max-h-[400px] bg-gray-100 dark:bg-gray-800 w-full">
                <div className="min-w-0">
                  <DiscordEvents events={discordData.events} />
                </div>
              </div>
            </Card>

            <Card className="p-4 w-full min-w-0 overflow-hidden">
              <h2 className="text-xl font-bold mb-1 text-primary">Recommandations d'Événements IA</h2>
              <p className="text-sm text-gray-500 mb-4 break-words">
                Décrivez vos goûts et laissez l'IA vous suggérer des sorties à Toulouse !
              </p>
              <AiRecommendations eventData={JSON.stringify(discordData.events ?? [], null, 2)} />
            </Card>

            <Card className="p-4 flex justify-between items-start w-full h-auto min-h-[6rem]">
              <div>
                <div className="text-sm text-gray-700">Membres sur le serveur</div>
                <div className="text-2xl font-bold">{totalMembers}</div>
                <div className="text-xs text-gray-500">Inscrits sur le Discord</div>
              </div>
              <Users className="h-5 w-5 text-primary" />
            </Card>
          </div>

{/* Colonne droite */}
    {/* Conteneur pour le Widget Discord et la Liste des Canaux */}
<div className="flex flex-col gap-6 w-full">
  {/* Discord Widget */}
  <Card className="p-4 w-full overflow-hidden max-h-[400px] sm:max-h-[500px]">
    <h2 className="text-xl font-bold mb-3 text-primary">Widget Discord</h2>
    <div className="w-full">
      <DiscordWidget />
    </div>
  </Card>

    {/* La Liste des Canaux, elle prend maintenant toute la largeur de la colonne */}
    <Card className="p-4 w-full min-w-0 overflow-hidden">
        <h2 className="text-xl font-bold mb-3 text-primary">Salons du serveur</h2>
        <DiscordChannelList channels={discordData.channels} />
    </Card>

  <Card className="p-4 w-full min-w-0 overflow-hidden">
    <h2 className="text-xl font-bold mb-3 text-primary">Sondages Actifs sur Discord</h2>
    <div className="overflow-x-auto max-h-[400px] bg-gray-100 dark:bg-gray-800 w-full">
      <div className="min-w-0">
        <DiscordPolls polls={discordPolls} />
      </div>
    </div>
  </Card>
</div>
        </div>
      </section>

      {/* Notifications */}
      <Alert>
        <BellRing className="h-4 w-4" />
        <AlertTitle>Événements à Venir (7 Jours)</AlertTitle>
        <AlertDescription>
          {upcomingEventsWeekCount > 0
            ? `Il y a actuellement ${upcomingEventsWeekCount} événements prévus cette semaine !`
            : 'Aucun événement n’est prévu cette semaine. Consultez la liste ci-dessous pour organiser une sortie !'}
        </AlertDescription>
      </Alert>

{/* Section téléchargement / partage */}
<section className="flex flex-col items-center gap-6 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl w-full overflow-hidden">
  
  {/* Ligne supérieure : Google Play + APK */}
  <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 w-full">
    <a
      href="https://play.google.com/store/apps/details?id=com.votre.appli.android"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 p-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
    >
      <Store className="h-5 w-5" />
      <Image
        src="/images/google-play-badge.png"
        alt="Disponible sur Google Play"
        width={180}
        height={53}
        className="w-auto h-auto"
      />
    </a>

    <APKDownloadModal />
  </div>

{/* Ligne inférieure : QR code + bouton partager */}
<div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">

  <div className="flex flex-col items-center">
    <InstallPWAiOS />
  </div>

  {/* QR code centré sous le bloc */}
<DesktopOnly>
  <div className="no-desktop">
    <DesktopQRCode />
  </div>
</DesktopOnly>
  
  <Button
    onClick={handleShare}
    className="flex items-center justify-center space-x-2 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition w-full sm:w-auto"
  >
    <Share2 className="h-5 w-5" />
    <span className="font-semibold">Partager l'application</span>
  </Button>
</div>

</section>

    </div>
  );
}

function StatItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center md:items-start px-3 py-2 bg-white dark:bg-slate-800/40 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-pointer shadow-sm">
      <span className="text-[9px] font-bold text-slate-500 uppercase w-full text-center md:text-left leading-tight mb-1">
        {label} ↗
      </span>
      <span className={`text-2xl font-black ${color}`}>
        {value}
      </span>
    </div>
  );
}
