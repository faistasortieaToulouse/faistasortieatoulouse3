'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function DiscordWidget() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Vérifie si le widget s'affiche après 5s
    const timeout = setTimeout(() => {
      if (!loaded && !error) {
        const hasRetried = sessionStorage.getItem('discord-widget-auto-refresh');
        if (!hasRetried) {
          console.log('🔄 Widget Discord non chargé — tentative automatique de rechargement...');
          sessionStorage.setItem('discord-widget-auto-refresh', 'true');
          window.location.reload();
        } else {
          console.warn('⚠️ Widget Discord toujours absent après un rechargement — arrêt des tentatives.');
          setError(true);
        }
      } else {
        sessionStorage.removeItem('discord-widget-auto-refresh');
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [loaded, error]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rejoins la conversation</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center w-full">
        {!loaded && !error && (
          <p className="text-sm text-muted-foreground mb-2 text-center">
            Chargement du widget Discord…
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500 mb-2 text-center">
            Impossible de charger le widget Discord. Veuillez réessayer.
          </p>
        )}

        {/* Container responsive pour supprimer le scroll horizontal */}
        <div className="w-full">
          <iframe
            src="https://discord.com/widget?id=1422806103267344416&theme=dark"
            className="w-full h-[450px] md:h-[450px] rounded-lg"
            allowTransparency={true}
            frameBorder="0"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            onLoad={() => setLoaded(true)}
          />
        </div>

        {(!loaded || error) && (
          <div className="mt-3">
            <Button
              onClick={() => {
                sessionStorage.removeItem('discord-widget-auto-refresh');
                window.location.reload();
              }}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Rafraîchir
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
