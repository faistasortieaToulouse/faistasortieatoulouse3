'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Poll {
  question: {
    text: string;
  };
  answers: {
    answer_id: number;
    text: string;
  }[];
}

interface DiscordPollsProps {
  polls: {
    id: string;
    poll: Poll;
  }[];
}

const GUILD_ID = '1422806103267344416';
const POLLS_CHANNEL_ID = '1422806103904882842';

export function DiscordPolls({ polls }: DiscordPollsProps) {
  // ✅ Rafraîchissement automatique si aucun sondage n’est chargé
  useEffect(() => {
    if (!polls || polls.length === 0) {
      const hasRetried = sessionStorage.getItem('discord-polls-auto-refresh');
      if (!hasRetried) {
        console.log('🔄 Aucun sondage détecté — rechargement automatique dans 4 secondes...');
        const timer = setTimeout(() => {
          sessionStorage.setItem('discord-polls-auto-refresh', 'true');
          window.location.reload();
        }, 4000);
        return () => clearTimeout(timer);
      } else {
        console.warn('⚠️ Aucun sondage détecté après rechargement — arrêt des tentatives.');
      }
    } else {
      sessionStorage.removeItem('discord-polls-auto-refresh');
    }
  }, [polls]);

  // ✅ Cas : aucun sondage chargé
  if (!polls || polls.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <ListChecks className="w-6 h-6 text-primary" />
          <CardTitle>Sondages Discord Actifs</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Aucun sondage actif n’a pu être chargé.<br />
            Il se peut qu’aucun sondage ne soit en cours sur le serveur.
          </p>
          <Button
            onClick={() => {
              sessionStorage.removeItem('discord-polls-auto-refresh');
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

  // ✅ Cas : sondages disponibles
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-2">
        <ListChecks className="w-6 h-6 text-primary" />
        <CardTitle>Sondages Discord Actifs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {polls.map((pollMessage) => (
          <div
            key={pollMessage.id}
            className="p-3 border rounded-lg bg-secondary/50 shadow-md"
          >
            <h4 className="font-semibold text-lg mb-2 text-foreground">
              {pollMessage.poll.question.text}
            </h4>
            <p className="text-sm font-medium mb-1">Options :</p>
            <ul className="space-y-1 ml-4 list-disc text-muted-foreground">
              {pollMessage.poll.answers.map((answer: any) => (
                <li key={answer.answer_id} className="text-sm">
                  {answer.text}
                </li>
              ))}
            </ul>
            <a
              href={`https://discord.com/channels/${GUILD_ID}/${POLLS_CHANNEL_ID}/${pollMessage.id}`}
              target="_blank"
              className="mt-3 inline-block text-xs text-blue-500 hover:underline"
              rel="noopener noreferrer"
            >
              Voter sur Discord →
            </a>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
