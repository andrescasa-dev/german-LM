import { SectionPreposicionesIntro } from "@/components/sections/SectionPreposicionesIntro";
import { ExercisePreposicionesTemporales } from "@/components/sections/ExercisePreposicionesTemporales";
import { NarrativePreposicionesCloze } from "@/components/sections/NarrativePreposicionesCloze";
import { ResourcesPreposicionesList } from "@/components/sections/ResourcesPreposicionesList";
import { Toaster } from "@/components/ui/sonner";
import ThemeToggle from "@/components/ThemeToggle";
import { Vocabulary } from "@/components/sections/Vocabulary";
import TopTabs from "@/components/TopTabs";
import { WorkshopTitle } from "@/components/WorkshopTitle";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VariantProvider } from "@/hooks/useVariant";

export default function PreposicionesTemporalesWorkshop() {
  return (
    <VariantProvider>
      <div className="min-h-screen bg-background">
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
          <WorkshopTitle
            title="⏰ Taller de Preposiciones Temporales"
            subtitle="Nivel A2 | Preposiciones de tiempo en alemán"
          />
        </header>

        <main className="container mx-auto px-4 py-8 space-y-8">
          <TopTabs
            content={
              <div className="space-y-12">
                <section id="repaso" className="scroll-mt-20">
                  <SectionPreposicionesIntro />
                </section>

                <section id="ejercicio-central" className="scroll-mt-20">
                  <ExercisePreposicionesTemporales />
                </section>

                <section id="relato" className="scroll-mt-20">
                  <NarrativePreposicionesCloze />
                </section>

                <section id="recursos" className="scroll-mt-20">
                  <ResourcesPreposicionesList />
                </section>
              </div>
            }
            vocabulary={
              <section id="vocabulario" className="scroll-mt-20">
                <Vocabulary module="preposiciones-temporales" workshopId="preposiciones-temporales" />
              </section>
            }
            contentSections={[
              { id: "repaso", label: "I. Repaso & Diagnóstico" },
              { id: "ejercicio-central", label: "II. Ejercicio central" },
              { id: "relato", label: "III. Relato contextualizado" },
              { id: "recursos", label: "IV. Recursos" },
            ]}
            workshopId="preposiciones-temporales"
          />
        </main>

        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>Taller interactivo de alemán | MCER A2</p>
          </div>
        </footer>
      </div>
      <Toaster />
    </VariantProvider>
  );
}

