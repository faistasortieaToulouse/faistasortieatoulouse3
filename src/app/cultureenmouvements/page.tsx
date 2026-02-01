'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export default function CultureEnMouvementsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  async function fetchEvents() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cultureenmouvements");
      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(`API HTTP error: ${res.status} - ${errorBody.error || 'Erreur non détaillée'}`);
      }
      const data = await res.json();
      setEvents(data);
      setFilteredEvents(data);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchEvents(); }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredEvents(events);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = events.filter(ev =>
      (ev.title?.toLowerCase().includes(query) ?? false) ||
      (ev.description?.toLowerCase().includes(query) ?? false) ||
      (ev.location?.toLowerCase().includes(query) ?? false) ||
      (ev.category?.toLowerCase().includes(query) ?? false) ||
      (ev.start?.toLowerCase().includes(query) ?? false)
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      
      <nav className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Retour à l'accueil
        </Link>
      </nav>
      
      <h1 className="text-3xl font-bold mb-4 text-indigo-900">
        Événements Culture en Mouvements
      </h1>
      
      <p className="text-sm text-gray-600 mb-6">
        Récupération des événements du site officiel (Haute-Garonne).
      </p>

      {/* Barre de recherche et filtres */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Rechercher par titre, lieu, date..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
        />
        <div className="flex gap-2">
          <Button onClick={() => setViewMode("card")} variant={viewMode === "card" ? "default" : "secondary"}>
            📺 Cartes
          </Button>
          <Button onClick={() => setViewMode("list")} variant={viewMode === "list" ? "default" : "secondary"}>
            📋 Liste
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <p className="font-semibold text-sm text-gray-600">
          {filteredEvents.length} événement{filteredEvents.length > 1 ? "s" : ""} affiché{filteredEvents.length > 1 ? "s" : ""}
        </p>
        <Button onClick={fetchEvents} disabled={loading}>
          {loading ? "Chargement..." : "📡 Actualiser"}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* 🔴 MODE CARTES */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(ev => (
            <div key={ev.id} className="bg-white shadow rounded overflow-hidden flex flex-col h-[520px] border border-gray-100">
              <div className="h-40 overflow-hidden">
                <img 
                  src={ev.image.startsWith('/') ? `https://www.cultureenmouvements.org${ev.image}` : ev.image} 
                  alt={ev.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { 
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/94A3B8/FFFFFF?text=Culture+en+Mouvements'; 
                  }}
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                   📍 {ev.location || "Lieu non spécifié"}
                </p>
                <h2 className="text-lg font-semibold mb-1 leading-tight line-clamp-2">{ev.title}</h2>
                {ev.start && <p className="text-sm text-blue-600 font-semibold mb-1">{new Date(ev.start).toLocaleDateString('fr-FR', dateFormatOptions)}</p>}
                
                {/* Description vide ou placeholder pour maintenir la structure */}
                <div className="text-sm text-muted-foreground mb-4 flex-1 overflow-hidden italic mt-2">
                   Culture en Mouvements : Événement culturel en Haute-Garonne.
                </div>

                <div className="mt-auto space-y-3">
                  {ev.link && (
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 transition-all shadow-sm">
                      <a href={ev.link} target="_blank" rel="noopener noreferrer">🔗 VOIR LES DÉTAILS</a>
                    </Button>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Source : {ev.source}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🟨 MODE LISTE */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {filteredEvents.map(ev => (
            <div key={ev.id} className="flex flex-col sm:flex-row gap-6 p-4 border rounded-xl bg-white shadow-sm items-center">
              <img 
                src={ev.image.startsWith('/') ? `https://www.cultureenmouvements.org${ev.image}` : ev.image} 
                alt={ev.title}
                className="w-full sm:w-32 h-32 object-cover rounded-lg"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/94A3B8/FFFFFF?text=Culture'; }}
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800 leading-tight">{ev.title}</h2>
                {ev.start && <p className="text-sm text-blue-600 font-semibold">{new Date(ev.start).toLocaleDateString('fr-FR', dateFormatOptions)}</p>}
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1 italic">📍 {ev.location}</p>
                
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  {ev.link && (
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 h-9">
                      <a href={ev.link} target="_blank" rel="noopener noreferrer">Voir les détails →</a>
                    </Button>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Source : {ev.source}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
