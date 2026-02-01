import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import ical, { VEvent } from 'ical';

// --- Configuration des Flux iCalendar ---
const ICAL_GROUPS: string[][] = [
  // Lot 1
  [
    "https://www.meetup.com/fr-FR/Espanoles-en-Toulouse/events/ical/",
    "https://www.meetup.com/fr-FR/activites-tls-jeux-de-societe-diners-art-vin-outdoor/events/ical/",
    "https://www.meetup.com/fr-FR/play-english-board-games-in-toulouse/events/ical/",
    "https://www.meetup.com/fr-FR/8f97cfe6-9d63-4268-bba2-e2b16db340bb/events/ical/",
    "https://www.meetup.com/fr-FR/toulouse-galleries-meetup-group/events/ical/",
    "https://www.meetup.com/fr-FR/creative-mornings-running/events/ical/",
    "https://www.meetup.com/fr-FR/agile-toulouse/events/ical/",
    "https://www.meetup.com/fr-FR/espritwafu/events/ical/",
    "https://www.meetup.com/fr-FR/meetup-group-qbmdpprq/events/ical/",
    "https://www.meetup.com/fr-FR/speakenglishtoulouse/events/ical/",
    "https://www.meetup.com/fr-FR/yolo-toulouse-socializing-concerts-outings/events/ical/",
    "https://www.meetup.com/fr-FR/toulouse-sociale-meetup-group/events/ical/",
    "https://www.meetup.com/colocation-logement-hebergement-emploi-job-stage-toulouse/events/ical/",
    "https://www.meetup.com/toulouse-sorties-evenements-soirees-balades-visites-randos/events/ical/",
    "https://www.meetup.com/expats-in-toulouse/events/ical/"
  ],
  // Lot 2
  [
    "https://www.meetup.com/fr-FR/Meetup-HarryCow-coworking-Toulouse/events/ical/",
    "https://www.meetup.com/fr-FR/cercle-dambition-morale/events/ical/",
    "https://www.meetup.com/fr-FR/crea-toulouse/events/ical/",
    "https://www.meetup.com/fr-FR/art-lovers-art-events/events/ical/",
    "https://www.meetup.com/fr-FR/toulouse-pause-cafe-sprituelle/events/ical/",
    "https://www.meetup.com/fr-FR/toulouse-recommended-boardgames-meetup-group/events/ical/",
    "https://www.meetup.com/fr-FR/soirees-cine-philo/events/ical/",
    "https://www.meetup.com/fr-FR/rotary-toulouse-ovalie/events/ical/",
    "https://www.meetup.com/fr-FR/the_art_of_noticing_toulouse/events/ical/",
    "https://www.meetup.com/fr-FR/cafe-das-maes/events/ical/",
    "https://www.meetup.com/fr-FR/frenchproduit-sudouest-toulouse/events/ical/",
    "https://www.meetup.com/fr-FR/les-rendez-vous-de-la-bulle-mage/events/ical/"
  ],
  // Lot 3
  [
    "https://www.meetup.com/fr-FR/les-rendez-vous-de-la-bulle-mage/events/ical/",
    "https://www.meetup.com/fr-FR/the-friendly-debate/events/ical/",
    "https://www.meetup.com/fr-FR/colocation-logement-hebergement-emploi-job-stage-toulouse/events/ical/",
    "https://www.meetup.com/fr-FR/toulouse-sorties-evenements-soirees-balades-visites-randos/events/ical/",
    "https://www.meetup.com/fr-FR/expats-in-toulouse/events/ical/",
    "https://www.meetup.com/fr-FR/toulouse-free-evenements-to-discover/events/ical/",
    "https://www.meetup.com/fr-FR/meetup-group-iozolhsj/events/ical/",
    "https://www.meetup.com/fr-FR/toulouse-free-evenements-to-discover/events/ical/",
    "https://www.meetup.com/fr-FR/international-mondays-tower-of-london/events/ical/",
    "https://www.meetup.com/fr-FR/Yellow-Chatters-Toulouse-International-Community/events/ical/",
    "https://www.meetup.com/fr-FR/toulouse-hiking-meetup-group/events/ical/",
    "https://www.meetup.com/fr-FR/rando-entre-femmes-nature-convivialite/events/ical/"
  ],
  // Lot 4
  [
    "https://www.meetup.com/fr-FR/meetup-group-pdfpdjis/events/ical/",
    "https://www.meetup.com/fr-FR/friday-night-live-fnl/events/ical/",
    "https://www.meetup.com/fr-FR/la-sauce-viens-relever-ta-creativite-au-sol-entre-meufs/events/ical/",
    "https://www.meetup.com/fr-FR/contesatoulouse/events/ical/",
    "https://www.meetup.com/fr-FR/groupe-meetup-toulouse-philosophie/events/ical/",
    "https://www.meetup.com/fr-FR/el-patio-lab/events/ical/",
    "https://www.meetup.com/fr-FR/danse-flamenco/events/ical/",
    "https://www.meetup.com/fr-FR/danses-traditionnelles-indiennes-a-toulouse/events/ical/",
    "https://www.meetup.com/fr-FR/toulouse-k-pop-dance-evolution/events/ical/",
    "https://www.meetup.com/fr-FR/la-bulle-creative/events/ical/",
    "https://www.meetup.com/fr-FR/pages-n-pies/events/ical/",
    "https://www.meetup.com/fr-FR/se-faire-des-amis-en-randonnant-%EF%B8%8F/events/ical/"
  ],
  // Lot 5
  [
    "https://www.meetup.com/fr-FR/toulouse-diy-do-it-yourself-meetup-group/events/ical/",
    "https://www.meetup.com/fr-FR/studio-video-photo-podcast-toulouse/events/ical/",
    "https://www.meetup.com/fr-FR/le-club-des-curieux/events/ical/",
    "https://www.meetup.com/fr-FR/rencontre-creative-en-bioceramique/events/ical/",
    "https://www.meetup.com/fr-FR/occitania-hikes/events/ical/",
    "https://www.meetup.com/fr-FR/Toulouse-travel-photography/events/ical/",
    "https://www.meetup.com/fr-FR/toulouse-petanque/events/ical/",
    "https://www.meetup.com/fr-FR/toulouse-viajes-aventura-meetup-group/events/ical/",
    "https://www.meetup.com/fr-FR/meetup-group-ogveclmn/events/ical/",
    "https://www.meetup.com/fr-FR/Gnosis-Toulouse/events/ical/",
    "https://www.meetup.com/fr-FR/The-Freedom-Trail-Trek-Meetup/events/ical/"
  ]
];

// --- Types de données ---
type MeetupEventItem = {
  title: string;
  link: string;
  startDate: Date;
  location: string;
  fullAddress: string;
  description: string;
  coverImage?: string;
};

// --- Scraping ---
async function scrapeEventData(url: string): Promise<{ coverImage?: string; fullAddress?: string }> {
  try {
    const res = await fetch(url);
    if (!res.ok) return {};
    const html = await res.text();
    const $ = cheerio.load(html);

    const ogImage = $('meta[property="og:image"]').attr('content');
    let fullAddress: string | undefined;

    $('script[type="application/ld+json"]').each((_, elem) => {
      try {
        const json = $(elem).html();
        if (!json) return;
        const data = JSON.parse(json);
        if (data['@type'] === 'Event' || data['@type'] === 'FoodEvent') {
          const addr = data.location?.address;
          if (addr?.streetAddress) {
            fullAddress = `${addr.streetAddress}, ${addr.addressLocality || ''}`.trim().replace(/,$/, '');
            return false;
          }
        }
      } catch {}
    });

    return { coverImage: ogImage, fullAddress };
  } catch { return {}; }
}

// --- Fonction de récupération d’un lot ---
async function fetchLot(lot: string[]): Promise<MeetupEventItem[]> {
  const allCalendars = await Promise.all(lot.map(async url => {
    const res = await fetch(url);
    const data = await res.text();
    return ical.parseICS(data);
  }));

  const uniqueMap = new Map<string, VEvent>();
  for (const calendar of allCalendars) {
    for (const key in calendar) {
      const event = calendar[key] as VEvent;
      if (event.type === 'VEVENT' && event.start) {
        const id = event.uid || event.summary + event.start.toISOString();
        uniqueMap.set(id, event);
      }
    }
  }

  const events = Array.from(uniqueMap.values());

  const processed = await Promise.all(events.map(async e => {
    let url: string | undefined;
    if (typeof e.url === "string" && e.url.startsWith("http")) url = e.url;
    else if (typeof e.url === "object" && e.url?.val?.startsWith("http")) url = e.url.val;
    else url = e.uid ? `https://www.meetup.com/fr-FR/events/${e.uid}/` : undefined;

    const extra = url ? await scrapeEventData(url) : {};

    const icalAddress = (e.location || '').trim();
    const jsonAddress = extra.fullAddress || '';
    const finalAddress = icalAddress || jsonAddress || "Lieu non spécifié";

    return {
      title: e.summary || "Événement sans titre",
      link: url || "",
      startDate: new Date(e.start),
      location: e.location?.split(",")[0] || finalAddress,
      fullAddress: finalAddress,
      description: String(e.description || "Pas de description"),
      coverImage: extra.coverImage,
    } as MeetupEventItem;
  }));

  return processed;
}

// --- Cache global en mémoire ---
let CACHE: MeetupEventItem[] = [];

// --- Route API ---
export async function GET() {
  try {
    const now = new Date();

    // --- Lot 1 : immédiat et en parallèle ---
    const lot1Events = await fetchLot(ICAL_GROUPS[0]);
    CACHE = lot1Events;

    // --- Lots 2 à 5 : chargement progressif toutes les 10 minutes ---
    ICAL_GROUPS.slice(1).forEach((lot, index) => {
      setTimeout(async () => {
        const lotEvents = await fetchLot(lot);
        CACHE = [...CACHE, ...lotEvents];
        console.log(`Lot ${index + 2} rafraîchi avec ${lotEvents.length} événements.`);
      }, (index + 1) * 10 * 60 * 1000); // 10 minutes
    });

    // --- Filtrage 31 jours à venir ---
    const endFilter = new Date(now.getTime() + 31 * 86400000);
    const filtered = CACHE.filter(e => e.startDate >= now && e.startDate < endFilter);
    filtered.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    const headers = { 'Cache-Control': `public, s-maxage=3600, stale-while-revalidate=3600` };

    return NextResponse.json({ events: filtered, totalEvents: filtered.length }, { status: 200, headers });
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors de la récupération des événements" }, { status: 500 });
  }
}
