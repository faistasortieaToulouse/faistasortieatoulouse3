// Mapping complet des images par thème / catégorie / type
export const themeImageMap: Record<string, string> = {
  animations: "/images/categories/animations.jpg",
  balade: "/images/categories/balade.jpg",
  brocante: "/images/categories/brocante.jpg",
  cinema: "/images/categories/cinema.jpg",
  concert: "/images/categories/concert.jpg",
  culturel: "/images/categories/culturel.jpg",
  danse: "/images/categories/danse.jpg",
  defilecortegeparade: "/images/categories/defilecortegeparade.jpg",
  exposition: "/images/categories/exposition.jpg",
  festival: "/images/categories/festival.jpg",
  fairoesalon: "/images/categories/foiresalon.jpg",
  insolite: "/images/categories/insolite.jpg",
  loisirs: "/images/categories/loisirs.jpg",
  manifestationcommerciale: "/images/categories/manifestationcommerciale.jpg",
  marche: "/images/categories/marche.jpg",
  musique: "/images/categories/musique.jpg",
  naturedetente: "/images/categories/naturedetente.jpg",
  opera: "/images/categories/opera.jpg",
  portesouvertes: "/images/categories/portesouvertes.jpg",
  rencontres: "/images/categories/rencontres.jpg",
  soireeclubbing: "/images/categories/soireeclubbing.jpg",
  spectacle: "/images/categories/spectacle.jpg",
  sport: "/images/categories/sport.jpg",
  theatre: "/images/categories/theatre.jpg",
  traditionsfolklore: "/images/categories/traditionsfolklore.jpg",
  videgreniersbraderie: "/images/categories/videgreniersbraderie.jpg",
  visitesguidees: "/images/categories/visitesguidees.jpg",

  // Nouveaux thèmes
  jeunepublic: "/images/categories/jeunepublic.jpg",
  patrimoine: "/images/categories/patrimoine.jpg",
  atelier: "/images/categories/atelier.jpg",
  conference: "/images/categories/conference.jpg",

  // Fallback intermédiaire
  divers: "/images/categories/divers.jpg",

  // Fallback final
  generique: "/images/categories/generique.jpg",
};

// Normalisation commune
function normalize(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function getEventImage(event: any): string {
  // 1. Champs connus
  const theme =
    event.theme_de_la_manifestation ||
    event.categorie_de_la_manifestation ||
    event.type_de_manifestation;

  if (theme) {
    const normalized = normalize(theme);

    // match strict
    if (themeImageMap[normalized]) {
      return themeImageMap[normalized];
    }

    // match partiel
    for (const key in themeImageMap) {
      if (normalized.includes(key)) {
        return themeImageMap[key];
      }
    }
  }

  // 2. Détection automatique dans le titre / description
  const text = normalize(
    (event.title || "") + " " + (event.description || "")
  );

  for (const key in themeImageMap) {
    if (key !== "generique" && text.includes(key)) {
      return themeImageMap[key];
    }
  }

  // 3. fallback
  return themeImageMap["generique"];
}
