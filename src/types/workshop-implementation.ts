/**
 * Tipos específicos para loaders y utilidades de workshop
 * Complementa workshop-variants.ts con tipos para la implementación
 */

import type {
  WorkshopId,
  AnyWorkshopVariant,
  AdjectiveWorkshopVariant,
  PrepositionTemporalWorkshopVariant,
  AnyExercise,
  AnyExerciseContext,
  AnyValidationResult,
} from "./workshop-variants";

// ============================================================================
// TIPOS PARA WORKSHOP LOADER
// ============================================================================

/**
 * Definición de un taller en el registry
 */
export interface WorkshopDefinition {
  id: WorkshopId;
  hasVariants: boolean;
  variantCount: number;
  loaderFn: WorkshopVariantLoader<AnyWorkshopVariant>;
  vocabularyLoaderFn?: WorkshopVocabularyLoader;
}

/**
 * Loader genérico para variantes de workshop
 */
export type WorkshopVariantLoader<T extends AnyWorkshopVariant> = (
  workshopId: WorkshopId,
  variant: number
) => Promise<T>;

/**
 * Loader específico para vocabulario
 */
export type WorkshopVocabularyLoader = (
  workshopId: WorkshopId,
  variant: number
) => Promise<Record<string, unknown[]>>;

/**
 * Registry de talleres
 */
export type WorkshopRegistry = Record<WorkshopId, WorkshopDefinition>;

// ============================================================================
// TIPOS PARA ADAPTADORES
// ============================================================================

/**
 * Función adaptadora para convertir ejercicios específicos a base
 */
export type ExerciseAdapter<T extends AnyExercise> = (exercise: T) => {
  id: string;
  sentence: string;
  expectedAnswer: string;
  context: AnyExerciseContext;
};

/**
 * Función adaptadora para convertir contextos específicos a base
 */
export type ContextAdapter<T extends AnyExerciseContext> = (
  context: T
) => AnyExerciseContext;

/**
 * Función adaptadora para extraer contexto específico desde base
 */
export type ContextExtractor<T extends AnyExerciseContext> = (
  baseContext: AnyExerciseContext
) => T;

// ============================================================================
// TIPOS PARA VALIDADORES
// ============================================================================

/**
 * Función de validación genérica
 */
export type ValidationFunction<T extends AnyExerciseContext> = (
  answer: string,
  context: T
) => AnyValidationResult;

/**
 * Función generadora de hints
 */
export type HintGenerator<T extends AnyExerciseContext> = (
  context: T
) => string;

/**
 * Función para obtener respuesta correcta
 */
export type AnswerGetter<T extends AnyExerciseContext> = (context: T) => string;

/**
 * Interfaz común para validadores de workshop
 */
export interface WorkshopValidator<
  T extends AnyExerciseContext,
  R extends AnyValidationResult
> {
  validate: ValidationFunction<T>;
  generateHint: HintGenerator<T>;
  getCorrectAnswer: AnswerGetter<T>;
}

// ============================================================================
// TIPOS PARA COMPONENTES GENÉRICOS
// ============================================================================

/**
 * Props para componentes de ejercicios genéricos
 */
export interface GenericExerciseProps<T extends AnyExercise> {
  exercise: T;
  answer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onHint: () => void;
  onFill: () => void;
  disabled?: boolean;
  showAttempts?: boolean;
  attempts?: number;
}

/**
 * Props para secciones de ejercicios genéricas
 */
export interface GenericExerciseSectionProps<T extends AnyExercise> {
  sectionId: string;
  title: string;
  description: string;
  icon: string;
  workshopId: WorkshopId;
  loadExercises: (variant: number) => Promise<T[]>;
  renderExercise: (
    exercise: T,
    handlers: ExerciseHandlers<T>
  ) => React.ReactNode;
  validateFn: ValidationFunction<AnyExerciseContext>;
  getHintFn: HintGenerator<AnyExerciseContext>;
  getAnswerFn: AnswerGetter<AnyExerciseContext>;
  showDemo?: boolean;
  renderDemo?: () => React.ReactNode;
}

/**
 * Handlers para ejercicios
 */
export interface ExerciseHandlers<T extends AnyExercise> {
  onSubmit: (exercise: T) => AnyValidationResult;
  onHint: (exercise: T) => string;
  onFill: (exercise: T) => void;
  userAnswer: string;
  setAnswer: (answer: string) => void;
}

// ============================================================================
// TIPOS PARA HOOKS GENÉRICOS
// ============================================================================

/**
 * Configuración para useWorkshopExercises
 */
export interface UseWorkshopExercisesConfig<
  T extends AnyExercise,
  C extends AnyExerciseContext
> {
  workshopId: WorkshopId;
  sectionId: string;
  loader: WorkshopVariantLoader<AnyWorkshopVariant>;
  validator: ValidationFunction<C>;
  hintGenerator: HintGenerator<C>;
  answerGetter: AnswerGetter<C>;
  feedbackHandler: (result: AnyValidationResult) => void;
  contextExtractor: (exercise: T) => C;
}

/**
 * Retorno del hook useWorkshopExercises
 */
export interface UseWorkshopExercisesReturn<T extends AnyExercise> {
  // Estado
  exercises: T[];
  loading: boolean;
  answers: Record<string, string>;
  attempts: Record<string, number>;
  progress: {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    hintsUsed: number;
  };

  // Acciones
  handleSubmit: (exercise: T) => AnyValidationResult;
  handleHint: (exercise: T) => string;
  handleFill: (exercise: T) => void;
  updateAnswer: (exerciseId: string, answer: string) => void;
  resetState: () => void;
}

// ============================================================================
// TIPOS PARA CONFIGURACIÓN DE EJERCICIOS
// ============================================================================

/**
 * Configuración completa de un ejercicio
 */
export interface ExerciseConfig<
  T extends AnyExercise,
  C extends AnyExerciseContext
> {
  workshopId: WorkshopId;
  sectionId: string;
  title: string;
  description: string;
  icon: string;
  loader: WorkshopVariantLoader<AnyWorkshopVariant>;
  validator: ValidationFunction<C>;
  hintGenerator: HintGenerator<C>;
  answerGetter: AnswerGetter<C>;
  contextExtractor: (exercise: T) => C;
  sentenceExtractor: (exercise: T) => string;
  placeholderExtractor?: (exercise: T) => string;
  renderDemo?: () => React.ReactNode;
  renderExerciseMetadata?: (exercise: T, attempts?: number) => React.ReactNode;
}

/**
 * Factory para crear configuraciones de ejercicios
 */
export type ExerciseConfigFactory<
  T extends AnyExercise,
  C extends AnyExerciseContext
> = (config: ExerciseConfig<T, C>) => ExerciseConfig<T, C>;

// ============================================================================
// TIPOS PARA FEEDBACK Y TOASTS
// ============================================================================

/**
 * Handler de feedback genérico
 */
export type FeedbackHandler = (result: AnyValidationResult) => void;

/**
 * Handler de hints genérico
 */
export type HintHandler = (hint: string) => void;

/**
 * Factory para crear handlers de feedback
 */
export type FeedbackHandlerFactory = () => FeedbackHandler;

/**
 * Factory para crear handlers de hints
 */
export type HintHandlerFactory = () => HintHandler;

// ============================================================================
// TIPOS PARA UTILIDADES DE EJERCICIOS
// ============================================================================

/**
 * Función para normalizar respuestas
 */
export type AnswerNormalizer = (answer: string) => string;

/**
 * Función para validar si una respuesta está vacía
 */
export type EmptyAnswerChecker = (answer: string) => boolean;

/**
 * Función para calcular progreso
 */
export type ProgressCalculator = (
  answers: Record<string, string>,
  totalExercises: number
) => {
  score: number;
  correctAnswers: number;
  completionRate: number;
  accuracy: number;
};

/**
 * Función para formatear feedback
 */
export type FeedbackFormatter = (result: AnyValidationResult) => string;

// ============================================================================
// NOTA: Los tipos se exportan automáticamente al ser declarados
// ============================================================================
