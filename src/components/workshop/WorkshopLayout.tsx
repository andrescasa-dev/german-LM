"use client";

import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import ThemeToggle from "@/components/ThemeToggle";
import { Vocabulary } from "@/components/sections/Vocabulary";
import TopTabs from "@/components/TopTabs";
import { WorkshopTitle } from "@/components/WorkshopTitle";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VariantProvider } from "@/hooks/useVariant";

interface WorkshopLayoutProps {
  title: string;
  subtitle: string;
  workshopId: string;
  introSection: ReactNode;
  centralSection: ReactNode;
  narrativeSection: ReactNode;
  resourcesSection: ReactNode;
  contentSections: { id: string; label: string }[];
  vocabularyModule?: string;
}

/**
 * Layout común para todas las páginas de talleres
 * Encapsula la estructura estándar: header, tabs, footer, etc.
 */
export function WorkshopLayout({
  title,
  subtitle,
  workshopId,
  introSection,
  centralSection,
  narrativeSection,
  resourcesSection,
  contentSections,
  vocabularyModule,
}: WorkshopLayoutProps) {
  return (
    <VariantProvider>
      <div className="min-h-screen bg-background">
        {/* Header con banner */}
        <header className="relative border-b overflow-hidden">
          <div className="absolute inset-0">
            <div className="h-full w-full bg-[url('/banner.webp')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 container mx-auto px-4 pt-4 flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Volver al menú
              </Link>
            </Button>
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
          <WorkshopTitle title={title} subtitle={subtitle} />
        </header>

        {/* Contenido principal */}
        <main className="container mx-auto px-4 py-8 space-y-8">
          <TopTabs
            content={
              <div className="space-y-12">
                <section id="repaso" className="scroll-mt-20">
                  {introSection}
                </section>

                <section id="ejercicio-central" className="scroll-mt-20">
                  {centralSection}
                </section>

                <section id="relato" className="scroll-mt-20">
                  {narrativeSection}
                </section>

                <section id="recursos" className="scroll-mt-20">
                  {resourcesSection}
                </section>
              </div>
            }
            vocabulary={
              <section id="vocabulario" className="scroll-mt-20">
                <Vocabulary
                  module={vocabularyModule || workshopId}
                  workshopId={workshopId}
                />
              </section>
            }
            contentSections={contentSections}
            workshopId={workshopId}
          />
        </main>

        {/* Footer */}
        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>Taller interactivo de alemán | MCER A2-B1</p>
          </div>
        </footer>
      </div>
      <Toaster />
    </VariantProvider>
  );
}
