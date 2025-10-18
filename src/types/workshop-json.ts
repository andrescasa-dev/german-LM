/**
 * Tipos específicos para los datos JSON de variantes
 * Mapea exactamente la estructura de los archivos variant-*.json
 */

// ============================================================================
// TIPOS PARA ADJETIVOS (variant-1.json de adjective-exercises)
// ============================================================================

/**
 * Determinante en el contexto de adjetivos (JSON)
 */
export interface AdjectiveDeterminerJSON {
  word: string;
  type: "definite" | "indefinite" | "possessive" | "kein" | "none";
  case: "nominativ" | "akkusativ" | "dativ" | "genitiv";
  gender: "maskulin" | "feminin" | "neutrum";
  number: "singular" | "plural";
}

/**
 * Contexto de ejercicio de adjetivos (JSON)
 */
export interface AdjectiveExerciseContextJSON {
  determiner: AdjectiveDeterminerJSON | null;
  case: "nominativ" | "akkusativ" | "dativ" | "genitiv";
  gender: "maskulin" | "feminin" | "neutrum";
  number: "singular" | "plural";
}

/**
 * Ejercicio central de adjetivos (JSON)
 */
export interface AdjectiveCentralExerciseJSON {
  id: string;
  type: "weak" | "mixed" | "strong";
  sentence: string;
  adjective: string;
  context: AdjectiveExerciseContextJSON;
  imageAlt: string;
}

/**
 * Cloze de adjetivos en narrativa (JSON)
 */
export interface AdjectiveClozeJSON {
  id: string;
  adjective: string;
  context: AdjectiveExerciseContextJSON;
}

/**
 * Párrafo narrativo de adjetivos (JSON)
 */
export interface AdjectiveNarrativeParagraphJSON {
  id: string;
  text: string;
  clozes: AdjectiveClozeJSON[];
}

/**
 * Secciones de taller de adjetivos (JSON)
 */
export interface AdjectiveWorkshopSectionsJSON {
  central: AdjectiveCentralExerciseJSON[];
  narrative: AdjectiveNarrativeParagraphJSON[];
}

/**
 * Variante completa de taller de adjetivos (JSON)
 */
export interface AdjectiveWorkshopVariantJSON {
  workshopId: "adjetivo";
  sections: AdjectiveWorkshopSectionsJSON;
}

// ============================================================================
// TIPOS PARA PREPOSICIONES TEMPORALES (variant-1.json de preposiciones-temporales)
// ============================================================================

/**
 * Contexto de ejercicio de preposiciones temporales (JSON)
 */
export interface PrepositionTemporalContextJSON {
  preposition: string;
  case: "dativo" | "acusativo" | "dativo... acusativo";
  timeUnit:
    | "mes"
    | "hora"
    | "festividad-dia"
    | "estacion"
    | "momento-dia"
    | "fecha"
    | "duracion"
    | "secuencia"
    | "periodo-completo"
    | "limite"
    | "dia-semana"
    | "inicio-periodo";
  explanation: string;
}

/**
 * Ejercicio de preposiciones temporales (JSON)
 */
export interface PrepositionTemporalExerciseJSON {
  id: string;
  sentence: string;
  expectedAnswer: string;
  context: PrepositionTemporalContextJSON;
}

/**
 * Cloze de preposiciones temporales en narrativa (JSON)
 */
export interface PrepositionTemporalClozeJSON {
  id: string;
  expectedAnswer: string;
  context: PrepositionTemporalContextJSON;
}

/**
 * Párrafo narrativo de preposiciones temporales (JSON)
 */
export interface PrepositionTemporalNarrativeParagraphJSON {
  id: string;
  germanText: string;
  clozes: PrepositionTemporalClozeJSON[];
}

/**
 * Secciones de taller de preposiciones temporales (JSON)
 */
export interface PrepositionTemporalWorkshopSectionsJSON {
  warmup: PrepositionTemporalExerciseJSON[];
  central: PrepositionTemporalExerciseJSON[];
  narrative: PrepositionTemporalNarrativeParagraphJSON[];
}

/**
 * Variante completa de taller de preposiciones temporales (JSON)
 */
export interface PrepositionTemporalWorkshopVariantJSON {
  workshopId: "preposiciones-temporales";
  sections: PrepositionTemporalWorkshopSectionsJSON;
}

// ============================================================================
// UNION TYPES PARA JSON
// ============================================================================

/**
 * Unión de todas las variantes JSON
 */
export type AnyWorkshopVariantJSON =
  | AdjectiveWorkshopVariantJSON
  | PrepositionTemporalWorkshopVariantJSON;

/**
 * Unión de todas las secciones JSON
 */
export type AnyWorkshopSectionsJSON =
  | AdjectiveWorkshopSectionsJSON
  | PrepositionTemporalWorkshopSectionsJSON;

/**
 * Unión de todos los ejercicios JSON
 */
export type AnyExerciseJSON =
  | AdjectiveCentralExerciseJSON
  | PrepositionTemporalExerciseJSON;

/**
 * Unión de todos los contextos JSON
 */
export type AnyExerciseContextJSON =
  | AdjectiveExerciseContextJSON
  | PrepositionTemporalContextJSON;

/**
 * Unión de todos los párrafos narrativos JSON
 */
export type AnyNarrativeParagraphJSON =
  | AdjectiveNarrativeParagraphJSON
  | PrepositionTemporalNarrativeParagraphJSON;

// ============================================================================
// TIPOS DE UTILIDAD PARA LOADERS JSON
// ============================================================================

/**
 * Loader específico para variantes JSON
 */
export type WorkshopVariantJSONLoader<T extends AnyWorkshopVariantJSON> = (
  workshopId: string,
  variant: number
) => Promise<T>;

/**
 * Loader específico para ejercicios centrales JSON
 */
export type CentralExercisesJSONLoader<T extends AnyExerciseJSON> = (
  workshopId: string,
  variant: number
) => Promise<T[]>;

/**
 * Loader específico para ejercicios warmup JSON
 */
export type WarmupExercisesJSONLoader<
  T extends PrepositionTemporalExerciseJSON
> = (workshopId: string, variant: number) => Promise<T[]>;

/**
 * Loader específico para párrafos narrativos JSON
 */
export type NarrativeParagraphsJSONLoader<T extends AnyNarrativeParagraphJSON> =
  (workshopId: string, variant: number) => Promise<T[]>;

// ============================================================================
// TIPOS DE MAPEO JSON -> TYPESCRIPT
// ============================================================================

/**
 * Mapeo de tipos JSON a tipos TypeScript
 */
export interface JSONToTypeScriptMapping {
  // Adjetivos
  AdjectiveWorkshopVariantJSON: AdjectiveWorkshopVariantJSON;
  AdjectiveCentralExerciseJSON: AdjectiveCentralExerciseJSON;
  AdjectiveExerciseContextJSON: AdjectiveExerciseContextJSON;
  AdjectiveNarrativeParagraphJSON: AdjectiveNarrativeParagraphJSON;
  AdjectiveClozeJSON: AdjectiveClozeJSON;

  // Preposiciones temporales
  PrepositionTemporalWorkshopVariantJSON: PrepositionTemporalWorkshopVariantJSON;
  PrepositionTemporalExerciseJSON: PrepositionTemporalExerciseJSON;
  PrepositionTemporalContextJSON: PrepositionTemporalContextJSON;
  PrepositionTemporalNarrativeParagraphJSON: PrepositionTemporalNarrativeParagraphJSON;
  PrepositionTemporalClozeJSON: PrepositionTemporalClozeJSON;
}

// ============================================================================
// TIPOS DE VALIDACIÓN PARA JSON
// ============================================================================

/**
 * Validador de estructura JSON
 */
export type JSONStructureValidator<T extends AnyWorkshopVariantJSON> = (
  data: unknown
) => data is T;

/**
 * Validador de ejercicios JSON
 */
export type JSONExerciseValidator<T extends AnyExerciseJSON> = (
  data: unknown
) => data is T;

/**
 * Validador de contextos JSON
 */
export type JSONContextValidator<T extends AnyExerciseContextJSON> = (
  data: unknown
) => data is T;

// ============================================================================
// TIPOS DE TRANSFORMACIÓN JSON -> TYPESCRIPT
// ============================================================================

/**
 * Transformador de JSON a TypeScript para ejercicios
 */
export type JSONToTSExerciseTransformer<TJSON extends AnyExerciseJSON, TTS> = (
  jsonExercise: TJSON
) => TTS;

/**
 * Transformador de JSON a TypeScript para contextos
 */
export type JSONToTSContextTransformer<
  TJSON extends AnyExerciseContextJSON,
  TTS
> = (jsonContext: TJSON) => TTS;

/**
 * Transformador de JSON a TypeScript para párrafos narrativos
 */
export type JSONToTSNarrativeTransformer<
  TJSON extends AnyNarrativeParagraphJSON,
  TTS
> = (jsonParagraph: TJSON) => TTS;

// ============================================================================
// NOTA: Los tipos se exportan automáticamente al ser declarados
// ============================================================================
