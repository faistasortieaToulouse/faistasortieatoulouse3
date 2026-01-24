'use client';

// components/ads/FixedAdBanner.tsx

import React, { useEffect } from 'react';
import styles from './FixedAdBanner.module.css'; // Créez ce fichier CSS/module plus tard

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const FixedAdBanner: React.FC = () => {
  useEffect(() => {
    // Une fois le composant monté, demandez à AdSense de charger l'annonce
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={styles.adContainer}>
      {/* Code d'unité d'annonce AdSense */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="VOTRE_ID_ADSENSE_PUB" // REMPLACER
        data-ad-slot="VOTRE_ID_BLOC_ANNONCE" // REMPLACER
        data-ad-format="auto" // Laissez AdSense choisir la taille optimale (souvent 320x50 sur mobile)
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default FixedAdBanner;
