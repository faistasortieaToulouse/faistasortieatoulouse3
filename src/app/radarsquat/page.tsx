'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type EventItem = {
    id: string;
    source: string;
    title: string;
    description: string | null;
    location: string | null;
    link: string | null;
    start: string | null;
    date?: string | null; // Ajouté pour compatibilité agrégateur
    end: string | null;
    image: string | null;
    categories?: string[];
};

export default function RadarSquatPage() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [includePast, setIncludePast] = useState(false);
    const [viewMode, setViewMode] = useState<"card" | "list">("card");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // On appelle l'API (assurez-vous que l'URL est correcte selon votre config)
            const apiUrl = includePast ? "/api/radarsquat?past=true" : "/api/radarsquat";
            const res = await fetch(apiUrl, { cache: "no-store" });
            
            if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
            
            const data = await res.json();
            
            // CORRECTION CRUCIALE : Gestion du format Objet (agrégateur) ou Tableau (API seule)
            let rawEvents = Array.isArray(data) ? data : (data.events || []);
            
            // On s'assure que ce sont bien les événements Radar Squat si on passe par l'agrégateur
            if (!Array.isArray(data) && data.events) {
                rawEvents = rawEvents.filter((ev: EventItem) => ev.source.includes("Radar Squat"));
            }

            setEvents(rawEvents);
            setFilteredEvents(rawEvents);
        } catch (err: any) {
            setError(err.message || "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    }, [includePast]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Filtrage multi-critères
    useEffect(() => {
        const q = searchQuery.toLowerCase();
        const filtered = events.filter(ev => {
            if (!searchQuery) return true;
            return (
                (ev.title?.toLowerCase().includes(q) ?? false) ||
                (ev.description?.toLowerCase().includes(q) ?? false) ||
                (ev.location?.toLowerCase().includes(q) ?? false) ||
                (ev.categories?.some(cat => cat.toLowerCase().includes(q)) ?? false)
            );
        });
        
        // Tri par date (du plus proche au plus lointain)
        filtered.sort((a, b) => {
            const dateA = new Date(a.date || a.start || 0).getTime();
            const dateB = new Date(b.date || b.start || 0).getTime();
            return dateA - dateB;
        });

        setFilteredEvents(filtered);
    }, [searchQuery, events]);

    const togglePastEvents = () => setIncludePast(prev => !prev);

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">

      <nav className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Retour à l'accueil
        </Link>
      </nav>

            <h1 className="text-3xl font-bold mb-4">🏴‍☠️ Événements Radar Squat Toulouse</h1>
            <p className="text-muted-foreground mb-6">
                Lieux alternatifs, cantines populaires et concerts en autogestion.
            </p>

            {/* Barre de recherche */}
            <input
                type="text"
                placeholder="Rechercher une cantine, un concert, un lieu..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full mb-6 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {/* BOUTONS D'ACTION */}
            <div className="flex flex-wrap gap-3 mb-6">
                <Button onClick={fetchEvents} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    {loading ? "Chargement..." : "📡 Actualiser"}
                </Button>
                <Button onClick={togglePastEvents} disabled={loading} variant={includePast ? "destructive" : "outline"}>
                    {includePast ? "🔴 Cacher le passé" : "🟢 Inclure le passé"}
                </Button>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
                    <Button size="sm" variant={viewMode === "card" ? "default" : "ghost"} onClick={() => setViewMode("card")}>📺 Carte</Button>
                    <Button size="sm" variant={viewMode === "list" ? "default" : "ghost"} onClick={() => setViewMode("list")}>🔲 Liste</Button>
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg mb-6">{error}</div>}
            
            <p className="mb-4 text-sm font-semibold text-gray-600">
                {filteredEvents.length} événement(s) trouvé(s)
            </p>

            {/* MODE CARTE */}
            {viewMode === "card" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(ev => (
                        <div key={ev.id} className="bg-white shadow-md border border-gray-100 rounded-xl overflow-hidden flex flex-col h-[500px]">
                            <div className="relative w-full h-44 bg-gray-100">
                                <img 
                                    src={ev.image || "/images/radarsquat/default.jpg"} 
                                    alt={ev.title} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h2 className="text-lg font-bold mb-2 line-clamp-2">{ev.title}</h2>
                                
                                {ev.end && new Date(ev.end) < new Date() && (
                                    <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded w-fit mb-2">TERMINÉ</span>
                                )}

                                <p className="text-sm text-blue-600 font-bold mb-1">
                                    🗓️ {new Date(ev.date || ev.start || "").toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                </p>
                                
                                {ev.location && <p className="text-sm text-gray-500 mb-2 truncate">📍 {ev.location}</p>}
                                
                                <div className="text-sm text-gray-600 flex-1 overflow-y-auto mb-4 pr-1 scrollable">
                                    {ev.description}
                                </div>

                                {ev.link && (
                                    <a href={ev.link} target="_blank" rel="noopener noreferrer" 
                                       className="w-full bg-blue-600 text-white text-center py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm">
                                        🔗 Voir l'événement
                                    </a>
                                )}
                                <p className="text-[10px] text-gray-400 mt-3 uppercase tracking-tighter">Source : {ev.source}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* MODE LISTE */
                <div className="flex flex-col gap-4">
                    {filteredEvents.map(ev => (
                        <div key={ev.id} className="flex flex-col sm:flex-row bg-white border rounded-xl p-4 gap-4 items-center shadow-sm">
                            <img 
                                src={ev.image || "/images/radarsquat/default.jpg"} 
                                alt="" 
                                className="w-full sm:w-32 h-24 object-cover rounded-lg" 
                            />
                            <div className="flex-1 w-full text-center sm:text-left">
                                <h2 className="text-lg font-bold">{ev.title}</h2>
                                <p className="text-sm text-blue-600 font-bold">
                                    {new Date(ev.date || ev.start || "").toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit' })}
                                </p>
                                <p className="text-xs text-gray-500 italic mb-2">{ev.location}</p>
                                {ev.link && (
                                    <a href={ev.link} target="_blank" className="text-blue-600 font-bold text-sm underline">
                                        Plus d'infos →
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredEvents.length === 0 && !loading && (
                <div className="py-20 text-center border-2 border-dashed rounded-xl bg-gray-50">
                    <p className="text-gray-400">Aucun événement ne correspond à votre recherche.</p>
                </div>
            )}
        </div>
    );
}
