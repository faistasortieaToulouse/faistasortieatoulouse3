'use client';

import Link from 'next/link';
import {
    ChevronLeft,
    Zap, // Icône principale pour les sorties/événements
    ExternalLink,
    LinkIcon,
    Home,
    Users,
    Sparkles,
    Book,
    Mic,
    ShoppingBag,
    Music,
    Globe,
    FlaskRound, // CORRECTION : Remplacement de Flask par FlaskRound
    School,
    ChevronDown, 
    ChevronUp 
} from 'lucide-react';
import React, { useState } from 'react';

// NOTE: Les imports de composants spécifiques à votre projet (comme Button) sont commentés car non définis ici.
// import { Button } from '@/components/ui/button'; 

// --- Définition des Données et Catégories ---

// Structure des catégories et des liens (Votre liste complète)
const rawCategories = [
    {
        title: "Événements des établissements privés gratuits et payants",
        links: [
            "https://www.toulousebouge.com", "https://www.clutchmag.fr/evenements", "https://www.lepetittou.com/activite/culture/", "https://31.agendaculturel.fr/agenda-culturel/toulouse/",
            "https://toulousesecret.com/culture/page/8/", "https://www.jds.fr/toulouse/agenda/", "https://www.alentoor.fr/toulouse/agenda", "https://www.cityzeum.com/evenement/toulouse",
            "https://toulouse.latribune.fr/evenements.html", "https://www.lafrenchtechtoulouse.com/open-agenda/",
        ],
    },
    {
        title: "Événements des établissements publics gratuits",
        links: [
            "https://bibliotheque.toulouse.fr/agenda", "https://agenda.toulouse-metropole.fr/", "https://www.toulouse-tourisme.com/agenda", "https://www.hautegaronnetourisme.com/bouger-et-sortir/sortir-se-divertir/tout-agenda/",
            "https://cpieterrestoulousaines.org/agenda/", "https://www.culture.gouv.fr/Regions/Drac-Occitanie", "https://openagenda.com/toulouse-metropole",
        ],
    },
    {
        title: "Événements alternatifs gratuits",
        links: [
            "https://toulouse.demosphere.net/", "https://radar.squat.net/fr/events/city/Toulouse", "https://la-toulouse.fr/category/evenement/",
        ],
    },
    {
        title: "Événements gratuits des médias",
        links: [
            "https://www.amis.monde-diplomatique.fr/", "https://infolocale.actu.fr/occitanie/haute-garonne/toulouse-31000",
        ],
    },
    {
        title: "Évènements gratuits des établissements de nuit",
        links: [
            "https://auchatnoir.noblogs.org/", "https://www.facebook.com/levasion.bar/events?locale=fr_FR",
        ],
    },
    {
        title: "Événements gratuits des bars associatifs",
        links: [
            "http://lapasserelle-negreneys.org/", "https://www.facebook.com/lapasserellenegreneys/events", "https://www.sozinho.org/agenda/", "https://www.placecommune.fr/programmation",
            "https://www.maisonmalepere.fr/programmation", "https://cafe-lastronef.fr/programme/",
        ],
    },
    {
        title: "Événements culturels alternatifs",
        links: [
            "https://lachapelletoulouse.com/evenements/", "http://lehangar.eklablog.com/", "https://vive.mixart-myrys.org/",
        ],
    },
    {
        title: "Événements des librairies",
        links: [
            "https://www.ombres-blanches.fr/posts/30/Nos-evenements", "https://www.librairieprivat.com/agenda.php", "https://www.librairie-terranova.fr/agenda-librairie",
            "https://www.fnac.com/Toulouse-Wilson/Fnac-Toulouse-Wilson/cl55/w-4", "https://www.fnac.com/Toulouse-Labege/Fnac-Labege/cl57/w-4",
        ],
    },
    {
        title: "Événements des orchestres, bals et concerts",
        links: [
            "https://conservatoire.toulouse.fr/agenda/", "http://www.orchestre-h2o.fr", "https://orchestre.ut-capitole.fr/accueil/concerts", "https://www.out-toulouse.fr/",
            "https://philharmonia-tolosa.fr/?cat=5", "https://orchestre-opus31.fr/events/", "http://ensemble-orchestral-pierre-de-fermat.fr/concerts-a-venir.php", "https://www.comdt.org/saison/les-concerts/",
            "https://agendatrad.org/calendrier/France/Occitanie", "https://www.facebook.com/groups/221534187648", "https://www.diversdanses.com/", "https://www.facebook.com/Diversdanse/?locale=fr_FR",
            "https://www.facebook.com/page.bombes.2.bal/?locale=fr_FR", "https://toulouse-les-orgues.org/",
        ],
    },
    {
        title: "Événements des halles",
        links: [
            "https://halles-cartoucherie.fr/agenda/", "https://www.leshallesdelatransition.com/evenements-programmation",
        ],
    },
    {
        title: "Événements des lieux culturels publics",
        links: [
            "https://www.facebook.com/EspaceRoguet/events", "https://www.facebook.com/theatredesmazades/events",
        ],
    },
    {
        title: "Événements des conférences et débats gratuits",
        links: [
            "https://www.amis.monde-diplomatique.fr/", "https://www.fest.fr/agenda/haute-garonne/toulouse/conferences-forums-et-debats", "https://www.rencontres-occitanie.fr/",
            "https://museum.toulouse-metropole.fr/agenda/type/rencontres-conferences/", "https://www.tse-fr.eu/fr/events/conferences", "https://www.arnaud-bernard.net/conversations-socratiques/",
        ],
    },
    {
        title: "Événements des musées gratuit",
        links: [
            "https://museum.toulouse-metropole.fr/agenda/type/rencontres-conferences/", "https://www.cite-espace.com/a-la-une/",
        ],
    },
    {
        title: "Événements scientifiques",
        links: [
            "https://www.canal-u.tv/chaines/fermatscience/voyage-en-mathematique", "https://www.chu-toulouse.fr/agenda/",
        ],
    },
    {
        title: "Événements des établissements de l'enseignement",
        links: [
            "https://www.univ-tlse3.fr/agenda", "https://www.univ-tlse3.fr/actualites", "https://www.univ-tlse2.fr/accueil/agenda", "https://culture.univ-tlse2.fr/accueil/a-venir/a-la-fabrique",
            "https://www.ut-capitole.fr/accueil/campus/espace-media/actualites", "https://www.inp-toulouse.fr/fr/actualites.html", "https://www.univ-toulouse.fr/des-campus-attractifs/culture",
        ],
    },
    {
        title: "Événements particuliers",
        links: [
            "https://carnavaldetoulouse.fr/SiteCarnaval/", "https://www.tourisme-occitanie.com/agenda/par-date/mois/agenda-mars/?id1[q]=carnaval&id1[geo]=46.521075663842865~9.151611328125002~40.979898069620155~-3.6254882812500004",
        ],
    },
    {
        title: "Événements d'exposition",
        links: [
            "https://www.chu-toulouse.fr/agenda/",
        ],
    },
    {
        title: "Événements de botanique",
        links: [
            "http://lacaravanedescueilleurs.fr/stages-ateliers/", "https://www.hautegaronnetourisme.com/resultats-de-recherche/?search=botanique", "https://arbresetpaysagesdautan.fr",
            "https://www.mairie-revel.fr/agenda/",
            "https://www.eventbrite.fr/d/france--toulouse/botanique/", "https://www.billetweb.fr/balade-botanique-comestibles-medicinales-daout1", "https://www.mairie-revel.fr/agenda/",
            "https://tourisme.hautstolosans.fr/fr/diffusio/fetes-et-manifestations/rv-aux-jardins-visite-du-jardin-pedagogique-grenade-sur-garonne_TFOFMAMID031V50VXJB",
        ],
    },
    {
        title: "Événements d'art",
        links: [
            "https://www.facebook.com/ArtByLizzie31/",
        ],
    },
    {
        title: "Événements de Festivals",
        links: [
            "https://www.jds.fr/toulouse/agenda/manifestations-fetes-festivals-137_B", "https://www.helloasso.com/e/reg/occitanie/dep/haute-garonne/ville/toulouse/act/festival",
        ],
    },
    {
        title: "Événements de Noël",
        links: [
            "https://www.jds.fr/toulouse/agenda/concert-de-l-avent-et-de-noel-270_B", "https://31.agendaculturel.fr/festival/spectacles-de-noel-toulouse.html",
            "https://toulouse-les-orgues.org/evenement/concert-de-noel/",
        ],
    },
    {
        title: "Évènements de marchés de Noël",
        links: [
            "https://www.jds.fr/toulouse/agenda/concert-de-l-avent-et-de-noel-270_B", "http://marchedenoeltoulouse.fr/", "https://noel.org/31-Haute-Garonne", "https://www.festinoel.com/agendas-departement-31.html",
            "https://toulouse.kidiklik.fr/articles/336279-les-marches-de-noel-autour-de-toulouse.html", "https://www.helloasso.com/e/reg/occitanie/dep/haute-garonne/act/concert",
            "https://www.lacordevocale.org/agenda/31-haute-garonne.html", "https://31.agendaculturel.fr/festival/spectacles-de-noel/",
        ],
    },
    {
        title: "Événements culturels et gratuits",
        links: [
            "https://www.helloasso.com/associations/culture-ambition-toulouse", "https://www.eventbrite.fr/d/france--toulouse/gratuit/", "https://fr-fr.facebook.com/groups/221534187648/",
            "https://www.culture31.com/", "https://www.toulouseinfos.fr/actualites/culture/50521-carte-toulouse-cultures.html", "https://www.univ-toulouse.fr/des-campus-attractifs/culture",
            "https://www.instagram.com/toulouse_culture/", "https://actu.fr/toulouse/loisirs-culture", "https://www.cultureenmouvements.org/agenda",
        ],
    },
];

// Map des titres de catégories à des icônes pour la cohérence visuelle
// Cette map est utilisée pour ajouter l'icône à chaque titre de catégorie
const iconMap: { [key: string]: React.ReactNode } = {
    "Événements des établissements privés gratuits et payants": <Sparkles className="w-6 h-6" />,
    "Événements des établissements publics gratuits": <Home className="w-6 h-6" />,
    "Événements alternatifs gratuits": <Users className="w-6 h-6" />,
    "Événements gratuits des médias": <Mic className="w-6 h-6" />,
    "Évènements gratuits des établissements de nuit": <Music className="w-6 h-6" />,
    "Événements gratuits des bars associatifs": <Music className="w-6 h-6" />,
    "Événements culturels alternatifs": <Globe className="w-6 h-6" />,
    "Événements des librairies": <Book className="w-6 h-6" />,
    "Événements des orchestres, bals et concerts": <Music className="w-6 h-6" />,
    "Événements des halles": <ShoppingBag className="w-6 h-6" />,
    "Événements des lieux culturels publics": <Home className="w-6 h-6" />,
    "Événements des conférences et débats gratuits": <Mic className="w-6 h-6" />,
    "Événements des musées gratuit": <Home className="w-6 h-6" />,
    "Événements scientifiques": <FlaskRound className="w-6 h-6" />, // CORRECTION : Utilisation de FlaskRound
    "Événements des établissements de l'enseignement": <School className="w-6 h-6" />,
    "Événements particuliers": <Zap className="w-6 h-6" />,
    "Événements d'exposition": <Globe className="w-6 h-6" />,
    "Événements de botanique": <Globe className="w-6 h-6" />,
    "Événements d'art": <Sparkles className="w-6 h-6" />,
    "Événements de Festivals": <Zap className="w-6 h-6" />,
    "Événements de Noël": <Sparkles className="w-6 h-6" />,
    "Évènements de marchés de Noël": <ShoppingBag className="w-6 h-6" />,
    "Événements culturels et gratuits": <Book className="w-6 h-6" />,
};

// Application de l'icône aux données
const categoriesData = rawCategories.map(cat => ({
    ...cat,
    icon: iconMap[cat.title] || <Zap className="w-6 h-6" />,
}));


// --- Composants (Adaptés pour Organise tes Sorties) ---

/**
 * Composant de carte pour un lien d'événement.
 */
const LinkCard: React.FC<{ url: string }> = ({ url }) => {
    // Nettoyage de l'URL pour l'affichage (ex: enlève https://, www, et le slash final)
    const displayUrl = url.replace(/https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
    
    // Fonction simple pour déduire un titre à partir de l'URL
    const getTitleFromUrl = (url: string) => {
        try {
            const hostname = new URL(url).hostname;
            const name = hostname.replace(/^www\./, '').split('.')[0];
            return name.charAt(0).toUpperCase() + name.slice(1);
        } catch (e) {
            return displayUrl; // Retourne l'URL nettoyée si la construction de l'URL échoue
        }
    };
    
    const defaultTitle = getTitleFromUrl(url);

    return (
        <div className="bg-background border border-border rounded-xl p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
            <h3 className="text-lg font-bold text-foreground mb-2 flex items-start">
                <LinkIcon className="w-5 h-5 mr-2 mt-1 text-primary flex-shrink-0" />
                {defaultTitle}
            </h3>
            <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-medium flex items-center text-primary hover:text-primary/80 hover:underline mt-2"
            >
                {displayUrl}
                <ExternalLink className="w-3 h-3 ml-1" />
            </a>
        </div>
    );
};

/**
 * Composant pour une section de liens (avec icône et titre) utilisant l'accordéon.
 */
const CategoryAccordion: React.FC<{ category: typeof categoriesData[0] }> = ({ category }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="rounded-xl shadow-md overflow-hidden bg-card border border-border">
            {/* Bouton de l'accordéon (Tête) */}
            <button
                onClick={toggleAccordion}
                className="w-full flex justify-between items-center p-4 sm:p-5 transition duration-150 ease-in-out hover:bg-muted focus:outline-none"
            >
                <h3 className="text-xl font-bold text-foreground flex items-center text-left">
                    <span className="mr-3 text-primary flex-shrink-0">{category.icon}</span>
                    {category.title}
                </h3>
                {/* Icône de flèche */}
                {isOpen ? (
                    <ChevronUp className="w-6 h-6 text-primary flex-shrink-0" />
                ) : (
                    <ChevronDown className="w-6 h-6 text-primary flex-shrink-0" />
                )}
            </button>

            {/* Contenu de l'accordéon (Corps) */}
            {isOpen && (
                <div className="p-4 sm:p-5 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-border pt-4">
                        {category.links.map((url, index) => (
                            <LinkCard key={index} url={url} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


/**
 * Composant principal de la page Organise tes Sorties.
 */
export default function OrganiserSortiesPage() {
    return (
        <div className="p-4 sm:p-8 space-y-10 bg-background min-h-screen font-sans">
            <header className="flex justify-start">
                {/* Remplacement du Button par un simple Link stylisé (si vous n'avez pas le composant Button) */}
                {/* <Link href="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    Retour au Tableau de Bord
                </Link> */}
            </header>

            <div className="max-w-6xl mx-auto space-y-10 bg-card p-8 rounded-xl shadow-lg border border-border">
                
                {/* En-tête de la Page */}
                <header className="text-center pt-4 pb-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4 flex items-center justify-center">
                        <Zap className="w-6 sm:w-8 h-6 sm:h-8 mr-3 text-primary" />
                        Organise tes Sorties 🎉
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Explore des centaines de sites pour trouver des idées d'événements à Toulouse.
                    </p>
                </header>

                {/* Sections de Liens Catégorisées (Accordeon) */}
                <div className="space-y-4 mt-8">
                    {categoriesData.map((category) => (
                        <CategoryAccordion key={category.title} category={category} />
                    ))}
                </div>
            </div>
        </div>
    );
}
