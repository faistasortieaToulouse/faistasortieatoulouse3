"use client";

import { MapPin, Globe, ChevronDown, ChevronUp, ExternalLink, ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';

// NOTE: Le composant Button n'est pas défini ici mais est supposé importé (comme dans l'exemple de style).
// Si vous utilisez shadcn/ui/Next.js, vous devrez ajouter l'import de Button pour le bouton de retour.
// import { Button } from '@/components/ui/button'; 


// --- Définition des Interfaces et des Données ---

/** Interface pour un office ou un comité touristique. */
interface Office {
    name: string;
    website: string;
}

/** Interface pour un département regroupant ses offices. */
interface Department {
    name: string;
    offices: Office[];
}

/** Informations sur l'office régional principal. */
const regionalOffice: Office = { 
    name: "Comité Régional du Tourisme et des Loisirs d'Occitanie", 
    website: "www.tourisme-occitanie.com" 
};

/** Liste complète des départements et de leurs offices de tourisme locaux. */
const departments: Department[] = [
    {
        name: "Ariège (09)",
        offices: [
            { name: "Office de Tourisme des Pyrénées Ariégeoises", website: "www.pyrenees-ariegeoises.com" },
            { name: "Office de Tourisme Foix - Ariège - Pyrénées", website: "www.foix-tourisme.com" },
            { name: "Office de Tourisme Couserans-Pyrénées", website: "www.tourisme-couserans-pyrenees.com" },
            { name: "Office de Tourisme des vallées de l'Arize et de la Lèze", website: "www.tourisme-arize-leze.com" },
            { name: "Office de Tourisme des Pyrénées Cathares", website: "www.pyreneescathares.com" },
        ],
    },
    {
        name: "Aude (11)",
        offices: [
            { name: "Office de Tourisme Grand Carcassonne", website: "www.tourisme-carcassonne.fr" },
            { name: "Office de Tourisme de la Côte du Midi", website: "www.cotedumidi.com" },
            { name: "Office de Tourisme de Gruissan Méditerranée", website: "www.gruissan-mediterranee.com" },
            { name: "Pyrénées Audoises Tourisme", website: "www.pyreneesaudoises.com" },
            { name: "Office de Tourisme Intercommunal du Limouxin", website: "www.limouxin-tourisme.com" },
            { name: "Office de Tourisme de Castelnaudary Lauragais Audois", website: "www.castelnaudary-tourisme.fr" },
            { name: "Office de Tourisme Intercommunal Corbières Minervois", website: "www.tourisme-corbieres-minervois.com" },
            { name: "Office de Tourisme Corbières Salanque Méditerranée", website: "www.c3sm.fr" },
            { name: "Office de Tourisme Au Cœur des Collines Cathares", website: "collinescathares.com" },
        ],
    },
    {
        name: "Aveyron (12)",
        offices: [
            { name: "Office de Tourisme Rodez Agglomération", website: "www.rodez-tourisme.fr" },
            { name: "Office de Tourisme Millau Grands Causses", website: "www.explore-millau.com" },
            { name: "Office de Tourisme en Aubrac", website: "www.tourisme-en-aubrac.com" },
            { name: "Agence d'Attractivité et de Développement Touristique du Lévézou", website: "www.levezou-aveyron.com" },
            { name: "Office de Tourisme Pays du Roquefort et Saint-Affricain", website: "www.roquefort-tourisme.fr" },
            { name: "Office de Tourisme Terres d'Aveyron", website: "www.terresdaveyron.com" },
            { name: "Office de Tourisme de Conques-Marcillac", website: "www.tourisme-conques.fr" },
            { name: "Office de Tourisme Ouest Aveyron", website: "www.ouestaveyron.fr" },
            { name: "Office de Tourisme des Causses à l'Aubrac", website: "www.causses-aubrac-tourisme.com" },
            { name: "Office de Tourisme Pays Ségali", website: "www.payssegali.fr" },
            { name: "Office de Tourisme Monts et Lacs en Haut-Languedoc", website: "www.montsdelacauneetmontagneduhautlanguedoc.fr" },
        ],
    },
    {
        name: "Gard (30)",
        offices: [
            { name: "Office de Tourisme et des Congrès de Nîmes", website: "nimes-tourisme.com" },
            { name: "Office de Tourisme Destination Pays d'Uzès Pont du Gard", website: "www.uzes-pontdugard.com" },
            { name: "Cévennes Tourisme", website: "www.cevennes-tourisme.fr" },
            { name: "Office de Tourisme Intercommunal Provence Occitane / Gard Rhodanien", website: "www.provenceoccitane.com" },
            { name: "Office de Tourisme Intercommunal Terre de Camargue", website: "www.terredecamargue.fr" },
            { name: "Office de Tourisme Coeur de Petite Camargue", website: "www.coeurdepetitecamargue.fr" },
            { name: "Office de Tourisme Intercommunal du Piémont Cévenol", website: "www.piemont-cevenol-tourisme.com" },
            { name: "Office de Tourisme Intercommunal du Pays de Sommières", website: "ot-sommieres.com" },
        ],
    },
    {
        name: "Haute-Garonne (31)",
        offices: [
            { name: "Comité Départemental du Tourisme de la Haute-Garonne", website: "www.hautegaronnetourisme.com" },
            { name: "Office de Tourisme de Toulouse", website: "www.toulouse-tourisme.com" },
            { name: "Office de Tourisme Pyrénées 31 (Luchon)", website: "www.pyrenees31.com" },
            { name: "Office de Tourisme Destination Comminges Pyrénées", website: "www.tourisme-stgaudens.com" },
            { name: "Office de Tourisme Intercommunal Aux Sources du Canal du Midi", website: "www.auxsourcesducanaldumidi.com" },
            { name: "Office de Tourisme Intercommunal du Volvestre", website: "www.tourisme-volvestre.fr" },
            { name: "Office de Tourisme Cœur de Garonne", website: "tourismecoeurdegaronne.com" },
            { name: "Office de Tourisme du Vignoble de Fronton", website: "www.vignoblesetdecouvertesfronton.com" },
            { name: "Office de Tourisme Intercommunal des Coteaux du Girou", website: "www.cc-coteaux-du-girou.fr" },
            { name: "Lauragais Tourisme", website: "www.lauragais-tourisme.fr" },
            { name: "Office de Tourisme des Hauts Tolosans", website: "tourisme.hautstolosans.fr" },
        ],
    },
    {
        name: "Gers (32)",
        offices: [
            { name: "Office de Tourisme Grand Auch Cœur de Gascogne", website: "www.auch-tourisme.com" },
            { name: "Office de Tourisme de la Ténarèze / Gascogne Lomagne", website: "www.gers-armagnac.com" },
            { name: "Office de Tourisme et du Thermalisme du Grand Armagnac", website: "www.grand-armagnac.com" },
            { name: "Office de Tourisme Cœur d'Astarac en Gascogne", website: "www.tourisme-mirande-astarac.com" },
            { name: "Office de Tourisme Val de Gers", website: "valdegerstourisme.fr" },
            { name: "Office de Tourisme Armagnac Adour / Cœur Sud-Ouest Tourisme", website: "www.coeursudouest-tourisme.com" },
            { name: "Office de Tourisme de la Gascogne Toulousaine", website: "www.tourisme-gascognetoulousaine.com" },
            { name: "Office de Tourisme Bastides de Lomagne", website: "www.tourisme-bastidesdelomagne.fr" },
            { name: "Office de Tourisme Coteaux Arrats Gimone", website: "www.tourisme-3cag-gers.com" },
        ]
    },
    {
        name: "Hérault (34)",
        offices: [
            { name: "Office de Tourisme Cap d'Agde Méditerranée", website: "www.capdagde.com" },
            { name: "Office de Tourisme Béziers Méditerranée", website: "www.beziers-mediterranee.com" },
            { name: "Office de Tourisme Intercommunal Sète - Archipel de Thau", website: "www.tourisme-sete.com" },
            { name: "Office de Tourisme et des Congrès Montpellier Méditerranée Métropole", website: "www.montpellier-tourisme.fr" },
            { name: "Office de Tourisme Mauguio Carnon", website: "www.mauguio-carnon.com" },
            { name: "Office de Tourisme Saint-Guilhem-le-Désert - Vallée de l'Hérault", website: "www.saintguilhem-valleeherault.fr" },
            { name: "Office de Tourisme du Clermontais / Destination Salagou", website: "www.destination-salagou.fr" },
            { name: "Office de Tourisme Lodévois & Larzac", website: "www.tourisme-lodevois-larzac.fr" },
            { name: "Office de Tourisme Grand Orb", website: "www.tourisme.grandorb.fr" },
            { name: "Office de Tourisme Intercommunal Canal du Midi au Saint-Chinian", website: "www.tourismecanaldumidi.fr" },
            { name: "Office de Tourisme du Pays de Lunel", website: "www.ot-paysdelunel.fr" },
        ]
    },
    {
        name: "Lot (46)",
        offices: [
            { name: "Office de Tourisme Vallée de la Dordogne", website: "www.vallee-dordogne.com" },
            { name: "Office de Tourisme Cahors Vallée du Lot", website: "www.cahorsvalleedulot.com" },
            { name: "Office de Tourisme du Grand Figeac, Vallées du Lot et du Célé", website: "www.tourisme-figeac.com" },
            { name: "Office de Tourisme du Pays de Gourdon, Entre Lot et Dordogne", website: "www.tourisme-gourdon.com" },
            { name: "Office de Tourisme du Causse de Labastide-Murat", website: "www.tourisme-labastide-murat.fr" },
        ]
    },
    {
        name: "Lozère (48)",
        offices: [
            { name: "Office de Tourisme Gorges du Tarn, Causses, Cévennes", website: "www.gorgescaussescevennes.fr" },
            { name: "Office de Tourisme de l'Aubrac Lozérien", website: "www.aubrac-lozere.com" },
            { name: "Office de Tourisme Mende Cœur Lozère", website: "www.mende-coeur-lozere.fr" },
            { name: "Office de Tourisme des Cévennes au Mont Lozère", website: "www.cevennes-montlozere.com" },
            { name: "Office de Tourisme Margeride en Gévaudan", website: "www.margeride-en-gevaudan.com" },
            { name: "Office de Tourisme Cœur Margeride", website: "www.lozere-margeride.fr" },
            { name: "Office de Tourisme Mont Lozère", website: "www.destination-montlozere.fr" },
            { name: "Office de Tourisme du Haut Allier", website: "www.hautallier.com" },
        ]
    },
    {
        name: "Hautes-Pyrénées (65)",
        offices: [
            { name: "Office de Tourisme de Tarbes", website: "www.tarbes-tourisme.fr" },
            { name: "Office de Tourisme de Lourdes", website: "www.lourdes-infotourisme.com" },
            { name: "Office de Tourisme des Vallées de Gavarnie", website: "www.valleesdegavarnie.com" },
            { name: "Office de Tourisme du Grand Tourmalet - Pic du Midi", website: "www.tourmaletpicdumidi.com" },
            { name: "Office de Tourisme Communautaire Pyrénées2vallées", website: "www.pyrenees2vallees.com" },
            { name: "Office de Tourisme Neste Barousse", website: "www.tourisme-neste-barousse.fr" },
            { name: "Office de Tourisme des Coteaux du Val d'Adour", website: "adour-coteaux.fr" },
        ]
    },
    {
        name: "Pyrénées-Orientales (66)",
        offices: [
            { name: "Office de Tourisme de Perpignan", website: "www.perpignantourisme.com" },
            { name: "Office de Tourisme d'Argelès-sur-Mer", website: "www.argeles-sur-mer.com" },
            { name: "Office de Tourisme Intercommunal Sud Roussillon", website: "sudroussillon.fr" },
            { name: "Office de Tourisme de Canet-en-Roussillon", website: "www.ot-canet.fr" },
            { name: "Office de Tourisme de Collioure", website: "www.collioure.com" },
            { name: "Office de Tourisme de Banyuls-sur-Mer", website: "www.banyuls-sur-mer.com" },
            { name: "Office de Tourisme Le Barcarès", website: "www.lebarcares-tourisme.com" },
            { name: "Office de Tourisme Intercommunal Pyrénées Méditerranée", website: "www.tourisme-pyrenees-mediterranee.com" },
            { name: "Office de Tourisme Intercommunal Aspres-Canigó", website: "www.cc-aspres.fr" },
            { name: "Office de Tourisme du Vallespir", website: "www.vallespir.com" },
            { name: "Office de Tourisme Intercommunal Conflent Canigó", website: "www.conflentcanigo.fr" },
            { name: "Office de Tourisme de Font-Romeu Pyrénées 2000", website: "www.font-romeu.fr" },
            { name: "Office de Tourisme Les Angles", website: "lesangles.com" },
            { name: "Office de Tourisme Intercommunal du Fenouillèdes", website: "www.fenouilledes.com" },
        ]
    },
    {
        name: "Tarn (81)",
        offices: [
            { name: "Office de Tourisme d'Albi", website: "www.albi-tourisme.fr" },
            { name: "Office de Tourisme Castres-Mazamet", website: "www.tourisme-castresmazamet.com" },
            { name: "Office de Tourisme de l'Agglomération Gaillacoise", website: "www.gaillacvisit.fr" },
            { name: "Office de Tourisme La Toscane Occitane", website: "www.la-toscane-occitane.com" },
            { name: "Office de Tourisme Vallée du Tarn & Monts de l'Albigeois", website: "www.valleedutarn-tourisme.com" },
            { name: "Office de Tourisme Intercommunal Tarn-Agout", website: "www.lepaysdecocagne.fr" },
            { name: "Office de Tourisme Centre Tarn", website: "www.tourisme-centretarn.fr" },
            { name: "Office de Tourisme du Ségala Tarnais", website: "tourisme-tarn-carmaux.fr" },
            { name: "Office de Tourisme Intercommunal Aux sources du Canal du Midi", website: "www.tourisme-sor-agout.fr" },
            { name: "Office de Tourisme Sidobre Vals et Plateaux", website: "sidobre-vallees-tourisme.com" },
            { name: "Office de Tourisme des Monts de Lacaune", website: "www.montsdelacauneetmontagneduhautlanguedoc.fr" },
        ]
    },
    {
        name: "Tarn-et-Garonne (82)",
        offices: [
            { name: "Office de Tourisme du Grand Montauban", website: "www.montauban-tourisme.com" },
            { name: "Office de Tourisme Intercommunal Moissac - Terres des Confluences", website: "www.tourisme-moissac-terresdesconfluences.fr" },
            { name: "Office de Tourisme des Gorges de l'Aveyron et des Plaines", website: "www.gorges-aveyron-tourisme.com" },
            { name: "Office de Tourisme du Quercy Caussadais", website: "www.tourisme-quercy-caussadais.fr" },
            { name: "Office de Tourisme Intercommunal Grand Sud Tarn-et-Garonne", website: "tourisme.grandsud82.fr" },
            { name: "Office de Tourisme Lomagne Tarn-et-Garonnaise", website: "tourisme.malomagne.com" },
            { name: "Office de Tourisme Intercommunal Quercy Sud-Ouest", website: "www.quercy-sud-ouest.com" },
            { name: "Office de Tourisme des Deux Rives", website: "www.officedetourismedesdeuxrives.fr" },
        ]
    }
];

// --- Composants (Mise à jour du Design) ---

/**
 * Composant de carte pour un Office de Tourisme
 */
const OfficeCard: React.FC<{ office: Office, isRegional?: boolean }> = ({ office, isRegional = false }) => (
    // Style Régional (Primaire) vs Départemental (Arrière-plan)
    <div className={`
        p-4 rounded-xl transition-all duration-300
        ${isRegional 
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
            : 'bg-background border border-border hover:shadow-md'
        }
    `}>
        <h3 className={`text-lg font-bold mb-2 flex items-center ${isRegional ? 'text-primary-foreground' : 'text-foreground'}`}>
            <MapPin className={`w-5 h-5 mr-2 ${isRegional ? 'text-primary-foreground/80' : 'text-primary'}`} />
            {office.name}
        </h3>
        <a 
            href={`https://${office.website}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`
                text-sm font-medium flex items-center hover:underline
                ${isRegional ? 'text-primary-foreground/90 hover:text-primary-foreground' : 'text-primary hover:text-primary/90'}
            `}
        >
            {office.website}
            <ExternalLink className="w-3 h-3 ml-1" />
        </a>
    </div>
);

/**
 * Composant pour la liste déroulante d'un département (Accordéon)
 */
const DepartmentAccordion: React.FC<{ department: Department }> = ({ department }) => {
    // Utilisation d'un état local pour un fonctionnement indépendant de chaque accordéon
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
                <h3 className="text-xl font-bold text-foreground">
                    {department.name}
                </h3>
                {/* Icône de flèche */}
                {isOpen ? (
                    <ChevronUp className="w-6 h-6 text-primary" />
                ) : (
                    <ChevronDown className="w-6 h-6 text-primary" />
                )}
            </button>

            {/* Contenu de l'accordéon (Corps) */}
            {/* Utilisation de l'affichage conditionnel pour contrôler l'ouverture, avec un style d'espacement */}
            {isOpen && (
                <div className="p-4 sm:p-5 pt-0">
                    {/* La grille des offices de tourisme */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-border pt-4">
                        {department.offices.map((office, officeIndex) => (
                            <OfficeCard key={officeIndex} office={office} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


/**
 * Composant principal de la page /tourisme-offices (Renommé pour le contexte)
 */
export default function TourismOfficesPage() {
    return (
        <div className="p-4 sm:p-8 space-y-10 bg-background min-h-screen font-sans">
            <header className="flex justify-start">
                {/* Exemple de bouton de retour - nécessite le composant Button de shadcn/ui */}
                {/* <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
                    <Link href="/">
                        <ChevronLeft className="h-5 w-5 mr-2" />
                        Retour au Tableau de Bord
                    </Link>
                </Button> */}
            </header>

            <div className="max-w-6xl mx-auto space-y-10 bg-card p-8 rounded-xl shadow-lg border border-border">
                
                {/* En-tête de la Page (Titre mis à jour) */}
                <header className="text-center pt-4 pb-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4 flex items-center justify-center">
                        <MapPin className="w-6 sm:w-8 h-6 sm:h-8 mr-3 text-primary" />
                        Organise tes Balades 🏞️
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Retrouve ici la liste complète des offices de tourisme en Occitanie pour planifier tes sorties.
                    </p>
                </header>

                {/* Office Régional */}
                <section className="mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-foreground border-l-4 border-primary pl-3">
                        Comité Régional (CRT)
                    </h2>
                    <OfficeCard office={regionalOffice} isRegional />
                </section>

                {/* Offices Départementaux avec Accordéons */}
                <section className="mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-foreground border-l-4 border-primary pl-3">
                        Offices par Département
                    </h2>
                    <div className="space-y-4">
                        {departments.map((dept, index) => (
                            <DepartmentAccordion key={index} department={dept} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
