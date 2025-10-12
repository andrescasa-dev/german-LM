import werdenExercises from "@/data/workshops/werden-exercises.json";
import type {
  WarmupExercise,
  CentralExercise,
  NarrativeParagraph,
} from "@/types/werden";

export type WorkshopExercises = typeof werdenExercises;

export function loadWorkshopExercises(workshopId: string): WorkshopExercises {
  const workshops: Record<string, WorkshopExercises> = {
    werden: werdenExercises,
  };

  const exercises = workshops[workshopId];
  if (!exercises) {
    throw new Error(`Workshop "${workshopId}" not found`);
  }

  return exercises;
}

// Helpers para acceder a ejercicios específicos
export function getWarmupExercises(workshopId: string): WarmupExercise[] {
  return loadWorkshopExercises(workshopId).sections.warmup as WarmupExercise[];
}

export function getCentralExercises(workshopId: string): CentralExercise[] {
  return loadWorkshopExercises(workshopId).sections
    .central as CentralExercise[];
}

export function getNarrativeExercises(
  workshopId: string
): NarrativeParagraph[] {
  return loadWorkshopExercises(workshopId).sections
    .narrative as NarrativeParagraph[];
}

// Helper para obtener un ejercicio específico por ID
export function getExerciseById(
  workshopId: string,
  section: "warmup" | "central" | "narrative",
  exerciseId: string
) {
  const exercises = loadWorkshopExercises(workshopId);

  if (section === "warmup") {
    return exercises.sections.warmup.find((ex) => ex.id === exerciseId);
  }

  if (section === "central") {
    return exercises.sections.central.find((ex) => ex.id === exerciseId);
  }

  if (section === "narrative") {
    // Para narrative, buscar en todos los párrafos
    for (const paragraph of exercises.sections.narrative) {
      const cloze = paragraph.clozes.find((c) => c.id === exerciseId);
      if (cloze) {
        return { paragraph, cloze };
      }
    }
  }

  return null;
}

// Helper para validar que un workshop existe
export function workshopExists(workshopId: string): boolean {
  try {
    loadWorkshopExercises(workshopId);
    return true;
  } catch {
    return false;
  }
}

// Helper para obtener información básica del workshop
export function getWorkshopInfo(workshopId: string) {
  const exercises = loadWorkshopExercises(workshopId);

  return {
    id: exercises.workshopId,
    warmupCount: exercises.sections.warmup.length,
    centralCount: exercises.sections.central.length,
    narrativeParagraphs: exercises.sections.narrative.length,
    totalClozes: exercises.sections.narrative.reduce(
      (sum, para) => sum + para.clozes.length,
      0
    ),
  };
}
