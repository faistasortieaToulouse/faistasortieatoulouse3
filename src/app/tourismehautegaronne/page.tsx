'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const THEME_IMAGES: Record<string, string> = {
  "Culture": "/images/tourismehg31/themeculture.jpg",
  "Education": "/images/tourismehg31/themeeducation.jpg", // ✔️ Nouvelle version simplifiée
  "Autres": "/images/tourismehg31/themeautres.jpg",
  "Sport": "/images/tourismehg31/themesport.jpg",
  "Environnement": "/images/tourismehg31/themeenvironnement.jpg",
  "Économie / vie des entreprises": "/images/tourismehg31/themeentreprises.jpg",
  "Vides Grenier / Brocantes / Foires et salons": "/images/tourismehg31/themebrocantes.jpg",
  "Culture scientifique": "/images/tourismehg31/themesciences.jpg",
  "Agritourisme": "/images/tourismehg31/themeagritourisme.jpg",
};

const DEFAULT_IMAGE = "/images/tourismehg31/placeholder.jpg";
const PAGE_LIMIT = 100;

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  dateFormatted: string;
  location: string;
  fullAddress: string;
  image: string;
  url?: string;
  source: string;
  thematique?: string;
}

// 🔥 Fonction améliorée pour détecter les thématiques (accents, variations, etc.)
function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getThemeImage(thematique?: string): string {
  if (!thematique) return DEFAULT_IMAGE;

  const t = normalize(thematique.trim());

  // Match large "education"
  if (t.startsWith("education")) {
    return THEME_IMAGES["Education"];
  }

  // Matching exact existant
  if (THEME_IMAGES[thematique]) {
    return THEME_IMAGES[thematique];
  }

  return DEFAULT_IMAGE;
}

export default function TourismeHauteGaronnePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

const apiUrl = "/api/tourismehautegaronne";

  async function fetchEvents() {
    setLoading(true);
    setError(null);
    setEvents([]);
    setFilteredEvents([]);

    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`Erreur API: ${res.status}`);

      const data = await res.json();
      if (!data.events) return;

      const today = new Date();
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 31);

      const mapped: EventItem[] = data.events
        .filter((ev: any) => ev.date && new Date(ev.date) >= today && new Date(ev.date) <= maxDate)
        .map((ev: any, idx: number) => ({
          ...ev,
          id: ev.id || `event-${idx}`,
          image: getThemeImage(ev.thematique), // 🔥 Utilisation du match intelligent
        }))
        .slice(0, PAGE_LIMIT);

      setEvents(mapped);
      setFilteredEvents(mapped);

    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filtrage multi-critères
  useEffect(() => {
    if (!searchQuery) {
      setFilteredEvents(events);
      return;
    }

    const q = searchQuery.toLowerCase();
    setFilteredEvents(
      events.filter(ev =>
        ev.title.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.fullAddress.toLowerCase().includes(q) ||
        ev.dateFormatted.toLowerCase().includes(q) ||
        (ev.thematique?.toLowerCase().includes(q) ?? false)
      )
    );
  }, [searchQuery, events]);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">

      <nav className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Retour à l'accueil
        </Link>
      </nav>

      <h1 className="text-3xl font-bold mb-4">Événements en Haute-Garonne</h1>
      <p className="text-muted-foreground mb-6">
        Événements à venir dans les 31 prochains jours pour le département 31, depuis le dataset OpenData de la Région Occitanie.
      </p>

      <input
        type="text"
        placeholder="Rechercher par titre, description, lieu, date ou thématique..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring focus:border-blue-300"
      />

      <p className="mb-4 text-sm text-gray-600">Événements affichés : {filteredEvents.length}</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={fetchEvents} disabled={loading}>
          {loading ? "Chargement..." : "📡 Charger les événements"}
        </Button>
        <Button
          onClick={() => setViewMode("card")}
          variant={viewMode === "card" ? "default" : "secondary"}
        >
          📺 Plein écran
        </Button>
        <Button
          onClick={() => setViewMode("list")}
          variant={viewMode === "list" ? "default" : "secondary"}
        >
          🔲 Vignette
        </Button>
      </div>

      {error && (
        <div className="mt-6 p-4 border border-red-500 bg-red-50 text-red-700 rounded">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      {!loading && filteredEvents.length === 0 && (
        <p className="mt-6 text-muted-foreground">Aucun événement correspondant aux critères de recherche.</p>
      )}

      {!loading && filteredEvents.length > 0 && (
        <>
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredEvents.map(event => (
                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                  <img src={event.image} alt={event.title} className="w-full aspect-[16/9] object-cover" />
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                    <p className="text-sm text-muted-foreground mb-2 flex-1 line-clamp-4">{event.description}</p>
                    <p className="text-sm font-medium mb-1">{event.dateFormatted}</p>
                    <p className="text-sm text-muted-foreground mb-1">{event.fullAddress}</p>
                    <p className="text-xs text-muted-foreground italic mb-1">Thématique : {event.thematique}</p>
                    <p className="text-xs text-muted-foreground italic mb-3">Source : {event.source}</p>
                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-block bg-blue-600 text-white text-center py-2 px-3 rounded hover:bg-blue-700 transition"
                      >
                        🔗 Voir l’événement officiel
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-6">
              {filteredEvents.map(event => (
                <div key={event.id} className="flex flex-col sm:flex-row bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full sm:w-48 h-32 object-cover flex-shrink-0" />
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-lg font-semibold mb-1">{event.title}</h2>
                    <p className="text-sm text-muted-foreground mb-1 line-clamp-3">{event.description}</p>
                    <p className="text-sm font-medium">{event.dateFormatted}</p>
                    <p className="text-sm text-muted-foreground">{event.fullAddress}</p>
                    <p className="text-xs text-muted-foreground italic">Thématique : {event.thematique}</p>
                    <p className="text-xs text-muted-foreground italic mb-1">Source : {event.source}</p>
                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-block bg-blue-600 text-white text-center py-2 px-3 rounded hover:bg-blue-700 transition"
                      >
                        🔗 Voir l’événement officiel
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
