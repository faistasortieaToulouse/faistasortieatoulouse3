import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import ical, { VEvent } from 'ical';

const ICAL_URLS = [
    "https://www.meetup.com/toulouse-sorties-evenements-soirees-balades-visites-randos/events/ical/"
];

type MeetupEventItem = {
    title: string;
    link: string;
    startDate: Date;
    location: string;
    fullAddress: string;
    description: string;
    coverImage?: string;
};

/* ----------------------------------------------------
   NORMALISATION DES DATES iCal
---------------------------------------------------- */
function normalizeICalDate(date: any): Date | null {
    if (!date) return null;

    if (date instanceof Date) return date;
    if (typeof date === "string") return new Date(date);

    if (typeof date === "object" && date.val) {
        return new Date(date.val);
    }

    return null;
}

/* ----------------------------------------------------
   SCRAPING (og:image + JSON-LD adresse)
---------------------------------------------------- */
async function scrapeEventData(url: string): Promise<{ coverImage?: string; fullAddress?: string }> {
    try {
        const res = await fetch(url);
        if (!res.ok) return {};

        const html = await res.text();
        const $ = cheerio.load(html);

        const ogImage = $('meta[property="og:image"]').attr('content');

        let fullAddress: string | undefined;

        $('script[type="application/ld+json"]').each((i, elem) => {
            try {
                const jsonText = $(elem).html();
                if (!jsonText) return;

                const data = JSON.parse(jsonText);

                if (data['@type'] === 'Event' || data['@type'] === 'FoodEvent') {
                    const addr = data.location?.address;
                    if (addr && addr.streetAddress) {
                        fullAddress =
                            `${addr.streetAddress}, ${addr.addressLocality || ""}`
                                .trim()
                                .replace(/,$/, "");
                    }
                }
            } catch { }
        });

        return { coverImage: ogImage, fullAddress };
    } catch {
        return {};
    }
}

/* ----------------------------------------------------
   ROUTE HANDLER PRINCIPAL
---------------------------------------------------- */
export async function GET() {
    try {
        // Fetch des flux iCal
        const allCalendars = await Promise.all(
            ICAL_URLS.map(async url => {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`Erreur iCal: ${url}`);
                return ical.parseICS(await res.text());
            })
        );

        // Déduplication
        const unique = new Map<string, VEvent>();
        for (const cal of allCalendars) {
            for (const key in cal) {
                const evt = cal[key];
                if (evt.type === 'VEVENT' && evt.start) {
                    const uniqueKey = evt.uid || evt.summary + evt.start;
                    unique.set(uniqueKey, evt as VEvent);
                }
            }
        }

        const uniqueEvents = Array.from(unique.values());

        // Traitement + scraping
        const processedEvents = await Promise.all(
            uniqueEvents.map(async event => {
                let url;

                if (typeof event.url === 'string') url = event.url;
                else if (event.url?.val) url = event.url.val;

                if (!url && event.uid) {
                    url = `https://www.meetup.com/fr-FR/events/${event.uid}/`;
                }

                const scraped = url ? await scrapeEventData(url) : {};

                const icalAddress = (event.location || "").trim();
                const finalAddress =
                    icalAddress ||
                    scraped.fullAddress ||
                    "Lieu non spécifié";

                return {
                    title: event.summary || "Événement sans titre",
                    link: url || "",
                    startDate: normalizeICalDate(event.start) || new Date(),
                    location: finalAddress.split(",")[0] || finalAddress,
                    fullAddress: finalAddress,
                    description: String(event.description || "Pas de description."),
                    coverImage: scraped.coverImage
                } as MeetupEventItem;
            })
        );

        /* ----------------------------------------------------
           FILTRAGE : aujourd’hui → +31 jours
        ---------------------------------------------------- */
        const now = new Date();
        const end = new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000);

        let finalEvents = processedEvents.filter(e =>
            e.startDate >= now && e.startDate < end
        );

        finalEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

        /* ----------------------------------------------------
           RÉPONSE
        ---------------------------------------------------- */
        return NextResponse.json(
            {
                events: finalEvents,
                totalEvents: finalEvents.length
            },
            {
                status: 200,
                headers: {
                    "Cache-Control":
                        "public, s-maxage=604800, stale-while-revalidate=604800"
                }
            }
        );

    } catch (error) {
        console.error("Erreur Meetup-sorties :", error);

        return NextResponse.json(
            { error: "Impossible de charger les événements Meetup iCal." },
            { status: 500 }
        );
    }
}
