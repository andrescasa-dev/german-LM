import { SectionWerdenIntro } from "@/components/sections/SectionWerdenIntro";
import { ExerciseWerdenCentral } from "@/components/sections/ExerciseWerdenCentral";
import { NarrativeWerdenCloze } from "@/components/sections/NarrativeWerdenCloze";
import { ResourcesWerdenList } from "@/components/sections/ResourcesWerdenList";
import { Vocabulary } from "@/components/sections/Vocabulary";
import { Toaster } from "@/components/ui/sonner";
import ThemeToggle from "@/components/ThemeToggle";
import TopTabs from "@/components/TopTabs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VariantProvider } from "@/hooks/useVariant";

export default function WerdenWorkshop() {
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
          <div className="relative z-10 container mx-auto px-4 py-12 md:py-16 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="inline-block bg-background text-foreground rounded-xl px-4 py-2 shadow-sm">
                ⚡ Taller Intensivo: Dominando el Verbo WERDEN
              </span>
            </h1>
            <p className="mt-3">
              <span className="inline-block bg-background text-foreground rounded-full px-3 py-1 shadow-sm">
                Nivel A2 | Verbo pleno, Futuro y Pasiva
              </span>
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-8">
          <TopTabs
            content={
              <div className="space-y-12">
                <section id="repaso" className="scroll-mt-20">
                  <SectionWerdenIntro />
                </section>

                <section id="ejercicio-central" className="scroll-mt-20">
                  <ExerciseWerdenCentral />
                </section>

                <section id="relato" className="scroll-mt-20">
                  <NarrativeWerdenCloze />
                </section>

                <section id="recursos" className="scroll-mt-20">
                  <ResourcesWerdenList />
                </section>
              </div>
            }
            vocabulary={
              <section id="vocabulario" className="scroll-mt-20">
                <Vocabulary module="werden" />
              </section>
            }
            contentSections={[
              { id: "repaso", label: "I. Repaso y Diagnóstico" },
              { id: "ejercicio-central", label: "II. Ejercicio Central" },
              { id: "relato", label: "III. Relato Contextualizado" },
              { id: "recursos", label: "IV. Recursos Adicionales" },
            ]}
            workshopId="werden"
          />
        </main>

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
