'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const API_BASE = "/api/hautegaronne";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x200?text=Événement";

export default function HauteGaronnePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchEvents() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filtrage + tri chronologique
  const filteredEvents = events
    .filter((event) => {
      // 1. Recherche textuelle
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        event.title?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.fullAddress?.toLowerCase().includes(query) ||
        event.dateFormatted?.toLowerCase().includes(query) ||
        event.category?.toLowerCase().includes(query)
      );

      // 2. Filtrage temporel (Aujourd'hui -> J+31)
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Début de journée pour inclure aujourd'hui

      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 31);
      maxDate.setHours(23, 59, 59, 999); // Fin de journée à J+31

      const isWithinTimeRange = eventDate >= today && eventDate <= maxDate;

      return matchesSearch && isWithinTimeRange;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      
      <nav className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Retour à l'accueil
        </Link>
      </nav>
      
      <h1 className="text-3xl font-bold mb-4">Événements Haute-Garonne</h1>
      <p className="text-muted-foreground mb-6">
        Cette page affiche les événements à venir dans les 31 prochains jours pour la Haute-Garonne.
      </p>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher par titre, description, lieu, date, catégorie..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
      />

      {/* Compteur */}
      <p className="mb-4 font-semibold text-blue-700">
        Événements trouvés (prochains 31 jours) : {filteredEvents.length}
      </p>

      {/* Mode de vue */}
      <div className="flex gap-4 mb-6">
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

      {/* Actualiser */}
      <Button onClick={fetchEvents} disabled={loading} className="mb-6">
        {loading ? "Chargement..." : "📡 Actualiser les événements"}
      </Button>

      {error && (
        <div className="mt-6 p-4 border border-red-500 bg-red-50 text-red-700 rounded">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      {/* Mode plein écran (Grille de cartes) */}
      {viewMode === "card" && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[480px] border border-gray-100"
            >
              <img
                src={event.image || PLACEHOLDER_IMAGE}
                alt={event.title}
                className="w-full aspect-[16/9] object-cover"
              />
              <div className="p-4 flex flex-col flex-1 min-h-0">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">{event.title}</h2>

                <div
                  className="text-sm text-muted-foreground mb-2 overflow-y-auto"
                  style={{ flex: 1, minHeight: 0 }}
                >
                  {event.description}
                </div>

                <div className="mt-2 pt-2 border-t border-gray-50">
                  <p className="text-sm font-bold text-blue-600 mb-1">{event.dateFormatted}</p>
                  <p className="text-sm text-gray-600 mb-1 line-clamp-1">{event.fullAddress}</p>
                  <p className="text-xs text-muted-foreground italic mb-3">Source : {event.source}</p>
                </div>

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

      {/* Mode vignette (Liste) */}
      {viewMode === "list" && filteredEvents.length > 0 && (
        <div className="space-y-4 mt-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 p-4 border rounded-lg shadow bg-white hover:bg-gray-50 transition"
            >
              <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs overflow-hidden shrink-0">
                <img
                  src={event.image || PLACEHOLDER_IMAGE}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold line-clamp-1">{event.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                <div className="flex gap-4 mt-1 items-center">
                  <p className="text-sm font-bold text-blue-600">{event.dateFormatted}</p>
                  <span className="text-gray-300">|</span>
                  <p className="text-xs text-gray-500 truncate">{event.fullAddress}</p>
                </div>
                {event.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm mt-1 block font-medium"
                  >
                    Voir →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredEvents.length === 0 && !loading && (
        <div className="mt-10 text-center p-10 border-2 border-dashed rounded-lg">
          <p className="text-xl text-muted-foreground">Aucun événement trouvé pour les 31 prochains jours.</p>
          <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
            Réinitialiser la recherche
          </Button>
        </div>
      )}
    </div>
  );
}
