"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x200?text=Événement";

const getCapitoleImage = (title?: string) => {
  if (!title) return "/images/capitole/capidefaut.jpg";
  const lower = title.toLowerCase();
  if (lower.includes("ciné") || lower.includes("cine")) return "/images/capitole/capicine.jpg";
  if (lower.includes("conf")) return "/images/capitole/capiconf.jpg";
  if (lower.includes("expo")) return "/images/capitole/capiexpo.jpg";
  return "/images/capitole/capidefaut.jpg";
};

type UnifiedEvent = {
  id?: string;
  title: string;
  description?: string;
  start?: string;
  date?: string;
  startDate?: string;
  url?: string;
  link?: string;
  fullAddress?: string;
  location?: string;
  image?: string;
  category?: string;
  source?: string;
  dateFormatted?: string;
};

export default function AgendaToulousainPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<UnifiedEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<UnifiedEvent[]>([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  function getCategory(event: UnifiedEvent) {
    if (event.category) return event.category;
    const t = (event.title + " " + (event.description || "")).toLowerCase();
    if (t.includes("concert")) return "Concert";
    if (t.includes("théâtre") || t.includes("theatre")) return "Théâtre";
    if (t.includes("exposition")) return "Exposition";
    if (t.includes("festival")) return "Festival";
    if (t.includes("conférence")) return "Conférence";
    return "Autre";
  }

  async function fetchAgenda() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agendatoulousain");
      if (!res.ok) throw new Error(`Erreur ${res.status}`);

      const data = await res.json();
      const evts: UnifiedEvent[] = Array.isArray(data.events) ? data.events : [];

      const normalized = evts.map((ev) => {
        const rawDate = ev.date || ev.start || ev.startDate;
        const dateObj = rawDate ? new Date(rawDate) : null;

        let image = ev.image || PLACEHOLDER_IMAGE;
        if (!ev.image && ev.source?.toLowerCase().includes("capitole")) {
          image = getCapitoleImage(ev.title);
        }

        return {
          ...ev,
          dateFormatted:
            dateObj && !isNaN(dateObj.getTime())
              ? dateObj.toLocaleString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Date inconnue",
          image,
          link: ev.link || ev.url || "#",
          fullAddress: ev.fullAddress || ev.location || "Lieu non précisé",
        };
      });

      normalized.sort((a, b) => {
        const da = new Date(a.date || a.start || 0).getTime();
        const db = new Date(b.date || b.start || 0).getTime();
        return da - db;
      });

      setEvents(normalized);
      setFilteredEvents(normalized);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAgenda();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase().trim();
    if (!query) {
      setFilteredEvents(events);
      return;
    }

    setFilteredEvents(
      events.filter((ev) => {
        const combined = `${ev.title} ${ev.description || ""} ${ev.fullAddress || ""} ${ev.source || ""} ${getCategory(ev)}`.toLowerCase();
        return combined.includes(query);
      })
    );
  }, [search, events]);

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">

      <nav className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Retour à l'accueil
        </Link>
      </nav>
      
      <h1 className="text-3xl font-bold mb-4">Agenda Toulousain – Multi-sources</h1>

      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par titre, lieu, date, catégorie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Compteur */}
      <p className="text-muted-foreground mb-4">
        {filteredEvents.length} événement(s) trouvé(s)
      </p>

      {/* Contrôles de vue et Actions */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
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
        
        <Button onClick={fetchAgenda} disabled={loading} variant="outline">
          {loading ? "Chargement..." : "📡 Recharger les événements"}
        </Button>
      </div>

      {error && (
        <div className="mt-6 p-4 border border-red-500 bg-red-50 text-red-700 rounded">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      {/* Mode plein écran (Grille de cartes) */}
      {viewMode === "card" && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, i) => (
            <div
              key={event.id || i}
              className="bg-white rounded-xl shadow-md overflow-hidden border flex flex-col h-[520px] hover:shadow-lg transition-shadow"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 sm:h-56 md:h-60 object-cover bg-gray-100"
              />

              <div className="p-4 flex flex-col flex-1 min-h-0">
                <div className="text-xl font-bold mb-2 line-clamp-2 overflow-y-auto max-h-14 text-gray-900">
                  {event.title}
                </div>

                <div className="text-sm text-muted-foreground mb-2 flex-1 overflow-y-auto max-h-24 italic">
                  {event.description}
                </div>

                <div className="mt-auto space-y-1">
                  <p className="text-sm font-bold text-blue-600">📅 {event.dateFormatted}</p>
                  <p className="text-sm text-gray-600 line-clamp-1">📍 {event.fullAddress}</p>
                  
                  <div className="flex items-center gap-2 py-2">
                     <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-gray-100 rounded text-gray-600 border">
                        {event.source}
                     </span>
                     <span className="text-[10px] text-muted-foreground italic">
                        Catégorie : {getCategory(event)}
                     </span>
                  </div>

                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2 bg-zinc-900 text-white text-center rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors"
                  >
                    Voir les détails
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mode vignette (Liste compacte) */}
      {viewMode === "list" && filteredEvents.length > 0 && (
        <div className="space-y-4">
          {filteredEvents.map((event, i) => (
            <div
              key={event.id || i}
              className="flex items-start gap-4 p-3 border rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded object-cover flex-shrink-0 bg-gray-100"
              />

              <div className="flex flex-col flex-1 min-w-0">
                <div className="text-lg font-bold text-blue-700 line-clamp-1">
                  {event.title}
                </div>

                <div className="text-sm text-muted-foreground line-clamp-2 mb-1">
                  {event.description}
                </div>

                <p className="text-sm font-medium">{event.dateFormatted}</p>
                
                <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-muted-foreground italic">
                        {event.fullAddress} • {getCategory(event)}
                    </p>
                    <span className="text-[10px] font-mono text-gray-400 font-bold px-1">{event.source}</span>
                </div>

                <a
                  href={event.link}
                  target="_blank"
                  className="mt-1 text-sm font-semibold text-zinc-900 underline underline-offset-4"
                >
                  Voir l'événement →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredEvents.length === 0 && !error && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed mt-6">
          <p className="text-gray-500 text-lg">
            Aucun événement ne correspond à votre recherche.
          </p>
          <Button variant="link" onClick={() => setSearch("")} className="mt-2 text-blue-600">
            Effacer la recherche
          </Button>
        </div>
      )}
    </div>
  );
}
