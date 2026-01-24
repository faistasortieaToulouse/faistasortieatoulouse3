import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary flex items-center gap-3">
          <LifeBuoy className="h-10 w-10" />
          Aide & FAQ
        </h1>
        <p className="mt-2 text-muted-foreground">
          Trouvez les réponses à vos questions les plus fréquentes.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Foire Aux Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Comment puis-je rejoindre une sortie ?
              </AccordionTrigger>
              <AccordionContent>
                Toutes nos sorties sont organisées sur notre serveur Discord.
                Cliquez sur le lien "Rejoindre Discord" ou sur une des sorties
                listées dans le tableau de bord pour accéder directement au
                salon correspondant et vous inscrire.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Comment puis-je créer ma propre sortie ?
              </AccordionTrigger>
              <AccordionContent>
                Pour proposer votre propre sortie, rendez-vous sur notre serveur
                Discord. Vous y trouverez des salons dédiés où vous pourrez
                décrire votre idée, fixer une date et inviter d'autres membres
                à se joindre à vous.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                L'application et les sorties sont-elles vraiment gratuites ?
              </AccordionTrigger>
              <AccordionContent>
                Oui, l'utilisation de l'application et la participation aux
                sorties organisées par la communauté sont entièrement
                gratuites. Certaines sorties peuvent inclure des activités
                payantes (musée, restaurant, etc.), mais cela est toujours
                clairement indiqué par l'organisateur.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                Dois-je obligatoirement avoir un compte Discord ?
              </AccordionTrigger>
              <AccordionContent>
                Oui, Discord est le cœur de notre communauté. C'est là que
                toutes les discussions, organisations et inscriptions aux
                sorties ont lieu. La création d'un compte Discord est gratuite
                et rapide.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                Comment puis-je contacter le support ?
              </AccordionTrigger>
              <AccordionContent>
                Si vous avez une question ou un problème, vous pouvez nous
                contacter via la page "Nous contacter" ou directement sur
                Discord, où notre équipe de modération est toujours prête à
                vous aider.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
