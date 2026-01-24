import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  const today = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary">Politique de Confidentialité</h1>
        <p className="mt-2 text-muted-foreground">
          Informations sur la collecte et l'utilisation de vos données.
        </p>
      </header>

      <div className="space-y-6 text-card-foreground">
        <Card>
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent>
            {/* MISE À JOUR : Ajout de l'entité légale Happy People 31 et son adresse */}
            <p>Fais ta sortie à Toulouse (ci-après « l'Application » ou « Nous »), éditée par l'association **Happy People 31**, basée au 26, avenue de la Colonne à Toulouse, s'engage à protéger la confidentialité des utilisateurs. Cette politique de confidentialité détaille les types d'informations que nous collectons via l'Application, la manière dont nous les utilisons et les droits des utilisateurs concernant ces informations.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Données Collectées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <h3 className="font-semibold">2.1. Informations Fournies par l'Utilisateur</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    {/* MISE À JOUR : Clarification sur la condition de collecte */}
                    <li>Données d'identité et de contact (lorsque l'utilisateur choisit de créer un compte) : Nom d'utilisateur, adresse e-mail, mot de passe chiffré.</li>
                    {/* MISE À JOUR : Clarification sur le contenu utilisateur */}
                    <li>Contenu Utilisateur (le cas échéant : messages dans les discussions, commentaires sur les sorties, descriptions de profils) : Textes, photos, ou autres contenus que vous téléchargez ou créez dans l'Application.</li>
                </ul>
            </div>
              <div>
                <h3 className="font-semibold">2.2. Informations Collectées Automatiquement</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Données d'utilisation : Informations sur la manière dont vous interagissez avec l'Application (pages vues, fonctionnalités utilisées, fréquence d'accès, etc.).</li>
                    {/* MISE À JOUR : Clarification des exemples d'identifiants techniques */}
                    <li>Données techniques : Adresse IP, type d'appareil mobile, système d'exploitation, identifiants uniques de l'appareil (tels que : IDFA pour iOS, Android ID pour Android).</li>
                    {/* MISE À JOUR : Clarification sur le consentement explicite de l'utilisateur */}
                    <li>Données de localisation (si l'utilisateur a donné son consentement explicite, par exemple via l'activation du GPS de son appareil) : Localisation géographique précise via GPS ou moins précise via l'adresse IP.</li>
                    <li>Cookies et technologies similaires : Utilisés pour améliorer l'expérience utilisateur et analyser l'utilisation de l'Application.</li>
                </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>3. Utilisation des Données</CardTitle></CardHeader>
            <CardContent>
                <p>Nous utilisons les données collectées pour les finalités suivantes :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Fourniture de Services : Pour exploiter, maintenir, fournir et améliorer les fonctionnalités de l'Application.</li>
                    <li>Communication : Pour répondre à vos demandes de support, vous envoyer des notifications liées au service, ou des communications marketing (avec votre consentement).</li>
                    <li>Analyse et Amélioration : Pour surveiller les métriques d'utilisation, diagnostiquer les problèmes techniques et améliorer l'expérience utilisateur.</li>
                    <li>Sécurité et Conformité Légale : Pour prévenir la fraude, protéger la sécurité de l'Application et se conformer aux obligations légales.</li>
                </ul>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader><CardTitle>4. Partage des Données</CardTitle></CardHeader>
            <CardContent>
                <p>Nous ne vendons ni ne louons vos données personnelles à des tiers. Nous pouvons partager vos informations avec :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Prestataires de Services Tiers : Entreprises externes qui nous aident à exploiter l'Application (hébergement de données, services d'analyse, marketing). Ces tiers sont contractuellement obligés de protéger vos données.</li>
                    <li>Obligations Légales : Si nous y sommes contraints par la loi ou par une procédure judiciaire valide (par exemple, un mandat de perquisition ou une ordonnance d'un tribunal).</li>
                    <li>Transferts d'Entreprise : Dans le cadre d'une fusion, acquisition, ou vente d'actifs, vos données pourraient être transférées à l'entité acquéreuse.</li>
                </ul>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Durée de Conservation des Données</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Nous conservons vos informations personnelles aussi longtemps que nécessaire pour vous fournir le service, et pour nous conformer à nos obligations légales, résoudre les litiges et appliquer nos politiques.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Vos Droits d'Utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Conformément à la réglementation applicable (comme le RGPD), vous disposez des droits suivants :</p>
             <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Droit d'accès : Obtenir la confirmation que vos données sont traitées et, le cas échéant, y accéder.</li>
                <li>Droit de rectification : Demander la correction de données inexactes.</li>
                <li>Droit à l'effacement : Demander la suppression de vos données personnelles (sous certaines conditions).</li>
                <li>Droit d'opposition : Vous opposer au traitement de vos données pour certaines finalités, comme le marketing direct.</li>
             </ul>
             <p className="mt-2">Pour exercer ces droits, veuillez nous contacter à l'adresse fournie dans la section 7.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Nous Contacter</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Si vous avez des questions concernant cette politique de confidentialité, vous pouvez nous contacter à : tolosa31@free.fr.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Modifications de la Politique de Confidentialité</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Nous pourrons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de toute modification en publiant la nouvelle politique sur cette page et en changeant la date d'entrée en vigueur ci-dessous.</p>
            <p className="mt-4 font-semibold">Date d'entrée en vigueur : {today}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
