"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types                                   */
/* -------------------------------------------------------------------------- */

type CapitoleEvent = {
  id: string;
  title: string;
  description?: string;
  start?: string;
  location?: string;
  url?: string;
  source?: string;
};

/* -------------------------------------------------------------------------- */
/* Helpers / Utils                              */
/* -------------------------------------------------------------------------- */

const getEventImage = (title?: string) => {
  if (!title) return "/images/capitole/capidefaut.jpg";
  const lower = title.toLowerCase();
  if (lower.includes("ciné") || lower.includes("cine")) return "/images/capitole/capicine.jpg";
  if (lower.includes("conf")) return "/images/capitole/capiconf.jpg";
  if (lower.includes("expo")) return "/images/capitole/capiexpo.jpg";
  return "/images/capitole/capidefaut.jpg";
};

const formatDate = (isoDate?: string) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* -------------------------------------------------------------------------- */
/* Page                                    */
/* -------------------------------------------------------------------------- */

export default function CapitoleMinPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<CapitoleEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CapitoleEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  async function fetchEvents() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/capitole-min");
      if (!res.ok) throw new Error(`API HTTP error: ${res.status}`);
      const data: CapitoleEvent[] = await res.json();
      setEvents(data);
      setFilteredEvents(data);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchEvents(); }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredEvents(
      events.filter((ev) =>
        ev.title.toLowerCase().includes(q) ||
        ev.description?.toLowerCase().includes(q) ||
        ev.location?.toLowerCase().includes(q) ||
        ev.start?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, events]);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">

      <nav className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Retour à l'accueil
        </Link>
      </nav>
      
      {/* Style pour le scroll discret */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      <h1 className="text-3xl font-bold mb-4">Événements UT Capitole</h1>

      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <Button onClick={fetchEvents} disabled={loading}>
          {loading ? "Chargement..." : "📡 Actualiser"}
        </Button>
        <Button onClick={() => setViewMode("card")} variant={viewMode === "card" ? "default" : "secondary"}>
          📺 Cartes
        </Button>
        <Button onClick={() => setViewMode("list")} variant={viewMode === "list" ? "default" : "secondary"}>
          📋 Liste
        </Button>
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 border border-red-400 rounded mb-6">{error}</div>}

      {/* ------------------------------ MODE CARTE ----------------------------- */}
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="bg-white shadow rounded overflow-hidden flex flex-col h-[520px]">
              <img src={getEventImage(ev.title)} alt={ev.title} className="w-full h-40 object-cover" />

              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-lg font-semibold mb-1 leading-tight line-clamp-2">{ev.title}</h2>

                {ev.start && <p className="text-sm text-blue-600 font-medium mb-1">{formatDate(ev.start)}</p>}
                {ev.location && <p className="text-sm text-muted-foreground mb-2">📍 {ev.location}</p>}

                {ev.description && (
                  <div className="text-sm text-muted-foreground mb-4 flex-1 overflow-hidden">
                    <div className="h-24 overflow-y-auto pr-2 custom-scrollbar leading-relaxed">
                      {ev.description}
                    </div>
                  </div>
                )}

                <div className="mt-auto space-y-3">
                  {ev.url && (
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10">
                      <a href={ev.url} target="_blank" rel="noopener noreferrer">
                        🔗 VOIR L'ÉVÉNEMENT
                      </a>
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">Source : {ev.source}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ------------------------------ MODE LISTE ----------------------------- */
        <div className="flex flex-col gap-4">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="flex flex-col sm:flex-row bg-white shadow rounded p-4 gap-4">
              <img src={getEventImage(ev.title)} alt={ev.title} className="w-full sm:w-40 h-36 object-cover rounded" />

              <div className="flex-1 flex flex-col">
                <h2 className="text-lg font-semibold mb-1">{ev.title}</h2>
                <p className="text-sm text-blue-600 font-medium">{formatDate(ev.start)}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{ev.description}</p>

                <div className="mt-auto flex flex-wrap items-center gap-4">
                  {ev.url && (
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-4">
                      <a href={ev.url} target="_blank" rel="noopener noreferrer">Voir l'événement</a>
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">Source : {ev.source}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
