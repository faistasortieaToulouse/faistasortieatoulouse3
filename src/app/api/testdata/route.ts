import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host") || "localhost:3000";
  const BASE_URL = `${protocol}://${host}`;

  try {
    const endpoints = [
      // ON APPELLE CHAQUE MEETUP INDIVIDUELLEMENT
      { id: 'm_events',  path: '/api/meetup-events' },
      { id: 'm_expats',  path: '/api/meetup-expats' },
      { id: 'm_coloc',   path: '/api/meetup-coloc' },
      { id: 'm_happy',   path: '/api/meetup-happy' },
      { id: 'm_sorties', path: '/api/meetup-sorties' },
      // AUTRES SOURCES
      { id: 'cinema',    path: '/api/cinematoulouse' },
      { id: 'agenda',    path: '/api/agendatoulousain' },
      { id: 'jeux',      path: '/api/trictracphilibert' }
    ];

    const results = await Promise.all(
      endpoints.map(async (endpoint) => {
        try {
          const res = await fetch(`${BASE_URL}${endpoint.path}`, {
            cache: 'no-store',
            headers: { "Internal-Auth": "radar-secret-v1" }
          });

          if (!res.ok) return { id: endpoint.id, count: 0 };

          const data = await res.json();
          
          // Détection du count (gère totalEvents, events.length ou items.length)
          const count = data.totalEvents || data.events?.length || data.items?.length || data.results?.length || 0;
          
          console.log(`📡 [DEBUG] ${endpoint.id} a trouvé: ${count}`);
          return { id: endpoint.id, count };
        } catch (err) {
          return { id: endpoint.id, count: 0 };
        }
      })
    );

    // --- CALCUL DE LA SOMME DES MEETUPS ---
    const totalMeetup = results
      .filter(r => r.id.startsWith('m_')) // On prend tous ceux qui commencent par m_
      .reduce((sum, r) => sum + r.count, 0);

    const counts = {
      meetup: totalMeetup,
      cinema: results.find(r => r.id === 'cinema')?.count || 0,
      agenda: results.find(r => r.id === 'agenda')?.count || 0,
      jeux: results.find(r => r.id === 'jeux')?.count || 0,
    };

    return NextResponse.json({
      totalLive: counts.meetup + counts.cinema + counts.agenda + counts.jeux,
      totalArticles: 216,
      detailsLive: counts,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    return NextResponse.json({ totalLive: 0, totalArticles: 216 }, { status: 500 });
  }
}