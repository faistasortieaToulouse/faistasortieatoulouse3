'use client';

import { useState, useEffect } from 'react';
import { Clock, Calendar, CloudSun, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
}

// Simule la récupération météo
async function fetchWeather(city: string = "Toulouse"): Promise<WeatherData | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { temp: 24, description: 'Ensoleillé', icon: 'Sun' };
}

export function TimeWeatherBar() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Mise à jour de l’heure après montage
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Récupération météo après montage
  useEffect(() => {
    fetchWeather().then(setWeather).catch(console.error);
  }, []);

  // Placeholder côté serveur avant le montage
  if (!currentTime) return <div className="p-4">Chargement...</div>;

  const formattedDate = format(currentTime, 'EEEE d MMMM yyyy', { locale: fr });
  const formattedTime = format(currentTime, 'HH:mm:ss');

  return (
    <div className="flex flex-wrap items-center justify-between p-4 rounded-lg text-white shadow-lg" style={{ backgroundColor: '#4a203b' }}>
      <div className="flex items-center gap-2 text-sm sm:text-base">
        <Calendar className="h-5 w-5 flex-shrink-0" />
        <span className="font-medium capitalize">{formattedDate}</span>
      </div>
      <div className="flex items-center gap-2 text-lg font-bold sm:text-xl">
        <Clock className="h-6 w-6 flex-shrink-0" />
        <span>{formattedTime}</span>
      </div>
      <div className="flex items-center gap-2 text-sm sm:text-base">
        {weather ? (
          <>
            <CloudSun className="h-5 w-5 flex-shrink-0" />
            <span>{weather.temp}°C ({weather.description})</span>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Loader className="h-5 w-5 animate-spin" />
            <span>Météo...</span>
          </div>
        )}
      </div>
    </div>
  );
}
