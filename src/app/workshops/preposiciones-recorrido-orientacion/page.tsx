import { SectionPreposicionesRecorridoIntro } from "@/components/sections/SectionPreposicionesRecorridoIntro";
import { ExercisePreposicionesRecorrido } from "@/components/sections/ExercisePreposicionesRecorrido";
import { NarrativePreposicionesRecorridoCloze } from "@/components/sections/NarrativePreposicionesRecorridoCloze";
import { ResourcesPreposicionesRecorridoList } from "@/components/sections/ResourcesPreposicionesRecorridoList";
import { WorkshopLayout } from "@/components/workshop/WorkshopLayout";

export default function PreposicionesRecorridoOrientacionWorkshop() {
  return (
    <WorkshopLayout
      title="🗺️ Taller de Preposiciones de Recorrido y Orientación"
      subtitle="Nivel A2.2 | Orientación en la ciudad y itinerarios"
      workshopId="preposiciones-recorrido-orientacion"
      introSection={<SectionPreposicionesRecorridoIntro />}
      centralSection={<ExercisePreposicionesRecorrido />}
      narrativeSection={<NarrativePreposicionesRecorridoCloze />}
      resourcesSection={<ResourcesPreposicionesRecorridoList />}
      contentSections={[
        { id: "repaso", label: "I. Repaso & Diagnóstico" },
        { id: "ejercicio-central", label: "II. Ejercicio central" },
        { id: "relato", label: "III. Relato contextualizado" },
        { id: "recursos", label: "IV. Recursos" },
      ]}
      vocabularyModule="preposiciones-recorrido-orientacion"
    />
  );
}
