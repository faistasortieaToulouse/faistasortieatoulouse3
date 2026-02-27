import type { Metadata } from 'next';
import Script from 'next/script'; // Importez Script pour les librairies externes
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { TranslateWrapper } from '@/components/TranslateWrapper';

// 🛑 Nouveaux imports pour la publicité 🛑
import FixedAdBanner from '@/components/ads/FixedAdBanner';

// Utilisez des variables d'environnement PUBLIQUES (NEXT_PUBLIC_) pour la configuration
// Par défaut, ENABLE_ADS sera 'false' d'après votre .env.local
const ENABLE_ADS = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true';

// Récupération de l'ID AdSense depuis les variables d'environnement.
// Cette valeur est celle fictive de votre .env.local pour le moment.
const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'VOTRE_ID_ADSENSE_PUB'; 

// Récupération de l'ID Analytics
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: 'Fais ta Sortie à Toulouse FTS',
  description: 'Application pour faire des sorties à Toulouse Fais Ta Sortie à Toulouse FTS, gratuit et sans limite, pour sortir à Toulouse',
  icons: {
    icon: '/icons/favicon.ico',
    shortcut: '/icons/favicon.ico',
    apple: '/icons/logoFTS180iphone.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>

        {/* --- GOOGLE ANALYTICS --- */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        {/* ------------------------- */}

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />

        {/* 🛑 LOGIQUE ADSENSE : Chargement conditionnel du script 🛑 */}
        {/* Le script est chargé UNIQUEMENT si les publicités sont activées (ENABLE_ADS=true) ET si l'ID est défini. */}
        {ENABLE_ADS && ADSENSE_PUB_ID && (
          <Script
            id="adsense-script"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive" // Charge après l'hydratation
          />
        )}
        
        {/* Meta PWA / iOS */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FTST" />
        <meta name="theme-color" content="#2563eb" />

        {/* Logo iOS */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/logoFTS180iphone.png" />

        {/* Manifest PWA */}
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body className="font-body antialiased">
        {children}

        {/* <GoogleTranslate /> */}
        {/* <TranslateWrapper /> */}

        <Toaster />

        {/* 🛑 LOGIQUE ADSENSE : Affichage conditionnel de la bannière fixe 🛑 */}
        {/* Le composant n'est affiché UNIQUEMENT si les publicités sont activées. */}
        {ENABLE_ADS && ADSENSE_PUB_ID && <FixedAdBanner />}
        
        {/*
          NOTE IMPORTANTE : Si le contenu de votre page est masqué par la bannière fixe 
          en bas (environ 58px de haut), vous devrez ajouter un padding-bottom 
          à l'élément qui contient le contenu principal (ex: une div autour de {children})
          pour que le bas soit toujours visible au-dessus de la barre de pub.
        */}

      </body>
    </html>
  );
}
