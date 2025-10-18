import { WorkshopLayout } from "@/components/workshop/WorkshopLayout";
import { SectionPreposicionesModalesIntro } from "@/components/sections/SectionPreposicionesModalesIntro";
import { ExercisePreposicionesModales } from "@/components/sections/ExercisePreposicionesModales";
import { NarrativePreposicionesModalesCloze } from "@/components/sections/NarrativePreposicionesModalesCloze";
import { ResourcesPreposicionesModalesList } from "@/components/sections/ResourcesPreposicionesModalesList";

export default function PreposicionesModalesRelacionesWorkshop() {
  return (
    <WorkshopLayout
      title="🔗 Preposiciones Modales y Relacionales"
      subtitle="Nivel A2 | Compañía, finalidad, oposición y ausencia"
      workshopId="preposiciones-modales-relaciones"
      introSection={<SectionPreposicionesModalesIntro />}
      centralSection={<ExercisePreposicionesModales />}
      narrativeSection={<NarrativePreposicionesModalesCloze />}
      resourcesSection={<ResourcesPreposicionesModalesList />}
      contentSections={[
        { id: "repaso", label: "I. Repaso & Diagnóstico" },
        { id: "ejercicio-central", label: "II. Ejercicio central" },
        { id: "relato", label: "III. Relato contextualizado" },
        { id: "recursos", label: "IV. Recursos" },
      ]}
      vocabularyModule="preposiciones-modales-relaciones"
    />
  );
}
