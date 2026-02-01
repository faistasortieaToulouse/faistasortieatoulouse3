"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, Search, LayoutGrid, List } from "lucide-react";

const API_BASE = "/api/discord";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/800x450?text=Événement+Discord";
// Lien vers le salon des événements (ajuster si nécessaire)
const DISCORD_EVENT_URL = "https://discord.com/channels/1422806103267344416/1423210600036565042";

type DiscordEvent = {
  id: string;
  title: string;
  description?: string;
  date: string;
  image?: string | null;
  location?: string;
  source?: string;
};

export default function DiscordEventsPage() {
  const [events, setEvents] = useState<DiscordEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      
      // Si l'API renvoie une erreur mais pas d'événements, on affiche le message
      if (data.error && (!data.events || data.events.length === 0)) {
        setError(data.error);
      } else {
        setEvents(data.events ?? []);
      }
    } catch (err: any) {
      setError("Impossible de contacter le serveur.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events
    .filter((event) => {
      const query = searchQuery.toLowerCase();
      return (
        event.title?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Date à venir";
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Navigation */}
      <nav className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Retour à l'accueil
        </Link>
      </nav>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Événements Discord</h1>
          <p className="text-muted-foreground italic">
            Retrouvez les rendez-vous communautaires de notre serveur.
          </p>
        </div>
        <Button onClick={fetchEvents} disabled={loading} variant="outline" className="shrink-0">
          {loading ? "Chargement..." : "📡 Actualiser"}
        </Button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un événement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-500">
            {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
          </p>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-md transition-all ${viewMode === "card" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-xl mb-8 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p><strong>Erreur :</strong> {error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p>Synchronisation avec Discord...</p>
        </div>
      ) : filteredEvents.length > 0 ? (
        <>
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border flex flex-col h-[550px] hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 w-full">
                    <img 
                      src={event.image || PLACEHOLDER_IMAGE} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Discord
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 leading-tight">{event.title}</h2>
                    
                    <div className="text-sm text-gray-600 mb-4 overflow-y-auto flex-1 pr-2 whitespace-pre-wrap">
                      {event.description || "Aucune description fournie pour cet événement."}
                    </div>

                    <div className="mt-auto pt-4 border-t space-y-3">
                      <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                        <Calendar size={16} />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        📍 <span className="truncate">{event.location || "En ligne / Toulouse"}</span>
                      </p>
                      <a 
                        href={DISCORD_EVENT_URL} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block w-full py-3 bg-[#5865F2] text-white text-center rounded-xl text-sm font-bold hover:bg-[#4752C4] transition-all transform hover:scale-[1.02] active:scale-95"
                      >
                        Rejoindre sur Discord
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div key={event.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-2xl bg-white hover:border-blue-300 transition-all shadow-sm">
                  <img src={event.image || PLACEHOLDER_IMAGE} className="w-full sm:w-32 h-32 sm:h-24 rounded-xl object-cover" alt="" />
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h2 className="font-bold text-gray-900 text-lg truncate">{event.title}</h2>
                    <p className="text-sm text-gray-500 line-clamp-1 mb-2">{event.description}</p>
                    <p className="text-sm font-bold text-blue-600">{formatDate(event.date)}</p>
                  </div>
                  <a 
                    href={DISCORD_EVENT_URL} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full sm:w-auto px-6 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-[#5865F2] hover:text-white transition-all"
                  >
                    Ouvrir
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl">
          <div className="text-5xl mb-4">💨</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun événement à l'horizon</h3>
          <p className="text-gray-500 max-w-xs mx-auto">
            Il n'y a actuellement aucun événement programmé sur le serveur. Revenez plus tard !
          </p>
        </div>
      )}
    </div>
  );
}