/**
 * Índice de tipos para el sistema de talleres
 * Exporta todos los tipos organizados por categoría
 */

// ============================================================================
// TIPOS BASE Y COMUNES
// ============================================================================

export type {
  // Tipos base
  WorkshopId,
  WorkshopSection,
  BaseExerciseVariant,
  BaseExerciseContext,
} from "./workshop-variants";

// ============================================================================
// TIPOS ESPECÍFICOS DE ADJETIVOS
// ============================================================================

export type {
  // Tipos de declinación y gramática
  AdjectiveDeclensionType,
  GermanCase,
  GermanGender,
  GermanNumber,
  ArticleType,
  AdjectiveDeterminer,

  // Contextos y ejercicios
  AdjectiveExerciseContext,
  AdjectiveExercise,
  AdjectiveCloze,
  AdjectiveNarrativeParagraph,

  // Secciones y variantes
  AdjectiveWorkshopSections,
  AdjectiveWorkshopVariant,

  // Resultados de validación
  AdjectiveValidationResult,
} from "./workshop-variants";

// ============================================================================
// TIPOS ESPECÍFICOS DE PREPOSICIONES TEMPORALES
// ============================================================================

export type {
  // Tipos de preposiciones
  PrepositionCase,
  TimeUnit,
  PrepositionTemporalContext,
  PrepositionTemporalExercise,
  PrepositionTemporalCloze,
  PrepositionTemporalNarrativeParagraph,

  // Secciones y variantes
  PrepositionTemporalWorkshopSections,
  PrepositionTemporalWorkshopVariant,

  // Resultados de validación
  PrepositionTemporalValidationResult,
} from "./workshop-variants";

// ============================================================================
// TIPOS GENÉRICOS Y UNION TYPES
// ============================================================================

export type {
  // Union types principales
  AnyExercise,
  AnyExerciseContext,
  AnyNarrativeParagraph,
  AnyWorkshopVariant,
  AnyWorkshopSections,
  AnyValidationResult,

  // Tipos de utilidad
  WorkshopVariantLoader,
  WorkshopSectionLoader,
  WorkshopConfig,
  WorkshopRegistry,
  ExerciseComponentProps,
  NarrativeComponentProps,
  UserAnswers,
  ExerciseAttempts,
  SectionProgress,
  ExerciseHookConfig,
} from "./workshop-variants";

// ============================================================================
// TIPOS PARA IMPLEMENTACIÓN Y LOADERS
// ============================================================================

export type {
  // Workshop Loader
  WorkshopDefinition,
  WorkshopVariantLoader as WorkshopVariantLoaderImpl,
  WorkshopVocabularyLoader,
  WorkshopRegistry as WorkshopRegistryImpl,

  // Adaptadores
  ExerciseAdapter,
  ContextAdapter,
  ContextExtractor,

  // Validadores
  ValidationFunction,
  HintGenerator,
  AnswerGetter,
  WorkshopValidator,

  // Componentes genéricos
  GenericExerciseProps,
  GenericExerciseSectionProps,
  ExerciseHandlers,

  // Hooks
  UseWorkshopExercisesConfig,
  UseWorkshopExercisesReturn,

  // Configuración
  ExerciseConfig,
  ExerciseConfigFactory,

  // Feedback
  FeedbackHandler,
  HintHandler,
  FeedbackHandlerFactory,
  HintHandlerFactory,

  // Utilidades
  AnswerNormalizer,
  EmptyAnswerChecker,
  ProgressCalculator,
  FeedbackFormatter,
} from "./workshop-implementation";

// ============================================================================
// TIPOS PARA DATOS JSON
// ============================================================================

export type {
  // Adjetivos JSON
  AdjectiveDeterminerJSON,
  AdjectiveExerciseContextJSON,
  AdjectiveCentralExerciseJSON,
  AdjectiveClozeJSON,
  AdjectiveNarrativeParagraphJSON,
  AdjectiveWorkshopSectionsJSON,
  AdjectiveWorkshopVariantJSON,

  // Preposiciones temporales JSON
  PrepositionTemporalContextJSON,
  PrepositionTemporalExerciseJSON,
  PrepositionTemporalClozeJSON,
  PrepositionTemporalNarrativeParagraphJSON,
  PrepositionTemporalWorkshopSectionsJSON,
  PrepositionTemporalWorkshopVariantJSON,

  // Union types JSON
  AnyWorkshopVariantJSON,
  AnyWorkshopSectionsJSON,
  AnyExerciseJSON,
  AnyExerciseContextJSON,
  AnyNarrativeParagraphJSON,

  // Loaders JSON
  WorkshopVariantJSONLoader,
  CentralExercisesJSONLoader,
  WarmupExercisesJSONLoader,
  NarrativeParagraphsJSONLoader,

  // Mapeo JSON -> TS
  JSONToTypeScriptMapping,

  // Validadores JSON
  JSONStructureValidator,
  JSONExerciseValidator,
  JSONContextValidator,

  // Transformadores JSON -> TS
  JSONToTSExerciseTransformer,
  JSONToTSContextTransformer,
  JSONToTSNarrativeTransformer,
} from "./workshop-json";

// ============================================================================
// RE-EXPORTACIONES CON NOMBRES MÁS CLAROS
// ============================================================================

// Tipos principales para uso común
export type {
  // Tipos de ejercicios más usados
  AdjectiveExercise as AdjectiveExerciseType,
  PrepositionTemporalExercise as PrepositionTemporalExerciseType,
  AnyExercise as AnyExerciseType,

  // Tipos de contextos más usados
  AdjectiveExerciseContext as AdjectiveContextType,
  PrepositionTemporalContext as PrepositionTemporalContextType,
  AnyExerciseContext as AnyContextType,

  // Tipos de variantes más usados
  AdjectiveWorkshopVariant as AdjectiveVariantType,
  PrepositionTemporalWorkshopVariant as PrepositionTemporalVariantType,
  AnyWorkshopVariant as AnyVariantType,

  // Tipos de validación más usados
  AdjectiveValidationResult as AdjectiveValidationType,
  PrepositionTemporalValidationResult as PrepositionTemporalValidationType,
  AnyValidationResult as AnyValidationType,
} from "./workshop-variants";

// ============================================================================
// CONSTANTES DE TIPOS PARA USO EN RUNTIME
// ============================================================================

/**
 * IDs de talleres disponibles
 */
export const WORKSHOP_IDS = [
  "adjetivo",
  "preposiciones-temporales",
  "werden",
] as const;

/**
 * Secciones disponibles en talleres
 */
export const WORKSHOP_SECTIONS = ["warmup", "central", "narrative"] as const;

/**
 * Tipos de declinación de adjetivos
 */
export const ADJECTIVE_DECLENSION_TYPES = ["weak", "mixed", "strong"] as const;

/**
 * Casos gramaticales alemanes
 */
export const GERMAN_CASES = [
  "nominativ",
  "akkusativ",
  "dativ",
  "genitiv",
] as const;

/**
 * Géneros gramaticales alemanes
 */
export const GERMAN_GENDERS = ["maskulin", "feminin", "neutrum"] as const;

/**
 * Números gramaticales
 */
export const GERMAN_NUMBERS = ["singular", "plural"] as const;

/**
 * Tipos de artículos
 */
export const ARTICLE_TYPES = [
  "definite",
  "indefinite",
  "possessive",
  "kein",
  "none",
] as const;

/**
 * Casos para preposiciones temporales
 */
export const PREPOSITION_CASES = [
  "dativo",
  "acusativo",
  "dativo... acusativo",
] as const;

/**
 * Unidades de tiempo para preposiciones
 */
export const TIME_UNITS = [
  "mes",
  "hora",
  "festividad-dia",
  "estacion",
  "momento-dia",
  "fecha",
  "duracion",
  "secuencia",
  "periodo-completo",
  "limite",
  "dia-semana",
  "inicio-periodo",
] as const;

// ============================================================================
// UTILIDADES DE TIPOS
// ============================================================================

/**
 * Extrae el tipo de ejercicio de una variante
 */
export type ExtractExerciseType<T extends AnyWorkshopVariant> =
  T extends AdjectiveWorkshopVariant
    ? AdjectiveExercise
    : T extends PrepositionTemporalWorkshopVariant
    ? PrepositionTemporalExercise
    : never;

/**
 * Extrae el tipo de contexto de una variante
 */
export type ExtractContextType<T extends AnyWorkshopVariant> =
  T extends AdjectiveWorkshopVariant
    ? AdjectiveExerciseContext
    : T extends PrepositionTemporalWorkshopVariant
    ? PrepositionTemporalContext
    : never;

/**
 * Extrae el tipo de resultado de validación de una variante
 */
export type ExtractValidationType<T extends AnyWorkshopVariant> =
  T extends AdjectiveWorkshopVariant
    ? AdjectiveValidationResult
    : T extends PrepositionTemporalWorkshopVariant
    ? PrepositionTemporalValidationResult
    : never;

/**
 * Mapeo de workshop ID a tipo de variante
 */
export interface WorkshopIdToVariantMap {
  adjetivo: AdjectiveWorkshopVariant;
  "preposiciones-temporales": PrepositionTemporalWorkshopVariant;
  werden: never; // TODO: Implementar cuando esté disponible
}

/**
 * Obtiene el tipo de variante basado en el workshop ID
 */
export type GetVariantType<T extends WorkshopId> = WorkshopIdToVariantMap[T];
