'use client';

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { Download, PartyPopper, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardMenuProps {
  ftsLogoUrl?: string | StaticImageData;
}

export function DashboardMenu({ ftsLogoUrl }: DashboardMenuProps) {
  return (
    <div className="relative w-full flex flex-col items-center">
      {/* BOUTONS PRINCIPAUX — Responsive */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full mt-4 px-4">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link
            href="https://discord.com/channels/1422806103267344416/1422806103904882842"
            target="_blank"
          >
            Pour commencer clique sur ce bouton
          </Link>
        </Button>

        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
          <Link href="https://discord.com/download" target="_blank">
            <Download className="mr-2 h-5 w-5" />
            Télécharger Discord
          </Link>
        </Button>

        <Button
          asChild
          size="lg"
          variant="outline"
          className="w-full sm:w-auto bg-green-50 hover:bg-green-100 text-green-700"
        >
          <Link
            href="https://chat.whatsapp.com/DTtPXJb8Z787JDhyjeRS6S"
            target="_blank"
          >
            <MessageCircle className="mr-2 h-5 w-5 text-green-600" />
            Rejoindre le groupe WhatsApp
          </Link>
        </Button>
      </div>

      {/* ÉVÉNEMENTS DÉSACTIVÉS — Responsive */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 mt-4 px-4 w-full">
        <Button size="lg" variant="outline" disabled className="w-full sm:w-auto">
          <PartyPopper className="mr-2 h-5 w-5" />
          Girls Party
        </Button>
        <Button size="lg" variant="outline" disabled className="w-full sm:w-auto">
          <PartyPopper className="mr-2 h-5 w-5" />
          Student Event
        </Button>
        <Button size="lg" variant="outline" disabled className="w-full sm:w-auto">
          <PartyPopper className="mr-2 h-5 w-5" />
          Rando Trip
        </Button>
      </div>
    </div>
  );
}
