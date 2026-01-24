import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary">À Propos</h1>
        <p className="mt-2 text-muted-foreground">
          Bienvenue sur votre application de sorties à Toulouse !
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Notre Objectif</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-card-foreground">
          <p>
            Notre mission est simple : vous permettre de faire des sorties à Toulouse, d'échanger, de vous informer, mais aussi de pouvoir créer vos propres sorties et de vous y inscrire.
          </p>
          <p>
            Tout est entièrement gratuit et sans aucune limite !
          </p>
          <div className="rounded-lg border bg-secondary/50 p-4">
             <p className="font-semibold">
                Attention ! Pour discuter, échanger et organiser vos sorties, nous utilisons Discord. C'est le cœur de notre communauté.
             </p>
          </div>
          <Button asChild className="mt-4">
            <a href="https://discord.com/channels/1422806103267344416/1422806103904882842" target="_blank" rel="noopener noreferrer">
              <MessageSquare className="mr-2" />
              Rejoindre la discussion sur Discord
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
