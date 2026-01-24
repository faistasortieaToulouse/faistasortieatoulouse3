"use client";

import { useState, useEffect } from 'react';
import { Clock, Calendar, CloudSun, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Simule la récupération de la météo (à implémenter pour la vraie météo)
interface WeatherData {
    temp: number;
    description: string;
    icon: string;
}

// Fonction asynchrone pour la météo (actuellement statique)
async function fetchWeather(city: string = "Toulouse"): Promise<WeatherData | null> {
    // ⚠️ Remplacez ceci par un appel API MÉTÉO réel
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        temp: 24, // Remplacement statique
        description: 'Ensoleillé',
        icon: 'Sun',
    };
}

export function TimeWeatherBar() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Effet pour l'horloge
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Effet pour la météo
    useEffect(() => {
        fetchWeather()
            .then(data => {
                setWeather(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération de la météo:", error);
                setIsLoading(false);
            });
    }, []);

    const formattedDate = format(currentTime, 'EEEE d MMMM yyyy', { locale: fr });
    const formattedTime = format(currentTime, 'HH:mm:ss');
    const WeatherIcon = CloudSun; // Utilisation d'une icône par défaut

    return (
        // Le fond violet pourpre est appliqué ici
        <div 
            className="flex flex-wrap items-center justify-between p-4 rounded-lg text-white shadow-lg"
            style={{ backgroundColor: '#4a203b' }}
        >
            {/* Date */}
            <div className="flex items-center gap-2 text-sm sm:text-base">
                <Calendar className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium capitalize">{formattedDate}</span>
            </div>

            {/* Heure */}
            <div className="flex items-center gap-2 text-lg font-bold sm:text-xl">
                <Clock className="h-6 w-6 flex-shrink-0" />
                <span>{formattedTime}</span>
            </div>

            {/* Météo */}
            <div className="flex items-center gap-2 text-sm sm:text-base">
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <Loader className="h-5 w-5 animate-spin" />
                        <span>Météo...</span>
                    </div>
                ) : weather ? (
                    <div className="flex items-center gap-2">
                        <WeatherIcon className="h-5 w-5 flex-shrink-0" />
                        <span>{weather.temp}°C ({weather.description})</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                        <CloudSun className="h-5 w-5" />
                        <span>Météo non disponible</span>
                    </div>
                )}
            </div>
        </div>
    );
}
