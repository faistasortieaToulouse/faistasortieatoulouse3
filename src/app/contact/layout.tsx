// Ce layout reste un composant serveur (pas de 'use client')
import MainLayout from "@/app/(main)/layout";
import { ReactNode } from "react";
import Script from "next/script";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <MainLayout>{children}</MainLayout>

      {/* --- Script Cloudflare Turnstile RETIRÉ ---
        Le script ALTCHA est désormais chargé spécifiquement dans src/app/contact/page.jsx 
        pour ne s'appliquer qu'à cette page.
      */}
    </>
  );
}