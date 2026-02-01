"use client";

import { useState, useEffect } from "react";

export default function MeetupDataPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Chargement des données...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", color: "#000", backgroundColor: "#fff" }}>
      <h1>Statistiques FTS Toulouse</h1>
      <hr />
      
      <section>
        <h2>Base de données</h2>
        <p><strong>Nombre total d'articles :</strong> {data?.totalArticles || 0}</p>
      </section>

      <hr />

      <section>
        <h2>Évènements en direct (Radar)</h2>
        <p><strong>Total évènements :</strong> {data?.totalLive || 0}</p>
        <ul>
          <li>Agenda Toulouse : {data?.detailsLive?.agenda || 0}</li>
          <li>Meetup Full : {data?.detailsLive?.meetup || 0}</li>
          <li>Cinémas : {data?.detailsLive?.cinema || 0}</li>
          <li>Jeux : {data?.detailsLive?.jeux || 0}</li>
        </ul>
      </section>

      <footer style={{ marginTop: "40px", fontSize: "12px", color: "#666" }}>
        Dernière mise à jour : {data?.timestamp ? new Date(data.timestamp).toLocaleString() : "N/A"}
      </footer>
    </div>
  );
}