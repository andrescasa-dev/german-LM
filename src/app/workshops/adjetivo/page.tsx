import { SectionIntro } from "@/components/sections/SectionIntro";
import { ExerciseAkkusativMasculine } from "@/components/sections/ExerciseAkkusativMasculine";
import { NarrativeCloze } from "@/components/sections/NarrativeCloze";
import { ResourcesList } from "@/components/sections/ResourcesList";
import { Toaster } from "@/components/ui/sonner";
import ThemeToggle from "@/components/ThemeToggle";
import { Vocabulary } from "@/components/sections/Vocabulary";
import TopTabs from "@/components/TopTabs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdjetivoWorkshop() {
  return (
    <>
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
                🧙‍♀️ Taller de Declinación del Adjetivo Alemán
              </span>
            </h1>
            <p className="mt-3">
              <span className="inline-block bg-background text-foreground rounded-full px-3 py-1 shadow-sm">
                Nivel A2.2–B1 | Enfoque comunicativo
              </span>
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-8">
          <TopTabs
            content={
              <div className="space-y-12">
                <section id="repaso" className="scroll-mt-20">
                  <SectionIntro />
                </section>

                <section id="ejercicio-central" className="scroll-mt-20">
                  <ExerciseAkkusativMasculine />
                </section>

                <section id="relato" className="scroll-mt-20">
                  <NarrativeCloze />
                </section>

                <section id="recursos" className="scroll-mt-20">
                  <ResourcesList />
                </section>
              </div>
            }
            vocabulary={
              <section id="vocabulario" className="scroll-mt-20">
                <Vocabulary />
              </section>
            }
            contentSections={[
              { id: "repaso", label: "I. Repaso & Diagnóstico" },
              { id: "ejercicio-central", label: "II. Ejercicio central" },
              { id: "relato", label: "III. Relato contextualizado" },
              { id: "recursos", label: "IV. Recursos" },
            ]}
          />
        </main>

        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>Taller interactivo de alemán | MCER B1</p>
          </div>
        </footer>
      </div>
      <Toaster />
    </>
  );
}
