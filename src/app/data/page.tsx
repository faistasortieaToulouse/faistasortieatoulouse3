import { Metadata } from 'next';

// 1. On définit la revalidation au niveau de la page (identique à l'API)
export const revalidate = 300; 

export const metadata: Metadata = {
  title: 'Statistiques FTS Toulouse',
  description: 'Radar des événements et base de données FTS',
};

async function getStats() {
  // On récupère l'URL de base selon l'environnement
  const host = process.env.NEXT_PUBLIC_BASE_URL 
    ? `https://${process.env.NEXT_PUBLIC_BASE_URL.replace('https://', '')}`
    : "https://ftstoulouse.vercel.app";

  try {
    const res = await fetch(`${host}/api/data`, {
      next: { revalidate: 300 }, // Cache partagé
    });

    if (!res.ok) throw new Error('Échec API');
    return res.json();
  } catch (error) {
    console.error("Erreur récupération stats:", error);
    return null;
  }
}

export default async function MeetupDataPage() {
  // 2. Le serveur récupère les données AVANT d'envoyer la page
  const data = await getStats();

  // Si l'API échoue totalement
  if (!data) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif", textAlign: "center" }}>
        <h1>Radar Toulouse</h1>
        <p>Service en cours de maintenance. Revenez dans quelques instants.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", color: "#000", backgroundColor: "#fff", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Statistiques FTS Toulouse</h1>
      <p style={{ fontSize: '10px', color: '#999' }}>Source : {data.source || 'Standard'}</p>
      <hr />
      
      <section>
        <h2>Base de données</h2>
        <p><strong>Nombre total d'articles :</strong> {data.totalArticles || 0}</p>
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
        Dernière mise à jour : {data.timestamp || "N/A"}
      </footer>
    </div>
  );
}