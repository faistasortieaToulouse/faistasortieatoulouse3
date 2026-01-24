'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CalendarHeart, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiscordWidgetData {
  id: string;
  name: string;
  instant_invite: string;
  channels: any[];
  members: any[];
  presence_count: number;
  events: any[];
}

export function DiscordStats({ data }: { data: DiscordWidgetData | null }) {
  const memberCount = data?.presence_count ?? 0;
  const eventCount = data?.events?.length ?? 0;

  // ✅ Rafraîchissement automatique si les stats sont nulles ou vides
  useEffect(() => {
    if (!data || (!data.members?.length && !data.events?.length)) {
      const hasRetried = sessionStorage.getItem('discord-stats-auto-refresh');
      if (!hasRetried) {
        console.log('🔄 Aucune donnée Discord détectée — tentative de rechargement dans 4 secondes...');
        const timer = setTimeout(() => {
          sessionStorage.setItem('discord-stats-auto-refresh', 'true');
          window.location.reload();
        }, 4000);
        return () => clearTimeout(timer);
      } else {
        console.warn('⚠️ Données Discord toujours absentes après un rechargement — arrêt des tentatives.');
      }
    } else {
      sessionStorage.removeItem('discord-stats-auto-refresh');
    }
  }, [data]);

  // ✅ Cas : aucune donnée
  if (!data || (!data.members?.length && !data.events?.length)) {
    return (
      <Card className="p-4 text-center">
        <CardHeader>
          <CardTitle>Statistiques Discord</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Impossible de charger les statistiques du serveur Discord.<br />
            Vérifie la connexion du bot ou réessaie dans un instant.
          </p>
          <Button
            onClick={() => {
              sessionStorage.removeItem('discord-stats-auto-refresh');
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

  // ✅ Cas : données disponibles
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Membres en ligne */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Membres en ligne</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{memberCount}</div>
          <p className="text-xs text-muted-foreground">Actuellement sur le Discord</p>
        </CardContent>
      </Card>

      {/* Événements à venir */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Événements à venir</CardTitle>
          <CalendarHeart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{eventCount}</div>
          <p className="text-xs text-muted-foreground">Planifiés sur le Discord</p>
        </CardContent>
      </Card>
    </div>
  );
}
