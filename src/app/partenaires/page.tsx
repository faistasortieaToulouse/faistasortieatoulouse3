'use client';

import Link from 'next/link';
import { ChevronLeft, HeartHandshake, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// --- Fonction robuste pour décoder l'URL inversée et FORCER www. + http ---
const decodeUrl = (reversedUrl: string) => {
  // 1) nettoyer les slashs initiaux/final
  const cleanReversed = reversedUrl.replace(/^\/+|\/+$/g, '');

  // 2) inversion stricte caractère à caractère
  let decoded = cleanReversed.split('').reverse().join('');

  // 3) garantir protocole http (pour new URL)
  if (!/^https?:\/\//i.test(decoded)) decoded = 'http://' + decoded;

  // 4) parser proprement et forcer 'www.' si absente du hostname
  try {
    const u = new URL(decoded);

    if (!u.hostname.startsWith('www.')) {
      u.hostname = 'www.' + u.hostname;
    }

    // retourne l'URL avec http
    u.protocol = 'http:';
    return u.toString();
  } catch (err) {
    // fallback
    let fallback = decoded;
    if (!/^https?:\/\//i.test(fallback)) fallback = 'http://' + fallback;
    if (!fallback.includes('www.')) fallback = fallback.replace(/^http:\/\//i, 'http://www.');
    return fallback;
  }
};

interface Partenaire {
  name: string;
  description: string;
  reversedUrl: string;
}

export default function PartenairesPage() {
  const partenaires: Partenaire[] = [
    {
      name: 'Happy People 31',
      description: 'Communauté d’échange et de sorties conviviales.',
      reversedUrl: '/fn.rf.elpoepyppah.www//:ptth', // inversé exact
    },
    {
      name: 'Bilingue 31',
      description: 'Événements d’échange linguistique et culturel.',
      reversedUrl: '/fn.rf.eugnilib.www//:ptth', // inversé exact
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <header className="flex justify-between items-center">
        <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
          <Link href="/">
            <ChevronLeft className="h-5 w-5 mr-2" />
            Retour au Tableau de Bord
          </Link>
        </Button>
      </header>

      <div className="bg-card p-8 rounded-xl shadow-lg border">
        <h1 className="font-headline text-4xl font-bold text-primary mb-4 flex items-center gap-3">
          <HeartHandshake className="h-7 w-7" />
          Nos Partenaires
        </h1>
        <p className="mb-8 text-muted-foreground max-w-2xl">
          Découvrez les associations et les communautés qui soutiennent notre mission à Toulouse.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {partenaires.map((partenaire) => {
            const finalUrl = decodeUrl(partenaire.reversedUrl);

            return (
              <Card key={partenaire.name} className="flex flex-col items-center text-center">
                <CardHeader>
                  <CardTitle className="text-primary">{partenaire.name}</CardTitle>
                  <CardDescription>{partenaire.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <Button asChild variant="outline" className="mt-2">
                    <a href={finalUrl} target="_blank" rel="noopener noreferrer">
                      Voir le site
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
