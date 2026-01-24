import fs from 'fs';
// Assurez-vous d'avoir node-fetch installé
import fetch from 'node-fetch'; 
import { categories } from './urlsList'; // <-- CORRECTION: RETRAIT de l'extension .ts

// Le message d'erreur souhaité
const ERROR_MESSAGE = '— Attention ! L’adresse de cette page a changé, merci de parcourir le site web.';
const OUTPUT_FILE = 'src/lib/checkUrlsResults.json';

// --- Interfaces (à copier depuis urlsList.ts pour la compilation) ---
interface Link {
    url: string;
    description: string;
}
interface Category {
    name: string;
    links: Link[];
}
// --------------------------------------------------------------------

(async () => {
    // Le type des clés de results doit être 'string' (l'URL)
    const results: Record<string, string> = {}; 
    let checkedCount = 0;

    console.log('Démarrage de la vérification des URLs...');

    for (const category of categories as Category[]) {
        // CORRECTION CLÉ : on itère sur 'link' (l'objet) et on utilise 'link.url'
        for (const link of category.links) {
            const url = link.url; // <-- On extrait la chaîne de caractères de l'URL
            checkedCount++;
            
            // --- CORRECTION DU TIMEOUT ---
            const controller = new AbortController();
            // Annule la requête après 5000ms (5 secondes)
            const timeoutId = setTimeout(() => controller.abort(), 5000); 
            // -----------------------------
            
            try {
                // Utilise maintenant la chaîne de caractères 'url' et le signal de l'AbortController
                const res = await fetch(url, { 
                    method: 'HEAD',
                    signal: controller.signal // Utilisation du signal pour le timeout
                }); 
                
                clearTimeout(timeoutId); // Si la requête réussit ou échoue rapidement, on nettoie le timer.
                
                if (!res.ok) {
                    results[url] = ERROR_MESSAGE;
                    console.log(`[ERREUR - ${res.status}] ${url}`);
                } else {
                    results[url] = '';
                }
            } catch (error) {
                clearTimeout(timeoutId);
                // Si l'erreur est AbortError (timeout), c'est une erreur "fatale"
                if ((error as Error).name === 'AbortError') {
                    console.log(`[TIMEOUT] ${url} : Requête annulée après 5s.`);
                } else {
                    console.log(`[ÉCHEC FATAL] ${url} : ${(error as Error).message}`);
                }
                results[url] = ERROR_MESSAGE;
            }
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`\nVérification terminée. ${checkedCount} URLs vérifiées. Résultats enregistrés dans ${OUTPUT_FILE}`);
})();
