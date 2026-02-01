import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

const RSS_URL =
  "https://agendatrad.org/rss/events/next/France/Occitanie/Haute-Garonne.xml?lang=fr&key=Zbt4p07ZfICSdyqfRzT5b8BSVmyb3izfR2lLvAUYp6SjIZaEX3qtCXiavgrfvFy2";

const xmlParser = new XMLParser({ ignoreAttributes: false });

// 🔎 Mapping catégorie canonique → image par défaut
const defaultImages: Record<string, string> = {
  Bal: "/images/agendatrad/default-bal.jpg",
  "Bal folk": "/images/agendatrad/default-balfolk.jpg",
  "Fest-noz": "/images/agendatrad/default-festnoz.jpg",
  Baleti: "/images/agendatrad/default-baleti.jpg",
  Concert: "/images/agendatrad/default-concert.jpg",
  Stage: "/images/agendatrad/default-stage.jpg",
  "Stage de danse": "/images/agendatrad/default-stagedanse.jpg",
  "Stage de musique / chant": "/images/agendatrad/default-stagechant.jpg",
  Atelier: "/images/agendatrad/default-atelier.jpg",
  "Cours réguliers": "/images/agendatrad/default-cours.jpg",
  "Ateliers réguliers": "/images/agendatrad/default-atelier.jpg",
  Festival: "/images/agendatrad/default-festival.jpg",
  Session: "/images/agendatrad/default-session.jpg",
  Autre: "/images/agendatrad/default-generique.jpg",
  Danse: "/images/agendatrad/default-danse.jpg", // fallback
};

// ✅ Fonction de normalisation
function normalizeCategory(cat: string): string {
  const lower = cat.toLowerCase();

  if (lower.includes("bal")) {
    if (lower.includes("folk")) return "Bal folk";
    return "Bal";
  }
  if (lower.includes("concert")) return "Concert";
  if (lower.includes("stage")) {
    if (lower.includes("danse")) return "Stage de danse";
    if (lower.includes("musique") || lower.includes("chant"))
      return "Stage de musique / chant";
    return "Stage"; // générique
  }
  if (lower.includes("atelier")) {
    if (lower.includes("régulier")) return "Ateliers réguliers";
    return "Atelier";
  }
  if (lower.includes("cours")) return "Cours réguliers";
  if (lower.includes("festival")) return "Festival";
  if (lower.includes("session")) return "Session";
  if (lower.includes("autre")) return "Autre";

  return "Danse"; // fallback
}

// 🔹 Nettoyage complet des descriptions
function cleanAgendaTradDescription(desc: string): string {
  if (!desc) return "";

  // Supprimer la ligne "source: ... - AgendaTrad"
  desc = desc.replace(/<p>source:.*AgendaTrad.*<\/p>/i, "").trim();

  // Remplacer <br> et </p> par des sauts de ligne
  desc = desc
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<p[^>]*>/gi, "")
    // Supprimer toutes les balises sauf <a>
    .replace(/<(?!a\b)[^>]+>/gi, "")
    .replace(/\n{2,}/g, "\n\n") // nettoyer les sauts de ligne multiples
    .trim();

  return desc;
}

export async function GET() {
  try {
    const xml = await fetch(RSS_URL).then((res) => res.text());
    const json = xmlParser.parse(xml);

    const entries = json.feed.entry || [];
    const today = new Date();

    const events = entries
      .map((entry: any) => {
        // ✅ Titre
        const rawTitle =
          typeof entry.title === "string"
            ? entry.title
            : entry.title?.["#text"] || "";

        const titleMatch = rawTitle.match(/\[(\d{4}-\d{2}-\d{2})\]\s*(.*)/);
        if (!titleMatch) return null;

        const date = new Date(titleMatch[1]);
        if (isNaN(date.getTime()) || date < today) return null;

        const title = titleMatch[2] || "Événement";

        // ✅ Description nettoyée
        const rawDescription =
          typeof entry.summary === "string"
            ? entry.summary
            : entry.summary?.["#text"] || "";
        const description = cleanAgendaTradDescription(rawDescription);

        // ✅ Catégorie brute
        let eventCategory = "Danse";
        if (entry.category) {
          if (Array.isArray(entry.category)) {
            eventCategory = entry.category[0]["@_term"] || "Danse";
          } else {
            eventCategory = entry.category["@_term"] || "Danse";
          }
        }

        // ✅ Normalisation
        const normalizedCategory = normalizeCategory(eventCategory);

        // ✅ Image
        const imgMatch = rawDescription.match(/<img.*?src="(.*?)"/);
        let image = imgMatch ? imgMatch[1] : "";
        if (!image) {
          image = defaultImages[normalizedCategory] || defaultImages["Danse"];
        }

        // ✅ URL
        const url =
          (Array.isArray(entry.link)
            ? entry.link[0]?.["@_href"]
            : entry.link?.["@_href"]) || "";

        return {
          id: entry.id || title + date.toISOString(),
          title,
          description,
          date: date.toISOString(),
          dateFormatted: date.toLocaleString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          fullAddress: "", // à compléter si besoin
          image,
          url,
          category: normalizedCategory, // ✅ catégorie canonique
        };
      })
      .filter(Boolean);

    return NextResponse.json(events, { status: 200 });
  } catch (err: any) {
    console.error("AgendaTrad Haute-Garonne error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
