'use client';

import { InfoCard, CardLink } from '@/components/info-card';
import { Bus, Car, Bike, Zap, Train } from 'lucide-react';

export default function MobilityPage() {
    return (
        <div className="p-4 md:p-8">
            <header className="mb-8">
                <h1 className="font-headline text-4xl font-bold text-primary">Mobilité à Toulouse</h1>
                <p className="mt-2 text-muted-foreground">
                    Tous les liens utiles pour vous déplacer dans la métropole.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Section 1 : Tisséo (Bus & Métro) */}
                <InfoCard
                    icon={Bus}
                    title="Transports en Commun (Tisséo)"
                    description="Informations officielles sur les lignes, tarifs et perturbations."
                >
                    <CardLink
                        href="https://www.tisseo.fr/"
                        text="Site Officiel Tisséo"
                    />
                    <CardLink
                        href="https://www.tisseo.fr/se-deplacer/plans-lignes"
                        text="Plans du Réseau (Métro, Tram, Bus)"
                    />
                    <CardLink
                        href="https://www.tisseo.fr/tarifs-titres/tarifs-par-profil"
                        text="Tarifs et Abonnements"
                    />
                    <CardLink
                        href="https://www.tisseo.fr/infos-pratiques/perturbations-reseau"
                        text="Consulter les Perturbations"
                    />
                </InfoCard>

                {/* Section 2 : Covoiturage */}
                <InfoCard
                    icon={Car}
                    title="Covoiturage Métropolitain"
                    description="Partagez vos trajets quotidiens pour économiser et réduire l'empreinte carbone."
                >
                    <CardLink
                        href="https://covoiturage.haute-garonne.fr/"
                        text="Covoiturage Haute-Garonne"
                    />
                    <CardLink
                        href="https://www.blablacar.fr/trajet/toulouse"
                        text="BlaBlaCar (Longues Distances)"
                    />
                    <CardLink
                        href="https://tisseo.moncovoit.fr/"
                        text="Covoiturage Tisséo"
                    />
                </InfoCard>

                {/* Section 3 : Vélo & Mobilités Douces */}
                <InfoCard
                    icon={Bike}
                    title="Mobilités Douces"
                    description="Vélos en libre-service, pistes cyclables et aides à l'achat."
                >
                    <CardLink
                        href="https://www.velotoulouse.fr/"
                        text="VélôToulouse (Vélo en Libre-Service)"
                    />
                    <CardLink
                        href="https://www.toulouse.fr/web/deplacements/velos/le-reseau-cyclable"
                        text="Plan des Pistes Cyclables"
                    />
                    <CardLink
                        href="https://www.toulouse-metropole.fr/aides-subventions/mobilite"
                        text="Aides à l'Achat de Vélo"
                    />
                </InfoCard>
                
                {/* Section 4 : Infos Trafic & Routes (Ajouté) */}
                <InfoCard
                    icon={Zap}
                    title="Infos Trafic & Routes"
                    description="Consultez l'état du trafic en temps réel pour vos déplacements en voiture."
                >
                    <CardLink
                        href="https://toulousetrafic.com/"
                        text="Toulouse Trafic (État des Routes)"
                    />
                    <CardLink
                        href="https://www.waze.com/live-map/carpool?lat=43.6047&lon=1.4442&zoom=14"
                        text="Carte du Trafic Waze"
                    />
                </InfoCard>

{/* Section 5 : TER */}
<InfoCard
    icon={Train}
    title="Transports Régionaux (TER)"
    description="Horaires, tarifs et informations sur les trains régionaux."
>
    <CardLink
        href="https://www.ter.sncf.com/occitanie"
        text="Site Officiel TER Occitanie"
    />
    <CardLink
        href="https://www.oui.sncf/horaires/train"
        text="Rechercher un Train"
    />
    <CardLink
        href="https://www.sncf.com/fr/service-client/infos-trafic"
        text="Infos Trafic TER"
    />
</InfoCard>
                
            </div>
        </div>
    );
}
