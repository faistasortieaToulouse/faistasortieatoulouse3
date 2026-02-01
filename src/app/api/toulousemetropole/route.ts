import { NextResponse } from "next/server";
import { isBefore } from "date-fns";
import { getEventImage } from "@/utils/eventImages";

const API_URL =
  "https://data.toulouse-metropole.fr/api/records/1.0/search/?dataset=agenda-des-manifestations-culturelles-so-toulouse&rows=1000&sort=date_debut";

const DATA_PORTAL_BASE_URL =
  "https://data.toulouse-metropole.fr/explore/dataset/agenda-des-manifestations-culturelles-so-toulouse/record/";

export async function GET() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      return NextResponse.json(
        { error: `API HTTP error: ${res.status}` },
        { status: 500 }
      );
    }

    const data = await res.json();
    if (!data.records || !Array.isArray(data.records)) {
      return NextResponse.json([], { status: 200 });
    }

    // Date actuelle
    const now = new Date();

    const futureEvents = data.records
      .filter((rec: any) => {
        const dateDebut = rec.fields?.date_debut;
        if (!dateDebut) return false;

        return !isBefore(new Date(dateDebut), now);
      })
      .map((rec: any) => {
        const fields = rec.fields || {};

        const primaryUrl = fields.reservation_site_internet;
        const fallbackUrl = `${DATA_PORTAL_BASE_URL}${rec.recordid}/`;

        return {
          id: rec.recordid,
          title: fields.nom_de_la_manifestation || "Sans titre",
          description:
            fields.descriptif_long || fields.descriptif_court || "",

          date: fields.date_debut,

          // Adresse
          lieu_nom: fields.lieu_nom || "",
          lieu_adresse_1: fields.lieu_adresse_1 || "",
          lieu_adresse_2: fields.lieu_adresse_2 || "",
          lieu_adresse_3: fields.lieu_adresse_3 || "",
          code_postal: fields.code_postal || "",
          commune: fields.commune || "",

          // Catégories
          category: fields.categorie_de_la_manifestation || "",
          type: fields.type_de_manifestation || "",
          theme: fields.theme_de_la_manifestation || "",

          // URL officielle
          url: primaryUrl || fallbackUrl,

          // 🎨 IMAGE → ajout automatique via ta fonction custom
          image: getEventImage(fields),

          // Source
          source: "toulousemetropole",
        };
      });

    futureEvents.sort((a: any, b: any) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return NextResponse.json(futureEvents);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erreur inconnue" },
      { status: 500 }
    );
  }
}
