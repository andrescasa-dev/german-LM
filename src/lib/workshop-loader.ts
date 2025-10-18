import werdenExercises from "@/data/workshops/werden-exercises.json";
import type {
  WarmupExercise,
  CentralExercise,
  NarrativeParagraph,
} from "@/types/werden";
import type {
  CentralScenario,
  NarrativeParagraph as AdjectiveNarrativeParagraph,
} from "@/types/adjective";
import type {
  PreposicionTemporalExercise,
  PreposicionTemporalParagraph,
  PreposicionTemporalWorkshop,
} from "@/types/preposiciones-temporales";

export type WorkshopExercises =
  | typeof werdenExercises
  | {
      workshopId: string;
      sections: {
        central: CentralScenario[];
        narrative: AdjectiveNarrativeParagraph[];
      };
    }
  | PreposicionTemporalWorkshop;

// Dynamic import function for adjective variants
async function loadAdjectiveVariant(variant: number = 1) {
  try {
    const variantModule = await import(
      `@/data/workshops/adjective-exercises/variant-${variant}.json`
    );
    return variantModule.default;
  } catch (error) {
    console.error(`Failed to load variant ${variant}:`, error);
    // Fallback to variant 1
    const variantModule = await import(
      `@/data/workshops/adjective-exercises/variant-1.json`
    );
    return variantModule.default;
  }
}

// Dynamic import function for preposiciones temporales variants
async function loadPreposicionesTemporalesVariant(variant: number = 1) {
  try {
    const variantModule = await import(
      `@/data/workshops/preposiciones-temporales/variant-${variant}.json`
    );
    return variantModule.default;
  } catch (error) {
    console.error(
      `Failed to load preposiciones temporales variant ${variant}:`,
      error
    );
    // Fallback to variant 1
    const variantModule = await import(
      `@/data/workshops/preposiciones-temporales/variant-1.json`
    );
    return variantModule.default;
  }
}

export async function loadWorkshopExercises(
  workshopId: string,
  variant?: number
): Promise<WorkshopExercises> {
  if (workshopId === "werden") {
    return werdenExercises;
  }

  if (workshopId === "adjetivo") {
    return await loadAdjectiveVariant(variant);
  }

  if (workshopId === "preposiciones-temporales") {
    return await loadPreposicionesTemporalesVariant(variant);
  }

  throw new Error(`Workshop "${workshopId}" not found`);
}

// Synchronous version for backward compatibility
export function loadWorkshopExercisesSync(
  workshopId: string
): WorkshopExercises {
  const workshops: Record<string, WorkshopExercises> = {
    werden: werdenExercises,
  };

  const exercises = workshops[workshopId];
  if (!exercises) {
    throw new Error(`Workshop "${workshopId}" not found`);
  }

  return exercises;
}

// Helper functions for synchronous access (backward compatibility)
export function getWarmupExercises(workshopId: string): WarmupExercise[] {
  const exercises = loadWorkshopExercisesSync(workshopId);
  if ("warmup" in exercises.sections) {
    return exercises.sections.warmup as WarmupExercise[];
  }
  return [];
}

export function getCentralExercises(workshopId: string): CentralExercise[] {
  return loadWorkshopExercisesSync(workshopId).sections
    .central as CentralExercise[];
}

export function getNarrativeExercises(
  workshopId: string
): NarrativeParagraph[] {
  return loadWorkshopExercisesSync(workshopId).sections
    .narrative as NarrativeParagraph[];
}

// Helper functions for adjective workshop
export function getCentralScenarios(workshopId: string): CentralScenario[] {
  return loadWorkshopExercisesSync(workshopId).sections
    .central as CentralScenario[];
}

export function getNarrativeParagraphs(
  workshopId: string
): AdjectiveNarrativeParagraph[] {
  return loadWorkshopExercisesSync(workshopId).sections
    .narrative as AdjectiveNarrativeParagraph[];
}

// Async helper functions for variant support
export async function getWarmupExercisesAsync(
  workshopId: string,
  variant?: number
): Promise<WarmupExercise[]> {
  const exercises = await loadWorkshopExercises(workshopId, variant);
  if ("warmup" in exercises.sections) {
    return exercises.sections.warmup as WarmupExercise[];
  }
  return [];
}

export async function getCentralExercisesAsync(
  workshopId: string,
  variant?: number
): Promise<CentralExercise[]> {
  const exercises = await loadWorkshopExercises(workshopId, variant);
  return exercises.sections.central as CentralExercise[];
}

export async function getNarrativeExercisesAsync(
  workshopId: string,
  variant?: number
): Promise<NarrativeParagraph[]> {
  const exercises = await loadWorkshopExercises(workshopId, variant);
  return exercises.sections.narrative as NarrativeParagraph[];
}

export async function getCentralScenariosAsync(
  workshopId: string,
  variant?: number
): Promise<CentralScenario[]> {
  const exercises = await loadWorkshopExercises(workshopId, variant);
  return exercises.sections.central as CentralScenario[];
}

export async function getNarrativeParagraphsAsync(
  workshopId: string,
  variant?: number
): Promise<AdjectiveNarrativeParagraph[]> {
  const exercises = await loadWorkshopExercises(workshopId, variant);
  return exercises.sections.narrative as AdjectiveNarrativeParagraph[];
}

// Helper functions for preposiciones temporales workshop
export async function getPreposicionesTemporalesWarmupAsync(
  workshopId: string,
  variant?: number
): Promise<PreposicionTemporalExercise[]> {
  const exercises = await loadWorkshopExercises(workshopId, variant);
  if ("warmup" in exercises.sections) {
    return exercises.sections.warmup as PreposicionTemporalExercise[];
  }
  return [];
}

export async function getPreposicionesTemporalesCentralAsync(
  workshopId: string,
  variant?: number
): Promise<PreposicionTemporalExercise[]> {
  const exercises = await loadWorkshopExercises(workshopId, variant);
  return exercises.sections.central as PreposicionTemporalExercise[];
}

export async function getPreposicionesTemporalesNarrativeAsync(
  workshopId: string,
  variant?: number
): Promise<PreposicionTemporalParagraph[]> {
  const exercises = await loadWorkshopExercises(workshopId, variant);
  return exercises.sections.narrative as PreposicionTemporalParagraph[];
}

// Helper para obtener un ejercicio específico por ID
export function getExerciseById(
  workshopId: string,
  section: "warmup" | "central" | "narrative",
  exerciseId: string
) {
  const exercises = loadWorkshopExercisesSync(workshopId);

  if (section === "warmup" && "warmup" in exercises.sections) {
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
    loadWorkshopExercisesSync(workshopId);
    return true;
  } catch {
    return false;
  }
}

// Helper para obtener información básica del workshop
export function getWorkshopInfo(workshopId: string) {
  const exercises = loadWorkshopExercisesSync(workshopId);

  return {
    id: exercises.workshopId,
    warmupCount:
      "warmup" in exercises.sections ? exercises.sections.warmup.length : 0,
    centralCount: exercises.sections.central.length,
    narrativeParagraphs: exercises.sections.narrative.length,
    totalClozes: exercises.sections.narrative.reduce(
      (sum, para) => sum + para.clozes.length,
      0
    ),
  };
}

// Dynamic import function for vocabulary variants
async function loadVocabularyVariant(workshopId: string, variant: number = 1) {
  try {
    if (workshopId === "adjetivo") {
      const variantModule = await import(
        `@/data/workshops/adjective-exercises/variant-${variant}-vocabulary.json`
      );
      return variantModule.default;
    }

    if (workshopId === "preposiciones-temporales") {
      const variantModule = await import(
        `@/data/workshops/preposiciones-temporales/variant-${variant}-vocabulary.json`
      );
      return variantModule.default;
    }

    // Fallback to general vocabulary
    const generalModule = await import(
      `@/data/workshops/legacy_vocabulary.json`
    );
    return generalModule.default;
  } catch (error) {
    console.error(`Failed to load vocabulary variant ${variant}:`, error);
    // Fallback to general vocabulary
    const generalModule = await import(
      `@/data/workshops/legacy_vocabulary.json`
    );
    return generalModule.default;
  }
}

// Helper para obtener vocabulario por variante
export async function getVocabularyByVariant(
  workshopId: string,
  variant?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Record<string, any[]>> {
  if (workshopId === "werden") {
    // Werden workshop uses general vocabulary
    const generalModule = await import(
      `@/data/workshops/legacy_vocabulary.json`
    );
    return generalModule.default;
  }

  if (workshopId === "adjetivo" || workshopId === "preposiciones-temporales") {
    return await loadVocabularyVariant(workshopId, variant);
  }

  // Fallback to general vocabulary
  const generalModule = await import(`@/data/workshops/legacy_vocabulary.json`);
  return generalModule.default;
}

// Helper para obtener variantes disponibles
export function getAvailableVariants(workshopId: string): number[] {
  if (workshopId === "werden") {
    return [1]; // Werden workshop has no variants
  }

  if (workshopId === "adjetivo") {
    // Return variants 1-20 based on the files we saw
    return Array.from({ length: 20 }, (_, i) => i + 1);
  }

  if (workshopId === "preposiciones-temporales") {
    // Return variants 1 for now, can be extended
    return [1];
  }

  return [];
}
