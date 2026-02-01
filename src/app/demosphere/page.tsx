'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DemospherePage() {
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
      const res = await fetch("/api/demosphere");
      if (!res.ok) throw new Error(`Erreur API : ${res.status}`);

      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Réponse invalide du serveur.");
      }

      // --- LOGIQUE DE FILTRAGE DATE (Today + 31 jours) ---
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 31);
      maxDate.setHours(23, 59, 59, 999);

      const upComingEvents = data.filter((ev: any) => {
        const eventDate = new Date(ev.start);
        return eventDate >= today && eventDate <= maxDate;
      }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

      setEvents(upComingEvents);
      setFilteredEvents(upComingEvents);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filtrage dynamique par recherche
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
      (ev.start?.toString().toLowerCase().includes(query) ?? false)
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
      
      <h1 className="text-3xl font-bold mb-2 text-indigo-900">Événements Demosphere Toulouse</h1>
      <p className="text-sm text-gray-600 mb-6">
        {filteredEvents.length} événement{filteredEvents.length > 1 ? "s" : ""} à venir (31 prochains jours)
      </p>

      {/* Barre de recherche et filtres */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Rechercher par titre, lieu..."
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
        <p className="font-semibold text-sm text-gray-600">Résultats : {filteredEvents.length}</p>
        <Button onClick={fetchEvents} disabled={loading}>
          {loading ? "Chargement..." : "📡 Actualiser"}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border rounded-lg mb-6 text-sm italic">
          Erreur: {error}
        </div>
      )}

      {/* 🔴 MODE CARTES */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(ev => (
            <div key={ev.id} className="bg-white shadow rounded overflow-hidden flex flex-col h-[520px] border border-gray-100">
              <div className="relative w-full h-40 bg-gray-50 flex items-center justify-center overflow-hidden border-b">
                <Image
                  src="/logo/demosphereoriginal.png"
                  alt="Logo Demosphere"
                  fill
                  className="object-contain p-4 opacity-80"
                />
              </div>

              <div className="p-4 flex flex-col flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                   📍 {ev.location || "Lieu non spécifié"}
                </p>
                <h2 className="text-lg font-semibold mb-1 leading-tight line-clamp-2">{ev.title}</h2>
                <p className="text-sm text-blue-600 font-semibold mb-2">
                  {new Date(ev.start).toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </p>
                
                {ev.description && (
                  <div className="text-sm text-muted-foreground overflow-y-auto h-24 mb-4 pr-1 text-justify leading-relaxed">
                    {ev.description}
                  </div>
                )}

                <div className="mt-auto space-y-3">
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 shadow-sm">
                    <a href={ev.url} target="_blank" rel="noopener noreferrer">🔗 PLUS D'INFOS</a>
                  </Button>
                  <p className="text-xs text-muted-foreground">Source : {ev.source}</p>
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
              <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <Image
                  src="/logo/demosphereoriginal.png"
                  alt="Logo Demosphere"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800 leading-tight">{ev.title}</h2>
                <p className="text-sm text-blue-600 font-semibold">
                  {new Date(ev.start).toLocaleString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">📍 {ev.location}</p>
                
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 h-9">
                    <a href={ev.url} target="_blank" rel="noopener noreferrer">Plus d'infos →</a>
                  </Button>
                  <span className="text-xs text-muted-foreground">Source : {ev.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
