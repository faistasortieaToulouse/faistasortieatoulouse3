import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Statistiques - FTS Online',
};

// Cette fonction lit le fichier directement sur le disque sans passer par le réseau
function getStatsFromDisk() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'stats-hebdo.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Erreur critique de lecture :", error);
    return null;
  }
}

export default function StatsPage() {
  const stats = getStatsFromDisk();

  // Si le fichier est introuvable ou mal formé
  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <div className="bg-red-50 border-2 border-red-100 p-8 rounded-3xl max-w-md">
          <span className="text-4xl">📊</span>
          <h1 className="text-red-600 font-black text-xl mt-4">Données indisponibles</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Le fichier <code className="bg-white px-1">data/stats-hebdo.json</code> est manquant ou contient une erreur de syntaxe.
          </p>
        </div>
      </div>
    );
  }

  const { totalLive, totalArticles, detailsLive, lastUpdate } = stats;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex flex-col items-center">
          <div className="bg-white px-4 py-1 rounded-full border border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Rapport Hebdomadaire
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Activité FTS Online</h1>
          <p className="text-slate-500 mt-2 font-medium">Mise à jour du {new Date(lastUpdate).toLocaleDateString('fr-FR')}</p>
        </header>

        {/* Chiffres Clés */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-blue-100 font-bold text-xs uppercase">Événements en direct</span>
              <div className="text-6xl font-black mt-2">{totalLive}</div>
            </div>
            <div className="absolute -right-4 -bottom-4 text-white/10 text-9xl font-black select-none">LIVE</div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <span className="text-slate-400 font-bold text-xs uppercase">Articles publiés</span>
            <div className="text-6xl font-black mt-2 text-slate-800">{totalArticles}</div>
          </div>
        </div>

        {/* Détails Catégories */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 px-2">Détails des événements</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(detailsLive).map(([key, value]) => (
              <div key={key} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">{key}</div>
                <div className="text-2xl font-black text-blue-600">{value as number}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}