// urlsList.ts

interface Link {
    url: string;
    description: string;
}

interface Category {
    name: string;
    links: Link[];
}

// Liste complète et dédoublée (mais incluant les répertoires/chemins différents) des 205 URLs
const rawUrls: Record<string, string> = {
    "https://www.toulousebouge.com": "",
    "https://www.clutchmag.fr/evenements": "",
    "https://www.lepetittou.com/activite/culture/": "",
    "https://31.agendaculturel.fr/agenda-culturel/toulouse/": "OK", 
    "https://toulousesecret.com/culture/page/8/": "",
    "https://www.jds.fr/toulouse/agenda/": "",
    "https://www.alentoor.fr/toulouse/agenda": "",
    "https://www.cityzeum.com/evenement/toulouse": "",
    "https://toulouse.latribune.fr/evenements.html": "",
    "https://www.lafrenchtechtoulouse.com/open-agenda/": "",
    "https://bibliotheque.toulouse.fr/agenda": "",
    "https://agenda.toulouse-metropole.fr/": "",
    "https://www.toulouse-tourisme.com/agenda": "",
    "https://www.hautegaronnetourisme.com/bouger-et-sortir/sortir-se-divertir/tout-agenda/": "",
    "https://cpieterrestoulousaines.org/agenda/": "",
    "https://www.culture.gouv.fr/Regions/Drac-Occitanie": "",
    "https://openagenda.com/toulouse-metropole": "",
    "https://toulouse.demosphere.net/": "",
    "https://radar.squat.net/fr/events/city/Toulouse": "OK", 
    "https://la-toulouse.fr/category/evenement/": "",
    "https://www.amis.monde-diplomatique.fr/": "",
    "https://infolocale.actu.fr/occitanie/haute-garonne/toulouse-31000": "",
    "https://auchatnoir.noblogs.org/": "",
    "https://www.facebook.com/levasion.bar/events?locale=fr_FR": "",
    "http://lapasserelle-negreneys.org/": "OK", 
    "https://www.facebook.com/lapasserellenegreneys/events": "",
    "https://www.sozinho.org/agenda/": "",
    "https://www.placecommune.fr/programmation": "", // Remplacement de https://www.placecommune.fr/prog1
    "https://www.maisonmalepere.fr/programmation": "",
    "https://cafe-lastronef.fr/programme/": "",
    "https://lachapelletoulouse.com/evenements/": "",
    "http://lehangar.eklablog.com/": "",
    "https://vive.mixart-myrys.org/": "",
    "https://www.ombres-blanches.fr/posts/30/Nos-evenements": "",
    "https://www.librairieprivat.com/agenda.php": "",
    "https://www.librairie-terranova.fr/agenda-librairie": "",
    "https://www.fnac.com/Toulouse-Wilson/Fnac-Toulouse-Wilson/cl55/w-4": "OK", 
    "https://www.fnac.com/Toulouse-Labege/Fnac-Labege/cl57/w-4": "OK", 
    "https://conservatoire.toulouse.fr/agenda/": "",
    "http://www.orchestre-h2o.fr": "",
    "https://orchestre.ut-capitole.fr/accueil/concerts": "",
    "https://www.out-toulouse.fr/": "", // Remplacement de https://www.out-toulouse.fr/saison-en-cours
    "https://philharmonia-tolosa.fr/?cat=5": "",
    "https://orchestre-opus31.fr/events/": "",
    "http://ensemble-orchestral-pierre-de-fermat.fr/concerts-a-venir.php": "",
    "https://www.comdt.org/saison/les-concerts/": "",
    "https://agendatrad.org/calendrier/France/Occitanie": "",
    "https://www.facebook.com/groups/221534187648": "",
    "https://www.diversdanses.com/": "", // Remplacement de https://www.diversdanses.org/
    "https://www.facebook.com/Diversdanse/?locale=fr_FR": "",
    "https://www.facebook.com/page.bombes.2.bal/?locale=fr_FR": "",
    "https://toulouse-les-orgues.org/": "",
    "https://halles-cartoucherie.fr/agenda/": "",
    "https://www.leshallesdelatransition.com/evenements-programmation": "",
    "https://www.facebook.com/EspaceRoguet/events": "",
    "https://www.facebook.com/theatredesmazades/events": "",
    "https://www.fest.fr/agenda/haute-garonne/toulouse/conferences-forums-et-debats": "",
    "https://www.rencontres-occitanie.fr/": "",
    "https://museum.toulouse-metropole.fr/agenda/type/rencontres-conferences/": "",
    "https://www.tse-fr.eu/fr/events/conferences": "",
    "https://www.arnaud-bernard.net/conversations-socratiques/": "",
    "https://www.cite-espace.com/a-la-une/": "OK", 
    "https://www.canal-u.tv/chaines/fermatscience/voyage-en-mathematique": "",
    "https://www.chu-toulouse.fr/agenda/": "",
    "https://www.univ-tlse3.fr/agenda": "",
    "https://www.univ-tlse3.fr/actualites": "",
    "https://www.univ-tlse2.fr/accueil/agenda": "",
    "https://culture.univ-tlse2.fr/accueil/a-venir/a-la-fabrique": "",
    "https://www.ut-capitole.fr/accueil/campus/espace-media/actualites": "",
    "https://www.inp-toulouse.fr/fr/actualites.html": "",
    "https://www.univ-toulouse.fr/des-campus-attractifs/culture": "",
    "https://carnavaldetoulouse.fr/SiteCarnaval/": "",
    "https://www.tourisme-occitanie.com/agenda/par-date/mois/agenda-mars/?id1[q]=carnaval&id1[geo]=46.521075663842865~9.151611328125002~40.979898069620155~-3.6254882812500004": "",
    "http://lacaravanedescueilleurs.fr/stages-ateliers/": "",
    "https://www.hautegaronnetourisme.com/resultats-de-recherche/?search=botanique": "",
    "https://arbresetpaysagesdautan.fr": "",
    "https://www.mairie-revel.fr/agenda/": "",
    // L'URL "https://www.destination-belledonne.com/offres/balade-botanique..." a été supprimée.
    "https://www.eventbrite.fr/d/france--toulouse/botanique/": "",
    "https://www.billetweb.fr/balade-botanique-comestibles-medicinales-daout1": "",
    "https://tourisme.hautstolosans.fr/fr/diffusio/fetes-et-manifestations/rv-aux-jardins-visite-du-jardin-pedagogique-grenade-sur-garonne_TFOFMAMID031V50VXJB": "",
    "https://www.facebook.com/ArtByLizzie31/": "",
    "https://www.jds.fr/toulouse/agenda/manifestations-fetes-festivals-137_B": "",
    // L'URL "https://31.agendaculturel.fr/festival/" a été supprimée (doublon).
    "https://www.helloasso.com/e/reg/occitanie/dep/haute-garonne/ville/toulouse/act/festival": "OK", 
    "https://www.jds.fr/toulouse/agenda/concert-de-l-avent-et-de-noel-270_B": "",
    // L'URL "https://www.unidivers.fr/event/theatre-du-capitole..." a été supprimée.
    "https://31.agendaculturel.fr/festival/spectacles-de-noel-toulouse.html": "OK", 
    "https://toulouse-les-orgues.org/evenement/concert-de-noel/": "",
    "http://marchedenoeltoulouse.fr/": "",
    "https://noel.org/31-Haute-Garonne": "OK", 
    "https://www.festinoel.com/agendas-departement-31.html": "",
    "https://toulouse.kidiklik.fr/articles/336279-les-marches-de-noel-autour-de-toulouse.html": "",
    "https://www.helloasso.com/e/reg/occitanie/dep/haute-garonne/act/concert": "OK", 
    "https://www.lacordevocale.org/agenda/31-haute-garonne.html": "",
    "https://31.agendaculturel.fr/festival/spectacles-de-noel/": "OK", 
    "https://www.helloasso.com/associations/culture-ambition-toulouse": "OK", 
    "https://www.eventbrite.fr/d/france--toulouse/gratuit/": "",
    "https://fr-fr.facebook.com/groups/221534187648/": "",
    "https://www.culture31.com/": "",
    "https://www.toulouseinfos.fr/actualites/culture/50521-carte-toulouse-cultures.html": "",
    "https://www.instagram.com/toulouse_culture/": "",
    "https://actu.fr/toulouse/loisirs-culture": "",
    "https://www.cultureenmouvements.org/agenda": "",
    "https://www.tourisme-occitanie.com": "",
    "https://www.pyrenees-ariegeoises.com": "",
    "https://www.foix-tourisme.com": "",
    "https://www.tourisme-couserans-pyrenees.com": "",
    "https://www.tourisme-arize-leze.com": "",
    "https://www.pyreneescathares.com": "",
    "https://www.tourisme-carcassonne.fr": "",
    "https://www.cotedumidi.com": "",
    "https://www.gruissan-mediterranee.com": "",
    "https://www.pyreneesaudoises.com": "",
    "https://www.limouxin-tourisme.com/": "", // Remplacement de https://www.tourisme-limoux.fr
    "https://www.castelnaudary-tourisme.fr": "",
    "https://www.tourisme-corbieres-minervois.com/": "", // Remplacement de https://www.corbieres-minervois-tourisme.com
    "https://www.c3sm.fr/": "", // Remplacement de https://www.corbieres-salanque-mediterranee.fr
    "https://collinescathares.com": "",
    "https://www.rodez-tourisme.fr": "",
    "https://www.explore-millau.com/": "", // Remplacement de https://www.millau-tourisme.fr
    "https://www.tourisme-en-aubrac.com": "",
    "https://www.levezou-aveyron.com": "",
    "https://www.roquefort-tourisme.fr": "",
    "https://www.terresdaveyron.com/": "", // Remplacement de https://www.tourisme-terresdaveyron.fr
    "https://www.tourisme-conques.fr": "",
    "https://www.ouestaveyron.fr/": "", // Remplacement de https://www.tourisme-ouest-aveyron.fr
    "https://www.causses-aubrac-tourisme.com": "",
    "https://www.payssegali.fr/": "", // Remplacement de https://www.tourisme-pays-segali.fr
    "https://www.destinationhautlanguedoc.fr/": "", // Remplacement de https://www.tourisme-montsetlacs.fr
    "https://nimes-tourisme.com": "",
    "https://www.uzes-pontdugard.com": "",
    "https://www.cevennes-tourisme.fr": "",
    "https://www.provenceoccitane.com": "",
    "https://www.terredecamargue.fr/": "", // Remplacement de https://www.ot-terredecamargue.fr
    "https://www.coeurdepetitecamargue.fr": "",
    "https://www.piemont-cevenol-tourisme.com": "",
    "https://ot-sommieres.com/": "", // Remplacement de https://www.tourisme-sommieres.com
    "https://www.hautegaronnetourisme.com": "",
    "https://www.toulouse-tourisme.com": "",
    "https://www.pyrenees31.com": "",
    "https://www.tourisme-stgaudens.com/": "", // Remplacement de https://www.destination-comminges-pyrenees.com
    "https://www.auxsourcesducanaldumidi.com": "",
    "https://www.tourisme-volvestre.fr": "",
    "https://tourismecoeurdegaronne.com/": "", // Remplacement de https://www.coeurdegaronne.com
    "https://www.vignoblesetdecouvertesfronton.com/": "", // Remplacement de https://www.tourisme-vignobledefronton.com
    "https://www.cc-coteaux-du-girou.fr/": "", // Remplacement de https://www.tourisme-coteauxdugirou.com
    "https://www.lauragais-tourisme.fr/": "", // Remplacement de https://www.lauragaistourisme.fr
    "https://tourisme.hautstolosans.fr/": "", // Remplacement de https://www.hautstolosanstourisme.fr
    "https://www.auch-tourisme.com": "",
    "https://www.gers-armagnac.com": "",
    "https://www.grand-armagnac.com": "",
    "https://www.tourisme-mirande-astarac.com": "",
    "https://valdegerstourisme.fr/": "", // Remplacement de https://www.valdegerstourisme.com
    "https://www.coeursudouest-tourisme.com": "",
    "https://www.tourisme-gascognetoulousaine.com": "",
    "https://www.tourisme-bastidesdelomagne.fr": "",
    "http://www.tourisme-3cag-gers.com/": "", // Remplacement de https://www.tourisme-3cag-gers.com
    "https://www.capdagde.com": "",
    "https://www.beziers-mediterranee.com": "",
    "https://www.tourisme-sete.com": "",
    "https://www.montpellier-tourisme.fr": "",
    "https://www.mauguio-carnon.com": "",
    "https://www.saintguilhem-valleeherault.fr": "",
    "https://www.destination-salagou.fr": "",
    "https://www.tourisme-lodevois-larzac.fr": "",
    "https://www.tourisme.grandorb.fr/": "", // Remplacement de https://www.tourisme.grandorb.fr
    "https://www.tourismecanaldumidi.fr": "",
    "https://www.ot-paysdelunel.fr": "",
    "https://www.vallee-dordogne.com": "",
    "https://www.cahorsvalleedulot.com": "",
    "https://www.tourisme-figeac.com": "",
    "https://www.tourisme-gourdon.com": "",
    "https://www.tourisme-labastide-murat.fr": "",
    "https://www.gorgescaussescevennes.fr/": "", // Remplacement de https://www.gorges-causses-cevennes.com
    "https://www.aubrac-lozere.com": "",
    "https://www.mende-coeur-lozere.fr": "",
    "https://www.cevennes-montlozere.com": "",
    "https://www.margeride-en-gevaudan.com": "",
    "https://www.lozere-margeride.fr": "",
    "https://www.destination-montlozere.fr": "",
    "https://www.hautallier.com": "",
    "https://www.tarbes-tourisme.fr": "",
    "https://www.lourdes-infotourisme.com": "",
    "https://www.valleesdegavarnie.com": "",
    "https://www.tourmaletpicdumidi.com/": "", // Remplacement de https://www.grand-tourmalet.com
    "https://www.pyrenees2vallees.com": "",
    "https://www.tourisme-neste-barousse.fr": "",
    "http://adour-coteaux.fr/": "", // Remplacement de https://www.tourisme-coteaux-adour.fr
    "https://www.perpignantourisme.com": "",
    "https://www.argeles-sur-mer.com": "",
    "https://sudroussillon.fr/": "", // Remplacement de https://www.tourisme-sudroussillon.com
    "https://www.ot-canet.fr": "",
    "https://www.collioure.com": "",
    "https://www.banyuls-sur-mer.com": "",
    "https://www.lebarcares-tourisme.com/": "", // Remplacement de https://www.lebarcares.fr/tourisme/
    "https://www.tourisme-pyrenees-mediterranee.com/": "", // Remplacement de https://www.pyrenees-mediterranee.com/tourisme/
    "https://www.cc-aspres.fr/": "", // Remplacement de https://www.aspres-canigo.com
    "https://www.vallespir.com": "",
    "https://www.conflentcanigo.fr": "",
    "https://www.font-romeu.fr": "OK", 
    "https://lesangles.com/": "", // Remplacement de https://www.les-angles.com
    "https://www.fenouilledes.com": "",
    "https://www.albi-tourisme.fr": "",
    "https://www.tourisme-castresmazamet.com/": "", // Remplacement de https://www.tourisme-castres-mazamet.com
    "https://www.gaillacvisit.fr/": "", // Remplacement de https://www.tourisme-gaillac.fr
    "https://www.la-toscane-occitane.com/": "", // Remplacement de https://www.tourisme-toscane-occitane.com
    "https://www.valleedutarn-tourisme.com": "",
    "https://www.lepaysdecocagne.fr": "",
    "https://www.tourisme-centretarn.fr": "",
    "https://tourisme-tarn-carmaux.fr": "",
    "https://www.tourisme-sor-agout.fr": "",
    "https://sidobre-vallees-tourisme.com/": "", // Remplacement de https://www.tourisme-sidobre.com
    "https://www.montsdelacauneetmontagneduhautlanguedoc.fr/": "", // Remplacement de https://www.tourisme-montsdelacaune.com
    "https://www.montauban-tourisme.com": "",
    "https://www.tourisme-moissac-terresdesconfluences.fr": "",
    "https://www.gorges-aveyron-tourisme.com": "",
    "https://www.tourisme-quercy-caussadais.fr": "",
    "https://tourisme.grandsud82.fr": "",
    "https://tourisme.malomagne.com": "",
    "https://www.quercy-sud-ouest.com": "",
    "https://www.officedetourismedesdeuxrives.fr": "",
    "https://www.ffrandonnee.fr/": "", // Remplacement de https://ffrandonnee.fr
    "https://visorando.com": "",
    "https://alltrails.com": "",
    "https://opentopomap.org": "",
    "https://openstreetmap.org": "",
    "https://meteofrance.com/previsions-meteo-montagne": "",
    "https://meteofrance.com/previsions-meteo-france/occitanie/regin11": "", // Remplacement de https://meteofrance.com/previsions-meteo-france/occitanie/regiR76
    "https://www.hexatrek.com/": "",
    "https://www.mongr.fr/": "",
    "https://ignrando.fr/": "",
    "https://www.komoot.com/discover/Toulouse/@43.6046000,1.4451000/tours?sport=hike": "",
    "https://fr.wikiloc.com/wikiloc/map.do?sw=43.2371%2C0.9537&ne=43.9215%2C2.0483&place=Toulouse": "",
    "https://www.visorando.com/?component=rando&task=searchCircuitV2&loc=Toulouse": "OK" 
};

// Mappe les URLs brutes en objets Link pour le script
const allLinks: Link[] = Object.entries(rawUrls).map(([url, description]) => ({
  url,
  description: description || "URL à vérifier pour la validité et la disponibilité.",
}));

// Crée la structure Category pour l'export
export const categories: Category[] = [
    {
        name: "Liste complète des URLs à vérifier (y compris les chemins)",
        links: allLinks,
    },
];
