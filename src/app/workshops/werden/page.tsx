import { SectionWerdenIntro } from "@/components/sections/SectionWerdenIntro";
import { ExerciseWerdenCentral } from "@/components/sections/ExerciseWerdenCentral";
import { NarrativeWerdenCloze } from "@/components/sections/NarrativeWerdenCloze";
import { ResourcesWerdenList } from "@/components/sections/ResourcesWerdenList";
import { WorkshopLayout } from "@/components/workshop/WorkshopLayout";

export default function WerdenWorkshop() {
  return (
    <WorkshopLayout
      title="⚡ Taller Intensivo: Dominando el Verbo WERDEN"
      subtitle="Nivel A2 | Verbo pleno, Futuro y Pasiva"
      workshopId="werden"
      introSection={<SectionWerdenIntro />}
      centralSection={<ExerciseWerdenCentral />}
      narrativeSection={<NarrativeWerdenCloze />}
      resourcesSection={<ResourcesWerdenList />}
      contentSections={[
        { id: "repaso", label: "I. Repaso y Diagnóstico" },
        { id: "ejercicio-central", label: "II. Ejercicio Central" },
        { id: "relato", label: "III. Relato Contextualizado" },
        { id: "recursos", label: "IV. Recursos Adicionales" },
      ]}
      vocabularyModule="werden"
    />
  );
}
