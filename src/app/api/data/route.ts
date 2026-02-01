import { NextRequest, NextResponse } from "next/server";

// On définit une revalidation globale de 5 minutes (300 secondes)
export const revalidate = 300; 

export async function GET(request: NextRequest) {
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host") || "localhost:3000";
  const BASE_URL = `${protocol}://${host}`;

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
            // Le cache 'force-cache' combiné au revalidate global 
            // permet de ne pas surcharger tes APIs internes.
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

    return NextResponse.json(
      {
        totalLive: mCount + cCount + aCount + jCount,
        totalArticles: 216,
        detailsLive: {
          meetup: mCount,
          cinema: cCount,
          agenda: aCount,
          jeux: jCount
        },
        timestamp: new Date().toLocaleString('fr-FR'),
        cache: "Données rafraîchies toutes les 5 minutes"
      },
      {
        status: 200,
        headers: {
          // Ce header dit aux navigateurs et à Vercel de garder le résultat en cache
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );

  } catch (err) {
    return NextResponse.json({ totalLive: 0, totalArticles: 216 }, { status: 500 });
  }
}