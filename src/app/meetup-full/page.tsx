"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/400x200?text=Événement+Meetup";

type MeetupEvent = {
  title: string;
  link: string;
  startDate: Date;
  location: string;
  description: string;
  dateFormatted: string;
  fullAddress: string;
  image?: string;
};

export default function MeetupFullPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<MeetupEvent[]>([]);

  // Recherche
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<MeetupEvent[]>([]);

  // Vue (plein écran / liste)
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  async function fetchAllEvents() {
    setLoading(true);
    setError(null);

    try {
      const endpoints = [
        "/api/meetup-events",
        "/api/meetup-expats",
        "/api/meetup-coloc",
        "/api/meetup-sorties",
      ];

      const responses = await Promise.all(
        endpoints.map((ep) => fetch(ep).then((res) => res.json()))
      );

      const all = responses.flatMap((r) => r.events || []);

      // 🔥 Suppression des doublons
      const unique = new Map();
      all.forEach((ev: any) => {
        const key = `${ev.title}-${ev.startDate}`;
        if (!unique.has(key)) unique.set(key, ev);
      });

      const cleanEvents = Array.from(unique.values()).map((ev: any) => {
        const date = ev.startDate ? new Date(ev.startDate) : null;

        return {
          title: ev.title,
          link: ev.link,
          startDate: date,
          dateFormatted: date
            ? date.toLocaleString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Date inconnue",
          description: ev.description,
          fullAddress: ev.fullAddress || ev.location,
          image: ev.coverImage || PLACEHOLDER_IMAGE,
        };
      });

      // Trie chronologique
      cleanEvents.sort(
        (a: any, b: any) => a.startDate.getTime() - b.startDate.getTime()
      );

      setEvents(cleanEvents);
      setFilteredEvents(cleanEvents);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  }

  // Chargement initial
  useEffect(() => {
    fetchAllEvents();
  }, []);

  // 🔎 Filtrage des évènements
  useEffect(() => {
    if (!search.trim()) {
      setFilteredEvents(events);
      return;
    }

    const query = search.toLowerCase();

    const result = events.filter((ev) => {
      const text = `${ev.title} ${ev.description} ${ev.fullAddress}`.toLowerCase();
      const dateText = ev.dateFormatted.toLowerCase();
      return text.includes(query) || dateText.includes(query);
    });

    setFilteredEvents(result);
  }, [search, events]);

  return (
    <div className="container mx-auto py-10 px-4">

      <nav className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Retour à l'accueil
        </Link>
      </nav>

      <h1 className="text-3xl font-bold mb-2">
        Tous les événements Meetup Toulouse
      </h1>

      <p className="text-muted-foreground mb-6">
        Fusion des groupes Meetup de loisirs — {filteredEvents.length} évènement(s)
      </p>

      {/* 🔍 Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un évènement (titre, lieu, description, date...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* 🔄 Bouton refresh */}
      <Button
        onClick={fetchAllEvents}
        disabled={loading}
        className="mb-6 bg-red-600 hover:bg-red-700"
      >
        {loading ? "Chargement..." : "🔄 Rafraîchir les événements"}
      </Button>

      {/* 🟦 Choix du mode d’affichage */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewMode("card")}
          className={`px-4 py-2 rounded transition ${
            viewMode === "card"
              ? "bg-red-600 text-white shadow"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          🗂️ Plein écran
        </button>

        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 rounded transition ${
            viewMode === "list"
              ? "bg-red-600 text-white shadow"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          📋 Vignette
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 border border-red-500 bg-red-50 text-red-700 rounded">
          Erreur : {error}
        </div>
      )}

      {/* 🟥 MODE PLEIN ÉCRAN */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev, index) => (
            <div
              key={ev.link || index}
              className="bg-white rounded-xl shadow overflow-hidden border"
            >
              <img
                src={ev.image}
                alt={ev.title}
                className="w-full aspect-[16/9] object-cover"
              />

              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-xl font-semibold text-red-700 mb-2">
                  {ev.title}
                </h2>

                <p className="font-medium text-sm mb-1">📍 {ev.fullAddress}</p>
                <p className="text-gray-600 text-sm mb-3">
                  {ev.dateFormatted}
                </p>

                <p className="text-sm mb-3 line-clamp-4 whitespace-pre-wrap">
                  {ev.description}
                </p>

                <a
                  href={ev.link}
                  target="_blank"
                  className="bg-red-600 text-white py-2 px-3 rounded text-center hover:bg-red-700"
                >
                  🔗 Voir l’événement
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🟨 MODE LISTE */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {filteredEvents.map((ev, index) => (
            <div
              key={ev.link || index}
              className="flex items-start gap-4 p-3 border rounded-lg bg-white shadow-sm"
            >
              <img
                src={ev.image}
                className="w-24 h-24 rounded object-cover flex-shrink-0"
                alt={ev.title}
              />

              <div className="flex flex-col flex-1">
                <h2 className="text-lg font-semibold text-red-700 line-clamp-2">
                  {ev.title}
                </h2>

                <p className="text-sm font-medium">📍 {ev.fullAddress}</p>
                <p className="text-sm text-gray-600">{ev.dateFormatted}</p>

                <a
                  href={ev.link}
                  target="_blank"
                  className="mt-2 text-red-600 underline"
                >
                  Voir →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredEvents.length === 0 && (
        <p className="mt-6 text-xl text-gray-500 text-center p-8 border border-dashed rounded">
          Aucun événement trouvé.
        </p>
      )}
    </div>
  );
}
