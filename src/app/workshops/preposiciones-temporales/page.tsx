import { SectionPreposicionesIntro } from "@/components/sections/SectionPreposicionesIntro";
import { ExercisePreposicionesTemporales } from "@/components/sections/ExercisePreposicionesTemporales";
import { NarrativePreposicionesCloze } from "@/components/sections/NarrativePreposicionesCloze";
import { ResourcesPreposicionesList } from "@/components/sections/ResourcesPreposicionesList";
import { WorkshopLayout } from "@/components/workshop/WorkshopLayout";

export default function PreposicionesTemporalesWorkshop() {
  return (
    <WorkshopLayout
      title="⏰ Taller de Preposiciones Temporales"
      subtitle="Nivel A2 | Preposiciones de tiempo en alemán"
      workshopId="preposiciones-temporales"
      introSection={<SectionPreposicionesIntro />}
      centralSection={<ExercisePreposicionesTemporales />}
      narrativeSection={<NarrativePreposicionesCloze />}
      resourcesSection={<ResourcesPreposicionesList />}
      contentSections={[
        { id: "repaso", label: "I. Repaso & Diagnóstico" },
        { id: "ejercicio-central", label: "II. Ejercicio central" },
        { id: "relato", label: "III. Relato contextualizado" },
        { id: "recursos", label: "IV. Recursos" },
      ]}
      vocabularyModule="preposiciones-temporales"
    />
  );
}
