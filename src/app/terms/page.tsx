import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary">Charte d'utilisation</h1>
        <p className="mt-2 text-muted-foreground">
          Règles de bonne conduite et conditions d'utilisation de notre service.
        </p>
      </header>

      <div className="space-y-6 text-card-foreground">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenue sur Fais ta sortie à Toulouse !</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Pour que notre communauté reste un espace convivial, sûr et respectueux, nous vous demandons de lire et d'accepter les règles suivantes.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1. Respect et bienveillance</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Chaque membre s'engage à faire preuve de courtoisie, de respect et de tolérance envers les autres utilisateurs. Les propos haineux, discriminatoires, injurieux, ou toute forme de harcèlement sont strictement interdits et entraîneront une suspension immédiate du compte.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Sécurité et données personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ne partagez jamais d'informations personnelles sensibles (numéro de téléphone, adresse exacte, informations bancaires) dans les espaces publics de l'application. Utilisez la messagerie privée pour des échanges plus personnels, mais restez vigilant.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Contenu des publications</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Toute publication (annonces, discussions, événements) doit être légale et conforme aux bonnes mœurs. Les contenus à caractère pornographique, violent, illégal ou faisant l'apologie d'activités illicites sont proscrits.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Interdiction des sorties de rencontre amoureuse ou entre célibataires</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Etant donné les problèmes provoqués par les évènements de rencontre, les sorties de rencontre sont prohibées sur notre application. Fais ta sortie à Toulouse est une plateforme dédiée aux sorties amicales et à l'entraide. Les événements organisés dans le but explicite de faire des rencontres amoureuses ou "dating" ne sont pas autorisés. Toute publication de ce type sera supprimée. Tout contrevenant pourra faire l'objet d'une suspension de son compte.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Signalements</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Si vous constatez un comportement ou un contenu qui enfreint cette charte, utilisez les outils de signalement mis à votre disposition. Notre équipe de modération examinera chaque signalement avec attention.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Responsabilité</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Les organisateurs de sorties sont responsables du bon déroulement de leurs événements. Fais ta sortie à Toulouse agit comme une plateforme de mise en relation et ne peut être tenu responsable des incidents survenant lors des activités organisées par ses membres.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Sorties payantes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>En ce qui concerne les sorties payantes ou qui contiennent des activités payantes ou vente de produits à côté, elles doivent être signalées au moins dans la description de la sortie. La transparence est essentielle pour que les membres puissent participer en toute connaissance de cause.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Concurrence</CardTitle>
          </CardHeader>
          <CardContent>
            <p>L'utilisation de cette application ne doit pas donner lieu à la promotion d'une autre application de même type que celle-ci.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acceptation</CardTitle>
          </CardHeader>
          <CardContent>
            <p>En vous inscrivant, vous confirmez avoir lu et accepté l'ensemble de cette charte. Merci de contribuer à faire de Fais ta sortie à Toulouse un espace positif et accueillant pour tous !</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
