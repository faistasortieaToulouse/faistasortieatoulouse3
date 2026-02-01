import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio'; 
import ical, { VEvent } from 'ical'; 

// --- Configuration des Flux iCalendar (vos 15 URLs) ---
const ICAL_URLS = [
    "https://www.meetup.com/colocation-logement-hebergement-emploi-job-stage-toulouse/events/ical/",
    "https://www.meetup.com/toulouse-sorties-evenements-soirees-balades-visites-randos/events/ical/",
    "https://www.meetup.com/expats-in-toulouse/events/ical/"
];

// --- Types de Données pour le retour API (AJOUT de fullAddress) ---
type MeetupEventItem = {
  title: string;
  link: string;
  startDate: Date;      
  location: string;
  fullAddress: string; // Ajouté pour contenir l'adresse complète (iCal ou Scrapée)
  description: string;
  coverImage?: string; 
};

// --- Fonction de Scraping des Données (Image et Adresse JSON-LD) ---
async function scrapeEventData(url: string): Promise<{ coverImage?: string; fullAddress?: string }> {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.warn(`Impossible de scraper les données sur : ${url}. Statut: ${res.status}`);
            return {};
        }
        const html = await res.text();
        const $ = cheerio.load(html);
        
        // 1. Scraping de l'image (og:image)
        const ogImage = $('meta[property="og:image"]').attr('content');
        
        // 2. Scraping de l'adresse à partir du JSON-LD (Solution de secours)
        let fullAddress: string | undefined = undefined;
        $('script[type="application/ld+json"]').each((i, elem) => {
            try {
                const jsonText = $(elem).html();
                if (jsonText) {
                    const data = JSON.parse(jsonText);
                    // Cherche les types Event ou FoodEvent
                    if (data['@type'] === 'FoodEvent' || data['@type'] === 'Event') {
                        const address = data.location?.address;
                        if (address && address.streetAddress) {
                            // Combine l'adresse de la rue et la localité/ville
                            fullAddress = `${address.streetAddress}, ${address.addressLocality || ''}`.trim().replace(/,$/, '').trim();
                            return false; // Arrêter la boucle après avoir trouvé
                        }
                    }
                }
            } catch (e) {
                // Ignore les erreurs de parsing JSON
            }
        });

        return { coverImage: ogImage, fullAddress };
    } catch (error) {
        console.error(`Erreur lors du scraping des données pour ${url}:`, error);
        return {};
    }
}

// --- Route Handler Principal (GET) ---
export async function GET(request: Request) {

    try {
        // NOTE: Retrait de la pagination (page, limit, startIndex) pour afficher tous les 31 jours.

        // 1. Récupération parallèle des flux iCalendar
        const fetchPromises = ICAL_URLS.map(async url => {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Erreur HTTP lors de la récupération de l'iCal: ${url}`);
            const data = await res.text();
            return ical.parseICS(data);
        });

        const allCalendars = await Promise.all(fetchPromises);
        const uniqueEventsMap = new Map<string, VEvent>();
        
        // 2. Déduplication des événements
        for (const calendar of allCalendars) {
            for (const key in calendar) {
                const event = calendar[key] as VEvent;
                if (event.type === 'VEVENT' && event.start) {
                    const uniqueKey = event.uid || event.summary + event.start.toISOString(); 
                    uniqueEventsMap.set(uniqueKey, event);
                }
            }
        }
        
        const uniqueEvents = Array.from(uniqueEventsMap.values());
        
        // 3. Traitement Parallèle (URL fix/Scraping image et adresse)
        const processedEventsPromises = uniqueEvents.map(async event => {
            const rawUrl = event.url;
            let url: string | undefined = undefined;

            // Fixe l'URL de l'événement
            if (typeof rawUrl === 'string' && rawUrl.startsWith('http')) {
                url = rawUrl;
            } else if (typeof rawUrl === 'object' && rawUrl !== null && 'val' in rawUrl && typeof rawUrl.val === 'string' && rawUrl.val.startsWith('http')) {
                url = rawUrl.val;
            }
            
            if (!url) {
                url = event.uid ? `https://www.meetup.com/fr-FR/events/${event.uid}/` : undefined;
            }
            
            let eventData: { coverImage?: string; fullAddress?: string } = {};

            if (url) { 
                eventData = await scrapeEventData(url); // Scrape l'image ET l'adresse JSON-LD
            }

            // Logique de sélection de l'adresse la plus fiable:
            const icalAddress = (event.location || '').trim();
            const jsonLdAddress = eventData.fullAddress || '';
            const finalAddress = icalAddress || jsonLdAddress || 'Lieu non spécifié';
            const locationName = event.location?.split(',')[0].trim() || finalAddress; 

            const eventItem: MeetupEventItem = {
                title: event.summary || 'Événement sans titre',
                link: url || '', 
                startDate: new Date(event.start),
                location: locationName,
                fullAddress: finalAddress, // Champ pour l'affichage de l'adresse complète
                description: String(event.description || 'Pas de description.'), 
                coverImage: eventData.coverImage,
            };
            return eventItem;
        });

        let finalEvents = await Promise.all(processedEventsPromises);
        
        // 4. FILTRAGE CRITIQUE : Événements dans les 31 jours à partir de MAINTENANT
        const now = new Date();
        const DAYS_TO_FILTER = 31;
        
        // Calcul de la date de fin (Aujourd'hui + 31 jours en millisecondes)
        const FILTER_END_DATE = new Date(now.getTime() + (DAYS_TO_FILTER * 24 * 60 * 60 * 1000));

        finalEvents = finalEvents.filter(event => 
            // 1. Événements non passés (par rapport à l'heure actuelle)
            event.startDate.getTime() >= now.getTime() && 
            // 2. Événements dans les 31 jours suivants
            event.startDate.getTime() < FILTER_END_DATE.getTime()
        );

        // Trier du plus proche au plus lointain
        finalEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
        
        // 5. Retourner tous les événements (sans pagination)
        const totalEvents = finalEvents.length;
        const ONE_WEEK_IN_SECONDS = 604800; // Cache une semaine

        const headers = {
            'Cache-Control': `public, s-maxage=${ONE_WEEK_IN_SECONDS}, stale-while-revalidate=${ONE_WEEK_IN_SECONDS}` 
        };

        return NextResponse.json({ 
          events: finalEvents,
          totalEvents: totalEvents,
          // Suppression des champs de pagination obsolètes
        }, { status: 200, headers });
        
    } catch (error) {
        console.error("Erreur critique lors du traitement des flux iCalendar:", error);
        return NextResponse.json(
          { error: "Impossible de charger les événements Meetup via iCalendar." }, 
          { status: 500 }
        );
    }
}