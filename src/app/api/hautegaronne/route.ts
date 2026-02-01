// src/app/api/hautegaronne/route.ts
import { NextResponse } from "next/server";

const PAGE_LIMIT = 100;
const PLACEHOLDER_IMAGE = "/images/tourismehg31/themeautres.jpg"; // image par défaut si aucune fournie

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const API_URL = `https://data.haute-garonne.fr/api/explore/v2.1/catalog/datasets/evenements-publics/records?limit=${PAGE_LIMIT}&timezone=Europe/Paris&select=title_fr,description_fr,firstdate_begin,location_name,location_address,location_postalcode,location_city,image,canonicalurl&where=firstdate_begin>='${today}'&sort=firstdate_begin ASC`;

    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error(`API HTTP error: ${resp.status}`);

    const data = await resp.json();
    if (!data.results || data.results.length === 0) return NextResponse.json({ events: [] });

    const events = data.results
      .map((item: any, index: number) => {
        const fields = item.record?.fields || item.fields || item;
        const date = fields.firstdate_begin ? new Date(fields.firstdate_begin) : null;
        if (!date) return null;

        const fullAddress = [fields.location_name, fields.location_address, fields.location_postalcode, fields.location_city]
          .filter(Boolean)
          .join(", ");

        return {
          id: `${fields.title_fr}-${date.toISOString()}-${index}`,
          title: fields.title_fr || "Événement sans titre",
          description: fields.description_fr || "",
          date: date.toISOString(),
          dateFormatted: date.toLocaleString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          image: fields.image || PLACEHOLDER_IMAGE,
          fullAddress,
          source: "Culture Haute-Garonne",
          url: fields.canonicalurl || null,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ events });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erreur inconnue" }, { status: 500 });
  }
}
