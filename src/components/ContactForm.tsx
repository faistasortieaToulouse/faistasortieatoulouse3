// src/components/ContactForm.tsx

'use client'; // 👈 Le composant entier est client

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast'; // ✅ Maintenant importé dans un Client Component pur
// ... tous les autres imports ...

export default function ContactForm() {
  const { toast } = useToast(); // ✅ L'appel au hook est sécurisé
  // ... tout le corps du composant ContactPage original ...
}
