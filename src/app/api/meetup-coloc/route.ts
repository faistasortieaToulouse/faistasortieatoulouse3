import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio'; 
import ical, { VEvent } from 'ical';

// --- Configuration iCal ---
const ICAL_URLS = [
    "https://www.meetup.com/colocation-logement-hebergement-emploi-job-stage-toulouse/events/ical/"
];

// --- Types ---
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

        let fullAddress: string | undefined = undefined;

        $('script[type="application/ld+json"]').each((i, elem) => {
            try {
                const jsonText = $(elem).html();
                if (!jsonText) return;

                const data = JSON.parse(jsonText);

                if (data['@type'] === 'FoodEvent' || data['@type'] === 'Event') {
                    const address = data.location?.address;
                    if (address?.streetAddress) {
                        fullAddress =
                            `${address.streetAddress}, ${address.addressLocality || ''}`
                                .trim()
                                .replace(/,$/, '');
                        return false;
                    }
                }
            } catch (_) {}
        });

        return { coverImage: ogImage, fullAddress };
    } catch (_) {
        return {};
    }
}

// --- GET Route ---
export async function GET(request: Request) {
    try {
        const fetchPromises = ICAL_URLS.map(async url => {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Erreur iCal: ${url}`);
            const data = await res.text();
            return ical.parseICS(data);
        });

        const allCalendars = await Promise.all(fetchPromises);
        const uniqueEventsMap = new Map<string, VEvent>();

        for (const calendar of allCalendars) {
            for (const key in calendar) {
                const event = calendar[key] as VEvent;
                if (event.type !== 'VEVENT' || !event.start) continue;
                uniqueEventsMap.set(event.uid || key, event);
            }
        }

        const uniqueEvents = Array.from(uniqueEventsMap.values());

        const processedEventsPromises = uniqueEvents.map(async event => {
            let url: string | undefined = undefined;

            const rawUrl = event.url;
            if (typeof rawUrl === 'string' && rawUrl.startsWith('http')) url = rawUrl;
            else if (typeof rawUrl === 'object' && rawUrl?.val?.startsWith('http')) url = rawUrl.val;
            else if (event.uid) url = `https://www.meetup.com/fr-FR/events/${event.uid}/`;

            let eventData = url ? await scrapeEventData(url) : {};

            const icalAddress = (event.location || '').trim();
            const jsonLdAddress = eventData.fullAddress || '';
            const finalAddress = icalAddress || jsonLdAddress || "Lieu non spécifié";

            const locationName = event.location?.split(',')[0]?.trim() || finalAddress;

            const eventItem: MeetupEventItem = {
                title: event.summary || "Événement sans titre",
                link: url || "",
                startDate: new Date(event.start),
                location: locationName,
                fullAddress: finalAddress,
                description: String(event.description || "Pas de description."),
                coverImage: eventData.coverImage
            };

            // --- Correction des dates dépassées ---
            const now = new Date();
            if (eventItem.startDate.getTime() < now.getTime()) {
                eventItem.startDate = new Date(now.getTime());
            }

            return eventItem;
        });

        let finalEvents = await Promise.all(processedEventsPromises);

        const now = new Date();
        const FILTER_END_DATE = new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000);

        finalEvents = finalEvents.filter(event =>
            event.startDate.getTime() >= now.getTime() &&
            event.startDate.getTime() < FILTER_END_DATE.getTime()
        );

        finalEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

        return NextResponse.json(
            {
                events: finalEvents,
                totalEvents: finalEvents.length
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": `public, s-maxage=604800, stale-while-revalidate=604800`
                }
            }
        );

    } catch (error) {
        console.error("Erreur meetup-coloc:", error);
        return NextResponse.json(
            { error: "Impossible de charger les événements." },
            { status: 500 }
        );
    }
}
