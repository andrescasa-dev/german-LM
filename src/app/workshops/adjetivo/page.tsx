import { SectionIntro } from "@/components/sections/SectionIntro";
import { ExerciseAkkusativMasculine } from "@/components/sections/ExerciseAkkusativMasculine";
import { NarrativeCloze } from "@/components/sections/NarrativeCloze";
import { ResourcesList } from "@/components/sections/ResourcesList";
import { WorkshopLayout } from "@/components/workshop/WorkshopLayout";

export default function AdjetivoWorkshop() {
  return (
    <WorkshopLayout
      title="🧙‍♀️ Taller de Declinación del Adjetivo Alemán"
      subtitle="Nivel A2.2–B1 | Enfoque comunicativo"
      workshopId="adjetivo"
      introSection={<SectionIntro />}
      centralSection={<ExerciseAkkusativMasculine />}
      narrativeSection={<NarrativeCloze />}
      resourcesSection={<ResourcesList />}
      contentSections={[
        { id: "repaso", label: "I. Repaso & Diagnóstico" },
        { id: "ejercicio-central", label: "II. Ejercicio central" },
        { id: "relato", label: "III. Relato contextualizado" },
        { id: "recursos", label: "IV. Recursos" },
      ]}
      vocabularyModule="adjetivo"
    />
  );
}
