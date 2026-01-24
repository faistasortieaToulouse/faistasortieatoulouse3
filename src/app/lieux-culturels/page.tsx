"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Item {
  name: string;
  url: string;
}

interface SectionProps {
  title: string;
  items: Item[];
}

function Section({ title, items }: SectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-2xl mb-4 shadow-sm bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        {open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      {open && (
        <ul className="p-4 pt-0 space-y-1 text-gray-700">
          {items.map((item, i) => (
            <li
              key={i}
              className="border-b border-gray-100 last:border-none pb-1"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🎭 Lieux Culturels à Toulouse
      </h1>

      <Section
        title="🎤 Stand-Up Comedy / Comedy Clubs"
        items={[
  { name: "3 Brasseurs Comedy Club (Blagnac)", url: "https://www.billetweb.fr/soiree-stand-up-au-3brasseurs-blagnac" },
  { name: "Chez Mamie – Toulouse Esquirol", url: "https://www.eventbrite.fr/e/billets-stand-up-chez-mamie-toulouse-esquirol-1138446005649" },
  { name: "Satch Club – Toulouse Capitole", url: "https://www.eventbrite.fr/e/billets-stand-up-satch-club-toulouse-capitole-1061269328129" },
  { name: "M. Georges – Toulouse St Georges", url: "https://www.eventbrite.fr/e/billets-stand-up-m-georges-toulouse-st-georges-976174533307" },
  { name: "Barrio Latino – Toulouse St Aubin", url: "https://www.eventbrite.fr/e/stand-up-au-barrio-latino-toulouse-st-aubin-tickets-1105505289079" },
  { name: "La Planque Comedy Club – Sesquières", url: "https://www.eventbrite.fr/e/billets-la-planque-comedy-club-stand-up-a-sesquieres-1098610917829" },
  { name: "O Fil des Saveurs – Villeneuve-Tolosane", url: "https://www.eventbrite.fr/e/diner-spectacle-stand-up-o-fil-des-saveurs-tickets-1222568608619" },
  { name: "Hôtel Le Clocher de Rodez – Toulouse", url: "https://www.eventbrite.fr/e/soiree-stand-up-comedy-club-tickets-1221530353169" },
  { name: "Alegria Comedy – Toulouse", url: "https://www.eventbrite.fr/e/alegria-comedy-stand-up-comedy-tickets-1118876613069" },
  { name: "Quart d’heure Comedy Show – Labarthe sur Lèze", url: "https://www.trip.com/events/le-quart-dheure-comedy-show-labarthe-sur-lèze-20250120/" },
  { name: "Mado Comedy Club – Bar Mado", url: "https://www.eventbrite.fr/e/mado-comedy-club-tickets-1135588980209" },
  { name: "Pepouze Comedy Show – Buzet-sur-Tarn", url: "https://www.eventbrite.fr/e/pepouze-stand-up-comedy-show-buzet-sur-tarn-tickets-1638369309709" },
  { name: "FlashBack Comedy – FlashBack Café", url: "https://www.eventbrite.fr/e/billets-flashback-comedy-stand-up-le-collectif-1053391806249" },
  { name: "Diago Comedy Night – Bar Le Diago", url: "https://www.eventbrite.com/e/le-diago-comedy-night-tickets-1146880122319" },
  { name: "Billy Comedy Club – Billy Brandy", url: "https://allevents.in/toulouse/billy-comedy-club/100001063854771259" },
  { name: "Mamagayo Comedy Club – Bar Mamagayo", url: "https://www.eventbrite.fr/e/billets-mamagayo-comedy-club-1h-de-standup-1020503051097" },
  { name: "Péniche Comedy Club – Ramonville-Saint-Agne", url: "https://www.eventbrite.fr/e/billets-peniche-comedy-club-787988794697" },
  { name: "Le Show Continue – Bar The House", url: "https://www.eventbrite.com/e/le-moon-show-continue-tickets-1276147654989" },
  { name: "Canette Comedy Club – Madame Baudruche", url: "https://www.eventbrite.com/e/canette-comedy-club-x-madame-baudruche-tickets-1202924632959" },
  { name: "Capitole Comedy Club – Roof du Florida", url: "https://www.facebook.com/LeRoofToulouse/reels" },
  { name: "Totem Comedy Club – Mamagayo", url: "http://www.lemamagayo.fr/" },
  { name: "Boudu Comedy – Ô Boudu Pont", url: "https://www.facebook.com/679866355388443/" },
  { name: "La Fabrique du Rire – Kalimera", url: "https://linktr.ee/lafabriqueduire" },
  { name: "Fais-moi rire – The Petit London", url: "https://feverup.com/m/149065" },
  { name: "Vice Comedy – Bear’s House", url: "https://linktr.ee/bearshousetoulouse" },
  { name: "Prima Comedia – Prima Circus", url: "https://circus.primafamily.fr/" },
  { name: "GOAT Comedy Club – Café du Commerce Honoré", url: "https://linktr.ee/goatcomedyclub" },
  { name: "VHS Comedy – Les 500", url: "https://www.les-500.fr/programmation/" },
  { name: "Levrette Comedy Café – Toulouse", url: "https://linktr.ee/levrettecafe_toulouse" },
  { name: "Blague Buster – Little O’Clock", url: "https://stayhappening.com/e/blague-buster-E3LV2NLXI61C" },
  { name: "Safe Comedy Show – Théâtre Roquelaine (Le Stimuli)", url: "https://www.facebook.com/events/th%C3%A9%C3%A2tre-roquelaine-le-stimuli/safe-comedy-show/1305712100055925/" },
  { name: "Stand-Up – Le Citron Bleu Café-théâtre", url: "https://www.lecitronbleu.fr/" },
  { name: "Little Big Joke – Little Big Bar", url: "https://www.privateaser.com/lieu/52348-little-big" },
  { name: "Stand-Up Comedy – Restaurant du 101", url: "https://www.complexe101.fr/" },
  { name: "La Fabrique du rire – Kalimera (Facebook Événement)", url: "https://www.facebook.com/events/kalimera/la-fabrique-du-rire-kalimera/768201101108891/" },
  { name: "Vice Comedy – Bear's House (Facebook Événement)", url: "https://www.facebook.com/events/bears-house-toulouse/vice-comedy-bears-house/555164406151475/" },
  { name: "Le Prima Comedia – Prima Circus (Site du lieu)", url: "https://circus.primafamily.fr/" },
  { name: "Levrette (Comedy) Café – Café Levrette", url: "https://www.levrettecafe.fr/" },
  { name: "Blague Buster – Little O'Clock (Eventbrite)", url: "https://www.eventbrite.fr/e/billets-blague-buster-1138107974589" },
  { name: "Safe Comedy Show – Théâtre Roquelaine (Eventbrite)", url: "https://www.eventbrite.fr/e/billets-safe-comedy-show-1h-de-standup-1425420413829" },
  { name: "Stand-Up – Le Citron Bleu (Programmation)", url: "https://www.lecitronbleu.fr/la-programmation/" },
  { name: "Little Big Joke – Little Big Bar (Eventbrite)", url: "https://www.eventbrite.fr/e/billets-little-big-joke-open-mic-1042768587917" },
  { name: "STAND UP COMEDY – Restaurant du 101", url: "https://www.complexe101.fr/bistrot" },
  { name: "3 Brasseurs Comedy Club – 3 Brasseurs Blagnac", url: "https://www.eventbrite.fr/e/billets-soiree-stand-up-3-brasseurs-comedy-club-1583015133879" },
  { name: "Stand Up – Barrio Latino", url: "https://www.jds.fr/toulouse/spectacles/humour/barrio-comedy-show-791618_A" },
  { name: "Dîner Spectacle Stand Up – O Fil des Saveurs", url: "https://www.facebook.com/p/Au-fil-des-saveurs-100039867171659/" },
  { name: "Alegria Comedy – Restaurant Alegria (Vidéo Superset Comedy)", url: "https://www.facebook.com/superset.comedy/videos/-nouveau-lieu-et-nouvelle-date-pour-se-marrer-%C3%A0-toulouse-quartier-guilhemery-nou/696654308992065/" },
  { name: "Mado Comedy Club – Bar Mado (Facebook Page)", url: "https://www.facebook.com/pages/Bar-Chez-mado/190565251001917/" },
  { name: "Pepouze Stand Up Comedy – Buzet-sur-Tarn (Eventbrite)", url: "https://www.eventbrite.fr/e/pepouze-stand-up-comedy-show-buzet-sur-tarn-tickets-1638369309709" },
  { name: "Péniche Comedy Club – Ramonville-Saint-Agne (Eventbrite)", url: "https://www.eventbrite.fr/e/billets-peniche-comedy-club-867639461987" },
  { name: "Le Show Continue – Bar The House (Eventbrite)", url: "https://www.eventbrite.com/e/le-moon-show-continue-tickets-1276147654989" }
]
}
      />

      <Section
        title="🎭 Improvisation Théâtrale"
        items={[
          { name: "Les Ateliers d’impro", url: "https://ateliers-impro-toulouse.fr" },
          { name: "LUDI Toulouse", url: "https://www.luditoulouse.org" },
          { name: "La Bulle Carrée", url: "https://bullecarree.fr" },
          { name: "L’Impro (Contact Impro Toulouse)", url: "https://www.contactimprotoulouse.org" },
          { name: "Lambda Impro", url: "https://lambdaimpro.fr" },
          { name: "Black Stories Impro", url: "https://blackstoriesimpro.com" },
          { name: "Trio d’impro (La Comédie de Toulouse)", url: "https://www.lacomediedetoulouse.com/fr/programmation/trio-d-impro" },
          { name: "Le Studio du Grand i Théâtre", url: "https://legranditheatre.com" },
          { name: "La Brique de Toulouse", url: "https://labriquedetoulouse.fr" },
          { name: "Les Grumots – Théâtre d’impro", url: "https://lesgrumots.fr" },
          { name: "Compagnie du Dragon", url: "https://compagniedudragon.fr" },
          { name: "Festival Impulsez", url: "https://impulsez.org" },
          { name: "La Petite Scène (Salle de spectacle)", url: "https://www.billetreduc.com/27746/salle.htm" },
        ]}
      />

      <Section
        title="🎟️ Théâtres"
        items={[
          { name: "Théâtre du Capitole", url: "https://opera.toulouse.fr/contact-et-infos-pratiques/" },
          { name: "Théâtre National de Toulouse (TNT) / Théâtre de la Cité", url: "https://theatredelacite.com/" },
          { name: "Théâtre Sorano", url: "https://metropole.toulouse.fr/annuaire/theatre-sorano" },
          { name: "Théâtre du Grand Rond", url: "https://www.grand-rond.fr/" },
          { name: "Théâtre Garonne", url: "https://metropole.toulouse.fr/annuaire/theatre-garonne" },
          { name: "Théâtre Le RING - Scènes Périphérique", url: "https://www.theatrelring.com/" },
          { name: "Théâtre Le Hangar", url: "https://metropole.toulouse.fr/annuaire/theatre-le-hangar" },
          { name: "Théâtre du Pavé", url: "https://www.theatredupave.org/" },
          { name: "Théâtre du Fil à plomb", url: "https://theatrelefilaplomb.fr/" },
          { name: "Théâtre des Mazades", url: "https://metropole.toulouse.fr/annuaire/centre-culturel-theatre-des-mazades" },
          { name: "Nouveau théâtre Jules-Julien", url: "https://metropole.toulouse.fr/annuaire/theatre-jules-julien" },
          { name: "Théâtre du Pont-Neuf (TPN)", url: "https://www.theatredupontneuf.fr/evenements/reservations/" },
          { name: "Théâtre de la Violette", url: "http://www.theatredelaviolette.com/" },
          { name: "Théâtre de Poche", url: "https://www.theatredepoche.com/" },
          { name: "Théâtre du Chien Blanc", url: "https://metropole.toulouse.fr/annuaire/theatre-du-chien-blanc" },
          { name: "Théâtre Roquelaine (Stimuli Théâtre)", url: "http://www.stimuli-theatre.fr/" },
          { name: "Café-théâtre les 3 T", url: "https://www.3tcafetheatre.com/spectacles/les-3t/" },
          { name: "Café-théâtre les Minimes / Café-théâtre Le 57", url: "https://www.le57.com/" },
          { name: "La Cave Poésie", url: "https://metropole.toulouse.fr/annuaire/cave-poesie-rene-gouzenne" },
          { name: "La Comédie de Toulouse", url: "http://www.lacomediedetoulouse.com/" },
          { name: "Théâtre du Citron Bleu", url: "https://www.lecitronbleu.fr/" },
          { name: "Théâtre Le Studio 55", url: "https://www.studio-55.fr/" },
          { name: "Théâtre l'Ecluse", url: "http://www.ecluse-prod.com/" },
          { name: "La Comédie de la Roseraie", url: "https://www.comediedelaroseraie.fr/index.php/contact" },
          { name: "Petit Théâtre du Centre (Colomiers)", url: "https://billetterie.festik.net/petit-theatre-du-centre-colomiers/fr-agendafestik/" },
          { name: "Petit Théâtre Saint-Exupère (Blagnac)", url: "https://www.mairie-blagnac.fr/annuaires/equipements/equipement/petit-theatre-saint-exupere" },
          { name: "Le Chapeau Rouge - Espace Saint-Cyprien", url: "https://ma-source.info/annuaire/le-chapeau-rouge-espace-saint-cyprien/" },
          { name: "Grenier Théâtre", url: "https://www.greniertheatre.org/infos-pratiques/" },
          { name: "Théâtre des sens", url: "https://www.artcena.fr/annuaire/organismes/compagnie-des-sens" },
          { name: "Le Rex (salle de concert)", url: "https://www.lerextoulouse.com/fr/contact/infos/" },
          { name: "Salle Nougaro", url: "https://sallenougaro.com/infos-pratiques/comment-reserver/" },
        ]}
      />

      <Section
        title="🎶 Salles de Spectacle et Concerts"
        items={[
          { name: "Halle aux Grains", url: "https://metropole.toulouse.fr/annuaire/halle-aux-grains" },
          { name: "Zénith de Toulouse", url: "https://zenith-toulousemetropole.com/" },
          { name: "Auditorium de Saint-Pierre-des-Cuisines", url: "https://metropole.toulouse.fr/annuaire/auditorium-saint-pierre-des-cuisines" },
          { name: "Casino-théâtre Barrière de Toulouse", url: "https://www.casinosbarriere.com/fr/toulouse/infos-pratiques.html" },
          { name: "Salle Nougaro", url: "https://sallenougaro.com/" },
          { name: "Metronum", url: "https://lemetronum.fr/" },
          { name: "Le Bijou", url: "https://www.le-bijou.net/" },
          { name: "Le Citron Bleu", url: "https://www.lecitronbleu.fr/" },
          { name: "Le Cap (Salle du CAP - Université Paul Sabatier)", url: "https://culture.univ-tlse3.fr/" },
          { name: "Le Port (Centre Culturel Le Port)", url: "https://metropole.toulouse.fr/annuaire/centre-culturel-le-port" },
          { name: "Le 111 Lunares", url: "http://www.le111lunares.com/" },
          { name: "Le Mandala", url: "https://www.le-mandala.com/" },
          { name: "Le Lido (Centre des Arts du Cirque)", url: "https://www.arts-du-cirque.toulouse.fr/" },
          { name: "La Grainerie (Fabrique des Arts du Cirque et de l'Itinérance)", url: "https://www.la-grainerie.net/" },
          { name: "La Cabane", url: "https://www.la-cabane-toulouse.com/" },
          { name: "Le Phare", url: "https://lephare-tournefeuille.com/" },
          { name: "L’Escale", url: "https://lescale-tournefeuille.fr/" },
          { name: "L'Usine (Tournefeuille)", url: "https://www.lusine.net/" },
        ]}
      />

      <Section
        title="🎬 Cinémas d’Art et d’Essai"
  items={[
    { name: "ABC (cinéma)", url: "https://abc-toulouse.fr/" },
    { name: "L'American Cosmograph", url: "https://www.american-cosmograph.fr/" },
    { name: "Cinémathèque de Toulouse", url: "https://www.lacinemathequedetoulouse.com/" },
    { name: "Le Cratère (cinéma)", url: "https://www.cinemalecratere.com/" },
    { name: "Le Métro (cinéma)", url: "https://metropole.toulouse.fr/annuaire/cinema-le-metro" },
  ]}
      />

      <Section
        title="🎧 Blind Tests & Quiz Musicaux"
  items={[
    { name: "Thirsty Monk Quiz Night / Blind Test", url: "https://thethirstymonk.fr/" },
    { name: "George & Dragon", url: "https://www.facebook.com/GeorgeAndDragonToulouse/" },
    { name: "Blind Test Sauvage – BlackShepherd", url: "https://www.facebook.com/BlackShepherdEvent/" },
    { name: "Super Blind Test – Champagne", url: "https://www.instagram.com/superblindtest/" },
    { name: "Ô Boudu Pont", url: "https://www.facebook.com/obouddupont/" },
    { name: "Pub O'Clock", url: "https://www.facebook.com/puboclock/" },
    { name: "Four Monkeys", url: "https://www.four-monkeys.fr/" },
    { name: "The Danu Pub", url: "https://www.facebook.com/TheDanuPubToulouse/" },
    { name: "Tower of London", url: "https://www.facebook.com/thetoweroflondonpub/" },
    { name: "London Town", url: "https://www.facebook.com/LondonTownPubToulouse/" },
    { name: "Le Filochard", url: "https://www.facebook.com/lefilochard/" },
    { name: "Delicatessen", url: "https://www.facebook.com/DelicatessenToulouse/" },
    { name: "Melting Pot Pub", url: "https://www.facebook.com/meltingpotpubtoulouse/" },
    { name: "Black Lion", url: "https://www.facebook.com/BlackLionPubToulouse/" },
    { name: "Les 3T (Café-théâtre)", url: "https://www.3tcafetheatre.com/" },
    { name: "Quiz Room Toulouse", url: "https://quizroom.com/toulouse/" },
    { name: "Les Tricheurs", url: "https://www.facebook.com/lestricheursbar/" },
    { name: "Le LoKaL", url: "https://www.facebook.com/lokaltoulouse/" },
    { name: "Halles de la Cartoucherie", url: "https://hallesdelacartoucherie.com/" },
    { name: "Beers and Bretzels", url: "https://www.facebook.com/BeersAndBretzels/" },
    { name: "Café Ginette", url: "https://www.facebook.com/ginettetoulouse/" },
    { name: "La Biérothèque Corner Ramblas", url: "https://www.labierotheque-toulouse.fr/" },
    { name: "Little O'Clock", url: "https://www.facebook.com/LittleOClockToulouse/" },
    { name: "Levrette Café", url: "https://www.levrettecafe.fr/" },
    { name: "Le 42", url: "https://www.facebook.com/BarLe42Toulouse/" },
    { name: "Black Owl", url: "https://www.facebook.com/BlackOwlToulouse/" },
    { name: "Canaille Club", url: "https://www.facebook.com/canailleclub/" },
    { name: "TomTom", url: "https://www.facebook.com/tomtombartoulouse/" },
    { name: "Level Up", url: "https://www.facebook.com/levelupbar/" },
    { name: "Le Tchin", url: "https://www.facebook.com/BarLeTchin/" },
    { name: "Cacahuète", url: "https://www.facebook.com/barcacahuete/" },
    { name: "Marins d’eau douce", url: "https://www.facebook.com/marinsdeaudouce/" },
    { name: "La Mécanique des Fluides", url: "https://www.facebook.com/lamecaniquedesfluidestoulouse/" },
    { name: "L'Autruche", url: "https://www.facebook.com/BarLAutruche/" },
    { name: "Baraka Jeux", url: "https://baraka-jeux.fr/" },
    { name: "Biergaten Saint-Michel", url: "https://www.facebook.com/BiergatenStMichel/" },
    { name: "La Planque de Toulouse", url: "https://www.facebook.com/laplanquetoulouse/" },
    { name: "Matabiau Capsule Pub", url: "https://www.facebook.com/MatabiauCapsulePub/" },
    { name: "Fût et à Mesure", url: "https://www.fut-et-a-mesure.fr/toulouse/" },
    { name: "Au Pirouette", url: "https://www.facebook.com/aupirouette.toulouse/" },
    { name: "Spritz & Polpette", url: "https://www.facebook.com/SpritzPolpette/" },
    { name: "Le Jardin", url: "https://www.facebook.com/BarLeJardin/" },
    { name: "Chez Jacques", url: "https://www.facebook.com/chezjacques31/" },
    { name: "Les Chimères", url: "https://www.facebook.com/LesChimeresToulouse/" },
    { name: "Le Rhino", url: "https://www.facebook.com/rhino.toulouse/" },
    { name: "Le Bureau", url: "https://www.facebook.com/leBureauPubToulouse/" },
    { name: "Le Bernabé", url: "https://www.facebook.com/LeBernabeToulouse/" },
    { name: "Le Minimum", url: "https://www.facebook.com/MinimumToulouse/" },
    { name: "Le Bullrush", url: "https://www.facebook.com/BullrushToulouse/" },
    { name: "Le Gloria Bar", url: "https://www.facebook.com/gloriabartoulouse/" },
    { name: "KD", url: "https://www.facebook.com/KDtoulouse/" },
    { name: "L'Engrenage", url: "https://www.facebook.com/L.engrenage.toulouse/" },
    { name: "La Guilde d'Andérexia", url: "https://laguildedanderexias.fr/" },
    { name: "Obohem", url: "https://www.facebook.com/obohem/" },
    { name: "Les Merles Moqueurs", url: "https://www.facebook.com/LesMerlesMoqueurs/" },
    { name: "Le Bijou", url: "https://www.le-bijou.net/" },
    { name: "Hoppy Monkey Pub", url: "https://www.facebook.com/HoppyMonkeyPub/" },
    { name: "Seven Sisters", url: "https://www.facebook.com/sevensisterstoulouse/" },
    { name: "Bear's House", url: "https://www.facebook.com/BearsHouseToulouse/" },
    { name: "La Bistrothèque de Gramont", url: "https://www.facebook.com/LaBistrothquedeGramont/" },
    { name: "FlashBack Café", url: "https://toulouse.flashbackcafe.fr/" },
    { name: "Délirium", url: "https://www.facebook.com/DeliriumToulouse/" },
    { name: "L'Evasion", url: "https://www.facebook.com/levasiontoulouse/" },
    { name: "Médiathèque José Cabanis", url: "https://www.bibliotheque.toulouse.fr/" },
    { name: "Quiz au Champagne", url: "https://www.instagram.com/superblindtest/" },
  ]}
      />

      <Section
        title="🎤 Karaoké"
  items={[
    { name: "L’Ecran Pop (au Pathé Wilson)", url: "https://lecranpop.com/" },
    { name: "Le Karioka", url: "https://www.kariokatoulouse.fr/" },
    { name: "Bar l'Autruche", url: "https://www.facebook.com/BarLAutruche/" },
    { name: "Pub The George and Dragon", url: "https://www.facebook.com/GeorgeAndDragonToulouse/" },
    { name: "Bar Le Dauphin", url: "https://www.facebook.com/BarLeDauphin/" },
    { name: "Le Chorus", url: "https://www.facebook.com/lechorustoulouse/" },
    { name: "Le 9, rue Louis Lejeune", url: "https://www.reservationsle9.fr/" },
    { name: "You Sing Toulouse Montaudran", url: "https://www.yousing.fr/" },
    { name: "FourTwenty Bar", url: "https://www.facebook.com/FourTwentyBarToulouse/" },
    { name: "Ô Boudu Pont", url: "https://www.facebook.com/obouddupont/" },
    { name: "Bar The Classroom Toulouse", url: "https://www.theclassroom.fr/" },
    { name: "Bar La Maison", url: "https://www.facebook.com/BarLaMaisonToulouse/" },
    { name: "Bar Le Saint des Seins", url: "https://www.facebook.com/saint.des.seins/" },
    { name: "La Bièrothèque Gramont", url: "https://www.facebook.com/LaBierothequedeGramont/" },
    { name: "Karnage Club", url: "https://karnageclub.fr/" },
    { name: "Games Factory", url: "https://gamesfactory.fr/" },
    { name: "Trampoline Park Toulouse", url: "https://www.trampolinepark.fr/toulouse" },
    { name: "Le Ministère des Brasseurs", url: "https://www.facebook.com/ministeredesbrasseurs/" },
    { name: "Monsieur Georges", url: "https://www.facebook.com/MrGeorgesToulouse/" },
    { name: "Saint Jérôme (ex Chez Joseph)", url: "https://www.facebook.com/SaintJeromeToulouse/" },
    { name: "Bar Des Zés", url: "https://www.facebook.com/BarDesZesToulouse/" },
    { name: "Les Halles de la Transition", url: "https://www.hallesdelatransition.com/" },
    { name: "La Halle de la Cartoucherie", url: "https://hallesdelacartoucherie.com/" },
    { name: "La Friche Gourmande", url: "https://lafrichegourmandetoulouse.com/" },
    { name: "Au Fût et à Mesure Toulouse", url: "https://www.fut-et-a-mesure.fr/toulouse/" },
    { name: "La Cave à Rock", url: "https://www.facebook.com/lacavearocktoulouse/" },
    { name: "El CIRCO BAR LATINO Y TAPAS", url: "https://www.facebook.com/elcircotoulouse/" },
    { name: "La Guinguette d’Odyssud", url: "https://www.facebook.com/guinguettedodyssud/" },
    { name: "Le Rhino", url: "https://www.facebook.com/rhino.toulouse/" },
    { name: "Le Dubliners", url: "https://www.facebook.com/dublinerspubtoulouse/" },
    { name: "The London Town", url: "https://www.facebook.com/LondonTownPubToulouse/" },
    { name: "Bistrot 13", url: "https://www.facebook.com/bistrot13toulouse/" },
    { name: "P3", url: "https://www.facebook.com/leP3toulouse/" },
    { name: "Ibar", url: "https://www.facebook.com/IbarToulouse/" },
    { name: "Beer and Potes", url: "https://www.facebook.com/beerandpotes/" },
    { name: "Pirouette", url: "https://www.facebook.com/aupirouette.toulouse/" },
    { name: "Bentleys Pub", url: "https://www.facebook.com/bentleyspubtoulouse/" },
    { name: "Noize Bar", url: "https://www.facebook.com/noizebartoulouse/" },
    { name: "The Danu", url: "https://www.facebook.com/TheDanuPubToulouse/" },
    { name: "Café des Artistes", url: "https://www.facebook.com/cafedesartistes.toulouse/" },
    { name: "QuinQuina Bar", url: "https://www.facebook.com/quinquinabar/" },
    { name: "Bistrot 12", url: "https://www.facebook.com/bistrot12toulouse/" },
    { name: "L'Improvisé", url: "https://www.facebook.com/LImproviseBar/" },
    { name: "Chez Jacques", url: "https://www.facebook.com/chezjacques31/" },
    { name: "Tower of London", url: "https://www.facebook.com/thetoweroflondonpub/" },
    { name: "Restaurant O7", url: "https://www.facebook.com/restaurantO7toulouse/" },
    { name: "Restaurant La Grange", url: "https://www.facebook.com/lagrangetoulouse/" },
    { name: "La Cave de Papy", url: "https://www.facebook.com/lacavedepapytoulouse/" },
    { name: "Bistrot 101", url: "https://www.facebook.com/bistrot101toulouse/" },
    { name: "Le 145", url: "https://www.facebook.com/Le145Toulouse/" },
    { name: "Flunch Labège", url: "https://www.flunch.fr/restaurant/flunch-labege/" },
  ]}
      />
    </div>
  );
}
