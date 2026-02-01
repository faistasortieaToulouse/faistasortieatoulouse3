// src/app/api/demosphere/route.ts
import { NextResponse } from "next/server";
import ICAL from "ical.js";

interface DemosphereEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location: string | null;
  description: string | null;
  source: string;
  url: string;
}

export async function GET() {
  const url = "https://toulouse.demosphere.net/events.ics";

  try {
    // --- Récupérer le fichier ICS depuis Demosphere ---
    const res = await fetch(url);
    if (!res.ok) {
      console.error("❌ Demosphere HTTP error:", res.status, res.statusText);
      return NextResponse.json([]);
    }

    const icsText = await res.text();

    // --- Parser le ICS avec ical.js ---
    const jcalData = ICAL.parse(icsText);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");

    const now = new Date();

    // --- Transformer en événements structurés ---
    const events: DemosphereEvent[] = vevents
      .map(ev => {
        const e = new ICAL.Event(ev);
        return {
          id: e.uid || e.summary || String(Math.random()),
          title: e.summary || "Événement sans titre",
          start: e.startDate.toJSDate(),
          end: e.endDate.toJSDate(),
          location: e.location || null,
          description: e.description || null,
          source: "Demosphere (iCal)",
          url: e.url || `https://toulouse.demosphere.net/rv/${e.uid || ""}`,
        };
      })
      .filter(ev => ev.start >= now) // uniquement événements futurs
      .sort((a, b) => a.start.getTime() - b.start.getTime()); // tri chronologique

    return NextResponse.json(events);
  } catch (err: any) {
    console.error("❌ Demosphere parse error:", err.message);
    return NextResponse.json([]);
  }
}
