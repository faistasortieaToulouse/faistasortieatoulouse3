import React, { useMemo } from 'react';

// --- Définition du type pour le rapport de liens ---
interface LinkReport {
    [url: string]: string; // Clé: URL (string), Valeur: Message d'erreur ou chaîne vide (string)
}

// IMPORTANT : Assurez-vous que ce chemin est correct pour votre projet Next.js
// Si le fichier est généré dans src/lib/, Next.js devrait pouvoir le lire en utilisant require() ou un import dynamique.
// Pour simplifier l'exemple et le rendre exécutable, nous allons utiliser un import synchrone.
// Assurez-vous que votre environnement permet l'import de JSON directement.

let results: LinkReport = {};
try {
    // Tentative d'importer directement le JSON généré
    // ATTENTION: Remplacez ce chemin par le chemin réel dans votre projet.
    // L'importation est typée grâce au cast 'as LinkReport'.
    const resultsData = require('../lib/checkUrlsResults.json'); 
    results = resultsData as LinkReport;
} catch (e) {
    // Si l'importation échoue (par exemple, le fichier n'existe pas encore ou erreur de résolution de module)
    console.error("Erreur lors de l'importation de checkUrlsResults.json:", (e as Error).message);
    results = {}; // Utiliser un objet vide pour éviter le crash
}
// ----------------------------------------


/**
 * Composant pour afficher un rapport clair des URLs cassées.
 * Il filtre les résultats pour n'afficher que les entrées non vides (les liens cassés).
 */
const BrokenLinksReporter = () => {
    // Calcule la liste des liens cassés une seule fois.
    const brokenLinks = useMemo(() => {
        if (!results || Object.keys(results).length === 0) {
            return [];
        }
        return Object.entries(results)
            .filter(([, message]) => message && message.trim() !== "")
            .map(([url, message]) => ({ url, message }));
    }, [results]);


    if (!results || Object.keys(results).length === 0) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <h2 className="text-xl font-semibold mb-2">Alerte: Fichier de Résultats Manquant ou Vide</h2>
                <p>Le composant n'a pas pu charger le fichier de résultats (<code className="font-mono text-sm">src/lib/checkUrlsResults.json</code>).</p>
                <p className="mt-2 font-medium">Action requise : Veuillez exécuter <code className="font-mono text-sm bg-red-200 p-1 rounded">npm run check-urls</code> avant de lancer le serveur de développement ou la construction.</p>
            </div>
        );
    }

    if (brokenLinks.length === 0) {
        return (
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <h2 className="text-xl font-bold">🎉 Félicitations !</h2>
                <p>Aucun lien cassé n'a été trouvé dans le dernier rapport.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Rapport des Liens Cassés</h1>
            <p className="text-gray-600 mb-6">
                {brokenLinks.length} lien(s) cassé(s) identifié(s). Mettez à jour <code className="font-mono text-sm text-indigo-600">src/scripts/urlsList.ts</code> pour corriger.
            </p>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full text-left bg-white">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="py-3 px-4 font-semibold uppercase text-sm text-gray-600">URL Cassée</th>
                            <th className="py-3 px-4 font-semibold uppercase text-sm text-gray-600">Message d'Erreur</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brokenLinks.map((link, index) => (
                            <tr key={index} className="border-b last:border-b-0 hover:bg-yellow-50 transition-colors duration-150">
                                <td className="py-3 px-4 break-all">
                                    <a 
                                        href={link.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                                    >
                                        {link.url}
                                    </a>
                                </td>
                                <td className="py-3 px-4 text-red-500 font-semibold">
                                    {link.message}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BrokenLinksReporter;

// NOTE IMPORTANTE SUR LE CHEMIN DU FICHIER JSON :
// Si vous obtenez une erreur de type "Module not found" sur le fichier JSON,
// cela signifie que votre configuration Next.js n'arrive pas à l'importer depuis 'src/lib'.
// Dans ce cas, déplacez le fichier 'checkUrlsResults.json' vers le répertoire 'public/'
// et modifiez l'importation ci-dessus pour utiliser 'fetch' dans un 'useEffect':
/*
    const [results, setResults] = useState({});
    useEffect(() => {
        fetch('/checkUrlsResults.json')
            .then(res => res.json())
            .then(data => setResults(data))
            .catch(err => console.error("Erreur fetch JSON:", err));
    }, []);
*/
