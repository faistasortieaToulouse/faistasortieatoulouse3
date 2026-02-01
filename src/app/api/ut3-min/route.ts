import { NextResponse } from "next/server";
import ICAL from "ical.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const keywords = ["ciné", "cine", "conf", "expo"];

const getEventImage = (title: string | undefined) => {
  if (!title) return "/images/ut3/ut3default.jpg";
  const lower = title.toLowerCase();
  if (lower.includes("ciné") || lower.includes("cine")) return "/images/ut3/ut3cine.jpg";
  if (lower.includes("conf")) return "/images/ut3/ut3conf.jpg";
  if (lower.includes("expo")) return "/images/ut3/ut3expo.jpg";
  return "/images/ut3/ut3default.jpg";
};

export async function GET() {
  try {
    const icalUrl = "https://www.univ-tlse3.fr/servlet/com.jsbsoft.jtf.core.SG?EXT=agenda&PROC=RECHERCHE_AGENDA&ACTION=EXPORT_DIRECT&THEMATIQUE=0000&DTSTART=01/11/2025&AFFICHAGE=mensuel&CODE_RUBRIQUE=WEB&CATEGORIE=0000&LIEU=0000&DTEND=31/12/2025";

    const res = await fetch(icalUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const icsText = await res.text();
    
    // Parsing du flux avec ical.js
    const jcalData = ICAL.parse(icsText);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");

    const events = vevents.map(vevent => {
      const event = new ICAL.Event(vevent);
      return {
        id: event.uid,
        title: event.summary,
        start: event.startDate.toJSDate(),
        end: event.endDate.toJSDate(),
        location: event.location || "Université Paul Sabatier",
        description: "Évènement ouvert à tout type de public extérieur à l'université",
        url: "https://www.univ-tlse3.fr/actualites/agenda",
        image: getEventImage(event.summary),
        source: "Université Toulouse III - Paul Sabatier",
      };
    }).filter(ev => 
      ev.title && keywords.some(k => ev.title.toLowerCase().includes(k))
    );

    return NextResponse.json(events, { status: 200 });

  } catch (err: any) {
    console.error("UT3 Agenda error:", err.message);
    // Retourne un tableau vide pour ne pas faire planter ton agrégateur global
    return NextResponse.json([], { status: 200 });
  }
}