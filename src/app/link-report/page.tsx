import BrokenLinksReporter from '@/components/BrokenLinksReporter';
import React from 'react';

/**
 * Page dédiée à l'affichage du rapport des liens cassés.
 * * Cette page est conçue pour être utilisée en interne (pendant le développement ou le CI)
 * pour visualiser rapidement les URLs qui nécessitent une correction.
 */
export default function LinkReportPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/*
          Le composant BrokenLinksReporter lit le fichier JSON généré
          par 'npm run check-urls' et affiche les résultats dans un tableau.
        */}
        <BrokenLinksReporter />
      </div>
    </main>
  );
}