// src/components/APKDownloadModal.tsx
'use client';

import { Store } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Remplacez par le nom de fichier correct
const APK_FILE_NAME = "app-release-signed.apk";

export default function APKDownloadModal() {
  return (
    <Dialog>
      {/* Le trigger est le bouton APK qui ouvrira le modal */}
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2 p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition h-auto">
          <Store className="h-5 w-5" />
          <span className="text-center leading-tight">
            Télécharger le fichier APK (TWA)
            <br />
            <span className="text-sm opacity-90">pour Android</span>
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">⚠️ IMPORTANT : Installation APK Android</DialogTitle>
          <DialogDescription>
            Veuillez lire ces étapes avant de télécharger l'application hors du Play Store.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <h3 className="font-semibold">Étape 1 : Le Téléchargement</h3>
          <p className="text-sm">
            Après avoir cliqué sur le bouton de téléchargement, votre téléphone affichera un avertissement de sécurité ("Ce fichier peut être dangereux"). Appuyez sur **"Télécharger quand même"** ou **"OK"**.
          </p>
          <h3 className="font-semibold">Étape 2 : L'Installation</h3>
          <p className="text-sm">
            Une fois le téléchargement terminé, si l'installation est bloquée, vous devrez aller dans **"Paramètres"** et **"Autoriser l'installation d'applications de sources inconnues"** pour votre navigateur.
          </p>
          <h3 className="font-semibold">Étape 3 : Lancement</h3>
          <p className="text-sm">
            Revenez en arrière et appuyez sur **"Installer"**. L'application sera ensuite disponible sur votre écran d'accueil.
          </p>
        </div>
        
        {/* Bouton de téléchargement final dans le modal */}
        <a
          href={`/${APK_FILE_NAME}`}
          download
          className="w-full"
        >
          <Button type="button" className="w-full bg-green-600 hover:bg-green-700">
            J'ai compris, Télécharger l'APK
          </Button>
        </a>

      </DialogContent>
    </Dialog>
  );
}