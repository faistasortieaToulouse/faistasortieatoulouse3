// faistasortietest2/src/components/MainLayout.tsx
'use client';

import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Footer } from '@/components/footer';
import GoogleTranslate from '@/components/GoogleTranslate';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          {/* HEADER : Ajout du SidebarTrigger pour ouvrir/fermer la barre latérale */}
          <header className="relative z-10 flex justify-between p-2 bg-background shadow-sm">
            {/* 1. Bouton Menu Burger */}
            <SidebarTrigger />
            
            {/* 2. Google Translate (aligné à droite) */}
            <div className="w-48">
              <GoogleTranslate />
            </div>
          
          </header>

          <div className="flex-grow">{children}</div>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
