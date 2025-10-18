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
import type {
  PreposicionRecorridoExercise,
  PreposicionRecorridoParagraph,
  PreposicionRecorridoWorkshop,
} from "@/types/preposiciones-recorrido-orientacion";
import type {
  PreposicionModalRelacionalExercise,
  PreposicionModalRelacionalParagraph,
  PreposicionModalRelacionalWorkshop,
} from "@/types/preposiciones-modales-relaciones";

/**
 * Definición de un taller en el registry
 */
export interface WorkshopDefinition {
  id: string;
  hasVariants: boolean;
  variantCount: number;
  loaderFn: (variant: number) => Promise<WorkshopExercises>;
  vocabularyLoaderFn?: (variant: number) => Promise<Record<string, unknown[]>>;
}

/**
 * Registry declarativo de talleres
 */
const WORKSHOP_REGISTRY: Record<string, WorkshopDefinition> = {
  adjetivo: {
    id: "adjetivo",
    hasVariants: true,
    variantCount: 20,
    loaderFn: loadAdjectiveVariant,
    vocabularyLoaderFn: loadAdjectiveVocabularyVariant,
  },
  werden: {
    id: "werden",
    hasVariants: false,
    variantCount: 1,
    loaderFn: () => Promise.resolve(werdenExercises),
  },
  "preposiciones-temporales": {
    id: "preposiciones-temporales",
    hasVariants: true,
    variantCount: 1,
    loaderFn: loadPreposicionesTemporalesVariant,
    vocabularyLoaderFn: loadPreposicionesVocabularyVariant,
  },
  "preposiciones-recorrido-orientacion": {
    id: "preposiciones-recorrido-orientacion",
    hasVariants: true,
    variantCount: 1,
    loaderFn: loadPreposicionesRecorridoVariant,
    vocabularyLoaderFn: loadPreposicionesRecorridoVocabularyVariant,
  },
  "preposiciones-modales-relaciones": {
    id: "preposiciones-modales-relaciones",
    hasVariants: true,
    variantCount: 1,
    loaderFn: loadPreposicionesModalesVariant,
    vocabularyLoaderFn: loadPreposicionesModalesVocabularyVariant,
  },
};

export type WorkshopExercises =
  | typeof werdenExercises
  | {
      workshopId: string;
      sections: {
        central: CentralScenario[];
        narrative: AdjectiveNarrativeParagraph[];
      };
    }
  | PreposicionTemporalWorkshop
  | PreposicionRecorridoWorkshop
  | PreposicionModalRelacionalWorkshop;

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

// Dynamic import function for preposiciones recorrido variants
async function loadPreposicionesRecorridoVariant(variant: number = 1) {
  try {
    const variantModule = await import(
      `@/data/workshops/preposiciones-recorrido-orientacion/variant-${variant}.json`
    );
    return variantModule.default;
  } catch (error) {
    console.error(
      `Failed to load preposiciones recorrido variant ${variant}:`,
      error
    );
    // Fallback to variant 1
    const variantModule = await import(
      `@/data/workshops/preposiciones-recorrido-orientacion/variant-1.json`
    );
    return variantModule.default;
  }
}

// Dynamic import function for preposiciones modales variants
async function loadPreposicionesModalesVariant(variant: number = 1) {
  try {
    const variantModule = await import(
      `@/data/workshops/preposiciones-modales-relaciones/variant-${variant}.json`
    );
    return variantModule.default;
  } catch (error) {
    console.error(
      `Failed to load preposiciones modales variant ${variant}:`,
      error
    );
    // Fallback to variant 1
    const variantModule = await import(
      `@/data/workshops/preposiciones-modales-relaciones/variant-1.json`
    );
    return variantModule.default;
  }
}

export async function loadWorkshopExercises(
  workshopId: string,
  variant?: number
): Promise<WorkshopExercises> {
  const workshop = WORKSHOP_REGISTRY[workshopId];
  if (!workshop) {
    throw new Error(`Workshop "${workshopId}" not found`);
  }

  try {
    return await workshop.loaderFn(variant || 1);
  } catch (error) {
    console.error(`Failed to load workshop ${workshopId}:`, error);
    // Fallback to variant 1
    return await workshop.loaderFn(1);
  }
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

// Helper functions for preposiciones recorrido workshop
export async function getPreposicionesRecorridoWarmupAsync(
  workshopId: string,
  variant?: number
): Promise<PreposicionRecorridoExercise[]> {
  const exercises = await loadWorkshopExercises(workshopId, variant);
  if ("warmup" in exercises.sections) {
    return exercises.sections.warmup as PreposicionRecorridoExercise[];
  }
  return [];
}

export async function getPreposicionesRecorridoCentralAsync(
  workshopId: string,
  variant?: number
): Promise<PreposicionRecorridoExercise[]> {
  const exercises = await loadWorkshopExercises(workshopId, variant);
  return exercises.sections.central as PreposicionRecorridoExercise[];
}

export async function getPreposicionesRecorridoNarrativeAsync(
  workshopId: string,
  variant?: number
): Promise<PreposicionRecorridoParagraph[]> {
  const exercises = await loadWorkshopExercises(workshopId, variant);
  return exercises.sections.narrative as PreposicionRecorridoParagraph[];
}

// Helper functions for preposiciones modales workshop
export async function getPreposicionesModalesWarmupAsync(
  workshopId: string,
  variant?: number
): Promise<PreposicionModalRelacionalExercise[]> {
  const exercises = await loadWorkshopExercises(workshopId, variant);
  if ("warmup" in exercises.sections) {
    return exercises.sections.warmup as PreposicionModalRelacionalExercise[];
  }
  return [];
}

export async function getPreposicionesModalesCentralAsync(
  workshopId: string,
  variant?: number
): Promise<PreposicionModalRelacionalExercise[]> {
  const exercises = await loadWorkshopExercises(workshopId, variant);
  return exercises.sections.central as PreposicionModalRelacionalExercise[];
}

export async function getPreposicionesModalesNarrativeAsync(
  workshopId: string,
  variant?: number
): Promise<PreposicionModalRelacionalParagraph[]> {
  const exercises = await loadWorkshopExercises(workshopId, variant);
  return exercises.sections.narrative as PreposicionModalRelacionalParagraph[];
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

// Helper para obtener información de un taller desde el registry
export function getWorkshopInfo(workshopId: string): WorkshopDefinition | null {
  return WORKSHOP_REGISTRY[workshopId] || null;
}

// Helper para listar todos los talleres disponibles
export function getAllWorkshops(): WorkshopDefinition[] {
  return Object.values(WORKSHOP_REGISTRY);
}

// Helper para verificar si un taller existe
export function workshopExists(workshopId: string): boolean {
  return workshopId in WORKSHOP_REGISTRY;
}

// Helper para registrar un nuevo taller dinámicamente
export function registerWorkshop(
  workshopId: string,
  definition: WorkshopDefinition
): void {
  WORKSHOP_REGISTRY[workshopId] = definition;
}

// Dynamic import function for adjective vocabulary variants
async function loadAdjectiveVocabularyVariant(variant: number = 1) {
  try {
    const variantModule = await import(
      `@/data/workshops/adjective-exercises/variant-${variant}-vocabulary.json`
    );
    return variantModule.default;
  } catch (error) {
    console.error(
      `Failed to load adjective vocabulary variant ${variant}:`,
      error
    );
    // Fallback to general vocabulary
    const generalModule = await import(
      `@/data/workshops/legacy_vocabulary.json`
    );
    return generalModule.default;
  }
}

// Dynamic import function for preposiciones vocabulary variants
async function loadPreposicionesVocabularyVariant(variant: number = 1) {
  try {
    const variantModule = await import(
      `@/data/workshops/preposiciones-temporales/variant-${variant}-vocabulary.json`
    );
    return variantModule.default;
  } catch (error) {
    console.error(
      `Failed to load preposiciones vocabulary variant ${variant}:`,
      error
    );
    // Fallback to general vocabulary
    const generalModule = await import(
      `@/data/workshops/legacy_vocabulary.json`
    );
    return generalModule.default;
  }
}

// Dynamic import function for preposiciones recorrido vocabulary variants
async function loadPreposicionesRecorridoVocabularyVariant(
  variant: number = 1
) {
  try {
    const variantModule = await import(
      `@/data/workshops/preposiciones-recorrido-orientacion/variant-${variant}-vocabulary.json`
    );
    return variantModule.default;
  } catch (error) {
    console.error(
      `Failed to load preposiciones recorrido vocabulary variant ${variant}:`,
      error
    );
    // Fallback to general vocabulary
    const generalModule = await import(
      `@/data/workshops/legacy_vocabulary.json`
    );
    return generalModule.default;
  }
}

// Dynamic import function for preposiciones modales vocabulary variants
async function loadPreposicionesModalesVocabularyVariant(variant: number = 1) {
  try {
    const variantModule = await import(
      `@/data/workshops/preposiciones-modales-relaciones/variant-${variant}-vocabulary.json`
    );
    return variantModule.default;
  } catch (error) {
    console.error(
      `Failed to load preposiciones modales vocabulary variant ${variant}:`,
      error
    );
    // Fallback to general vocabulary
    const generalModule = await import(
      `@/data/workshops/legacy_vocabulary.json`
    );
    return generalModule.default;
  }
}

// Helper para obtener vocabulario por variante usando el registry
export async function getVocabularyByVariant(
  workshopId: string,
  variant?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Record<string, any[]>> {
  const workshop = WORKSHOP_REGISTRY[workshopId];
  if (!workshop) {
    // Fallback to general vocabulary
    const generalModule = await import(
      `@/data/workshops/legacy_vocabulary.json`
    );
    return generalModule.default;
  }

  if (workshop.vocabularyLoaderFn) {
    try {
      return await workshop.vocabularyLoaderFn(variant || 1);
    } catch (error) {
      console.error(`Failed to load vocabulary for ${workshopId}:`, error);
      // Fallback to general vocabulary
      const generalModule = await import(
        `@/data/workshops/legacy_vocabulary.json`
      );
      return generalModule.default;
    }
  }

  // Fallback to general vocabulary
  const generalModule = await import(`@/data/workshops/legacy_vocabulary.json`);
  return generalModule.default;
}

// Helper para obtener variantes disponibles usando el registry
export function getAvailableVariants(workshopId: string): number[] {
  const workshop = WORKSHOP_REGISTRY[workshopId];
  if (!workshop) {
    return [];
  }

  if (!workshop.hasVariants) {
    return [1];
  }

  return Array.from({ length: workshop.variantCount }, (_, i) => i + 1);
}
