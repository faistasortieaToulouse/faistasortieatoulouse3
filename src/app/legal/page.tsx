import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LegalPage() {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary">
          Mentions Légales
        </h1>
        <p className="mt-2 text-muted-foreground">
          Informations légales concernant Tolosa.
        </p>
      </header>

      <div className="space-y-6 text-card-foreground">
        <Card>
          <CardHeader>
            <CardTitle>Éditeur du site</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Association Happy People 31</p>
            <p>26, avenue de la Colonne</p>
            <p>31500 Toulouse</p>
            <p>France</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Directeur de la publication</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Le représentant légal de l'association Happy People 31.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Pour toute question, veuillez utiliser le formulaire de contact
              afin de nous contacter.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hébergeur et Infrastructure du site</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold mb-1">
              Hébergement Principal et Déploiement
            </p>
            <p>
              L'hébergement et le déploiement du site (Frontend et API Routes)
              sont assurés par :
            </p>
            <div className="ml-4 mt-2">
              <p>
                <strong>Vercel Inc.</strong>
              </p>
              <p>340 S Lemon Ave #4133</p>
              <p>Walnut, CA 91789, États-Unis</p>
            </div>

            <p className="font-semibold mt-4 mb-1">
              Services d'Infrastructure Complémentaires
            </p>
            <p>L'application utilise également les services suivants :</p>
            <div className="ml-4 mt-2">
              <p>
                <strong>Code Source (GitHub)</strong>
              </p>
              <p>GitHub, Inc.</p>
              <p>
                88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis.
              </p>
            </div>
            <div className="ml-4 mt-2">
              <p>
                <strong>Services Cloud & API (Google/Firebase)</strong>
              </p>
              <p>Google LLC / Firebase</p>
              <p>
                1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Note sur le Service et la Communauté</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-red-600 dark:text-red-400">
              IMPORTANT :
            </p>
            <p className="mt-2">
              Le site sert de portail d'accès et de tableau de bord pour la
              communauté. L'organisation des sorties, les discussions en temps
              réel et la modération de la communauté sont gérées exclusivement
              sur notre serveur{' '}
              <a
                href="[Lien de votre Discord]"
                target="_blank"
                className="text-primary hover:underline font-semibold"
              >
                Discord
              </a>
              . Les utilisateurs sont soumis aux conditions générales
              d'utilisation et à la politique de confidentialité de Discord pour
              toutes les activités menées sur ce serveur.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Propriété intellectuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              L'ensemble de ce site relève de la législation française et
              internationale sur le droit d'auteur et la propriété
              intellectuelle. Tous les droits de reproduction sont réservés, y
              compris pour les documents téléchargeables et les représentations
              iconographiques et photographiques.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Données personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Les informations recueillies font l'objet d'un traitement
              informatique destiné à la gestion des comptes utilisateurs et à la
              mise en relation des membres. Conformément à la loi "informatique
              et libertés" du 6 janvier 1978 modifiée, vous bénéficiez d'un droit
              d'accès et de rectification aux informations qui vous concernent,
              que vous pouvez exercer en nous contactant à l'adresse email
              mentionnée ci-dessus.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Responsabilité</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Tolosa Amical met tout en œuvre pour offrir aux utilisateurs des
              informations et/ou des outils disponibles et vérifiés mais ne
              saurait être tenu pour responsable des erreurs, d'une absence de
              disponibilité des fonctionnalités ou de la présence de virus sur
              son site. Les événements et annonces sont publiés sous la seule
              responsabilité de leurs auteurs.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
