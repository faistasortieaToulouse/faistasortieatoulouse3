'use client';

import { useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Hash, Volume2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// --- Interface (Types de Données) ---
interface Channel {
  id: string;
  name: string;
  position: number;
  type: number; // 0: Texte, 2: Vocal, 4: Catégorie
  parent_id?: string;
}

// --- Organisation Dynamique des Canaux ---
const organizeChannels = (channels: Channel[] | undefined) => {
  if (!channels) return { categories: [], categorizedChannels: {} };

  // Filtrer les catégories (Type 4)
  const categories: Channel[] = channels
    .filter((c) => c.type === 4)
    .sort((a, b) => a.position - b.position);

  const categorizedChannels: { [id: string]: Channel[] } = {};
  const categoryIds = categories.map((c) => c.id);

  // Initialiser les catégories
  categoryIds.forEach((id) => (categorizedChannels[id] = []));
  categorizedChannels['null'] = [];

  // Grouper les canaux Texte (0) et Vocaux (2)
  channels
    .filter((c) => c.type === 0 || c.type === 2)
    .sort((a, b) => a.position - b.position)
    .forEach((channel) => {
      const parentId = channel.parent_id || 'null';
      if (categorizedChannels[parentId]) {
        categorizedChannels[parentId].push(channel);
      } else {
        categorizedChannels['null'].push(channel);
      }
    });

  // Ajouter la fausse catégorie pour les canaux orphelins
  if (categorizedChannels['null'].length > 0) {
    categories.unshift({
      id: 'null',
      name: 'SALONS SANS CATÉGORIE',
      position: -1,
      type: 4,
    });
  }

  return { categories, categorizedChannels };
};

// --- Composant Principal ---
export function DiscordChannelList({ channels }: { channels?: Channel[] }) {
  const GUILD_ID = '1422806103267344416';
  const { categories, categorizedChannels } = organizeChannels(channels);
  const defaultOpenCategories = categories.map((c) => c.id);

  // ✅ Auto-refresh si aucun salon n’est chargé
  useEffect(() => {
    if (!channels || channels.length === 0) {
      const hasRetried = sessionStorage.getItem('discord-channels-auto-refresh');
      if (!hasRetried) {
        console.log('🔄 Aucun salon détecté — rechargement automatique dans 4 secondes...');
        const timer = setTimeout(() => {
          sessionStorage.setItem('discord-channels-auto-refresh', 'true');
          window.location.reload();
        }, 4000);
        return () => clearTimeout(timer);
      } else {
        console.warn('⚠️ Aucun salon détecté après rechargement — arrêt des tentatives.');
      }
    } else {
      sessionStorage.removeItem('discord-channels-auto-refresh');
    }
  }, [channels]);

  // --- Cas : aucun canal chargé ---
  if (!channels || channels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Salons du serveur</CardTitle>
          <CardDescription>
            Liste de tous les salons disponibles, groupés par catégorie.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Aucun salon n’a pu être chargé.<br />
            Assurez-vous que le bot dispose des autorisations nécessaires.
          </p>
          <Button
            onClick={() => {
              sessionStorage.removeItem('discord-channels-auto-refresh');
              window.location.reload();
            }}
            variant="outline"
            size="sm"
            className="flex items-center mx-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Rafraîchir
          </Button>
        </CardContent>
      </Card>
    );
  }

  // --- Cas : salons disponibles ---
  return (
    <Card>
      <CardHeader>
        <CardTitle>Salons du serveur</CardTitle>
        <CardDescription>
          Liste de tous les salons disponibles, groupés par catégorie.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <Accordion
            type="multiple"
            className="w-full pr-4"
            defaultValue={defaultOpenCategories}
          >
            {categories.map((category) => {
              const subChannels = categorizedChannels[category.id] || [];

              return (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="text-sm font-semibold uppercase text-muted-foreground hover:no-underline">
                    {category.name.replace(/-/g, ' ')}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2 pl-4 pt-2">
                      {subChannels.length > 0 ? (
                        subChannels.map((channel) => (
                          <Link
                            key={channel.id}
                            href={`https://discord.com/channels/${GUILD_ID}/${channel.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-md p-1 hover:bg-muted transition-colors min-w-0"
                          >
                            {channel.type === 2 ? (
                              <Volume2 className="h-4 w-4 text-primary shrink-0" />
                            ) : (
                              <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                            )}
                            <span className="text-sm font-medium hover:text-primary truncate">
                              {channel.name.replace(/-/g, ' ')}
                            </span>
                          </Link>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Aucun salon visible dans cette catégorie.
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
