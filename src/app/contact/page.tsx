'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCallback, useEffect, useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// --- Déclaration du widget ALTCHA ---
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'altcha-widget': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          name?: string;
          theme?: 'light' | 'dark' | 'auto';
          auto?: 'onsubmit';
          challengeurl?: string;
          challenge?: string;
        },
        HTMLElement
      >;
    }
  }
}

// --- Validation du formulaire ---
const contactFormSchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  subject: z.string().min(5, 'Sujet trop court'),
  message: z.string().min(10, 'Message trop court'),
  altcha: z.string().min(1, 'Veuillez compléter la vérification ALTCHA.'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [altchaElement, setAltchaElement] = useState<HTMLElement | null>(null);
  const [challenge, setChallenge] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', subject: '', message: '', altcha: '' },
  });

  const altchaError = form.formState.errors['altcha']?.message;

  // --- Charger le script ALTCHA ---
  useEffect(() => {
    if (document.querySelector('script[data-altcha-loaded]')) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = '/js/altcha.js';
    script.async = true;
    script.defer = true;
    script.type = 'module';
    script.setAttribute('data-altcha-loaded', 'true');
    script.onload = () => {
      console.log('✅ ALTCHA.js chargé');
      setScriptLoaded(true);
    };
    script.onerror = (e) => console.error('❌ Erreur de chargement ALTCHA.js', e);
    document.body.appendChild(script);
  }, []);

  // --- Précharger un challenge dès le montage ---
  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const res = await fetch('/api/altcha', { cache: 'no-store' });
        const data = await res.json();
        if (data) {
          console.log('✅ Challenge ALTCHA préchargé');
          setChallenge(JSON.stringify(data));
        } else {
          console.warn('⚠️ Challenge non reçu');
        }
      } catch (e) {
        console.error('❌ Erreur lors du préchargement du challenge', e);
      }
    };
    loadChallenge();
  }, []);

  // --- Réinitialiser ALTCHA ---
  const resetAltcha = useCallback(() => {
    form.setValue('altcha', '', { shouldValidate: true });
    if (altchaElement && 'reset' in altchaElement) {
      (altchaElement as any).reset();
    }
  }, [form, altchaElement]);

  // --- Attacher les événements du widget + gestion erreurs/expiration ---
  useEffect(() => {
    if (!scriptLoaded) return;
    const widget = document.querySelector('altcha-widget');
    if (!widget) return;

    setAltchaElement(widget as HTMLElement);

    const onChange = (e: any) => {
      const value = (widget as any).value ?? e?.detail?.value ?? '';
      form.setValue('altcha', value, { shouldValidate: true });
    };

    const onVerified = (e: any) => {
      const value = e.detail?.payload ?? e.detail?.value ?? '';
      if (value) form.setValue('altcha', value, { shouldValidate: true });
    };

    const onReset = () => form.setValue('altcha', '', { shouldValidate: true });

    const reloadChallenge = async () => {
      console.warn('🔄 Rechargement du challenge ALTCHA...');
      resetAltcha();
      try {
        const res = await fetch('/api/altcha', { cache: 'no-store' });
        const data = await res.json();
        if (data) {
          setChallenge(JSON.stringify(data));
          try {
            (widget as any).challenge = JSON.stringify(data);
          } catch {}
        }
      } catch (err) {
        console.error('❌ Erreur lors du rechargement ALTCHA', err);
      }
    };

    const onError = (e: any) => {
      console.warn('⚠️ ALTCHA error:', e?.detail ?? e);
      reloadChallenge();
    };

    const onExpired = () => {
      console.warn('⏳ ALTCHA expiré');
      reloadChallenge();
    };

    widget.addEventListener('change', onChange);
    widget.addEventListener('verified', onVerified);
    widget.addEventListener('reset', onReset);
    widget.addEventListener('error', onError);
    widget.addEventListener('expired', onExpired);

    // Toujours forcer challengeurl
    widget.setAttribute('challengeurl', '/api/altcha');
    if (challenge) widget.setAttribute('challenge', challenge);

    return () => {
      widget.removeEventListener('change', onChange);
      widget.removeEventListener('verified', onVerified);
      widget.removeEventListener('reset', onReset);
      widget.removeEventListener('error', onError);
      widget.removeEventListener('expired', onExpired);
    };
  }, [scriptLoaded, challenge, form, resetAltcha]);

  // --- Soumission du formulaire ---
  const onSubmit = useCallback(
    async (data: ContactFormValues) => {
      if (!data.altcha) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Veuillez compléter la vérification ALTCHA.',
        });
        return;
      }

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (res.ok) {
          toast({ title: 'Message envoyé avec succès 🎉' });
          form.reset();
          resetAltcha();
        } else {
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: result.message || 'Échec de l’envoi du message.',
          });
          resetAltcha();
        }
      } catch (error) {
        console.error('❌ Erreur réseau ou serveur', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible d’envoyer le message. Réessayez plus tard.',
        });
      }
    },
    [form, toast, resetAltcha]
  );

  // --- UI ---
  return (
    <div className="max-w-lg mx-auto p-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Contactez-nous</CardTitle>
          <CardDescription>Envoyez-nous un message via ce formulaire sécurisé.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Jean Dupont" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="jean@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sujet</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Votre sujet" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={5} placeholder="Votre message..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <input type="hidden" {...form.register('altcha')} />

              <div className="flex flex-col items-center pt-2">
                <altcha-widget
                  name="altcha"
                  theme="auto"
                  auto="onsubmit"
                  challenge={challenge ?? undefined}
                  challengeurl="/api/altcha"
                  style={{ width: '100%', maxWidth: 320 }}
                />
                {altchaError && (
                  <p className="text-sm text-destructive mt-2">{altchaError}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                <Send className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? 'Envoi...' : 'Envoyer'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
