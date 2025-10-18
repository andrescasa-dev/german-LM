import { WorkshopLayout } from "@/components/workshop/WorkshopLayout";
import { SectionPreposicionesDestinoProcedenciaIntro } from "@/components/sections/SectionPreposicionesDestinoProcedenciaIntro";
import { ExercisePreposicionesDestinoProcedencia } from "@/components/sections/ExercisePreposicionesDestinoProcedencia";
import { NarrativePreposicionesDestinoProcedenciaCloze } from "@/components/sections/NarrativePreposicionesDestinoProcedenciaCloze";
import { ResourcesPreposicionesDestinoProcedenciaList } from "@/components/sections/ResourcesPreposicionesDestinoProcedenciaList";

export default function PreposicionesDestinoProcedenciaWorkshop() {
  return (
    <WorkshopLayout
      title="🎯 Preposiciones de Destino y Procedencia"
      subtitle="Nivel A2 | Caso Fijo: Dativo Invariable"
      workshopId="preposiciones-destino-procedencia"
      introSection={<SectionPreposicionesDestinoProcedenciaIntro />}
      centralSection={<ExercisePreposicionesDestinoProcedencia />}
      narrativeSection={<NarrativePreposicionesDestinoProcedenciaCloze />}
      resourcesSection={<ResourcesPreposicionesDestinoProcedenciaList />}
      contentSections={[
        { id: "repaso", label: "I. Repaso & Diagnóstico" },
        { id: "ejercicio-central", label: "II. Ejercicio central" },
        { id: "relato", label: "III. Relato contextualizado" },
        { id: "recursos", label: "IV. Recursos" },
      ]}
      vocabularyModule="preposiciones-destino-procedencia"
    />
  );
}
