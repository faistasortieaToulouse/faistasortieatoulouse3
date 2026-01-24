// faistasortietest2/src/lib/checkUrls.ts
import fetch from "node-fetch"; // Installer node-fetch si nécessaire : npm install node-fetch

// Toutes les catégories et URL
const categories = [
  {
    title: "Événements des établissements privés gratuits et payants",
    links: [
      "https://www.toulousebouge.com",
      "https://www.clutchmag.fr/evenements",
      "https://www.lepetittou.com/activite/culture/",
      "https://31.agendaculturel.fr/agenda-culturel/toulouse/",
      "https://toulousesecret.com/culture/page/8/",
      "https://www.jds.fr/toulouse/agenda/",
      "https://www.alentoor.fr/toulouse/agenda",
      "https://www.cityzeum.com/evenement/toulouse",
      "https://toulouse.latribune.fr/evenements.html",
      "https://www.lafrenchtechtoulouse.com/open-agenda/",
    ],
  },
  {
    title: "Événements des établissements publics gratuits",
    links: [
      "https://bibliotheque.toulouse.fr/agenda",
      "https://agenda.toulouse-metropole.fr/",
      "https://www.toulouse-tourisme.com/agenda",
      "https://www.hautegaronnetourisme.com/bouger-et-sortir/sortir-se-divertir/tout-agenda/",
      "https://cpieterrestoulousaines.org/agenda/",
      "https://www.culture.gouv.fr/Regions/Drac-Occitanie",
      "https://openagenda.com/toulouse-metropole",
    ],
  },
  {
    title: "Événements alternatifs gratuits",
    links: [
      "https://toulouse.demosphere.net/",
      "https://radar.squat.net/fr/events/city/Toulouse",
      "https://la-toulouse.fr/category/evenement/",
    ],
  },
  {
    title: "Événements gratuits des médias",
    links: [
      "https://www.amis.monde-diplomatique.fr/",
      "https://infolocale.actu.fr/occitanie/haute-garonne/toulouse-31000",
    ],
  },
  {
    title: "Évènements gratuits des établissements de nuit",
    links: [
      "https://auchatnoir.noblogs.org/",
      "https://www.facebook.com/levasion.bar/events?locale=fr_FR",
    ],
  },
  {
    title: "Événements gratuits des bars associatifs",
    links: [
      "http://lapasserelle-negreneys.org/",
      "https://www.facebook.com/lapasserellenegreneys/events",
      "https://www.sozinho.org/agenda/",
      "https://www.placecommune.fr/prog1",
      "https://www.maisonmalepere.fr/programmation",
      "https://cafe-lastronef.fr/programme/",
    ],
  },
  {
    title: "Événements culturels alternatifs",
    links: [
      "https://lachapelletoulouse.com/evenements/",
      "http://lehangar.eklablog.com/",
      "https://vive.mixart-myrys.org/",
    ],
  },
  {
    title: "Événements des librairies",
    links: [
      "https://www.ombres-blanches.fr/posts/30/Nos-evenements",
      "https://www.librairieprivat.com/agenda.php",
      "https://www.librairie-terranova.fr/agenda-librairie",
      "https://www.fnac.com/Toulouse-Wilson/Fnac-Toulouse-Wilson/cl55/w-4",
      "https://www.fnac.com/Toulouse-Labege/Fnac-Labege/cl57/w-4",
    ],
  },
  {
    title: "Événements des orchestres, bals et concerts",
    links: [
      "https://conservatoire.toulouse.fr/agenda/",
      "http://www.orchestre-h2o.fr",
      "https://orchestre.ut-capitole.fr/accueil/concerts",
      "https://www.out-toulouse.fr/saison-en-cours",
      "https://philharmonia-tolosa.fr/?cat=5",
      "https://orchestre-opus31.fr/events/",
      "http://ensemble-orchestral-pierre-de-fermat.fr/concerts-a-venir.php",
      "https://www.comdt.org/saison/les-concerts/",
      "https://agendatrad.org/calendrier/France/Occitanie",
      "https://www.facebook.com/groups/221534187648",
      "https://www.diversdanses.org/",
      "https://www.facebook.com/Diversdanse/?locale=fr_FR",
      "https://www.facebook.com/page.bombes.2.bal/?locale=fr_FR",
      "https://toulouse-les-orgues.org/",
    ],
  },
  // Tu peux continuer à ajouter les autres catégories de ton fichier...
];

// Fonction principale de vérification
export async function checkUrls() {
  console.log("🔎 Vérification des URLs...");
  for (const category of categories) {
    for (const url of category.links) {
      try {
        const res = await fetch(url, { method: "HEAD" });
        if (!res.ok) {
          console.log(`- Attention ! L'adresse de cette page a changé : ${url}`);
        }
      } catch (err) {
        console.log(`- Attention ! L'adresse de cette page a changé : ${url}`);
      }
    }
  }
  console.log("✅ Vérification terminée !");
}

// Si tu veux exécuter directement avec ts-node
if (require.main === module) {
  checkUrls();
}
