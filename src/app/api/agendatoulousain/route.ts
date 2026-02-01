import { NextRequest, NextResponse } from "next/server";
import { decode } from "he";

// --- UTILS CAPITOLE ---
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

// --- NORMALISATION GÉNÉRIQUE ---
function normalizeApiResult(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.events)) return data.events;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.records)) return data.records;
  const firstArray = Object.values(data).find(v => Array.isArray(v));
  return Array.isArray(firstArray) ? firstArray : [];
}

// --- NORMALISATION CINÉMA ---
function normalizeCinema(data: any): any[] {
  if (!data?.results) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return data.results
    .filter((film: any) => {
      if (!film.release_date) return false;
      const d = new Date(film.release_date);
      return !isNaN(d.getTime()) && d >= today;
    })
    .map((film: any) => ({
      id: `tmdb-${film.id}`,
      title: film.title,
      date: film.release_date,
      description: film.overview || "Sortie cinéma",
      image: film.poster_path
        ? `https://image.tmdb.org/t/p/w500${film.poster_path}`
        : "/images/cinema-default.jpg",
      source: "Sorties cinéma",
      link: `https://www.themoviedb.org/movie/${film.id}?language=fr-FR`,
    }));
}

// --- PARSE ICS (COMDT) ---
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
    let date: Date | null = null;
    if (/^\d{8}$/.test(dt)) {
      date = new Date(`${dt.slice(0, 4)}-${dt.slice(4, 6)}-${dt.slice(6, 8)}T00:00:00`);
    } else {
      const d = new Date(dt);
      if (!isNaN(d.getTime())) date = d;
    }
    if (!date) continue;

    let image = get("ATTACH");
    if (!image) {
      const categories = get("CATEGORIES").split(",").map(c => c.trim());
      for (const cat of categories) {
        if (defaultComdtImages[cat]) { image = defaultComdtImages[cat]; break; }
      }
    }
    events.push({
      id: get("UID"),
      title: get("SUMMARY"),
      description: get("DESCRIPTION").replace(/\\n/g, "\n"),
      link: get("URL"),
      location: get("LOCATION"),
      date: date.toISOString(),
      source: "COMDT",
      image,
    });
  }
  return events;
}

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 31);
    maxDate.setHours(23, 59, 59, 999);

    const EXTERNAL_SOURCES = [
      { url: `${origin}/api/agenda-trad-haute-garonne`, source: "Agenda Trad Haute-Garonne" },
      { url: `${origin}/api/agendaculturel`, source: "Agenda Culturel" },
      { url: `${origin}/api/capitole-min`, source: "Université Toulouse Capitole" },
      { url: `${origin}/api/cinematoulouse`, source: "Sorties cinéma" },
      { url: `${origin}/api/comdt`, source: "COMDT" },
      { url: `${origin}/api/cultureenmouvements`, source: "Culture en Mouvements" },
      { url: `${origin}/api/demosphere`, source: "Demosphere" },
      { url: `${origin}/api/discord`, source: "Discord" },
      { url: `${origin}/api/ecluse`, source: "L'Écluse" },
      { url: `${origin}/api/hautegaronne`, source: "Culture Haute-Garonne" },
      { url: `${origin}/api/radarsquat`, source: "Radar Squat" },
      { url: `${origin}/api/theatredupave`, source: "Théâtre du Pavé" },
      { url: `${origin}/api/toulousemetropole`, source: "Toulouse Métropole" },
      { url: `${origin}/api/tourismehautegaronne`, source: "Tourisme Haute-Garonne" },
      { url: `${origin}/api/ut3-min`, source: "Université Toulouse III - Paul Sabatier" }, // 🆕 Ajout UT3
    ];

    const results = await Promise.all(
      EXTERNAL_SOURCES.map(async ({ url, source }) => {
        try {
          if (source === "COMDT") {
            const res = await fetch("https://www.comdt.org/events/feed/?ical=1", {
              headers: { Accept: "text/calendar" },
              cache: "no-store",
            });
            if (!res.ok) return [];
            return parseICS(await res.text());
          }

          const res = await fetch(url, { cache: "no-store" });
          if (!res.ok) return [];
          const data = await res.json();
          
          if (source === "Sorties cinéma") return normalizeCinema(data);
          
          const items = normalizeApiResult(data);

          // 🆕 TRAITEMENT UT3
          if (source === "Université Toulouse III - Paul Sabatier") {
            return items.map((ev: any) => ({
              ...ev,
              date: ev.start, // UT3 utilise 'start'
              link: ev.url,
              source
            }));
          }

          // 🆕 TRAITEMENT TOURISME HAUTE-GARONNE
          if (source === "Tourisme Haute-Garonne") {
            return items.map((ev: any) => ({
              ...ev,
              date: ev.date,
              link: ev.url,
              fullAddress: ev.fullAddress || ev.location,
              source
            }));
          }

          // 🎭 TOULOUSE MÉTROPOLE
          if (source === "Toulouse Métropole") {
            return items.map((ev: any) => {
              const fullAddr = [ev.lieu_nom, ev.lieu_adresse_1, ev.code_postal, ev.commune].filter(Boolean).join(", ");
              return { ...ev, fullAddress: fullAddr, source };
            });
          }

          // 🎭 THÉÂTRE DU PAVÉ
          if (source === "Théâtre du Pavé") {
            return items.map((ev: any) => ({ ...ev, date: ev.start, link: ev.url, source }));
          }

          // 🏴‍☠️ RADAR SQUAT
          if (source === "Radar Squat") {
            return items.map((ev: any) => ({ ...ev, date: ev.start || ev.date, source }));
          }

          // 🔴 DEMOSPHERE
          if (source === "Demosphere") {
            return items.map((ev: any) => ({ ...ev, date: ev.start || ev.date, image: "/logo/demosphereoriginal.png", source }));
          }

          return items.map(ev => ({ ...ev, source }));
        } catch {
          return [];
        }
      })
    );

    // --- HARMONISATION FINALE ---
    let events = results.flat();
    
    const processedEvents = events.map(ev => {
      // Priorité aux clés de date divergentes
      let d = new Date(ev.date || ev.start || ev.startDate || ev.scheduled_start_time || ev.date_debut || ev.date_evenement);
      if (isNaN(d.getTime())) d = today;

      let description = ev.description ? decode(ev.description) : "";
      description = description.replace(/<(?!\/?(p|br|strong|em|a)\b)[^>]*>/gi, "").trim();

      // Images spécifiques Capitole
      if (ev.source?.toLowerCase().includes("capitole") && !ev.image) {
        ev.image = getCapitoleImage(ev.title);
      }

      return { 
        ...ev, 
        title: ev.title || ev.name || ev.nom_de_la_manifestation || ev.titre || "Événement",
        date: d.toISOString(), 
        description,
        link: ev.link || ev.url || ev.href || "#",
        fullAddress: ev.fullAddress || ev.location || "Lieu non précisé",
        image: ev.image || "/images/default-event.jpg"
      };
    });

    // Suppression doublons et filtrage temporel final strict (Today + 31 jours)
    const uniq = new Map<string, any>();
    processedEvents.forEach(ev => {
      const key = ev.id || `${ev.title}-${ev.date}-${ev.source}`;
      if (!uniq.has(key)) uniq.set(key, ev);
    });

    const sorted = Array.from(uniq.values())
      .filter(ev => {
        const d = new Date(ev.date);
        return d >= today && d <= maxDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({ total: sorted.length, events: sorted });
  } catch (err: any) {
    return NextResponse.json({ total: 0, events: [], error: err.message }, { status: 500 });
  }
}