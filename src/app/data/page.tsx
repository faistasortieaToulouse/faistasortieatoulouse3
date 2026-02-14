import { Metadata } from 'next';

// Configuration du cache : la page sera recalculée au maximum toutes les heures
export const revalidate = 3600; 
export const dynamic = 'force-dynamic'; // Optionnel : force la fraîcheur au premier déploiement

export const metadata: Metadata = {
  title: 'Statistiques FTS Toulouse',
  description: 'Radar des événements et base de données FTS',
};

async function getStats() {
  // On utilise l'URL de production. Change-la si nécessaire.
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL 
    ? `https://${process.env.NEXT_PUBLIC_BASE_URL.replace('https://', '')}`
    : "https://ftstoulouse.vercel.app";

  try {
    const res = await fetch(`${BASE_URL}/api/data`, {
      // Le serveur Next.js garde ce fetch en cache pendant 1h
      next: { revalidate: 3600 }, 
    });

    if (!res.ok) throw new Error('Échec du chargement');
    return res.json();
  } catch (error) {
    console.error("Erreur Radar:", error);
    return null;
  }
}

export default async function MeetupDataPage() {
  const data = await getStats();

  // Si l'API échoue, on affiche un message d'erreur propre au lieu de crash
  if (!data) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <h1>Statistiques FTS Toulouse</h1>
        <p>Service temporairement indisponible. Veuillez rafraîchir la page.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", color: "#000", backgroundColor: "#fff", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Statistiques FTS Toulouse</h1>
      <hr />
      
      <section>
        <h2>Base de données</h2>
        <p><strong>Nombre total d'articles :</strong> {data.totalArticles || 0}</p>
      </section>

      <hr />

      {/* NOUVELLE SECTION AVEC TES DONNÉES EN DUR */}
      <section>
        <h2>Podcasts & Lectures</h2>
        <ul style={{ lineHeight: "1.8" }}>
          <li><strong>Podcasts sorties de livre :</strong> 1708</li>
          <li><strong>Nombre de livres suggérés :</strong> 4266</li>
        </ul>
      </section>

      <hr />
      
      <section>
        <h2>Évènements en direct (Radar)</h2>
        <p style={{ fontSize: "1.2rem" }}><strong>Total évènements :</strong> {data.totalLive || 0}</p>
        <ul style={{ lineHeight: "1.8" }}>
          <li><strong>Agenda Toulouse :</strong> {data.detailsLive?.agenda || 0}</li>
          <li><strong>Meetup Full :</strong> {data.detailsLive?.meetup || 0}</li>
          <li><strong>Cinémas :</strong> {data.detailsLive?.cinema || 0}</li>
          <li><strong>Jeux :</strong> {data.detailsLive?.jeux || 0}</li>

        </ul>
      </section>

      <footer style={{ marginTop: "40px", fontSize: "12px", color: "#666", borderTop: "1px solid #eee", paddingTop: "10px" }}>
        Dernière mise à jour (Radar) : {data.timestamp ? new Date(data.timestamp).toLocaleString("fr-FR", {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) : "N/A"}
      </footer>
    </div>
  );
}
