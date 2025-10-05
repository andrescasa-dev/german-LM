import { SectionIntro } from "@/components/sections/SectionIntro";
import { ExerciseAkkusativMasculine } from "@/components/sections/ExerciseAkkusativMasculine";
import { NarrativeCloze } from "@/components/sections/NarrativeCloze";
import { ResourcesList } from "@/components/sections/ResourcesList";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-foreground">
              Taller de Declinación del Adjetivo Alemán
            </h1>
            <p className="text-muted-foreground mt-2">
              Nivel A2.2–B1 | Enfoque comunicativo
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-12">
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
