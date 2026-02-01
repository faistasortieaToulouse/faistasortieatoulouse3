// src/app/api/agendatoulousain/route.ts
import { NextRequest, NextResponse } from "next/server";
import { decode } from "he";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

// --- UTILS ---

const getBaseUrl = (req: NextRequest) => {
  const host = req.headers.get("host") || "localhost:9001";
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
};

const getCapitoleImage = (title?: string) => {
  if (!title) return "/images/capitole/capidefaut.jpg";
  const lower = title.toLowerCase();
  if (lower.includes("ciné") || lower.includes("cine")) return "/images/capitole/capicine.jpg";
  if (lower.includes("conf")) return "/images/capitole/capiconf.jpg";
  if (lower.includes("expo")) return "/images/capitole/capiexpo.jpg";
  return "/images/capitole/capidefaut.jpg";
};

const defaultComdtImages: Record<string, string> = {
  "Stages": "/images/comdt/catecomdtstage.jpg",
  "Stages de danse": "/images/comdt/catecomdtdanse.jpg",
  "Stages de musique": "/images/comdt/catecomdtmusique.jpg",
  "Saison du COMDT": "/images/comdt/catecomdtcomdt.jpg",
  "Evénements partenaires": "/images/comdt/catecomdtpartenaire.jpg",
};

function normalizeApiResult(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.events && Array.isArray(data.events)) return data.events;
  if (data.items && Array.isArray(data.items)) return data.items;
  if (data.records && Array.isArray(data.records)) return data.records;
  return [];
}

// --- PARSERS ---

function parseICS(text: string) {
  const events: any[] = [];
  const blocks = text.split("BEGIN:VEVENT").slice(1);
  for (const block of blocks) {
    const get = (key: string) => {
      const m = block.match(new RegExp(`${key}[^:]*:(.+)`));
      return m ? m[1].trim() : "";
    };
    const dt = get("DTSTART");
    if (!dt) continue;
    let date = new Date(dt.replace(/^(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
    if (isNaN(date.getTime())) continue;

    let image = get("ATTACH");
    if (!image) {
      const cats = get("CATEGORIES").split(",");
      image = defaultComdtImages[cats[0].trim()] || "/images/comdt/catecomdtcomdt.jpg";
    }

    events.push({
      id: get("UID"),
      title: get("SUMMARY"),
      description: get("DESCRIPTION").replace(/\\n/g, "\n"),
      link: get("URL"),
      location: get("LOCATION"),
      date: date.toISOString(),
      source: "COMDT",
      image
    });
  }
  return events;
}

// --- MAIN ROUTE ---

export async function GET(request: NextRequest) {
  const origin = getBaseUrl(request);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 31);

  const SOURCES = [
    { url: `${origin}/api/agenda-trad-haute-garonne`, name: "Agenda Trad" },
    { url: `${origin}/api/agendaculturel`, name: "Agenda Culturel" },
    { url: `${origin}/api/capitole-min`, name: "UT Capitole" },
    { url: `${origin}/api/cinematoulouse`, name: "Cinéma" },
    { url: "https://www.comdt.org/events/feed/?ical=1", name: "COMDT" },
    { url: `${origin}/api/cultureenmouvements`, name: "Culture Mvts" },
    { url: `${origin}/api/demosphere`, name: "Demosphere" },
    { url: `${origin}/api/ecluse`, name: "L'Écluse" },
    { url: `${origin}/api/hautegaronne`, name: "Haute-Garonne" },
    { url: `${origin}/api/radarsquat`, name: "Radar Squat Toulouse" },
  ];

  const results = await Promise.all(
    SOURCES.map(async (src) => {
      try {
        const fetchOptions = { cache: "no-store" as const };
        
        // Cas spécial COMDT (ICS externe)
        if (src.name === "COMDT") {
          const res = await fetch(src.url, fetchOptions);
          return parseICS(await res.text());
        }

        const res = await fetch(src.url, fetchOptions);
        if (!res.ok) return [];
        const data = await res.json();
        const items = normalizeApiResult(data);

        return items.map((ev: any) => {
          // Normalisation des dates (RadarSquat utilise 'start', les autres 'date')
          const rawDate = ev.date || ev.start || ev.release_date;
          const d = new Date(rawDate);
          
          if (isNaN(d.getTime()) || d < today || d > maxDate) return null;

          // Nettoyage description
          let desc = ev.description ? decode(ev.description) : "";
          desc = desc.replace(/<[^>]*>/g, "").trim();

          return {
            ...ev,
            id: ev.id || `${src.name}-${ev.title}-${rawDate}`,
            title: ev.title || "Événement sans titre",
            description: desc,
            date: d.toISOString(),
            source: src.name, // On force le nom défini dans SOURCES
            location: ev.location || ev.fullAddress || "Toulouse",
            link: ev.link || ev.url,
            image: ev.image || (src.name === "UT Capitole" ? getCapitoleImage(ev.title) : ev.image)
          };
        }).filter(Boolean);
      } catch (e) {
        console.error(`Error fetching ${src.name}:`, e);
        return [];
      }
    })
  );

  const flatEvents = results.flat();
  
  // Dédoublonnage
  const unique = Array.from(new Map(flatEvents.map(ev => [ev.id, ev])).values());
  
  // Tri chronologique
  const sorted = unique.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return NextResponse.json({
    total: sorted.length,
    events: sorted,
    lastUpdated: new Date().toISOString()
  });
}