import { Zap, Film, Bell, Gamepad2, Database, AlertCircle } from "lucide-react";

// On définit la revalidation (identique à l'API)
export const revalidate = 300;

async function getTestData() {
  const host = process.env.NEXT_PUBLIC_BASE_URL 
    ? `https://${process.env.NEXT_PUBLIC_BASE_URL.replace('https://', '')}`
    : "https://ftstoulouse.vercel.app";
  
  try {
    const res = await fetch(`${host}/api/testdata`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Erreur Radar Test:", err);
    return null;
  }
}

export default async function MeetupSupPage() {
  const data = await getTestData();

  // Si l'API échoue totalement (fallback ultime)
  if (!data) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-white text-xl font-bold mb-2 uppercase tracking-tighter">Connexion au Radar interrompue</h2>
        <p className="text-slate-500 text-xs uppercase tracking-widest">Le flux de test est indisponible</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">
            Radar<span className="text-red-600">.Toulouse</span>
          </h1>
          <p className="text-slate-500 font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">
            Analyse globale de l'activité urbaine
          </p>
        </header>

        {/* SECTION DES GRANDS COMPTEURS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          
          {/* COMPTEUR ARTICLES */}
          <div className="text-center p-10 bg-slate-900/20 border border-white/5 rounded-[3rem] relative overflow-hidden group">
            <Database className="absolute -right-4 -top-4 text-white/5 group-hover:text-white/10 transition-colors" size={160} />
            <span className="relative z-10 text-[6rem] md:text-[8rem] font-black leading-none bg-gradient-to-b from-slate-200 to-slate-600 bg-clip-text text-transparent">
              {data.totalArticles || 0}
            </span>
            <p className="text-slate-400 font-black italic uppercase tracking-widest text-lg mt-4">Articles & Rubriques</p>
            <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mt-1">Base de données FTS</p>
          </div>

          {/* COMPTEUR LIVE */}
          <div className="text-center p-10 bg-red-950/10 border border-red-900/20 rounded-[3rem] relative overflow-hidden group">
            <Zap className="absolute -right-4 -top-4 text-red-600/5 group-hover:text-red-600/10 transition-colors" size={160} />
            <span className="relative z-10 text-[6rem] md:text-[8rem] font-black leading-none bg-gradient-to-b from-white to-red-600 bg-clip-text text-transparent">
              {data.totalLive || 0}
            </span>
            <p className="text-red-600 font-black italic uppercase tracking-widest text-lg mt-4">Radar Live</p>
            <p className="text-[10px] text-red-900 uppercase font-bold tracking-widest mt-1">Événements en temps réel</p>
          </div>
          
        </div>

        {/* GRILLE DES SOURCES */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] flex-1 bg-white/10"></div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic text-center">Détails des flux détectés</h2>
          <div className="h-[1px] flex-1 bg-white/10"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Zap />} label="Meetup" count={data.detailsLive?.meetup} color="text-yellow-400" />
          <StatCard icon={<Film />} label="Cinéma" count={data.detailsLive?.cinema} color="text-blue-400" />
          <StatCard icon={<Bell />} label="Agenda" count={data.detailsLive?.agenda} color="text-red-400" />
          <StatCard icon={<Gamepad2 />} label="Jeux RSS" count={data.detailsLive?.jeux} color="text-emerald-400" />
        </div>

        <footer className="text-center pb-12">
          <div className="inline-block px-4 py-2 bg-white/5 rounded-full border border-white/5">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
              Dernier scan : {data.timestamp || "N/A"} 
              {data.source === "backup_hebdo" && " (Archive Hebdo)"}
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}

function StatCard({ icon, label, count, color }: any) {
  return (
    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] hover:bg-slate-800 transition-all group relative overflow-hidden">
      <div className="relative z-10">
        <div className={`${color} mb-4 transition-transform group-hover:scale-110`}>{icon}</div>
        <div className="text-4xl font-black mb-1">{count ?? 0}</div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </div>
  );
}