import { NextResponse } from "next/server";
import Parser from "rss-parser";

const keywords = ["ciné", "cine", "conf", "expo"];

const getEventImage = (title?: string) => {
  if (!title) return "/images/capitole/capidefaut.jpg";
  const lower = title.toLowerCase();
  if (lower.includes("ciné") || lower.includes("cine")) return "/images/capitole/capicine.jpg";
  if (lower.includes("conf")) return "/images/capitole/capiconf.jpg";
  if (lower.includes("expo")) return "/images/capitole/capiexpo.jpg";
  return "/images/capitole/capidefaut.jpg";
};

export async function GET() {
  try {
    const rssUrl =
      "https://www.ut-capitole.fr/adminsite/webservices/export_rss.jsp?NOMBRE=50&CODE_RUBRIQUE=1315555643369&LANGUE=0";

    const res = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/rss+xml, application/xml",
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const xml = await res.text();
    const parser = new Parser();
    const feed = await parser.parseString(xml);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = (feed.items || [])
      .filter(item => item.title && keywords.some(k => item.title.toLowerCase().includes(k)))
      .map(item => {
        let startDate = item.pubDate ? new Date(item.pubDate) : new Date(today);
        if (isNaN(startDate.getTime()) || startDate < today) startDate = new Date(today);

        return {
          id: item.guid || item.link || item.title,
          title: item.title?.trim(),
          description: item.contentSnippet || "Événement ouvert à tous",
          url: item.link,
          image: getEventImage(item.title),
          start: startDate.toISOString(),
          end: null,
          location: null,
          source: "Université Toulouse Capitole",
        };
      });

    return NextResponse.json(events.length > 0 ? events : [
      {
        id: "fallback1",
        title: "Ciné UT Capitole",
        description: "Événement simulé",
        url: "#",
        image: "/images/capitole/capicine.jpg",
        start: new Date().toISOString(),
        source: "Université Toulouse Capitole",
      },
    ], { status: 200 });

  } catch (err: any) {
    console.error("Flux UT Capitole inaccessible :", err);
    return NextResponse.json([
      {
        id: "fallback1",
        title: "Ciné UT Capitole",
        description: "Événement simulé",
        url: "#",
        image: "/images/capitole/capicine.jpg",
        start: new Date().toISOString(),
        source: "Université Toulouse Capitole",
      },
    ], { status: 200 });
  }
}
