import React, { useState, useMemo, useCallback, ReactNode } from "react";

interface AiRecommendationsProps {
  eventData?: string; // JSON string des événements Discord
}

// --- Constantes API ---
const API_KEY =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_GEMINI_API_KEY
    ? process.env.NEXT_PUBLIC_GEMINI_API_KEY
    : "";

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

// --- UI Components Mock simples (avec typage corrigé) ---

interface CardProps {
  className?: string;
  children?: ReactNode;
}
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 md:p-8 ${className}`}
  >
    {children}
  </div>
);

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  className = "",
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-3 px-4 rounded-xl text-lg font-semibold transition duration-200 cursor-pointer touch-manipulation
      bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800
      ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
  >
    {children}
  </button>
);

interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}
const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition duration-150"
    />
  </div>
);

interface TextareaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}
const Textarea: React.FC<TextareaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  disabled,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition duration-150"
    />
  </div>
);

// --- Toast Hook ---
interface ToastOptions {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}

const useToast = () => {
  const [toastMessage, setToastMessage] = useState<ToastOptions | null>(null);

  const toast = useCallback((opts: ToastOptions) => {
    setToastMessage(opts);
    setTimeout(() => setToastMessage(null), 5000);
  }, []);

  const ToastComponent = toastMessage ? (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl transition-opacity duration-300
        ${
          toastMessage.variant === "destructive"
            ? "bg-red-600 text-white"
            : "bg-green-500 text-white"
        }`}
    >
      <div className="font-bold">{toastMessage.title}</div>
      <div className="text-sm">{toastMessage.description}</div>
    </div>
  ) : null;

  return { toast, ToastComponent };
};

// --- Composant principal ---
export const AiRecommendations: React.FC<AiRecommendationsProps> = ({
  eventData,
}) => {
  const [activity, setActivity] = useState("");
  const [context, setContext] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast, ToastComponent } = useToast();

  const handleGenerateRecommendation = useCallback(async () => {
    if (!activity || !context) {
      toast({
        title: "Champs manquants",
        description:
          "Veuillez décrire l'activité et le contexte pour obtenir une recommandation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRecommendation("Génération en cours...");

    const systemPrompt =
      "Vous êtes un expert en recommandations créatives. Créez une suggestion unique et inspirante d'environ 150 mots, adaptée à l'activité et au contexte fournis par l'utilisateur. Répondez uniquement avec la recommandation en français. Utilisez un ton enthousiaste.";

    const userQuery = `Activité: ${activity}. Contexte: ${context}. Générez une recommandation détaillée.`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    const callApi = async (retryCount = 0): Promise<void> => {
      if (retryCount > 0) {
        const delay = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
        await new Promise((res) => setTimeout(res, delay));
      }

      try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error(
              "Statut 403: Permission refusée. Vérifiez que la clé API est correctement configurée (NEXT_PUBLIC_GEMINI_API_KEY)."
            );
          }
          if (retryCount < 3) return callApi(retryCount + 1);
          throw new Error(`Échec de la requête API: ${response.status}`);
        }

        const result = await response.json();
        const generatedText =
          result.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Impossible de générer la recommandation. Veuillez réessayer.";

        setRecommendation(generatedText);
        toast({
          title: "Succès",
          description: "Recommandation générée avec succès!",
        });
      } catch (error: any) {
        console.error("Erreur API Gemini:", error);
        setRecommendation(`Erreur: ${error.message}`);
        toast({
          title: "Erreur de génération",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    callApi();
  }, [activity, context, toast]);

  const finalPrompt = useMemo(
    () =>
      `Activité: ${activity || "[Non spécifiée]"}\nContexte: ${
        context || "[Non spécifié]"
      }\nÉvénements Discord: ${eventData || "Aucun"}`,
    [activity, context, eventData]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-10 font-sans">
      {ToastComponent}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-8">
          {/* Entrées utilisateur */}
          <Card className="border border-indigo-200 dark:border-indigo-800">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              1. Votre Demande à l'IA
            </h2>
            <div className="space-y-6">
              <Input
                label="Activité ou But"
                value={activity}
                onChange={setActivity}
                placeholder="Décrivez votre objectif principal..."
                disabled={isLoading}
              />
              <Textarea
                label="Contexte"
                value={context}
                onChange={setContext}
                placeholder="Ajoutez des détails pour affiner la recommandation..."
                rows={4}
                disabled={isLoading}
              />
              <Button
                onClick={handleGenerateRecommendation}
                disabled={isLoading}
              >
                {isLoading
                  ? "Génération en cours..."
                  : "Générer la Recommandation"}
              </Button>
            </div>
          </Card>

          {/* Résultat IA */}
          <Card>
            <h2 className="text-2xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
              2. Recommandation Personnalisée
            </h2>
            <div className="min-h-[250px] max-h-[400px] bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 overflow-y-auto">
              {recommendation ? (
                <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                  {recommendation}
                </p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  Entrez vos critères et cliquez sur "Générer" pour recevoir une
                  suggestion unique de l'IA.
                </p>
              )}
            </div>

          </Card>
        </div>
      </div>
    </div>
  );
};
