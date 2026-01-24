"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Download, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardMenuProps {
  ftsLogoUrl?: string;
}

export function DashboardMenu({ ftsLogoUrl }: DashboardMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Classes pour mobile / desktop
  const mobileMenuClasses = `absolute top-full left-0 w-64 bg-white shadow-lg p-4 z-50 md:hidden ${
    isOpen ? "block" : "hidden"
  }`;

  return (
    <div className="relative flex flex-col md:hidden">
      {/* Logo */}
      {ftsLogoUrl && (
        <div className="flex justify-center mb-2">
          <Image
            src={ftsLogoUrl}
            alt="Logo FTST"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      )}

      {/* Bouton hamburger */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg text-gray-900 hover:bg-gray-100 transition focus:outline-none self-center"
        aria-label="Ouvrir le menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Menu mobile */}
      <div className={mobileMenuClasses}>
        <ul className="flex flex-col gap-2">
          <li>
            <Button asChild size="lg" className="w-full">
              <Link
                href={`https://discord.com/channels/1422806103267344416/1422806103904882842`}
                target="_blank"
              >
                Pour commencer
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild size="lg" variant="outline" className="w-full">
              <Link href="https://discord.com/download" target="_blank">
                <Download className="mr-2 h-5 w-5" />
                Télécharger Discord
              </Link>
            </Button>
          </li>
          <li>
            <Button size="lg" variant="outline" disabled className="w-full">
              <PartyPopper className="mr-2 h-5 w-5" />
              Girls Party
            </Button>
          </li>
          <li>
            <Button size="lg" variant="outline" disabled className="w-full">
              <PartyPopper className="mr-2 h-5 w-5" />
              Student Event
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}
