'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Facebook } from 'lucide-react';

const facebookGroups = [
  { name: "Happy People Toulouse", url: "https://www.facebook.com/groups/996796667051330" },
  { name: "Toulouse Le Bon Plan", url: "https://www.facebook.com/groups/550741995050817" },
  { name: "Toulouse libre ou gratuit", url: "https://www.facebook.com/groups/651831044888765" },
  { name: "Sorties Soirées Toulouse", url: "https://www.facebook.com/groups/596757027131271" },
  { name: "Colocation hébergement gratuit Toulouse", url: "https://www.facebook.com/groups/559216034241574" },
  { name: "Les Concerts Gratuits de Toulouse", url: "https://www.facebook.com/groups/221534187648" },
  { name: "Sorties culturelles à Toulouse", url: "https://www.facebook.com/groups/513531158446053" },
  { name: "Sorties Visite Toulouse, Occitanie et Région Toulousaine", url: "https://www.facebook.com/groups/546506525504472" },
  { name: "Soirées sorties entre filles Toulouse et Occitanie", url: "https://www.facebook.com/groups/1397077878141492" },
  { name: "Aller au théâtre, impro, stand up, spectacles, comédie à Toulouse", url: "https://www.facebook.com/groups/1396560737927890" }
];

interface FacebookGroupCardProps {
  name: string;
  url: string;
}

function FacebookGroupCard({ name, url }: FacebookGroupCardProps) {
  return (
    <Card className="flex flex-col items-center justify-between p-4">
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-semibold flex items-center justify-center gap-2">
          <Facebook className="h-5 w-5 text-blue-600" />
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-blue-600 font-medium hover:underline"
        >
          Voir le groupe sur Facebook
        </a>
      </CardContent>
    </Card>
  );
}

export default function FacebookGroupsPage() {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary">Groupes Facebook</h1>
        <p className="mt-2 text-muted-foreground">
          Les meilleurs groupes Facebook pour les sorties et bons plans à Toulouse.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facebookGroups.map((group) => (
          <FacebookGroupCard
            key={group.name}
            name={group.name}
            url={group.url}
          />
        ))}
      </div>
    </div>
  );
}
