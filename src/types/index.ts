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
// TIPOS ESPECÍFICOS DE WERDEN
// ============================================================================

export type {
  // Tipos de werden
  WerdenFunction,
  Tense,
  Pronoun,
  WerdenContext,
  WerdenValidationResult,
  WerdenExercise,
  WarmupExercise,
  CentralExercise,
  NarrativeParagraph,
} from "./werden";

// Secciones y variantes de werden (definidas en workshop-implementation.ts)
export type {
  WerdenWorkshopSections,
  WerdenWorkshopVariant,
} from "./workshop-implementation";

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

// Union types extendidos con werden
export type {
  AnyWorkshopVariantExtended,
  AnyExerciseExtended,
  AnyExerciseContextExtended,
  AnyValidationResultExtended,
  AnyNarrativeParagraphExtended,
} from "./workshop-implementation";

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

  // Tipos específicos de werden
  WerdenExerciseAdapter,
  WerdenWarmupAdapter,
  WerdenCentralAdapter,
  WerdenValidator,
  WerdenExerciseProps,
  WerdenWarmupProps,
  WerdenCentralProps,
  WerdenNarrativeProps,
  UseWerdenExercisesConfig,
  UseWerdenExercisesReturn,
  WerdenExerciseConfig,
  WerdenFeedbackHandler,
  WerdenHintHandler,
  WerdenFeedbackHandlerFactory,
  WerdenHintHandlerFactory,
  WerdenAnswerNormalizer,
  WerdenEmptyAnswerChecker,
  WerdenProgressCalculator,
  WerdenFeedbackFormatter,
  WerdenContextualHintGenerator,
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
} from "./workshop-variants";

export type {
  WerdenExercise as WerdenExerciseType,
  WarmupExercise as WarmupExerciseType,
  CentralExercise as CentralExerciseType,
} from "./werden";

export type {
  // Tipos de contextos más usados
  AdjectiveExerciseContext as AdjectiveContextType,
  PrepositionTemporalContext as PrepositionTemporalContextType,
  AnyExerciseContext as AnyContextType,
} from "./workshop-variants";

export type { WerdenContext as WerdenContextType } from "./werden";

export type {
  // Tipos de variantes más usados
  AdjectiveWorkshopVariant as AdjectiveVariantType,
  PrepositionTemporalWorkshopVariant as PrepositionTemporalVariantType,
  AnyWorkshopVariant as AnyVariantType,
} from "./workshop-variants";

export type { WerdenWorkshopVariant as WerdenVariantType } from "./workshop-implementation";

export type {
  // Tipos de validación más usados
  AdjectiveValidationResult as AdjectiveValidationType,
  PrepositionTemporalValidationResult as PrepositionTemporalValidationType,
  AnyValidationResult as AnyValidationType,
} from "./workshop-variants";

export type { WerdenValidationResult as WerdenValidationType } from "./werden";

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
 * Funciones de werden disponibles
 */
export const WERDEN_FUNCTIONS = ["verbo-pleno", "futuro", "pasiva"] as const;

/**
 * Tiempos verbales disponibles
 */
export const TENSES = ["prasens", "perfekt", "futur"] as const;

/**
 * Pronombres personales alemanes
 */
export const PRONOUNS = [
  "ich",
  "du",
  "er",
  "sie",
  "es",
  "wir",
  "ihr",
  "sie-formal",
  "sie-plural",
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

// Importar tipos necesarios para las utilidades
import type {
  AnyWorkshopVariant,
  AdjectiveWorkshopVariant,
  AdjectiveExercise,
  PrepositionTemporalWorkshopVariant,
  PrepositionTemporalExercise,
  AdjectiveExerciseContext,
  PrepositionTemporalContext,
  AdjectiveValidationResult,
  PrepositionTemporalValidationResult,
  WorkshopId,
} from "./workshop-variants";

import type { WerdenWorkshopVariant } from "./workshop-implementation";

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
  werden: WerdenWorkshopVariant;
}

/**
 * Obtiene el tipo de variante basado en el workshop ID
 */
export type GetVariantType<T extends WorkshopId> = WorkshopIdToVariantMap[T];
