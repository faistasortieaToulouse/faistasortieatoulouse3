// src/components/TranslateWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import GoogleTranslate from '@/components/GoogleTranslate'; // Assurez-vous que ce chemin est correct !

/**
 * Ce wrapper force le composant GoogleTranslate à se re-monter
 * complètement à chaque navigation Next.js via le changement de 'key'.
 * C'est essentiel pour que le widget Google se réinitialise sur le nouveau DOM.
 */
export function TranslateWrapper() {
  // Détecte le changement de route côté client
  const pathname = usePathname();
  
  return (
    // La clé change à chaque navigation, forçant la destruction/recréation du composant
    <GoogleTranslate key={pathname} />
  );
}
