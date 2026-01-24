'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

function InstallPWAiOS() {
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

    if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
      setDeviceType('ios');
    } else if (/Android/.test(ua)) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }

    // Vérifie si l'app est déjà installée en mode standalone
    if (
      (window.navigator as any).standalone ||
      window.matchMedia('(display-mode: standalone)').matches
    ) {
      setIsStandalone(true);
    }
  }, []);

  if (isStandalone) return null; // ne pas afficher si déjà installé

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-700 border rounded-lg shadow-md max-w-xs mx-auto">
      {deviceType === 'ios' && (
        <>
          <div className="mb-3">
            <Image
              src="/images/app-icon.png"
              alt="Icône de l'application"
              width={80}
              height={80}
              className="rounded-lg"
            />
          </div>
          <h3 className="font-bold text-center text-gray-800 dark:text-white mb-2">
            Installer l'App sur iPhone / iPad
          </h3>
          <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-3">
            Pour installer, appuyez sur <strong>Partager</strong> puis <strong>Ajouter à l’écran d’accueil</strong>.
          </p>
          <div className="relative w-full h-20 mb-2">
            <Image
              src="/images/pwa-ios-guide.png"
              alt="Guide Installation PWA iOS"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">
            Vous pourrez ensuite lancer l’application directement depuis votre écran d’accueil.
          </span>
        </>
      )}

      {deviceType === 'android' && (
        <div className="text-center">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Installer l'App sur Android</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Téléchargez notre application depuis le Play Store :
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=com.votre.appli.android"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 p-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
          >
            <Image src="/images/google-play-badge.png" alt="Google Play" width={120} height={36} />
          </a>
        </div>
      )}

      {deviceType === 'desktop' && (
        <div className="text-center">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">Version mobile disponible</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Notre application est optimisée pour les téléphones. Scannez le QR code pour y accéder :
          </p>
          <div className="relative w-32 h-32 mx-auto mb-3">
            <Image
              src="/images/qrcode.png"
              alt="QR code vers version mobile"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Bouton Retour (visible partout) */}
      <button
        onClick={handleGoBack}
        className="mt-2 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md shadow hover:bg-gray-300 dark:hover:bg-gray-500 transition"
      >
        Retour
      </button>
    </div>
  );
}

// ✅ Export par défaut pour Next.js
export default function InstallPwaIosPage() {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <InstallPWAiOS />
    </div>
  );
}
