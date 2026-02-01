import { NextRequest, NextResponse } from "next/server";

// Configuration des headers CORS pour autoriser les requêtes multi-ports
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const dataset = "agendas-participatif-des-sorties-en-occitanie";
  const departementCode = "31";
  const apiUrl = `https://data.laregion.fr/api/records/1.0/search/?dataset=${dataset}&rows=1000&refine.departement=${departementCode}`;

  const THEME_IMAGES: Record<string, string> = {
    "Culture": "/images/tourismehg31/themeculture.jpg",
    "Education Emploi": "/images/tourismehg31/themeeducation.jpg",
    "Autres": "/images/tourismehg31/themeautres.jpg",
    "Sport": "/images/tourismehg31/themesport.jpg",
    "Environnement": "/images/tourismehg31/themeenvironnement.jpg",
    "Économie / vie des entreprises": "/images/tourismehg31/themeentreprises.jpg",
    "Vides Grenier / Brocantes / Foires et salons": "/images/tourismehg31/themebrocantes.jpg",
    "Culture scientifique": "/images/tourismehg31/themesciences.jpg",
    "Agritourisme": "/images/tourismehg31/themeagritourisme.jpg",
  };

  const DEFAULT_THEME_IMAGE = "/images/tourismehg31/placeholder.jpg";
  const FALLBACK_PLACEHOLDER = "https://via.placeholder.com/400x200?text=Événement";

  function normalize(str?: string) {
    return (str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function getThemeImage(thematique?: string) {
    if (!thematique) return DEFAULT_THEME_IMAGE;
    const t = normalize(thematique.trim());
    if (t.startsWith("education") || t.startsWith("éducation")) return THEME_IMAGES["Education Emploi"];
    for (const key of Object.keys(THEME_IMAGES)) {
      if (normalize(key) === t) return THEME_IMAGES[key];
    }
    return DEFAULT_THEME_IMAGE;
  }

  function extractImageField(imageField: any): string | null {
    if (!imageField) return null;
    if (typeof imageField === "string") return imageField;
    if (Array.isArray(imageField) && imageField.length > 0) {
      const first = imageField[0];
      if (typeof first === "string") return first;
      if (typeof first === "object" && first !== null) return first.url || first.thumbnail || first.thumb || null;
    }
    return (typeof imageField === "object" && imageField.url) ? imageField.url : null;
  }

  function isDepartement31(fields: any): boolean {
    if (!fields) return false;
    const possibles = [fields.departement, fields.departement_code, fields.code_departement, fields.code_dept, fields.dept, fields.nom_departement];
    for (const p of possibles) {
      if (!p) continue;
      const nv = normalize(String(p));
      if (nv.includes("31") || nv.includes("haute-garonne")) return true;
    }
    const communeFields = [fields.commune, fields.ville, fields.lieu_nom, fields.insee];
    for (const c of communeFields) {
      if (!c) continue;
      const nv = normalize(String(c));
      if (nv.includes("toulouse") || nv.includes("31")) return true;
    }
    return false;
  }

  try {
    let resp = await fetch(apiUrl);
    let data;

    if (!resp.ok) {
      // Fallback si le refine échoue
      const fallbackUrl = `https://data.laregion.fr/api/records/1.0/search/?dataset=${dataset}&rows=1000`;
      const fallbackResp = await fetch(fallbackUrl);
      if (!fallbackResp.ok) return NextResponse.json({ error: "Erreur API" }, { status: 500, headers: corsHeaders });
      data = await fallbackResp.json();
    } else {
      data = await resp.json();
    }

    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 31);

    const events = (data.records || [])
      .map((r: any, idx: number) => {
        const f = r.fields || {};
        if (!isDepartement31(f)) return null;

        const rawDate = f.date_evenement || f.date_debut || f.date || f.start || null;
        let isoDate: string | null = null;
        let dateFormatted: string | null = null;

        if (rawDate) {
          const d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            isoDate = d.toISOString();
            dateFormatted = d.toLocaleDateString("fr-FR", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            });
          }
        }

        const stableId = r.recordid || f.id || `${normalize(f.titre).replace(/\s+/g, "-")}-${idx}`;
        const rawImage = extractImageField(f.image);
        const thematique = f.thematique || f.thematique_principale || "Autres";

        return {
          id: stableId,
          title: f.titre || "Événement",
          description: f.descriptif || "",
          date: isoDate,
          dateFormatted,
          location: f.commune || f.ville || "",
          fullAddress: f.adresse || "",
          image: rawImage || getThemeImage(thematique) || FALLBACK_PLACEHOLDER,
          url: f.url || "",
          source: "tourismehautegaronne",
          thematique,
        };
      })
      .filter((ev: any) => ev !== null && ev.date && new Date(ev.date) >= today && new Date(ev.date) <= maxDate)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({ events }, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json({ error: "Erreur réseau" }, { status: 500, headers: corsHeaders });
  }
}