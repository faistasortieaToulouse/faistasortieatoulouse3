'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* ------------------------------------------------------------------
   Image automatique selon titre : ciné / conf / expo / default
------------------------------------------------------------------- */
const getEventImage = (title: string | undefined) => {
  if (!title) return "/images/ut3/ut3default.jpg";
  const lower = title.toLowerCase();
  if (lower.includes("ciné") || lower.includes("cine")) return "/images/ut3/ut3cine.jpg";
  if (lower.includes("conf")) return "/images/ut3/ut3conf.jpg";
  if (lower.includes("expo")) return "/images/ut3/ut3expo.jpg";
  return "/images/ut3/ut3default.jpg";
};

export default function UT3MinPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  /* --------------------- Récupération des événements --------------------- */
  async function fetchEvents() {
    setLoading(true);
    setError(null);
    setEvents([]);

    try {
      const res = await fetch("/api/ut3-min");
      if (!res.ok) throw new Error(`API HTTP error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setEvents(data);
      setFilteredEvents(data);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  /* --------------------- Filtrage texte multi-champs --------------------- */
  useEffect(() => {
    if (!searchQuery) {
      setFilteredEvents(events);
      return;
    }

    const q = searchQuery.toLowerCase();

    setFilteredEvents(
      events.filter(ev =>
        ev.title.toLowerCase().includes(q) ||
        (ev.description?.toLowerCase().includes(q) ?? false) ||
        (ev.location?.toLowerCase().includes(q) ?? false) ||
        (ev.start?.toLowerCase().includes(q) ?? false)
      )
    );
  }, [searchQuery, events]);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">

      <nav className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Retour à l'accueil
        </Link>
      </nav>
      
      <h1 className="text-3xl font-bold mb-4">Événements UT3 – Ciné, Conf & Expo</h1>
      <p className="text-muted-foreground mb-6">
        Événements filtrés depuis le flux officiel de l’Université Toulouse III.
      </p>

      {/* Boutons + Recherche */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <Button onClick={fetchEvents} disabled={loading}>
          {loading ? "Chargement..." : "📡 Actualiser"}
        </Button>
        <div className="flex gap-2">
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

        <input
          type="text"
          placeholder="Rechercher par titre, description, lieu ou date..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[300px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {/* Compteur */}
      <p className="mb-4 text-sm text-gray-600 font-medium">
        {filteredEvents.length} événement(s) affiché(s)
      </p>

      {/* Erreur */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-400 rounded mb-6">
          {error}
        </div>
      )}

      {/* Aucun résultat */}
      {filteredEvents.length === 0 && !loading && (
        <p className="text-muted-foreground italic py-10 text-center bg-gray-50 rounded-lg">Aucun événement trouvé.</p>
      )}

      {/* --------------------------------------------------------------------
          MODE CARTE (grand format)
      --------------------------------------------------------------------- */}
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev, idx) => (
            <div key={ev.id || idx} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-[520px] border border-gray-100">
              
              {/* Image */}
              <img
                src={getEventImage(ev.title)}
                alt={ev.title}
                className="w-full h-44 object-cover"
              />

              <div className="p-4 flex flex-col flex-1">

                {/* Titre */}
                <h2 className="text-lg font-bold mb-2 line-clamp-2 min-h-[3.5rem]">{ev.title}</h2>

                {/* Dates */}
                {ev.start && (
                  <p className="text-sm text-blue-600 font-semibold mb-1">
                    🗓️ {new Date(ev.start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}

                {/* Lieu */}
                {ev.location && (
                  <p className="text-sm text-muted-foreground mb-3 truncate">
                    📍 {ev.location}
                  </p>
                )}

                {/* Description scrollable */}
                {ev.description && (
                  <div className="text-sm text-muted-foreground overflow-y-auto flex-1 mb-4 pr-1 leading-relaxed">
                    {ev.description}
                  </div>
                )}

                {/* Bouton Bleu */}
                {ev.url && (
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white text-center py-2.5 rounded hover:bg-blue-700 transition-colors font-bold text-sm shadow-sm"
                  >
                    🔗 Voir l’événement officiel
                  </a>
                )}

                {/* Source */}
                <p className="text-[10px] text-muted-foreground mt-3 uppercase tracking-wider">
                  Source : {ev.source || "Université Paul Sabatier"}
                </p>
              </div>
            </div>
          ))}
        </div>

      /* --------------------------------------------------------------------
          MODE LISTE (vignettes)
      --------------------------------------------------------------------- */
      ) : (
        <div className="flex flex-col gap-4">
          {filteredEvents.map((ev, idx) => (
            <div key={ev.id || idx} className="flex flex-col sm:flex-row bg-white shadow rounded-lg p-4 gap-4 items-center sm:items-start border border-gray-50">

              {/* Image */}
              <img
                src={getEventImage(ev.title)}
                alt={ev.title}
                className="w-full sm:w-40 h-32 object-cover rounded shadow-sm"
              />

              <div className="flex-1 w-full">
                <h2 className="text-lg font-bold mb-1">{ev.title}</h2>

                {ev.start && (
                  <p className="text-sm text-blue-600 font-semibold mb-1">
                    {new Date(ev.start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}

                {ev.location && (
                  <p className="text-sm text-muted-foreground mb-1">📍 {ev.location}</p>
                )}

                {ev.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {ev.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                    {ev.url && (
                    <a
                        href={ev.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold text-sm"
                    >
                        Voir →
                    </a>
                    )}
                    <p className="text-[10px] text-muted-foreground italic">
                        Source : {ev.source || "UT3"}
                    </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
