import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = "https://theatredupave.org/events/photo/?ical=1";

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36",
        Accept: "text/calendar,text/plain,*/*",
      },
      cache: "no-store",
    });

    const icsText = await res.text();
    console.log("ICS length:", icsText.length);

    // Déplie les lignes repliées
    const unfolded = icsText.replace(/\r?\n[ \t]/g, "");

    // Découpe les VEVENT
    const rawEvents = unfolded.split("BEGIN:VEVENT").slice(1);
    console.log("Total entries:", rawEvents.length);

    const events = rawEvents.map((block) => {
      const get = (key: string) => {
        const match = block.match(new RegExp(`${key}(?:;[^:]*)?:(.+)`));
        return match ? match[1].trim() : null;
      };

      // Parse des dates en ISO
      const parseDate = (s: string | null) => {
        if (!s) return null;
        // Support du format YYYYMMDD ou YYYYMMDDTHHMMSS
        const iso = s.includes("T")
          ? s.replace(/Z$/, "") // Supprime Z si présent
          : s + "T000000";
        const d = new Date(
          iso.slice(0, 4),
          parseInt(iso.slice(4, 6)) - 1,
          iso.slice(6, 8),
          iso.slice(9, 11),
          iso.slice(11, 13),
          iso.slice(13, 15)
        );
        return isNaN(d.getTime()) ? null : d.toISOString();
      };

      const start = parseDate(get("DTSTART"));
      const end = parseDate(get("DTEND"));

      return {
        title: get("SUMMARY") || "Événement",
        description: get("DESCRIPTION") || "",
        start,
        end,
        url: get("URL") || "",
        location: get("LOCATION") || "Théâtre du Pavé, Toulouse",
        image: get("ATTACH") || null,
      };
    });

    // Filtrage : événements valides avec titre et date
    const cleaned = events.filter((e) => e.title && e.start);

    // Limiter aux 31 prochains jours
    const now = new Date();
    const limitDate = new Date(now);
    limitDate.setDate(limitDate.getDate() + 31);

    const upcoming = cleaned.filter((e) => {
      const d = new Date(e.start);
      return d >= now && d <= limitDate;
    });

    // Tri chronologique
    upcoming.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    console.log("Upcoming events:", upcoming.length);

    return NextResponse.json({ events: upcoming });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ events: [], error: err.message }, { status: 500 });
  }
}
