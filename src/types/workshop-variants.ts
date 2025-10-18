/**
 * Tipado para variantes de ejercicios de talleres
 * Basado en la estructura de los archivos JSON de variantes
 */

// ============================================================================
// TIPOS BASE COMUNES
// ============================================================================

/**
 * Identificador único de taller
 */
export type WorkshopId = "adjetivo" | "preposiciones-temporales" | "werden";

/**
 * Secciones disponibles en un taller
 */
export type WorkshopSection = "warmup" | "central" | "narrative";

/**
 * Estructura base de un ejercicio
 */
export interface BaseExerciseVariant {
  id: string;
  sentence: string;
  expectedAnswer: string;
}

/**
 * Estructura base de un contexto de ejercicio
 */
export interface BaseExerciseContext {
  explanation: string;
}

// ============================================================================
// TIPOS ESPECÍFICOS DE ADJETIVOS
// ============================================================================

/**
 * Tipos de declinación de adjetivos
 */
export type AdjectiveDeclensionType = "weak" | "mixed" | "strong";

/**
 * Casos gramaticales alemanes
 */
export type GermanCase = "nominativ" | "akkusativ" | "dativ" | "genitiv";

/**
 * Géneros gramaticales alemanes
 */
export type GermanGender = "maskulin" | "feminin" | "neutrum";

/**
 * Números gramaticales
 */
export type GermanNumber = "singular" | "plural";

/**
 * Tipos de artículos/determinantes
 */
export type ArticleType =
  | "definite"
  | "indefinite"
  | "possessive"
  | "kein"
  | "none";

/**
 * Determinante con información completa
 */
export interface AdjectiveDeterminer {
  word: string;
  type: ArticleType;
  case: GermanCase;
  gender: GermanGender;
  number: GermanNumber;
}

/**
 * Contexto específico para ejercicios de adjetivos
 */
export interface AdjectiveExerciseContext extends BaseExerciseContext {
  determiner: AdjectiveDeterminer | null;
  case: GermanCase;
  gender: GermanGender;
  number: GermanNumber;
  position?: "attributive" | "predicative";
}

/**
 * Ejercicio específico de adjetivos
 */
export interface AdjectiveExercise extends BaseExerciseVariant {
  type: AdjectiveDeclensionType;
  adjective: string;
  context: AdjectiveExerciseContext;
  imageAlt: string;
}

/**
 * Cloze específico de adjetivos en narrativas
 */
export interface AdjectiveCloze {
  id: string;
  adjective: string;
  context: AdjectiveExerciseContext;
}

/**
 * Párrafo narrativo de adjetivos
 */
export interface AdjectiveNarrativeParagraph {
  id: string;
  text: string;
  clozes: AdjectiveCloze[];
}

// ============================================================================
// TIPOS ESPECÍFICOS DE PREPOSICIONES TEMPORALES
// ============================================================================

/**
 * Casos para preposiciones temporales
 */
export type PrepositionCase = "dativo" | "acusativo" | "dativo... acusativo";

/**
 * Unidades de tiempo para preposiciones
 */
export type TimeUnit =
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

/**
 * Contexto específico para ejercicios de preposiciones temporales
 */
export interface PrepositionTemporalContext extends BaseExerciseContext {
  preposition: string;
  case: PrepositionCase;
  timeUnit: TimeUnit;
}

/**
 * Ejercicio específico de preposiciones temporales
 */
export interface PrepositionTemporalExercise extends BaseExerciseVariant {
  context: PrepositionTemporalContext;
}

/**
 * Cloze específico de preposiciones temporales en narrativas
 */
export interface PrepositionTemporalCloze {
  id: string;
  expectedAnswer: string;
  context: PrepositionTemporalContext;
}

/**
 * Párrafo narrativo de preposiciones temporales
 */
export interface PrepositionTemporalNarrativeParagraph {
  id: string;
  germanText: string;
  clozes: PrepositionTemporalCloze[];
}

// ============================================================================
// TIPOS GENÉRICOS DE WORKSHOP
// ============================================================================

/**
 * Secciones de un taller de adjetivos
 */
export interface AdjectiveWorkshopSections {
  central: AdjectiveExercise[];
  narrative: AdjectiveNarrativeParagraph[];
}

/**
 * Secciones de un taller de preposiciones temporales
 */
export interface PrepositionTemporalWorkshopSections {
  warmup: PrepositionTemporalExercise[];
  central: PrepositionTemporalExercise[];
  narrative: PrepositionTemporalNarrativeParagraph[];
}

/**
 * Variante completa de taller de adjetivos
 */
export interface AdjectiveWorkshopVariant {
  workshopId: "adjetivo";
  sections: AdjectiveWorkshopSections;
}

/**
 * Variante completa de taller de preposiciones temporales
 */
export interface PrepositionTemporalWorkshopVariant {
  workshopId: "preposiciones-temporales";
  sections: PrepositionTemporalWorkshopSections;
}

// ============================================================================
// UNION TYPES PARA TIPADO GENÉRICO
// ============================================================================

/**
 * Unión de todos los tipos de ejercicios
 */
export type AnyExercise = AdjectiveExercise | PrepositionTemporalExercise;

/**
 * Unión de todos los tipos de contextos
 */
export type AnyExerciseContext =
  | AdjectiveExerciseContext
  | PrepositionTemporalContext;

/**
 * Unión de todos los tipos de párrafos narrativos
 */
export type AnyNarrativeParagraph =
  | AdjectiveNarrativeParagraph
  | PrepositionTemporalNarrativeParagraph;

/**
 * Unión de todas las variantes de talleres
 */
export type AnyWorkshopVariant =
  | AdjectiveWorkshopVariant
  | PrepositionTemporalWorkshopVariant;

/**
 * Unión de todas las secciones de talleres
 */
export type AnyWorkshopSections =
  | AdjectiveWorkshopSections
  | PrepositionTemporalWorkshopSections;

// ============================================================================
// TIPOS DE UTILIDAD PARA LOADERS
// ============================================================================

/**
 * Mapeo de tipos de ejercicios por sección
 */
export interface ExerciseTypeMap {
  warmup: PrepositionTemporalExercise[];
  central: AdjectiveExercise[] | PrepositionTemporalExercise[];
  narrative:
    | AdjectiveNarrativeParagraph[]
    | PrepositionTemporalNarrativeParagraph[];
}

/**
 * Tipo genérico para cargar variantes
 */
export type WorkshopVariantLoader<T extends AnyWorkshopVariant> = (
  variant: number
) => Promise<T>;

/**
 * Tipo genérico para cargar secciones específicas
 */
export type WorkshopSectionLoader<T extends AnyExercise[]> = (
  workshopId: WorkshopId,
  variant: number
) => Promise<T>;

// ============================================================================
// TIPOS DE VALIDACIÓN Y RESULTADOS
// ============================================================================

/**
 * Resultado de validación para adjetivos
 */
export interface AdjectiveValidationResult {
  isCorrect: boolean;
  expectedEnding: string;
  declensionType: AdjectiveDeclensionType;
  explanation: string;
  example: string;
  markerInfo: string;
}

/**
 * Resultado de validación para preposiciones temporales
 */
export interface PrepositionTemporalValidationResult {
  isCorrect: boolean;
  explanation: string;
  example?: string;
  markerInfo?: string;
}

/**
 * Unión de todos los resultados de validación
 */
export type AnyValidationResult =
  | AdjectiveValidationResult
  | PrepositionTemporalValidationResult;

// ============================================================================
// TIPOS DE CONFIGURACIÓN DE WORKSHOP
// ============================================================================

/**
 * Configuración de un taller específico
 */
export interface WorkshopConfig<T extends AnyWorkshopVariant> {
  workshopId: WorkshopId;
  hasVariants: boolean;
  variantCount: number;
  defaultVariant?: number;
  sections: (keyof T["sections"])[];
}

/**
 * Registry de configuraciones de talleres
 */
export type WorkshopRegistry = Record<
  WorkshopId,
  WorkshopConfig<AnyWorkshopVariant>
>;

// ============================================================================
// TIPOS DE UTILIDAD PARA COMPONENTES
// ============================================================================

/**
 * Props genéricas para componentes de ejercicios
 */
export interface ExerciseComponentProps<T extends AnyExercise> {
  exercise: T;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onHint: () => void;
  onFill: () => void;
  disabled?: boolean;
}

/**
 * Props genéricas para componentes de párrafos narrativos
 */
export interface NarrativeComponentProps<T extends AnyNarrativeParagraph> {
  paragraph: T;
  onAnswerChange: (clozeId: string, answer: string) => void;
  onVerify: () => void;
  onHint: () => void;
  disabled?: boolean;
}

// ============================================================================
// TIPOS DE ESTADO Y HOOKS
// ============================================================================

/**
 * Estado de respuestas de usuario
 */
export interface UserAnswers {
  [exerciseId: string]: string;
}

/**
 * Estado de intentos por ejercicio
 */
export interface ExerciseAttempts {
  [exerciseId: string]: number;
}

/**
 * Estado de progreso de sección
 */
export interface SectionProgress {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  hintsUsed: number;
}

/**
 * Configuración para hooks de ejercicios
 */
export interface ExerciseHookConfig<
  T extends AnyExercise,
  C extends AnyExerciseContext
> {
  workshopId: WorkshopId;
  sectionId: string;
  exercises: T[];
  validateFn: (answer: string, context: C) => AnyValidationResult;
  hintGenerator: (context: C) => string;
  answerGetter: (context: C) => string;
}

// ============================================================================
// NOTA: Los tipos se exportan automáticamente al ser declarados
// ============================================================================
