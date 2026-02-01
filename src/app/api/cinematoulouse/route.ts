// app/api/cinematoulouse/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const accessToken = process.env.TMDB_ACCESS_TOKEN;

    if (!apiKey || !accessToken) {
      return NextResponse.json(
        { error: "TMDB_API_KEY ou TMDB_ACCESS_TOKEN manquant" },
        { status: 500 }
      );
    }

    const url =
      "https://api.themoviedb.org/3/movie/now_playing?language=fr-FR&region=FR";

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erreur TMDB", details: await res.text() },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
