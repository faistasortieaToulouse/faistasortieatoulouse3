"use client";

import {
    MapPin,
    Mountain,
    LinkIcon,
    CloudSun,
    ExternalLink,
    Map,
    Compass,
    Shield,
    Route,
    ChevronLeft
} from 'lucide-react';
import React from 'react';
import Link from 'next/link';

// NOTE: Le composant Button n'est pas défini ici mais est supposé importé.
// import { Button } from '@/components/ui/button'; 

// --- Définition des Interfaces et des Données ---

/** Interface pour un lien de randonnée ou une ressource. */
interface HikingLink {
    title: string;
    url: string;
    description: string;
    category?: 'Planification' | 'Météo' | 'GR' | 'Local'; // Ajout pour classification interne
}

/** Liste des liens pour la randonnée. */
const rawLinks: HikingLink[] = [
    { title: "FFRandonnée - Fédération Française de la Randonnée Pédestre", url: "www.ffrandonnee.fr", description: "Le site officiel pour trouver des itinéraires homologués et des informations pratiques." },
    { title: "Visorando", url: "visorando.com", description: "Des milliers d'idées de randonnées partout en France avec cartes et fiches détaillées." },
    { title: "AllTrails", url: "alltrails.com", description: "Application populaire avec une grande communauté et des avis sur de nombreux sentiers." },
    { title: "OpenTopoMap", url: "opentopomap.org", description: "Carte topographique libre basée sur les données d'OpenStreetMap." },
    { title: "OpenStreetMap", url: "openstreetmap.org", description: "La carte libre et collaborative mondiale, une source de données essentielle pour de nombreuses cartes de randonnée." },
    { title: "Météo France Montagne", url: "meteofrance.com/previsions-meteo-montagne", description: "Prévisions météorologiques spécifiques pour les massifs montagneux." },
    { title: "Météo France Occitanie", url: "meteofrance.com/previsions-meteo-france/occitanie/regin11", description: "Prévisions météorologiques pour la région Occitanie." },
    { title: "HexaTrek", url: "www.hexatrek.com/", description: "Le sentier de grande randonnée qui traverse la France." },
    { title: "MonGR", url: "www.mongr.fr/", description: "Le site de la FFRandonnée dédié aux itinéraires de Grande Randonnée (GR®)." },
    { title: "IGNrando", url: "ignrando.fr/", description: "Le portail de l'Institut Géographique National pour trouver et partager des parcours." },
    { title: "Komoot - Randonnées depuis Toulouse", url: "www.komoot.com/discover/Toulouse/@43.6046000,1.4451000/tours?sport=hike", description: "Suggestions de randonnées et itinéraires autour de Toulouse sur Komoot." },
    { title: "Wikiloc - Randonnées depuis Toulouse", url: "fr.wikiloc.com/wikiloc/map.do?sw=43.2371%2C0.9537&ne=43.9215%2C2.0483&place=Toulouse", description: "Parcours partagés par la communauté Wikiloc près de Toulouse." },
    { title: "Visorando - Randonnées depuis Toulouse", url: "www.visorando.com/?component=rando&task=searchCircuitV2&loc=Toulouse", description: "Sélection de randonnées autour de Toulouse sur Visorando." },
];

// Fonction pour classer les liens
const classifyLinks = (links: HikingLink[]) => {
    const classified: { [key: string]: HikingLink[] } = {
        'Planification & Cartographie 🗺️': [],
        'Météo & Sécurité ☁️': [],
        'Grandes Randonnées & Itinéraires Nationaux 🛣️': [],
        'Randonnées Locales (Autour de Toulouse) 📍': [],
    };

    links.forEach(link => {
        if (link.url.includes('meteofrance.com')) {
            classified['Météo & Sécurité ☁️'].push(link);
        } else if (link.url.includes('ffrandonnee.fr') || link.url.includes('mongr.fr') || link.url.includes('hexatrek.com')) {
            classified['Grandes Randonnées & Itinéraires Nationaux 🛣️'].push(link);
        } else if (link.title.includes('Toulouse')) {
            classified['Randonnées Locales (Autour de Toulouse) 📍'].push(link);
        } else {
            classified['Planification & Cartographie 🗺️'].push(link);
        }
    });

    return classified;
};

const categorizedLinks = classifyLinks(rawLinks);


// --- Composants ---

/**
 * Composant de carte pour un lien de randonnée.
 */
const LinkCard: React.FC<{ link: HikingLink }> = ({ link }) => (
    <div className="bg-background border border-border rounded-xl p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
        <div>
            <h3 className="text-lg font-bold text-foreground mb-2 flex items-start">
                <LinkIcon className="w-5 h-5 mr-2 mt-1 text-primary flex-shrink-0" />
                {link.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{link.description}</p>
        </div>
        <a 
            href={`https://${link.url.replace('https://', '').replace('http://', '')}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-medium flex items-center text-primary hover:text-primary/80 hover:underline mt-2"
        >
            {link.url}
            <ExternalLink className="w-3 h-3 ml-1" />
        </a>
    </div>
);

/**
 * Composant pour une section de liens (avec icône et titre).
 */
const LinkSection: React.FC<{ title: string, links: HikingLink[], icon: React.ReactNode }> = ({ title, links, icon }) => (
    <section className="mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-6 text-foreground border-l-4 border-primary pl-3 flex items-center">
            <span className="mr-2 text-primary">{icon}</span>
            {title.split(' ')[0]} {title.split(' ').slice(1).join(' ')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link, index) => (
                <LinkCard key={index} link={link} />
            ))}
        </div>
    </section>
);


/**
 * Composant principal de la page Organise tes Randonnées.
 */
export default function HikingPlanningPage() {
    return (
        <div className="p-4 sm:p-8 space-y-10 bg-background min-h-screen font-sans">
            <header className="flex justify-start">
                {/* Espace réservé pour le bouton de retour */}
                {/* <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
                    <Link href="/">
                        <ChevronLeft className="h-5 w-5 mr-2" />
                        Retour
                    </Link>
                </Button> */}
            </header>

            <div className="max-w-6xl mx-auto space-y-10 bg-card p-8 rounded-xl shadow-lg border border-border">
                
                {/* En-tête de la Page */}
                <header className="text-center pt-4 pb-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4 flex items-center justify-center">
                        <Mountain className="w-6 sm:w-8 h-6 sm:h-8 mr-3 text-primary" />
                        Organise tes Randonnées ⛰️
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Toutes les ressources essentielles pour planifier vos treks, de la cartographie à la météo.
                    </p>
                </header>

                {/* Sections de Liens Catégorisées */}
                <div className="space-y-10">
                    <LinkSection 
                        title="Planification & Cartographie 🗺️" 
                        links={categorizedLinks['Planification & Cartographie 🗺️']}
                        icon={<Map className="w-6 h-6" />}
                    />
                    
                    <hr className="border-t border-border" />

                    <LinkSection 
                        title="Grandes Randonnées & Itinéraires Nationaux 🛣️" 
                        links={categorizedLinks['Grandes Randonnées & Itinéraires Nationaux 🛣️']}
                        icon={<Route className="w-6 h-6" />}
                    />

                    <hr className="border-t border-border" />
                    
                    <LinkSection 
                        title="Randonnées Locales (Autour de Toulouse) 📍" 
                        links={categorizedLinks['Randonnées Locales (Autour de Toulouse) 📍']}
                        icon={<MapPin className="w-6 h-6" />}
                    />
                    
                    <hr className="border-t border-border" />
                    
                    <LinkSection 
                        title="Météo & Sécurité ☁️" 
                        links={categorizedLinks['Météo & Sécurité ☁️']}
                        icon={<CloudSun className="w-6 h-6" />}
                    />
                </div>
            </div>
        </div>
    );
}
