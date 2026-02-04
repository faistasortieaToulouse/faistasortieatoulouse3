import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // On remonte à la racine du projet (D:\FTSOnline) depuis src/app/api/datajson
    const filePath = path.join(process.cwd(), 'data', 'stats-hebdo.json');
    
    // Lecture du fichier
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const stats = JSON.parse(fileContent);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur lecture stats:", error);
    return NextResponse.json(
      { error: "Impossible de charger les statistiques" },
      { status: 500 }
    );
  }
}