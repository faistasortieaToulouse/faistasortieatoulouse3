import { NextRequest, NextResponse } from "next/server";

export const revalidate = 300; 

export async function GET(request: NextRequest) {
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host") || "localhost:3000";
  const BASE_URL = `${protocol}://${host}`;

  // 1. Définition du fallback par défaut (au cas où même le fichier JSON manque)
  const defaultFallback = {
    totalLive: 0,
    totalArticles: 216,
    detailsLive: { meetup: 0, cinema: 0, agenda: 0, jeux: 0 },
    timestamp: new Date().toLocaleString('fr-FR')
  };

  try {
    const endpoints = [
      { id: 'm_events',  path: '/api/meetup-events' },
      { id: 'm_expats',  path: '/api/meetup-expats' },
      { id: 'm_coloc',   path: '/api/meetup-coloc' },
      { id: 'm_happy',   path: '/api/meetup-happy' },
      { id: 'm_sorties', path: '/api/meetup-sorties' },
      { id: 'cinema',    path: '/api/cinematoulouse' },
      { id: 'agenda',    path: '/api/agendatoulousain' },
      { id: 'jeux',      path: '/api/trictracphilibert' }
    ];

    const results = await Promise.all(
      endpoints.map(async (endpoint) => {
        try {
          const res = await fetch(`${BASE_URL}${endpoint.path}`, {
            next: { revalidate: 300 }, 
            headers: { "Internal-Auth": "radar-secret-v1" }
          });

          if (!res.ok) return { id: endpoint.id, count: 0 };
          const data = await res.json();
          
          const count = data.totalEvents || 
                        data.events?.length || 
                        data.items?.length || 
                        data.results?.length || 0;
          
          return { id: endpoint.id, count };
        } catch (err) {
          return { id: endpoint.id, count: 0 };
        }
      })
    );

    const mCount = results.filter(r => r.id.startsWith('m_')).reduce((s, r) => s + r.count, 0);
    const cCount = results.find(r => r.id === 'cinema')?.count || 0;
    const aCount = results.find(r => r.id === 'agenda')?.count || 0;
    const jCount = results.find(r => r.id === 'jeux')?.count || 0;

    const totalLive = mCount + cCount + aCount + jCount;

    // --- LOGIQUE DE SECOURS ---
    // Si le live est vide, on tente de charger le JSON hebdo
    if (totalLive === 0) {
      try {
        // Chemin relatif pour remonter à la racine /data/ depuis /src/app/api/data/
        const statsHebdo = require("../../../../data/stats-hebdo.json");
        return NextResponse.json({ ...statsHebdo, source: "backup_hebdo" });
      } catch (e) {
        return NextResponse.json(defaultFallback);
      }
    }

    return NextResponse.json(
      {
        totalLive,
        totalArticles: 216,
        detailsLive: { meetup: mCount, cinema: cCount, agenda: aCount, jeux: jCount },
        timestamp: new Date().toLocaleString('fr-FR'),
        source: "live_radar"
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
      }
    );

  } catch (err) {
    // Si tout plante (ex: BASE_URL invalide), on tente quand même le JSON
    try {
      const statsHebdo = require("../../../../data/stats-hebdo.json");
      return NextResponse.json(statsHebdo);
    } catch {
      return NextResponse.json(defaultFallback, { status: 500 });
    }
  }
}