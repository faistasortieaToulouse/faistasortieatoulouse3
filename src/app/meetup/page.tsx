'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface MeetupGroup {
  name: string;
  reversedUrl: string;
  imageUrl: string;
  description: string;
}

const meetupGroups: MeetupGroup[] = [
  {
    name: "Expats in Toulouse",
    reversedUrl: "/esuoluot-ni-stapxe/moc.puteem.www//:sptth",
    imageUrl: "https://secure.meetupstatic.com/photos/event/4/f/d/b/clean_522560443.webp",
    description: "Pour les expatriés et les locaux qui veulent se rencontrer."
  },
  {
    name: "Toulouse sorties évènements soirées balades visites randos",
    reversedUrl: "/sodnar-setisiv-sedalab-seerios-stnemeneve-seitros-esuoluot/moc.puteem.www//:sptth",
    imageUrl: "https://secure.meetupstatic.com/photos/event/6/a/7/1/clean_513687249.webp",
    description: "Un grand groupe pour toutes sortes de sorties à Toulouse."
  }
];

function MeetupCard({ group }: { group: MeetupGroup }) {
  const [meetupUrl, setMeetupUrl] = useState<string>('');

  useEffect(() => {
    setMeetupUrl(group.reversedUrl.split('').reverse().join(''));
  }, [group.reversedUrl]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
        <CardDescription>{group.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow">
        <div className="aspect-video w-full overflow-hidden rounded-lg border mb-4 relative">
          {meetupUrl ? (
            <a
              href={meetupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full w-full relative"
            >
              <Image
                src={group.imageUrl}
                alt={`Image pour ${group.name}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </a>
          ) : (
            <div className="block h-full w-full relative pointer-events-none opacity-50">
              <Image
                src={group.imageUrl}
                alt={`Image pour ${group.name}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
        </div>

        <div className="mt-auto">
          <Button asChild variant="outline" disabled={!meetupUrl} className="w-full">
            <a href={meetupUrl || '#'} target="_blank" rel="noopener noreferrer">
              Ouvrir sur Meetup.com
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MeetupPage() {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary">Événements Meetup</h1>
        <p className="mt-2 text-muted-foreground">
          Découvrez des groupes pour sortir et rencontrer du monde à Toulouse.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {meetupGroups.map((group) => (
          <MeetupCard key={group.name} group={group} />
        ))}
      </div>
    </div>
  );
}
