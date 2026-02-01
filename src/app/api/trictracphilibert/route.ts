// src/app/api/trictracphilibert/route.ts

export const runtime = 'nodejs'; // nécessaire pour rss-parser

import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

// --- Flux RSS ---
const RSS_FEEDS = [
  {
    name: 'JeuxOnline',
    urls: {
      Actualites: 'https://jeux-plateau-societe.jeuxonline.info/rss/actualites/rss.xml',
      Critiques: 'https://jeux-plateau-societe.jeuxonline.info/rss/critiques/rss.xml',
      Videos: 'https://jeux-plateau-societe.jeuxonline.info/rss/videos/rss.xml',
    },
    userAgent: 'Mozilla/5.0 (compatible; JeuxPlateauBot/1.0)',
  },
  {
    name: 'Philibert.net',
    urls: {
      Actualites: 'https://www.philibertnet.com/modules/feeder/rss.php?id_category=8051',
    },
    userAgent: 'Mozilla/5.0 (compatible; NextJS-RSS-Bot/1.0)',
  },
];

// Parser RSS
const parser = new Parser({
  customFields: {
    item: [['dc:creator', 'creator']],
  },
});

// Fetch sécurisé avec User-Agent
async function fetchRss(url: string, userAgent: string) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': userAgent,
      'Accept': 'application/rss+xml, application/xml;q=0.9,*/*;q=0.8',
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res.text();
}

// Endpoint GET
export async function GET() {
  try {
    const allItems: any[] = [];

    for (const feedSource of RSS_FEEDS) {
      for (const [category, url] of Object.entries(feedSource.urls)) {
        try {
          const xml = await fetchRss(url, feedSource.userAgent);
          const feed = await parser.parseString(xml);

          const items = feed.items.map((item, idx) => ({
            id: `${feedSource.name}-${category}-${idx}`,
            title: item.title ?? '',
            link: item.link ?? '',
            pubDate: item.pubDate ?? '',
            snippet: item.contentSnippet || item.content || '',
            creator: item.creator || 'Inconnu',
            category,
            source: feedSource.name,
          }));

          allItems.push(...items);
        } catch (err: any) {
          console.warn(`[${feedSource.name}] Flux ${category} ignoré : ${err.message}`);
        }
      }
    }

    // Tri par date décroissante
    allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return NextResponse.json({
      title: 'Agrégation JeuxOnline + Philibert',
      description: 'Articles récents de JeuxOnline et Philibert',
      count: allItems.length,
      items: allItems,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'Erreur lors de l’agrégation des flux RSS',
        details: err.message || 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}
